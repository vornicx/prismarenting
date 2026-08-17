from __future__ import annotations

import csv
import json
import re
import time
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

ROOT = "https://prismarenting.com/"
OUT = Path("migration-output")
HOSTS = {"prismarenting.com", "www.prismarenting.com"}
WORKERS = 8
MAX_URLS = 5000
TIMEOUT = (10, 50)

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; ArchicMigrationBot/2.0; +https://archic.es)",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.6",
})
session.mount("https://", HTTPAdapter(max_retries=Retry(
    total=3, connect=3, read=3, backoff_factor=1.0,
    status_forcelist=(429, 500, 502, 503, 504),
    allowed_methods=frozenset(["GET"]),
)))

SKIP_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".ico", ".pdf", ".zip", ".css", ".js", ".xml", ".mp4", ".webm", ".woff", ".woff2", ".ttf", ".eot"}
SKIP_PATH_PARTS = ("/wp-admin/", "/wp-login", "/wp-json/", "/feed/", "/cart/", "/checkout/", "/my-account/", "/wp-content/", "/wp-includes/")


def fetch(url: str):
    return session.get(url, timeout=TIMEOUT, allow_redirects=True)


def clean_url(raw: str, base: str = ROOT) -> str | None:
    if not raw or raw.startswith(("mailto:", "tel:", "javascript:", "#")):
        return None
    parsed = urlparse(urljoin(base, raw))
    if parsed.scheme not in {"http", "https"} or parsed.hostname not in HOSTS:
        return None
    path = re.sub(r"/{2,}", "/", parsed.path or "/")
    if any(path.lower().endswith(ext) for ext in SKIP_EXTENSIONS):
        return None
    if any(part in path for part in SKIP_PATH_PARTS):
        return None
    return urlunparse(("https", "prismarenting.com", path, "", "", ""))


def discover_sitemap_urls() -> set[str]:
    sitemap_queue = []
    try:
        robots = fetch(urljoin(ROOT, "robots.txt"))
        if robots.ok:
            sitemap_queue.extend(re.findall(r"(?im)^\s*Sitemap:\s*(\S+)", robots.text))
    except Exception:
        pass
    sitemap_queue.extend(urljoin(ROOT, name) for name in ("sitemap_index.xml", "wp-sitemap.xml", "sitemap.xml"))

    seen_maps: set[str] = set()
    urls: set[str] = {ROOT}
    while sitemap_queue and len(seen_maps) < 300 and len(urls) < MAX_URLS:
        sitemap = sitemap_queue.pop(0)
        if sitemap in seen_maps:
            continue
        seen_maps.add(sitemap)
        try:
            response = fetch(sitemap)
            if not response.ok:
                continue
            root = ET.fromstring(response.content)
            locs = [el.text.strip() for el in root.iter() if el.tag.endswith("loc") and el.text]
            if root.tag.endswith("sitemapindex"):
                sitemap_queue.extend(locs)
            else:
                for loc in locs:
                    normalized = clean_url(loc)
                    if normalized:
                        urls.add(normalized)
                        if len(urls) >= MAX_URLS:
                            break
        except Exception:
            continue
    return urls


def text(el) -> str:
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip() if el else ""


def meta(soup: BeautifulSoup, *, name: str | None = None, prop: str | None = None) -> str:
    attrs = {"name": name} if name else {"property": prop}
    tag = soup.find("meta", attrs=attrs)
    return (tag.get("content") or "").strip() if tag else ""


def schema_items(soup: BeautifulSoup) -> list[dict]:
    queue: list[object] = []
    flattened: list[dict] = []
    for tag in soup.find_all("script", attrs={"type": re.compile("ld\\+json", re.I)}):
        try:
            raw = tag.string or tag.get_text()
            if raw and raw.strip():
                queue.append(json.loads(raw))
        except Exception:
            pass
    while queue:
        item = queue.pop(0)
        if isinstance(item, list):
            queue.extend(item)
        elif isinstance(item, dict):
            flattened.append(item)
            graph = item.get("@graph")
            if isinstance(graph, list):
                queue.extend(graph)
    return flattened


def schema_type_list(items: list[dict]) -> list[str]:
    values: set[str] = set()
    for item in items:
        kind = item.get("@type")
        if isinstance(kind, list):
            values.update(str(x) for x in kind)
        elif kind:
            values.add(str(kind))
    return sorted(values)


def product_schema(items: list[dict]) -> dict | None:
    for item in items:
        kind = item.get("@type")
        kinds = kind if isinstance(kind, list) else [kind]
        if "Product" in kinds:
            return item
    return None


def classify(path: str, types: list[str], soup: BeautifulSoup) -> str:
    lower = path.lower()
    if "Product" in types or soup.select_one("body.single-product, .single-product, .product_title"):
        return "vehicle"
    if lower == "/blog/":
        return "blog-index"
    if lower.startswith("/blog/"):
        return "blog-post"
    if lower in {"/renting-coches-particulares/", "/renting-coches-autonomos/", "/renting-coches-empresas/"}:
        return "profile"
    if lower in {"/contacto/", "/nosotros/", "/faqs/", "/aviso-legal/", "/politica-de-privacidad/", "/politica-de-cookies/"}:
        return "corporate"
    if lower.startswith("/ofertas-de-renting"):
        return "catalog"
    return "seo-landing"


def extract_price(blob: str) -> float | None:
    for pattern in (
        r"Desde\s*€?\s*([0-9.]+(?:,[0-9]{1,2})?)\s*/?mes",
        r"([0-9.]+(?:,[0-9]{1,2})?)\s*€\s*/?mes",
        r"€\s*([0-9.]+(?:,[0-9]{1,2})?)\s*/?mes",
    ):
        match = re.search(pattern, blob, re.I)
        if match:
            try:
                return float(match.group(1).replace(".", "").replace(",", "."))
            except ValueError:
                pass
    return None


def absoluteize_content(container: BeautifulSoup, page_url: str) -> str:
    for bad in container.find_all(["script", "style", "noscript", "template", "form"]):
        bad.decompose()
    for element in container.find_all(True):
        element.attrs.pop("style", None)
        element.attrs.pop("onclick", None)
        element.attrs.pop("onload", None)
        if element.name == "a" and element.get("href"):
            href = element.get("href")
            internal = clean_url(href, page_url)
            if internal:
                element["href"] = urlparse(internal).path
            elif href and not href.startswith(("mailto:", "tel:", "#")):
                element["href"] = urljoin(page_url, href)
        if element.name in {"img", "source"}:
            for attr in ("src", "data-src", "data-lazy-src"):
                if element.get(attr):
                    element[attr] = urljoin(page_url, element.get(attr))
            if element.get("srcset"):
                parts = []
                for item in element.get("srcset").split(","):
                    bits = item.strip().split(" ")
                    if bits:
                        bits[0] = urljoin(page_url, bits[0])
                    parts.append(" ".join(bits))
                element["srcset"] = ", ".join(parts)
        # Old WordPress classes can fight the new visual system; preserve semantics, not styling hooks.
        element.attrs.pop("class", None)
        element.attrs.pop("id", None)
    return container.decode_contents()


def parse_page(url: str):
    try:
        response = fetch(url)
        content_type = response.headers.get("content-type", "")
        if response.status_code != 200 or "text/html" not in content_type:
            return None, {"url": url, "status": response.status_code, "content_type": content_type}, []
        final = clean_url(response.url) or url
        raw = BeautifulSoup(response.text, "lxml")
        schemas = schema_items(raw)
        types = schema_type_list(schemas)
        product = product_schema(schemas)

        soup = BeautifulSoup(response.text, "lxml")
        canonical_tag = soup.find("link", rel=lambda value: value and "canonical" in value)
        canonical = clean_url(canonical_tag.get("href"), final) if canonical_tag and canonical_tag.get("href") else final
        canonical = canonical or final
        path = urlparse(canonical).path
        page_type = classify(path, types, soup)

        main = soup.find("main") or soup.find("article") or soup.find("div", attrs={"role": "main"}) or soup.body
        if main is None:
            main = soup
        semantic = BeautifulSoup(str(main), "lxml")
        semantic_container = semantic.find("main") or semantic.find("article") or semantic.body or semantic
        content_html = absoluteize_content(semantic_container, final)
        body_text = text(semantic_container)[:60000]

        headings = []
        seen_headings = set()
        for heading in semantic_container.find_all(["h1", "h2", "h3"]):
            value = text(heading)
            if value and value not in seen_headings:
                seen_headings.add(value)
                headings.append({"level": heading.name, "text": value})

        images = []
        seen_images = set()
        for image in semantic_container.find_all("img"):
            src = image.get("src") or image.get("data-src") or image.get("data-lazy-src")
            if not src:
                continue
            src = urljoin(final, src)
            if src.startswith("data:") or src in seen_images:
                continue
            seen_images.add(src)
            images.append({"src": src, "alt": (image.get("alt") or "").strip()})

        internal_links = []
        seen_links = set()
        for anchor in semantic_container.find_all("a", href=True):
            normalized = clean_url(anchor.get("href"), final)
            if normalized and normalized not in seen_links:
                seen_links.add(normalized)
                internal_links.append(normalized)

        tables = []
        for row in semantic_container.find_all("tr"):
            cells = [text(cell) for cell in row.find_all(["th", "td"])]
            if len(cells) >= 2 and any(cells):
                tables.append(cells[:10])

        record = {
            "url": final,
            "canonical": canonical,
            "path": path,
            "type": page_type,
            "status": 200,
            "title": text(soup.title),
            "meta_description": meta(soup, name="description"),
            "og_title": meta(soup, prop="og:title"),
            "og_description": meta(soup, prop="og:description"),
            "h1": [item["text"] for item in headings if item["level"] == "h1"],
            "headings": headings[:160],
            "body_text": body_text,
            "content_html": content_html[:350000],
            "images": images[:100],
            "internal_links": internal_links[:1200],
            "schema_types": types,
            "tables": tables[:150],
        }

        if page_type == "vehicle":
            name = str(product.get("name") or "") if product else ""
            if not name:
                name = record["h1"][0] if record["h1"] else record["title"].split("|")[0].strip()
            schema_price = None
            offers = product.get("offers") if product else None
            if isinstance(offers, dict):
                schema_price = offers.get("price") or offers.get("lowPrice")
            elif isinstance(offers, list) and offers and isinstance(offers[0], dict):
                schema_price = offers[0].get("price") or offers[0].get("lowPrice")
            try:
                schema_price = float(schema_price) if schema_price is not None else None
            except Exception:
                schema_price = None
            parts = [part for part in path.split("/") if part]
            record["vehicle"] = {
                "name": name,
                "brand_slug": parts[1] if len(parts) > 2 and parts[0] == "ofertas-de-renting" else "",
                "price": schema_price or extract_price(body_text),
                "attributes": tables[:100],
                "schema": product or {},
            }
        return record, None, internal_links
    except Exception as exc:
        return None, {"url": url, "error": repr(exc)}, []


def main():
    OUT.mkdir(exist_ok=True)
    urls = discover_sitemap_urls()
    print(f"sitemap_urls={len(urls)}", flush=True)

    records = []
    failures = []
    discovered = set()
    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {executor.submit(parse_page, url): url for url in sorted(urls)}
        for index, future in enumerate(as_completed(futures), 1):
            record, failure, links = future.result()
            if record:
                records.append(record)
                discovered.update(links)
            if failure:
                failures.append(failure)
            if index % 50 == 0:
                vehicle_count = sum(1 for item in records if item["type"] == "vehicle")
                print(f"fetched={index}/{len(futures)} records={len(records)} vehicles={vehicle_count} failures={len(failures)}", flush=True)

    known = {item["canonical"] for item in records} | urls
    extras = [url for url in discovered if url not in known][:700]
    if extras:
        print(f"supplemental_urls={len(extras)}", flush=True)
        with ThreadPoolExecutor(max_workers=WORKERS) as executor:
            futures = {executor.submit(parse_page, url): url for url in extras}
            for future in as_completed(futures):
                record, failure, _ = future.result()
                if record:
                    records.append(record)
                if failure:
                    failures.append(failure)

    by_canonical = {}
    for record in records:
        old = by_canonical.get(record["canonical"])
        if not old or len(record.get("content_html", "")) > len(old.get("content_html", "")):
            by_canonical[record["canonical"]] = record
    records = sorted(by_canonical.values(), key=lambda item: item["path"])
    vehicles = [record for record in records if record["type"] == "vehicle"]
    pages = [record for record in records if record["type"] != "vehicle"]
    summary = {
        "root": ROOT,
        "pages": len(records),
        "vehicles": len(vehicles),
        "editorial_pages": len(pages),
        "failures": len(failures),
        "sitemap_urls": len(urls),
        "types": {},
    }
    for record in records:
        summary["types"][record["type"]] = summary["types"].get(record["type"], 0) + 1

    datasets = {
        "inventory.json": records,
        "vehicles.json": vehicles,
        "pages.json": pages,
        "failures.json": failures,
        "summary.json": summary,
    }
    for filename, dataset in datasets.items():
        (OUT / filename).write_text(json.dumps(dataset, ensure_ascii=False, indent=2), encoding="utf-8")

    with (OUT / "routes.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(["type", "path", "title", "h1", "meta_description"])
        for record in records:
            writer.writerow([record["type"], record["path"], record["title"], " | ".join(record["h1"]), record["meta_description"]])

    print(json.dumps(summary, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
