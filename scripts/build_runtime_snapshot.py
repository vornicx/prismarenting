from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urlparse

CRAWL = Path("migration-crawl-full/inventory.json")
WP_PAGES = Path("migration-content/pages.json")
WP_POSTS = Path("migration-content/posts.json")
WOO = Path("migration-products/products.json")
OUT = Path("migration-runtime")


def load(path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def normalize(value: str):
    if not value:
        return "/"
    route = urlparse(value).path if "://" in value else value
    if not route.startswith("/"):
        route = "/" + route
    while "//" in route:
        route = route.replace("//", "/")
    return route if route.endswith("/") else route + "/"


def woo_path(item):
    return normalize(item.get("permalink") or f"/ofertas-de-renting/{item.get('slug','')}/")


def compact_active_product_page(record):
    keep = {
        "url", "canonical", "path", "type", "status", "title", "meta_description",
        "og_title", "og_description", "h1", "headings", "internal_links",
        "schema_types", "vehicle",
    }
    compact = {key: value for key, value in record.items() if key in keep}
    # WooCommerce is the runtime source for active product body/images/attributes.
    compact["body_text"] = ""
    compact["content_html"] = ""
    compact["images"] = []
    compact["tables"] = []
    return compact


def main():
    crawl = load(CRAWL, [])
    pages = load(WP_PAGES, [])
    posts = load(WP_POSTS, [])
    products = load(WOO, [])

    wp_paths = {normalize(item.get("path") or item.get("url") or "") for item in pages + posts}
    active_paths = {woo_path(item) for item in products}

    runtime = []
    full_fallback = 0
    compact_active = 0
    skipped_wp = 0

    for record in crawl:
        route = normalize(record.get("path") or record.get("canonical") or record.get("url") or "")
        if route in wp_paths:
            skipped_wp += 1
            continue
        normalized = {**record, "path": route}
        if route in active_paths and record.get("type") == "vehicle":
            runtime.append(compact_active_product_page(normalized))
            compact_active += 1
        else:
            runtime.append(normalized)
            full_fallback += 1

    # One record per route, preferring a fuller fallback if duplicates appear.
    by_path = {}
    for record in runtime:
        route = record["path"]
        old = by_path.get(route)
        if not old or len(str(record.get("content_html") or "")) > len(str(old.get("content_html") or "")):
            by_path[route] = record
    runtime = sorted(by_path.values(), key=lambda item: item["path"])

    OUT.mkdir(exist_ok=True)
    payload_path = OUT / "crawl-runtime.json"
    payload_path.write_text(json.dumps(runtime, ensure_ascii=False, indent=2), encoding="utf-8")
    failures = load(Path("migration-crawl-full/failures.json"), [])
    (OUT / "crawl-failures.json").write_text(json.dumps(failures, ensure_ascii=False, indent=2), encoding="utf-8")
    summary = {
        "crawl_records": len(crawl),
        "wordpress_override_paths": len(wp_paths),
        "active_woocommerce_paths": len(active_paths),
        "runtime_records": len(runtime),
        "full_fallback_records": full_fallback,
        "compact_active_product_metadata_records": compact_active,
        "skipped_wordpress_overrides": skipped_wp,
        "runtime_bytes": payload_path.stat().st_size,
    }
    (OUT / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
