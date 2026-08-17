from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

PRODUCTS = Path("migration-products/products.json")
PAGES = Path("migration-output/pages.json")
OUT = Path("migration-report")

BRANDS = [
    "Abarth", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Citroen", "Citroën",
    "Cupra", "Dacia", "DS", "Fiat", "Ford", "Hyundai", "Jaguar", "Jeep", "Kia", "Lamborghini",
    "Land Rover", "Lexus", "Maserati", "Mazda", "Mercedes-Benz", "MG", "Mini", "Mitsubishi",
    "Nissan", "Opel", "Peugeot", "Polestar", "Porsche", "Renault", "Seat", "Skoda", "Smart",
    "Ssangyong", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo",
]


def load(path: Path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def names(items):
    result = []
    for item in items or []:
        if isinstance(item, dict):
            value = item.get("name") or item.get("slug")
        else:
            value = str(item)
        if value:
            result.append(str(value))
    return result


def attribute_terms(product):
    for attr in product.get("attributes") or []:
        name = str(attr.get("name") or "").strip()
        terms = attr.get("terms") or []
        clean = []
        for term in terms:
            if isinstance(term, dict):
                term = term.get("name") or term.get("slug")
            if term:
                clean.append(str(term))
        if name or clean:
            yield name, clean


def haystack(product):
    values = [product.get("name", ""), product.get("slug", ""), product.get("short_description", "")]
    values += names(product.get("categories")) + names(product.get("tags"))
    for name, terms in attribute_terms(product):
        values.append(name); values.extend(terms)
    return " ".join(str(v) for v in values).lower()


def product_brand(product):
    blob = haystack(product)
    for brand in sorted(BRANDS, key=len, reverse=True):
        if re.search(rf"(?<!\w){re.escape(brand.lower())}(?!\w)", blob):
            return brand
    first = str(product.get("name") or "").split(" ")[0]
    return first.title() if first else "Sin marca"


def main():
    products = load(PRODUCTS, [])
    pages = load(PAGES, [])
    category_counts = Counter()
    tag_counts = Counter()
    attribute_name_counts = Counter()
    attribute_term_counts = Counter()
    brand_counts = Counter()
    profile_counts = Counter()
    paths = []

    profile_terms = {
        "particulares": ("particular", "particulares"),
        "autonomos": ("autonomo", "autónomo", "autonomos", "autónomos"),
        "empresas": ("empresa", "empresas"),
    }

    for product in products:
        for category in names(product.get("categories")):
            category_counts[category] += 1
        for tag in names(product.get("tags")):
            tag_counts[tag] += 1
        for attr_name, terms in attribute_terms(product):
            attribute_name_counts[attr_name] += 1
            for term in terms:
                attribute_term_counts[f"{attr_name} :: {term}"] += 1
        brand_counts[product_brand(product)] += 1
        blob = haystack(product)
        for profile, terms in profile_terms.items():
            if any(term in blob for term in terms):
                profile_counts[profile] += 1
        permalink = product.get("permalink") or ""
        if permalink:
            paths.append(urlparse(permalink).path)

    unique_paths = set(paths)
    duplicates = [path for path, count in Counter(paths).items() if count > 1]
    page_paths = {str(page.get("path") or "") for page in pages}

    report = {
        "products": len(products),
        "unique_product_paths": len(unique_paths),
        "duplicate_product_paths": duplicates,
        "products_with_price": sum(1 for product in products if product.get("price") is not None),
        "products_with_images": sum(1 for product in products if product.get("images")),
        "pages": len(pages),
        "unique_page_paths": len(page_paths),
        "profiles_detected": dict(profile_counts),
        "brands": dict(brand_counts.most_common()),
        "categories": dict(category_counts.most_common()),
        "tags": dict(tag_counts.most_common()),
        "attribute_names": dict(attribute_name_counts.most_common()),
        "attribute_terms_top": dict(attribute_term_counts.most_common(250)),
        "sample_products": [
            {
                "name": product.get("name"),
                "price": product.get("price"),
                "permalink": product.get("permalink"),
                "categories": names(product.get("categories")),
                "tags": names(product.get("tags")),
                "attributes": [{"name": name, "terms": terms} for name, terms in attribute_terms(product)],
            }
            for product in products[:20]
        ],
    }

    OUT.mkdir(exist_ok=True)
    (OUT / "audit.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "products": report["products"],
        "unique_product_paths": report["unique_product_paths"],
        "profiles_detected": report["profiles_detected"],
        "brands": len(report["brands"]),
        "categories": len(report["categories"]),
        "attribute_names": report["attribute_names"],
    }, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
