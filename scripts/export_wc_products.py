from __future__ import annotations

import json
from pathlib import Path
import requests

ROOT = "https://prismarenting.com"
OUT = Path("migration-products")
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; ArchicMigrationBot/1.2; +https://archic.es)"}


def get_json(path: str, params=None):
    r = requests.get(ROOT + path, params=params, headers=HEADERS, timeout=30)
    r.raise_for_status()
    return r.json(), r.headers


def main():
    OUT.mkdir(exist_ok=True)
    products = []
    page = 1
    while True:
        data, headers = get_json("/wp-json/wc/store/v1/products", {"per_page": 100, "page": page})
        if not isinstance(data, list) or not data:
            break
        products.extend(data)
        print(f"products page={page} total={len(products)}", flush=True)
        total_pages = int(headers.get("X-WP-TotalPages", page))
        if page >= total_pages:
            break
        page += 1

    extras = {}
    for name, path in {
        "categories": "/wp-json/wc/store/v1/products/categories",
        "attributes": "/wp-json/wc/store/v1/products/attributes",
        "brands": "/wp-json/wc/store/v1/products/brands",
    }.items():
        try:
            data, _ = get_json(path, {"per_page": 100})
            extras[name] = data
        except Exception as exc:
            extras[name] = {"error": repr(exc)}

    normalized = []
    for p in products:
        prices = p.get("prices") or {}
        minor = int(prices.get("currency_minor_unit", 2) or 2)
        raw_price = prices.get("price")
        try:
            price = int(raw_price) / (10 ** minor) if raw_price not in (None, "") else None
        except Exception:
            price = None
        normalized.append({
            "id": p.get("id"),
            "name": p.get("name"),
            "slug": p.get("slug"),
            "permalink": p.get("permalink"),
            "summary": p.get("summary"),
            "short_description": p.get("short_description"),
            "description": p.get("description"),
            "on_sale": p.get("on_sale"),
            "price": price,
            "price_raw": prices,
            "images": p.get("images") or [],
            "categories": p.get("categories") or [],
            "tags": p.get("tags") or [],
            "attributes": p.get("attributes") or [],
            "variations": p.get("variations") or [],
            "extensions": p.get("extensions") or {},
        })

    summary = {
        "products": len(normalized),
        "with_price": sum(1 for p in normalized if p["price"] is not None),
        "with_images": sum(1 for p in normalized if p["images"]),
        "categories": len(extras.get("categories", [])) if isinstance(extras.get("categories"), list) else None,
        "attributes": len(extras.get("attributes", [])) if isinstance(extras.get("attributes"), list) else None,
        "brands": len(extras.get("brands", [])) if isinstance(extras.get("brands"), list) else None,
    }
    (OUT / "products.json").write_text(json.dumps(normalized, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "taxonomy.json").write_text(json.dumps(extras, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
