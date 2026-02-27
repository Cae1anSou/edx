#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path


ROUTE_PATTERN = re.compile(
    r"(?:path|re_path|url)\(\s*(?:r|u|ur|f|fr|rf)?['\"]([^'\"]+)['\"]",
    re.MULTILINE,
)


def normalize(route: str) -> str:
    r = route.strip()
    r = r.lstrip("^").rstrip("$")
    r = r.replace("\\/", "/")
    r = re.sub(r"\(\?P<([^>]+)>[^)]+\)", r"{\1}", r)
    r = re.sub(r"\([^)]*\)", "", r)
    r = r.replace("?", "")
    r = r.replace("//", "/")
    r = r.strip("/")
    if not r:
        return ""
    if r.startswith("api/"):
        return "/" + r
    if "/api/" in r:
        idx = r.index("api/")
        return "/" + r[idx:]
    return ""


def main() -> None:
    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent.parent
    out_file = script_dir.parent / "contracts" / "django-api-paths.txt"
    out_file.parent.mkdir(parents=True, exist_ok=True)

    paths: set[str] = set()
    for file in sorted(repo_root.rglob("urls.py")):
        if any(part in {".git", "node_modules", "venv", ".venv"} for part in file.parts):
            continue
        text = file.read_text(encoding="utf-8", errors="ignore")
        for raw in ROUTE_PATTERN.findall(text):
            p = normalize(raw)
            if p:
                paths.add(p)

    out_file.write_text("\n".join(sorted(paths)) + "\n", encoding="utf-8")
    print(f"Django API paths exported to {out_file}")


if __name__ == "__main__":
    main()
