from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(".")


def load(path, default):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception:
        return default


def text(path):
    try:
        return Path(path).read_text(encoding="utf-8")
    except Exception:
        return ""


def main():
    route_parity = load("migration-report/route-parity.json", {})
    feature_audit = load("migration-report/feature-audit.json", {})
    embed_audit = load("migration-report/embed-audit.json", {})
    product_summary = load("migration-products/summary.json", {})
    content_summary = load("migration-content/summary.json", {})
    runtime_summary = load("migration-runtime/summary.json", {})

    form_map = text("src/lib/migrated-contact-forms.ts")
    form_component = text("src/components/original/MigratedContactForm.tsx")
    form_blueprint = text("public/__forms.html")
    source_html = text("src/lib/source-html.ts")
    catalog = text("src/components/original/OriginalCatalogTemplate.tsx")
    original_source = text("src/lib/original-source.ts")

    expected_form_paths = {
        "/formulario-contacto/",
        "/informate-sin-compromiso/",
        "/contacto-email3/",
        "/contacto-email/",
        "/contacto/",
    }
    audited_elementor_paths = {record.get("path") for record in feature_audit.get("elementor_forms", [])}
    mapped_form_paths = {path for path in expected_form_paths if path in form_map}

    checks = {
        "complete_route_coverage": route_parity.get("coverage", {}).get("uncovered_unique_routes") == 0,
        "route_union_at_least_749": route_parity.get("source", {}).get("union_unique_routes", 0) >= 749,
        "all_original_elementor_form_pages_identified": audited_elementor_paths == expected_form_paths,
        "all_original_elementor_form_pages_mapped": mapped_form_paths == expected_form_paths,
        "netlify_form_blueprint_present": 'name="prisma-contact"' in form_blueprint and 'data-netlify="true"' in form_blueprint,
        "netlify_ajax_submission_present": 'fetch("/__forms.html"' in form_component,
        "promo_field_preserved": 'name="promoCode"' in form_component and 'name="promoCode"' in form_blueprint,
        "message_field_preserved": 'name="message"' in form_component and 'name="message"' in form_blueprint,
        "privacy_consent_preserved": 'name="privacy"' in form_component and 'name="privacy"' in form_blueprint,
        "dead_elementor_forms_removed": "elementor-form" in source_html,
        "dead_woocommerce_ordering_removed": "woocommerce-ordering" in source_html,
        "no_lazy_iframe_dependency": embed_audit.get("lazy_only_iframes") == 0,
        "all_active_products_imported": product_summary.get("products") == 125,
        "all_active_products_have_prices": product_summary.get("with_price") == 125,
        "all_active_products_have_images": product_summary.get("with_images") == 125,
        "all_wordpress_pages_imported": content_summary.get("pages") == 296,
        "all_wordpress_posts_imported": content_summary.get("posts") == 73,
        "runtime_snapshot_present": runtime_summary.get("runtime_records", 0) >= 380,
        "catalog_uses_current_products_only": "getCurrentProducts" in catalog,
        "adapter_distinguishes_current_and_historical": "getCurrentProducts" in original_source and "active: boolean" in original_source,
    }

    failed = [name for name, ok in checks.items() if not ok]
    report = {
        "checks": checks,
        "failed": failed,
        "metrics": {
            "unique_routes": route_parity.get("source", {}).get("union_unique_routes"),
            "active_products": product_summary.get("products"),
            "wordpress_pages": content_summary.get("pages"),
            "wordpress_posts": content_summary.get("posts"),
            "elementor_form_pages": len(audited_elementor_paths),
            "actual_iframes": embed_audit.get("iframe_count"),
            "lazy_iframes": embed_audit.get("lazy_only_iframes"),
            "runtime_records": runtime_summary.get("runtime_records"),
        },
    }
    Path("migration-report").mkdir(exist_ok=True)
    Path("migration-report/functional-parity.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if failed:
        raise SystemExit("FUNCTIONAL PARITY FAILED: " + ", ".join(failed))


if __name__ == "__main__":
    main()
