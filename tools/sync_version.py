#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/sync_version.py
Synchronize SemVer version across VERSION, package.json, sw.js, and index.html.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSION_FILE = ROOT / "VERSION"
PACKAGE_JSON = ROOT / "package.json"
SW_JS = ROOT / "sw.js"
INDEX_HTML = ROOT / "index.html"


def get_version() -> str:
    if not VERSION_FILE.exists():
        VERSION_FILE.write_text("1.0.0\n", encoding="utf-8")
    return VERSION_FILE.read_text(encoding="utf-8").strip()


def sync_package_json(version: str):
    if not PACKAGE_JSON.exists():
        return
    data = json.loads(PACKAGE_JSON.read_text(encoding="utf-8"))
    if data.get("version") != version:
        data["version"] = version
        PACKAGE_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Synced package.json -> {version}")


def sync_sw_js(version: str):
    if not SW_JS.exists():
        return
    content = SW_JS.read_text(encoding="utf-8")
    asset_version = f"v{version}"
    new_content = re.sub(r"const\s+ASSET_VERSION\s*=\s*['\"][^'\"]+['\"];",
                         f"const ASSET_VERSION = '{asset_version}';", content)
    if new_content != content:
        SW_JS.write_text(new_content, encoding="utf-8")
        print(f"Synced sw.js ASSET_VERSION -> {asset_version}")


def sync_index_html(version: str):
    if not INDEX_HTML.exists():
        return
    content = INDEX_HTML.read_text(encoding="utf-8")
    asset_version = f"v{version}"

    # Replace version query params in stylesheets and scripts that use asset versioning
    new_content = re.sub(r'(\.css\?v=)[^"\'\s>]+', rf'\g<1>{asset_version}', content)
    new_content = re.sub(r'(\.js\?v=)[^"\'\s>]+', rf'\g<1>{asset_version}', new_content)

    if new_content != content:
        INDEX_HTML.write_text(new_content, encoding="utf-8")
        print(f"Synced index.html cache busters -> {asset_version}")


def main():
    version = get_version()
    print(f"Current SemVer: {version}")
    sync_package_json(version)
    sync_sw_js(version)
    sync_index_html(version)
    print("Version synchronization complete.")


if __name__ == "__main__":
    main()
