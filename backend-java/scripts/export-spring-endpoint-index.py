#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path


def extract_mapping(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    class_match = re.search(r'@RequestMapping\("([^"]+)"\)\s*public class', text, re.MULTILINE)
    class_base = class_match.group(1) if class_match else ""

    endpoints: list[str] = []
    method_pat = re.compile(
        r'@(GetMapping|PostMapping|PutMapping|DeleteMapping)(?:\("([^"]*)"\))?\s*'
        r'(?:@\w+(?:\([^)]*\))?\s*)*'
        r'(?:public|private|protected)\s+',
        re.MULTILINE,
    )
    for match in method_pat.finditer(text):
        http = match.group(1).replace("Mapping", "").upper()
        method_path = match.group(2) or ""
        if method_path.startswith("/"):
            full = f"{class_base}{method_path}"
        elif method_path:
            full = f"{class_base}/{method_path}"
        else:
            full = class_base or "/"
        full = re.sub(r"//+", "/", full)
        endpoints.append(f"{http} {full}")
    return endpoints


def main() -> None:
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent
    java_root = project_root / "src" / "main" / "java" / "org" / "openedx" / "backend"
    out_file = project_root / "contracts" / "spring-endpoints.txt"
    out_file.parent.mkdir(parents=True, exist_ok=True)

    all_endpoints: list[str] = []
    for file in sorted(java_root.rglob("*Controller.java")):
        all_endpoints.extend(extract_mapping(file))

    out_file.write_text("\n".join(sorted(set(all_endpoints))) + "\n", encoding="utf-8")
    print(f"Spring endpoint index exported to {out_file}")


if __name__ == "__main__":
    main()
