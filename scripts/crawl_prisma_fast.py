from __future__ import annotations

import csv
import json
import re
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup

ROOT = "https://prismarenting.com/"
HOSTS = {"prismarenting.com", "www.prismarenting.com"}
OUT = Path("migration-output")
MAX_URLS = 4000
WORKERS = 18
TIMEOUT = 22
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ArchicMigrationBot/1.1; +https://archic.es)",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.6",
}
SKIP_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".ico", ".pdf", ".zip", ".css", ".js", ".xml", ".mp4", ".webm", ".woff", ".woff2", ".ttf", ".eot"}
SKIP_PATH_PARTS = ("/wp-admin/", "/wp-login", "/wp-json/", "/feed/", "/cart/", "/checkout/", "/my-account/", "/author/", "/tag/", "/wp-content/", "/wp-includes/")


def clean_url(raw: str, base: str = ROOT) -> str | None:
    if not raw or raw.startswith(("mailto:", "tel:", "javascript:", "#")):
        return None
    p = urlparse(urljoin(base, raw))
    if p.scheme not in {"http", "https"} or p.hostname not in HOSTS:
        return None
    path = re.sub(r"/{2,}", "/", p.path or "/")
    if any(path.lower().endswith(ext) for ext in SKIP_EXTENSIONS) or any(x in path for x in SKIP_PATH_PARTS):
        return None
    query = ""
    if p.query:
        keep = [pair for pair in p.query.split("&") if pair.split("=", 1)[0] in {"product-page", "paged"}]
        query = "&".join(keep)
    return urlunparse(("https", "prismarenting.com", path, "", query, ""))


def get(url: str):
    return requests.get(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=True)


def discover_sitemaps() -> list[str]:
    found = []
    try:
        r = get(urljoin(ROOT, "robots.txt"))
        if r.ok:
            found += re.findall(r"(?im)^\s*Sitemap:\s*(\S+)", r.text)
    except Exception:
        pass
    found += [urljoin(ROOT, x) for x in ("sitemap_index.xml", "wp-sitemap.xml", "sitemap.xml")]
    out, seen = [], set()
    for u in found:
        if u not in seen:
            seen.add(u); out.append(u)
    return out


def sitemap_urls() -> set[str]:
    page_urls: set[str] = set()
    pending = discover_sitemaps()
    seen_maps = set()
    while pending and len(seen_maps) < 200:
        sm = pending.pop(0)
        if sm in seen_maps:
            continue
        seen_maps.add(sm)
        try:
            r = get(sm)
            if not r.ok or "xml" not in r.headers.get("content-type", "").lower() and not r.text.lstrip().startswith("<"):
                continue
            root = ET.fromstring(r.content)
            locs = [el.text.strip() for el in root.iter() if el.tag.endswith("loc") and el.text]
            if root.tag.endswith("sitemapindex"):
                pending.extend(locs)
            else:
                for loc in locs:
                    u = clean_url(loc)
                    if u:
                        page_urls.add(u)
                        if len(page_urls) >= MAX_URLS:
                            return page_urls
        except Exception:
            continue
    return page_urls


def text(el) -> str:
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip() if el else ""


def meta(soup, *, name=None, prop=None):
    attrs = {"name": name} if name else {"property": prop}
    tag = soup.find("meta", attrs=attrs)
    return (tag.get("content") or "").strip() if tag else ""


def flatten_jsonld(soup):
    queue, flat = [], []
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
            flat.append(item)
            if isinstance(item.get("@graph"), list):
                queue.extend(item["@graph"])
    return flat


def product_obj(schema):
    for item in schema:
        t = item.get("@type")
        ts = t if isinstance(t, list) else [t]
        if "Product" in ts:
            return item
    return None


def price_from_text(blob):
    for pat in (r"€\s*([0-9.]+(?:,[0-9]{1,2})?)", r"([0-9.]+(?:,[0-9]{1,2})?)\s*€\s*/?\s*mes", r"Desde\s+([0-9.]+(?:,[0-9]{1,2})?)\s*€"):
        m = re.search(pat, blob, re.I)
        if m:
            try:
                return float(m.group(1).replace(".", "").replace(",", "."))
            except ValueError:
                pass
    return None


def classify(path, schema, soup):
    types = set()
    for item in schema:
        t = item.get("@type")
        types.update(t if isinstance(t, list) else ([t] if t else []))
    if "Product" in types or soup.select_one(".single-product, .product_title, body.single-product"):
        return "vehicle", sorted(types)
    p = path.lower()
    if p.startswith("/blog/") and p != "/blog/": return "blog-post", sorted(types)
    if p == "/blog/": return "blog-index", sorted(types)
    if p in {"/renting-coches-particulares/", "/renting-coches-autonomos/", "/renting-coches-empresas/"}: return "profile", sorted(types)
    if p in {"/contacto/", "/nosotros/", "/faqs/", "/aviso-legal/", "/politica-de-privacidad/", "/politica-de-cookies/"}: return "corporate", sorted(types)
    if p.startswith("/ofertas-de-renting"): return "catalog", sorted(types)
    return "seo-landing", sorted(types)


def parse_one(url: str):
    try:
        r = get(url)
        ctype = r.headers.get("content-type", "")
        if r.status_code != 200 or "text/html" not in ctype:
            return None, {"url": url, "status": r.status_code, "content_type": ctype}, []
        final = clean_url(r.url) or url
        raw_soup = BeautifulSoup(r.text, "lxml")
        schema = flatten_jsonld(raw_soup)
        prod = product_obj(schema)
        soup = BeautifulSoup(r.text, "lxml")
        for tag in soup(["script", "style", "noscript", "template"]): tag.extract()
        canon_tag = soup.find("link", rel=lambda x: x and "canonical" in x)
        canonical = clean_url(canon_tag.get("href"), final) if canon_tag and canon_tag.get("href") else final
        path = urlparse(canonical).path
        page_type, schema_types = classify(path, schema, soup)
        headings = []
        seen_h = set()
        for h in soup.find_all(["h1", "h2", "h3"]):
            v = text(h)
            if v and v not in seen_h:
                seen_h.add(v); headings.append({"level": h.name, "text": v})
        images, seen_i = [], set()
        for img in soup.find_all("img"):
            src = img.get("data-src") or img.get("data-lazy-src") or img.get("src")
            if not src:
                ss = img.get("srcset") or img.get("data-srcset")
                if ss: src = ss.split(",")[-1].strip().split(" ")[0]
            if not src: continue
            src = urljoin(final, src)
            if src.startswith("data:") or src in seen_i: continue
            seen_i.add(src); images.append({"src": src, "alt": (img.get("alt") or "").strip()})
            if len(images) >= 45: break
        links, seen_l = [], set()
        for a in soup.find_all("a", href=True):
            u = clean_url(a.get("href"), final)
            if u and u not in seen_l:
                seen_l.add(u); links.append(u)
        main = soup.find("main") or soup.find("article") or soup.body or soup
        body_text = text(main)[:30000]
        tables = []
        for tr in soup.select("tr"):
            cells = [text(c) for c in tr.find_all(["th", "td"])]
            if len(cells) >= 2 and any(cells): tables.append(cells[:8])
            if len(tables) >= 100: break
        record = {
            "url": final, "canonical": canonical, "path": path, "type": page_type, "status": 200,
            "title": text(soup.title), "meta_description": meta(soup, name="description"),
            "og_title": meta(soup, prop="og:title"), "og_description": meta(soup, prop="og:description"),
            "h1": [h["text"] for h in headings if h["level"] == "h1"], "headings": headings[:100],
            "body_text": body_text, "images": images, "internal_links": links[:800],
            "schema_types": schema_types, "tables": tables,
        }
        if page_type == "vehicle":
            name = (str(prod.get("name")) if prod and prod.get("name") else (record["h1"][0] if record["h1"] else record["title"].split("|")[0].strip()))
            offers = prod.get("offers") if prod else None
            schema_price = None
            if isinstance(offers, dict): schema_price = offers.get("price") or offers.get("lowPrice")
            elif isinstance(offers, list) and offers and isinstance(offers[0], dict): schema_price = offers[0].get("price") or offers[0].get("lowPrice")
            try: schema_price = float(schema_price) if schema_price is not None else None
            except Exception: schema_price = None
            parts = [x for x in path.split("/") if x]
            record["vehicle"] = {
                "name": name,
                "brand_slug": parts[1] if len(parts) > 2 and parts[0] == "ofertas-de-renting" else "",
                "price": schema_price or price_from_text(body_text),
                "schema": prod or {},
                "attributes": tables,
            }
        return record, None, links
    except Exception as exc:
        return None, {"url": url, "error": repr(exc)}, []


def main():
    OUT.mkdir(exist_ok=True)
    urls = sitemap_urls()
    print(f"sitemap urls={len(urls)}", flush=True)
    urls.add(ROOT)

    # First pass: crawl sitemap inventory concurrently.
    records, failures, discovered = [], [], set()
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {pool.submit(parse_one, u): u for u in sorted(urls)[:MAX_URLS]}
        for i, fut in enumerate(as_completed(futures), 1):
            rec, fail, links = fut.result()
            if rec: records.append(rec); discovered.update(links)
            if fail: failures.append(fail)
            if i % 100 == 0: print(f"fetched={i}/{len(futures)} records={len(records)} vehicles={sum(r['type']=='vehicle' for r in records)}", flush=True)

    # Supplement sitemap with internal pages it missed (max 500 extra).
    known = {r["canonical"] for r in records} | set(urls)
    extras = [u for u in discovered if u not in known][:500]
    if extras:
        print(f"supplemental urls={len(extras)}", flush=True)
        with ThreadPoolExecutor(max_workers=WORKERS) as pool:
            futures = {pool.submit(parse_one, u): u for u in extras}
            for fut in as_completed(futures):
                rec, fail, _ = fut.result()
                if rec: records.append(rec)
                if fail: failures.append(fail)

    by_canonical = {}
    for rec in records:
        old = by_canonical.get(rec["canonical"])
        if not old or len(rec.get("body_text", "")) > len(old.get("body_text", "")):
            by_canonical[rec["canonical"]] = rec
    records = sorted(by_canonical.values(), key=lambda x: x["path"])
    vehicles = [r for r in records if r["type"] == "vehicle"]
    pages = [r for r in records if r["type"] != "vehicle"]
    summary = {"root": ROOT, "pages": len(records), "vehicles": len(vehicles), "failures": len(failures), "sitemap_urls": len(urls), "types": {}}
    for r in records: summary["types"][r["type"]] = summary["types"].get(r["type"], 0) + 1
    for name, data in (("inventory.json", records), ("vehicles.json", vehicles), ("pages.json", pages), ("failures.json", failures), ("summary.json", summary)):
        (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    with (OUT / "routes.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh); w.writerow(["type", "path", "title", "h1", "meta_description"])
        for r in records: w.writerow([r["type"], r["path"], r["title"], " | ".join(r["h1"]), r["meta_description"]])
    print(json.dumps(summary, ensure_ascii=False), flush=True)

if __name__ == "__main__": main()
