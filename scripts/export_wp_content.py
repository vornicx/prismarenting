from __future__ import annotations

import html
import json
import re
import time
from pathlib import Path
from urllib.parse import urlparse

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

ROOT = "https://prismarenting.com"
OUT = Path("migration-content")
PER_PAGE = 10

session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; ArchicMigrationBot/2.1; +https://archic.es)"})
session.mount("https://", HTTPAdapter(max_retries=Retry(
    total=5, connect=5, read=5, backoff_factor=1.1,
    status_forcelist=(429, 500, 502, 503, 504),
    allowed_methods=frozenset(["GET"]),
)))


def get(path: str, params=None):
    response = session.get(ROOT + path, params=params, timeout=(10, 60))
    response.raise_for_status()
    return response


def rendered(obj, key):
    value = obj.get(key) or {}
    if isinstance(value, dict):
        return value.get("rendered") or ""
    return str(value or "")


def plain(value: str):
    value = re.sub(r"<script[\s\S]*?</script>", " ", value, flags=re.I)
    value = re.sub(r"<style[\s\S]*?</style>", " ", value, flags=re.I)
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def export_collection(kind: str):
    items = []
    page = 1
    total_pages = None
    fields = "id,date,modified,slug,status,link,parent,template,title,excerpt,content,yoast_head_json"
    while total_pages is None or page <= total_pages:
        response = get(f"/wp-json/wp/v2/{kind}", {"per_page": PER_PAGE, "page": page, "status": "publish", "_fields": fields})
        batch = response.json()
        if not isinstance(batch, list) or not batch:
            break
        total_pages = int(response.headers.get("X-WP-TotalPages", page))
        for item in batch:
            link = item.get("link") or ""
            seo = item.get("yoast_head_json") or {}
            content_html = rendered(item, "content")
            title_html = rendered(item, "title")
            excerpt_html = rendered(item, "excerpt")
            items.append({
                "id": item.get("id"),
                "kind": kind,
                "slug": item.get("slug"),
                "path": urlparse(link).path or "/",
                "url": link,
                "parent": item.get("parent") or 0,
                "template": item.get("template") or "",
                "date": item.get("date"),
                "modified": item.get("modified"),
                "title": plain(title_html),
                "excerpt": plain(excerpt_html),
                "content_html": content_html,
                "body_text": plain(content_html),
                "seo": {
                    "title": seo.get("title"),
                    "description": seo.get("description"),
                    "canonical": seo.get("canonical"),
                    "og_title": seo.get("og_title"),
                    "og_description": seo.get("og_description"),
                    "og_image": seo.get("og_image"),
                    "robots": seo.get("robots"),
                    "schema": seo.get("schema"),
                },
            })
        print(f"{kind} page={page}/{total_pages} total={len(items)}", flush=True)
        page += 1
        time.sleep(0.12)
    return items


def main():
    OUT.mkdir(exist_ok=True)
    pages = export_collection("pages")
    posts = export_collection("posts")
    try:
        types = get("/wp-json/wp/v2/types").json()
    except Exception as exc:
        types = {"error": repr(exc)}
    summary = {
        "pages": len(pages),
        "posts": len(posts),
        "unique_page_paths": len({item["path"] for item in pages}),
        "unique_post_paths": len({item["path"] for item in posts}),
        "with_content": sum(1 for item in pages + posts if item["content_html"].strip()),
    }
    (OUT / "pages.json").write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "posts.json").write_text(json.dumps(posts, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "types.json").write_text(json.dumps(types, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
