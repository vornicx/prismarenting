from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse

CONTENT = Path("migration-content")
PRODUCTS = Path("migration-products/products.json")
RUNTIME = Path("migration-runtime")
OUT = Path("migration-report")

EXPLICIT_SEGMENTS = {"api", "alta-gama", "blog", "comparar", "favoritos", "modalidades", "ofertas", "perfil", "tipo"}
SOURCE_BACKED_EXPLICIT = {
    "/alta-gama/": "src/app/alta-gama/page.tsx",
    "/blog/": "src/app/blog/page.tsx",
}


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
        route = urlparse(value).path
    except Exception:
        route = value
    if not route.startswith("/"):
        route = "/" + route
    while "//" in route:
        route = route.replace("//", "/")
    return route if route.endswith("/") else route + "/"


def product_path(product):
    return normalize(product.get("permalink") or f"/ofertas-de-renting/{product.get('slug','')}/")


def route_handler(route: str):
    if route == "/":
        return "src/app/page.tsx", True
    if route in SOURCE_BACKED_EXPLICIT:
        return SOURCE_BACKED_EXPLICIT[route], True
    if route == "/ofertas-de-renting/" or route.startswith("/ofertas-de-renting/"):
        return "src/app/ofertas-de-renting/[[...slug]]/page.tsx", True
    first = route.strip("/").split("/", 1)[0]
    if first in EXPLICIT_SEGMENTS:
        return f"explicit:{first}", False
    return "src/app/[...sourcePath]/page.tsx", True


def add_record(target, *, source, kind, route, title=""):
    route = normalize(route)
    target[route]["sources"].add(source)
    target[route]["kinds"].add(kind)
    if title and not target[route]["title"]:
        target[route]["title"] = str(title)


def main():
    wp_pages = load(CONTENT / "pages.json", [])
    wp_posts = load(CONTENT / "posts.json", [])
    active_products = load(PRODUCTS, [])
    runtime_records = load(RUNTIME / "crawl-runtime.json", [])
    runtime_failures = load(RUNTIME / "crawl-failures.json", [])
    runtime_summary = load(RUNTIME / "summary.json", {})

    routes = defaultdict(lambda: {"sources": set(), "kinds": set(), "title": ""})

    for item in runtime_records:
        add_record(routes, source="crawl-runtime", kind=item.get("type") or "crawl", route=item.get("path") or item.get("canonical") or item.get("url") or "", title=item.get("title") or "")
    for item in wp_pages:
        add_record(routes, source="wordpress-page", kind="page", route=item.get("path") or item.get("url") or "", title=item.get("title") or "")
    for item in wp_posts:
        add_record(routes, source="wordpress-post", kind="post", route=item.get("path") or item.get("url") or "", title=item.get("title") or "")
    for item in active_products:
        add_record(routes, source="woocommerce", kind="active-vehicle", route=product_path(item), title=item.get("name") or "")

    coverage = []
    uncovered = []
    for route in sorted(routes):
        data = routes[route]
        handler, covered = route_handler(route)
        row = {
            "path": route,
            "sources": ",".join(sorted(data["sources"])),
            "kinds": ",".join(sorted(data["kinds"])),
            "title": data["title"],
            "handler": handler,
            "covered": covered,
        }
        coverage.append(row)
        if not covered:
            uncovered.append(row)

    runtime_paths = {normalize(item.get("path") or item.get("canonical") or item.get("url") or "") for item in runtime_records}
    runtime_vehicle_paths = {normalize(item.get("path") or item.get("canonical") or item.get("url") or "") for item in runtime_records if item.get("type") == "vehicle"}
    active_paths = {product_path(item) for item in active_products}
    wp_paths = {normalize(item.get("path") or item.get("url") or "") for item in wp_pages + wp_posts}

    active_missing_from_runtime = sorted(active_paths - runtime_paths)
    historical_vehicle_paths = sorted(runtime_vehicle_paths - active_paths)
    active_runtime_overlap = sorted(runtime_vehicle_paths & active_paths)
    wp_missing_from_runtime = sorted(wp_paths - runtime_paths)

    missing_active_price = [item.get("name") for item in active_products if item.get("price") is None]
    missing_active_images = [item.get("name") for item in active_products if not item.get("images")]
    content_without_html = [
        {"kind": kind, "path": normalize(item.get("path") or item.get("url") or ""), "title": item.get("title") or ""}
        for kind, collection in (("page", wp_pages), ("post", wp_posts))
        for item in collection
        if not str(item.get("content_html") or "").strip()
    ]

    valid_failure_exceptions = []
    unexpected_failures = []
    for item in runtime_failures:
        status = item.get("status")
        content_type = str(item.get("content_type") or "")
        row = {"url": item.get("url"), "status": status, "content_type": content_type, "error": item.get("error")}
        if status == 404 or (status == 200 and content_type.startswith("image/")):
            valid_failure_exceptions.append(row)
        else:
            unexpected_failures.append(row)

    report = {
        "source": {
            "crawl_records": runtime_summary.get("crawl_records"),
            "runtime_records": len(runtime_records),
            "crawl_vehicle_pages": len(runtime_vehicle_paths),
            "wordpress_pages": len(wp_pages),
            "wordpress_posts": len(wp_posts),
            "active_woocommerce_products": len(active_products),
            "union_unique_routes": len(routes),
        },
        "coverage": {
            "covered_unique_routes": len(coverage) - len(uncovered),
            "uncovered_unique_routes": len(uncovered),
            "uncovered": uncovered,
        },
        "catalog_reconciliation": {
            "active_products": len(active_paths),
            "crawl_vehicle_pages": len(runtime_vehicle_paths),
            "active_and_crawl_overlap": len(active_runtime_overlap),
            "active_missing_from_runtime": active_missing_from_runtime,
            "preserved_nonactive_vehicle_routes": len(historical_vehicle_paths),
            "preserved_nonactive_vehicle_paths": historical_vehicle_paths,
            "active_missing_price": missing_active_price,
            "active_missing_images": missing_active_images,
        },
        "editorial_reconciliation": {
            "wordpress_routes_missing_from_runtime": wp_missing_from_runtime,
            "without_rendered_html": content_without_html,
        },
        "crawl_failures": {
            "expected_invalid_source_urls": valid_failure_exceptions,
            "unexpected": unexpected_failures,
        },
    }

    OUT.mkdir(exist_ok=True)
    (OUT / "route-parity.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    with (OUT / "route-parity.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["path", "sources", "kinds", "title", "handler", "covered"])
        writer.writeheader(); writer.writerows(coverage)

    print(json.dumps({
        "crawl_records": runtime_summary.get("crawl_records"),
        "runtime_records": len(runtime_records),
        "union_unique_routes": len(routes),
        "covered": len(coverage) - len(uncovered),
        "uncovered": len(uncovered),
        "active_products": len(active_paths),
        "crawl_vehicle_pages": len(runtime_vehicle_paths),
        "active_overlap": len(active_runtime_overlap),
        "preserved_nonactive_vehicle_routes": len(historical_vehicle_paths),
        "wp_missing_from_runtime": len(wp_missing_from_runtime),
        "unexpected_crawl_failures": len(unexpected_failures),
    }, ensure_ascii=False, indent=2), flush=True)

    fatal = []
    if runtime_summary.get("crawl_records", 0) < 700 or len(runtime_records) < 300:
        fatal.append("compact runtime snapshot is missing or incomplete")
    if uncovered:
        fatal.append(f"{len(uncovered)} source routes are not handled by the application")
    if len(active_paths) != len(active_products):
        fatal.append("active WooCommerce product paths are not unique")
    if missing_active_price:
        fatal.append(f"{len(missing_active_price)} active products are missing price")
    if missing_active_images:
        fatal.append(f"{len(missing_active_images)} active products are missing images")
    if unexpected_failures:
        fatal.append(f"{len(unexpected_failures)} crawl failures are not explained by source 404/image URLs")
    if fatal:
        raise SystemExit("FULL PARITY FAILED: " + "; ".join(fatal))


if __name__ == "__main__":
    main()
