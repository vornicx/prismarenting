from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urlparse

OUT = Path("migration-report")


def load(path, default):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception:
        return default


def normalize(value):
    route = urlparse(value).path if value and "://" in value else (value or "/")
    if not route.startswith("/"):
        route = "/" + route
    return route if route.endswith("/") else route + "/"


def scan(kind, item):
    source = item.get("content_html") or ""
    route = normalize(item.get("path") or item.get("url") or "")
    lower = source.lower()
    forms = re.findall(r"<form\b[\s\S]*?</form>", source, re.I)
    classes = sorted(set(re.findall(r"<form\b[^>]*class=[\"']([^\"']+)", source, re.I)))
    return {
        "kind": kind,
        "path": route,
        "title": item.get("title") or "",
        "forms": len(forms),
        "form_classes": classes,
        "elementor_forms": sum(1 for form in forms if "elementor-form" in form.lower()),
        "woocommerce_forms": sum(1 for form in forms if "woocommerce" in form.lower()),
        "inputs": len(re.findall(r"<(?:input|select|textarea)\b", source, re.I)),
        "iframes": len(re.findall(r"<iframe\b", source, re.I)),
        "videos": len(re.findall(r"<(?:video|source)\b", source, re.I)),
        "tables": len(re.findall(r"<table\b", source, re.I)),
        "details": len(re.findall(r"<details\b", source, re.I)),
        "images": len(re.findall(r"<img\b", source, re.I)),
        "buttons": len(re.findall(r"<button\b", source, re.I)),
        "contact_form_7": "wpcf7" in lower or "contact-form-7" in lower,
        "elementor": "elementor" in lower,
        "woocommerce": "woocommerce" in lower,
        "gravity_forms": "gform_" in lower or "gravityforms" in lower,
        "maps": "google.com/maps" in lower or "maps.google" in lower,
        "youtube": "youtube.com" in lower or "youtu.be" in lower,
        "vimeo": "vimeo.com" in lower,
    }


def main():
    wp_pages = load("migration-content/pages.json", [])
    wp_posts = load("migration-content/posts.json", [])
    runtime = load("migration-runtime/crawl-runtime.json", [])

    records = [scan("wordpress-page", item) for item in wp_pages]
    records += [scan("wordpress-post", item) for item in wp_posts]
    records += [scan("crawl-runtime", item) for item in runtime if item.get("content_html")]

    interactive = [r for r in records if any(r[key] for key in ("forms", "iframes", "videos", "tables", "details", "maps", "youtube", "vimeo"))]
    true_forms = [r for r in records if r["forms"] > 0]
    elementor_forms = [r for r in records if r["elementor_forms"] > 0]
    woo_forms = [r for r in records if r["woocommerce_forms"] > 0]
    input_only = [r for r in records if r["forms"] == 0 and r["inputs"] > 0]
    embed_pages = [r for r in records if r["iframes"] or r["youtube"] or r["vimeo"] or r["maps"]]
    report = {
        "records_scanned": len(records),
        "interactive_records": len(interactive),
        "form_records": len(true_forms),
        "elementor_form_records": len(elementor_forms),
        "woocommerce_form_records": len(woo_forms),
        "input_only_records": len(input_only),
        "embed_records": len(embed_pages),
        "contact_form_7_records": sum(1 for r in records if r["contact_form_7"]),
        "elementor_records": sum(1 for r in records if r["elementor"]),
        "woocommerce_markup_records": sum(1 for r in records if r["woocommerce"]),
        "forms": true_forms,
        "elementor_forms": elementor_forms,
        "woocommerce_forms": woo_forms,
        "input_only": input_only,
        "embeds": embed_pages,
        "interactive": interactive,
    }
    OUT.mkdir(exist_ok=True)
    (OUT / "feature-audit.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    keys = ("records_scanned", "interactive_records", "form_records", "elementor_form_records", "woocommerce_form_records", "input_only_records", "embed_records", "contact_form_7_records", "elementor_records", "woocommerce_markup_records")
    print(json.dumps({key: report[key] for key in keys}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
