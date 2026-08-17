from __future__ import annotations

import csv
import json
import re
import time
from collections import deque
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup

ROOT = "https://prismarenting.com/"
HOSTS = {"prismarenting.com", "www.prismarenting.com"}
OUT = Path("migration-output")
MAX_PAGES = 2200
DELAY = 0.08
TIMEOUT = 25

SKIP_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".ico", ".pdf", ".zip",
    ".css", ".js", ".xml", ".mp4", ".webm", ".woff", ".woff2", ".ttf", ".eot",
}
SKIP_PATH_PARTS = (
    "/wp-admin/", "/wp-login", "/wp-json/", "/feed/", "/cart/", "/checkout/",
    "/my-account/", "/author/", "/tag/", "/wp-content/", "/wp-includes/",
)

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; ArchicMigrationBot/1.0; +https://archic.es)",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.6",
})


def clean_url(raw: str, base: str) -> str | None:
    if not raw or raw.startswith(("mailto:", "tel:", "javascript:", "#")):
        return None
    absolute = urljoin(base, raw)
    p = urlparse(absolute)
    if p.scheme not in {"http", "https"} or p.hostname not in HOSTS:
        return None
    path = re.sub(r"/{2,}", "/", p.path or "/")
    if any(path.lower().endswith(ext) for ext in SKIP_EXTENSIONS):
        return None
    if any(part in path for part in SKIP_PATH_PARTS):
        return None
    # Preserve WooCommerce pagination/search page paths but discard tracking/filter query noise.
    query = ""
    if p.query:
        kept = []
        for pair in p.query.split("&"):
            key = pair.split("=", 1)[0]
            if key in {"product-page", "paged"}:
                kept.append(pair)
        query = "&".join(kept)
    return urlunparse(("https", "prismarenting.com", path, "", query, ""))


def text(el) -> str:
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip() if el else ""


def meta(soup: BeautifulSoup, name: str = "", prop: str = "") -> str:
    if name:
        tag = soup.find("meta", attrs={"name": name})
    else:
        tag = soup.find("meta", attrs={"property": prop})
    return (tag.get("content") or "").strip() if tag else ""


def parse_jsonld(soup: BeautifulSoup):
    items = []
    for tag in soup.find_all("script", attrs={"type": re.compile("ld\\+json", re.I)}):
        raw = tag.string or tag.get_text()
        if not raw or not raw.strip():
            continue
        try:
            value = json.loads(raw)
            if isinstance(value, list):
                items.extend(value)
            else:
                items.append(value)
        except Exception:
            continue
    return items


def flatten_schema(items):
    out = []
    queue = list(items)
    while queue:
        item = queue.pop(0)
        if isinstance(item, dict):
            graph = item.get("@graph")
            if isinstance(graph, list):
                queue.extend(graph)
            out.append(item)
        elif isinstance(item, list):
            queue.extend(item)
    return out


def schema_types(items):
    types = set()
    for item in flatten_schema(items):
        t = item.get("@type")
        if isinstance(t, list):
            types.update(str(x) for x in t)
        elif t:
            types.add(str(t))
    return sorted(types)


def product_schema(items):
    for item in flatten_schema(items):
        t = item.get("@type")
        vals = t if isinstance(t, list) else [t]
        if "Product" in vals:
            return item
    return None


def classify(url: str, types: list[str], soup: BeautifulSoup) -> str:
    path = urlparse(url).path.lower()
    if "Product" in types or soup.select_one(".product, .single-product, .product_title"):
        return "vehicle"
    if path.startswith("/blog/") and path != "/blog/":
        return "blog-post"
    if path == "/blog/":
        return "blog-index"
    if path in {"/particulares/", "/autonomos/", "/empresas/"} or any(x in path for x in ("renting-particulares", "renting-autonomos", "renting-empresas")):
        return "profile"
    if path in {"/contacto/", "/nosotros/", "/faqs/", "/aviso-legal/", "/politica-de-privacidad/", "/politica-de-cookies/"}:
        return "corporate"
    if path.startswith("/ofertas-de-renting"):
        return "catalog"
    return "seo-landing"


def extract_price(blob: str) -> float | None:
    patterns = [
        r"€\s*([0-9.]+(?:,[0-9]{1,2})?)",
        r"([0-9.]+(?:,[0-9]{1,2})?)\s*€\s*/?\s*mes",
        r"Desde\s+([0-9.]+(?:,[0-9]{1,2})?)\s*€",
    ]
    for pattern in patterns:
        m = re.search(pattern, blob, flags=re.I)
        if m:
            v = m.group(1).replace(".", "").replace(",", ".")
            try:
                return float(v)
            except ValueError:
                pass
    return None


def parse_page(url: str, html: str) -> dict:
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "noscript", "template"]):
        tag.extract()

    canonical_tag = soup.find("link", rel=lambda x: x and "canonical" in x)
    canonical = clean_url(canonical_tag.get("href"), url) if canonical_tag and canonical_tag.get("href") else url

    jsonld = parse_jsonld(BeautifulSoup(html, "lxml"))
    types = schema_types(jsonld)
    prod = product_schema(jsonld)

    headings = []
    for h in soup.find_all(["h1", "h2", "h3"]):
        value = text(h)
        if value and value not in [x["text"] for x in headings]:
            headings.append({"level": h.name, "text": value})

    images = []
    seen_images = set()
    for img in soup.find_all("img"):
        src = img.get("data-src") or img.get("data-lazy-src") or img.get("src")
        if not src:
            srcset = img.get("srcset") or img.get("data-srcset")
            if srcset:
                src = srcset.split(",")[-1].strip().split(" ")[0]
        if not src:
            continue
        abs_src = urljoin(url, src)
        if abs_src in seen_images or abs_src.startswith("data:"):
            continue
        seen_images.add(abs_src)
        images.append({"src": abs_src, "alt": (img.get("alt") or "").strip()})
        if len(images) >= 40:
            break

    internal = []
    seen_links = set()
    for a in soup.find_all("a", href=True):
        href = clean_url(a.get("href"), url)
        if href and href not in seen_links:
            seen_links.add(href)
            internal.append(href)

    body = soup.find("main") or soup.find("article") or soup.body or soup
    body_text = text(body)
    body_text = body_text[:24000]

    tables = []
    for row in soup.select("tr"):
        cells = [text(c) for c in row.find_all(["th", "td"])]
        if len(cells) >= 2 and any(cells):
            tables.append(cells[:6])
        if len(tables) >= 80:
            break

    dls = []
    for dt in soup.find_all("dt"):
        dd = dt.find_next_sibling("dd")
        if dd:
            dls.append([text(dt), text(dd)])

    record = {
        "url": url,
        "canonical": canonical or url,
        "path": urlparse(canonical or url).path,
        "type": classify(canonical or url, types, soup),
        "status": 200,
        "title": text(soup.title),
        "meta_description": meta(soup, name="description"),
        "og_title": meta(soup, prop="og:title"),
        "og_description": meta(soup, prop="og:description"),
        "h1": [h["text"] for h in headings if h["level"] == "h1"],
        "headings": headings[:80],
        "body_text": body_text,
        "images": images,
        "internal_links": internal[:600],
        "schema_types": types,
        "tables": tables,
        "definition_lists": dls[:80],
    }

    if record["type"] == "vehicle":
        name = ""
        if prod:
            name = str(prod.get("name") or "")
        if not name:
            name = record["h1"][0] if record["h1"] else record["title"].split("|")[0].strip()
        offers = prod.get("offers") if prod else None
        schema_price = None
        if isinstance(offers, dict):
            schema_price = offers.get("price") or offers.get("lowPrice")
        elif isinstance(offers, list) and offers:
            first = offers[0] if isinstance(offers[0], dict) else {}
            schema_price = first.get("price") or first.get("lowPrice")
        try:
            schema_price = float(schema_price) if schema_price is not None else None
        except Exception:
            schema_price = None

        path_parts = [p for p in record["path"].split("/") if p]
        brand_slug = path_parts[1] if len(path_parts) > 2 and path_parts[0] == "ofertas-de-renting" else ""
        record["vehicle"] = {
            "name": name,
            "brand_slug": brand_slug,
            "price": schema_price or extract_price(body_text),
            "schema": prod or {},
            "attributes": tables + dls,
        }

    return record


def main():
    OUT.mkdir(exist_ok=True)
    queue = deque([ROOT])
    queued = {ROOT}
    visited = set()
    records = []
    failures = []

    while queue and len(visited) < MAX_PAGES:
        url = queue.popleft()
        if url in visited:
            continue
        visited.add(url)
        try:
            response = session.get(url, timeout=TIMEOUT, allow_redirects=True)
            ctype = response.headers.get("content-type", "")
            if response.status_code != 200 or "text/html" not in ctype:
                failures.append({"url": url, "status": response.status_code, "content_type": ctype})
                continue
            final_url = clean_url(response.url, ROOT) or url
            record = parse_page(final_url, response.text)
            records.append(record)
            for link in record["internal_links"]:
                if link not in visited and link not in queued:
                    queued.add(link)
                    queue.append(link)
            if len(records) % 50 == 0:
                print(f"crawled={len(records)} queued={len(queue)} vehicles={sum(1 for r in records if r['type']=='vehicle')}", flush=True)
            time.sleep(DELAY)
        except Exception as exc:
            failures.append({"url": url, "error": repr(exc)})

    # Deduplicate by canonical URL while keeping the richest record.
    by_canonical = {}
    for record in records:
        key = record["canonical"]
        old = by_canonical.get(key)
        if not old or len(record.get("body_text", "")) > len(old.get("body_text", "")):
            by_canonical[key] = record
    records = sorted(by_canonical.values(), key=lambda r: r["url"])

    vehicles = [r for r in records if r["type"] == "vehicle"]
    pages = [r for r in records if r["type"] != "vehicle"]
    summary = {
        "root": ROOT,
        "pages": len(records),
        "vehicles": len(vehicles),
        "failures": len(failures),
        "types": {},
    }
    for r in records:
        summary["types"][r["type"]] = summary["types"].get(r["type"], 0) + 1

    (OUT / "inventory.json").write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "vehicles.json").write_text(json.dumps(vehicles, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "pages.json").write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "failures.json").write_text(json.dumps(failures, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    with (OUT / "routes.csv").open("w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(["type", "path", "title", "h1", "meta_description"])
        for r in records:
            writer.writerow([r["type"], r["path"], r["title"], " | ".join(r["h1"]), r["meta_description"]])

    print(json.dumps(summary, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
