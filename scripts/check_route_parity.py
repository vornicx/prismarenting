from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

CONTENT = Path("migration-content")
PRODUCTS = Path("migration-products/products.json")
OUT = Path("migration-report")

# Explicit top-level App Router segments that take precedence over [...sourcePath].
# Original URLs under these namespaces need an intentional dedicated renderer.
EXPLICIT_SEGMENTS = {"api", "alta-gama", "comparar", "favoritos", "modalidades", "ofertas", "perfil", "tipo"}


def load(path: Path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def normalize(value: str) -> str:
    if not value:
        return "/"
    try:
        path = urlparse(value).path
    except Exception:
        path = value
    if not path.startswith("/"):
        path = "/" + path
    while "//" in path:
        path = path.replace("//", "/")
    return path if path.endswith("/") else path + "/"


def product_path(product):
    return normalize(product.get("permalink") or f"/ofertas-de-renting/{product.get('slug','')}/")


def route_handler(path: str):
    if path == "/":
        return "src/app/page.tsx", True
    if path == "/ofertas-de-renting/" or path.startswith("/ofertas-de-renting/"):
        return "src/app/ofertas-de-renting/[[...slug]]/page.tsx", True
    first = path.strip("/").split("/", 1)[0]
    if first in EXPLICIT_SEGMENTS:
        return f"explicit:{first}", False
    return "src/app/[...sourcePath]/page.tsx", True


def main():
    pages = load(CONTENT / "pages.json", [])
    posts = load(CONTENT / "posts.json", [])
    products = load(PRODUCTS, [])

    source_records = []
    for item in pages:
        source_records.append(("page", normalize(item.get("path") or item.get("url") or ""), item.get("title") or ""))
    for item in posts:
        source_records.append(("post", normalize(item.get("path") or item.get("url") or ""), item.get("title") or ""))
    for item in products:
        source_records.append(("vehicle", product_path(item), item.get("name") or ""))

    path_counts = Counter(path for _, path, _ in source_records)
    duplicate_paths = sorted(path for path, count in path_counts.items() if count > 1)
    coverage = []
    uncovered = []
    for kind, path, title in source_records:
        handler, covered = route_handler(path)
        row = {"kind": kind, "path": path, "title": title, "handler": handler, "covered": covered}
        coverage.append(row)
        if not covered:
            uncovered.append(row)

    product_paths = [product_path(item) for item in products]
    products_missing_price = [item.get("name") for item in products if item.get("price") is None]
    products_missing_images = [item.get("name") for item in products if not item.get("images")]
    content_without_html = [
        {"kind": kind, "path": normalize(item.get("path") or item.get("url") or ""), "title": item.get("title") or ""}
        for kind, collection in (("page", pages), ("post", posts))
        for item in collection
        if not str(item.get("content_html") or "").strip()
    ]

    unique_paths = sorted(set(path for _, path, _ in source_records))
    report = {
        "source": {
            "pages": len(pages),
            "posts": len(posts),
            "products": len(products),
            "records": len(source_records),
            "unique_routes": len(unique_paths),
        },
        "coverage": {
            "covered_records": len(coverage) - len(uncovered),
            "uncovered_records": len(uncovered),
            "uncovered": uncovered,
            "duplicate_paths_across_source_types": duplicate_paths,
        },
        "products": {
            "unique_paths": len(set(product_paths)),
            "missing_price": products_missing_price,
            "missing_images": products_missing_images,
        },
        "content": {
            "without_rendered_html": content_without_html,
        },
    }

    OUT.mkdir(exist_ok=True)
    (OUT / "route-parity.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    with (OUT / "route-parity.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["kind", "path", "title", "handler", "covered"])
        writer.writeheader(); writer.writerows(coverage)

    print(json.dumps(report, ensure_ascii=False, indent=2), flush=True)

    fatal = []
    if uncovered:
        fatal.append(f"{len(uncovered)} original records collide with explicit app routes")
    if len(set(product_paths)) != len(products):
        fatal.append("product paths are not unique")
    if products_missing_price:
        fatal.append(f"{len(products_missing_price)} products missing price")
    if products_missing_images:
        fatal.append(f"{len(products_missing_images)} products missing images")
    if fatal:
        raise SystemExit("PARITY FAILED: " + "; ".join(fatal))


if __name__ == "__main__":
    main()
