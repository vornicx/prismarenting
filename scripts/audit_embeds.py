from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

OUT = Path("migration-report")


def load(path, default):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception:
        return default


def attr(tag, name):
    m = re.search(rf"\b{name}=[\"']([^\"']*)[\"']", tag, re.I)
    return m.group(1).strip() if m else ""


def normalize(value):
    if not value:
        return "/"
    try:
        p = urlparse(value).path
    except Exception:
        p = value
    if not p.startswith("/"):
        p = "/" + p
    return p if p.endswith("/") else p + "/"


def scan(kind, item):
    html = item.get("content_html") or ""
    path = normalize(item.get("path") or item.get("url") or "")
    iframes = []
    for m in re.finditer(r"<iframe\b[^>]*>", html, re.I):
        tag = m.group(0)
        src = attr(tag, "src")
        data_src = attr(tag, "data-src") or attr(tag, "data-lazy-src")
        effective = src or data_src
        host = ""
        try:
            host = urlparse(effective).hostname or ""
        except Exception:
            pass
        iframes.append({
            "src": src,
            "data_src": data_src,
            "host": host,
            "lazy_only": bool(data_src and (not src or src in {"about:blank", "#"})),
        })
    urls = re.findall(r"https?://[^\"'<>\s)]+", html)
    youtube = sorted({url for url in urls if "youtube.com" in url or "youtu.be" in url})
    vimeo = sorted({url for url in urls if "vimeo.com" in url})
    maps = sorted({url for url in urls if "google." in url and "/maps" in url or "maps.google" in url})
    return {"kind": kind, "path": path, "title": item.get("title") or "", "iframes": iframes, "youtube_urls": youtube[:20], "vimeo_urls": vimeo[:20], "map_urls": maps[:20]}


def main():
    pages = load("migration-content/pages.json", [])
    posts = load("migration-content/posts.json", [])
    runtime = load("migration-runtime/crawl-runtime.json", [])
    records = [scan("wordpress-page", item) for item in pages]
    records += [scan("wordpress-post", item) for item in posts]
    records += [scan("crawl-runtime", item) for item in runtime if item.get("content_html")]
    relevant = [r for r in records if r["iframes"] or r["youtube_urls"] or r["vimeo_urls"] or r["map_urls"]]
    iframe_records = [r for r in relevant if r["iframes"]]
    lazy = [{"path": r["path"], "title": r["title"], "iframe": iframe} for r in iframe_records for iframe in r["iframes"] if iframe["lazy_only"]]
    host_counts = Counter(iframe["host"] or "no-host" for r in iframe_records for iframe in r["iframes"])
    report = {
        "records_scanned": len(records),
        "embed_records": len(relevant),
        "iframe_records": len(iframe_records),
        "iframe_count": sum(len(r["iframes"]) for r in iframe_records),
        "lazy_only_iframes": len(lazy),
        "iframe_hosts": dict(host_counts.most_common()),
        "youtube_records": sum(bool(r["youtube_urls"]) for r in relevant),
        "vimeo_records": sum(bool(r["vimeo_urls"]) for r in relevant),
        "map_records": sum(bool(r["map_urls"]) for r in relevant),
        "lazy_iframes": lazy,
        "records": relevant,
    }
    OUT.mkdir(exist_ok=True)
    (OUT / "embed-audit.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({k: report[k] for k in ("records_scanned", "embed_records", "iframe_records", "iframe_count", "lazy_only_iframes", "iframe_hosts", "youtube_records", "vimeo_records", "map_records")}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
