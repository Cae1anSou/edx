#!/usr/bin/env python3
"""Check parity between backend SPA routes and React routes."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONTROLLER = ROOT / "backend-java/src/main/java/org/openedx/backend/studio/web/StudioDashboardFrontendController.java"
APP = ROOT / "frontend-app-studio-dashboard/src/App.tsx"


def canonical(path: str) -> str:
    if path == "/":
        return path
    path = path.strip()
    path = re.sub(r"\{\*([a-zA-Z0-9_]+)\}", r"*", path)
    path = re.sub(r"\{([a-zA-Z0-9_]+):[^}]+\}", r":\1", path)
    path = re.sub(r"\{([a-zA-Z0-9_]+)\}", r":\1", path)
    path = re.sub(r"/+$", "", path)
    return path or "/"


def parse_backend_routes(text: str) -> set[str]:
    block_match = re.search(r"@GetMapping\(\{(?P<body>.*?)\}\)", text, flags=re.S)
    if not block_match:
        raise RuntimeError("Could not locate @GetMapping route block in controller")
    body = block_match.group("body")
    raw = re.findall(r'"(/[^\"]*)"', body)
    return {canonical(route) for route in raw if route != "/assets/**"}


def parse_frontend_routes(text: str) -> set[str]:
    raw = re.findall(r'path="([^"]+)"', text)
    return {canonical(route) for route in raw if route != "*"}


def main() -> int:
    backend_text = CONTROLLER.read_text(encoding="utf-8")
    frontend_text = APP.read_text(encoding="utf-8")

    backend_routes = parse_backend_routes(backend_text)
    frontend_routes = parse_frontend_routes(frontend_text)

    missing_in_frontend = sorted(backend_routes - frontend_routes)
    extra_in_frontend = sorted(frontend_routes - backend_routes)

    print(f"backend routes: {len(backend_routes)}")
    print(f"frontend routes: {len(frontend_routes)}")

    if missing_in_frontend:
        print("\nMissing in frontend:")
        for route in missing_in_frontend:
            print(f"  - {route}")

    if extra_in_frontend:
        print("\nExtra in frontend:")
        for route in extra_in_frontend:
            print(f"  - {route}")

    if missing_in_frontend:
        return 1

    print("\nRoute parity check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
