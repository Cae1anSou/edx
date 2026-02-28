#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path


def extract_paths(raw: str | None) -> list[str]:
    if not raw:
        return [""]
    values = re.findall(r'"([^"]*)"', raw)
    return values or [""]


def extract_mapping(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    class_decl = re.search(r"\bclass\s+\w+", text)
    class_header = text[: class_decl.start()] if class_decl else text
    class_mappings = re.findall(r"@RequestMapping\(([^)]*)\)", class_header, re.MULTILINE | re.DOTALL)
    class_paths = extract_paths(class_mappings[-1] if class_mappings else None)
    class_base = class_paths[0] if class_paths else ""

    endpoints: list[str] = []
    method_pat = re.compile(
        r'@(GetMapping|PostMapping|PutMapping|DeleteMapping|PatchMapping)(?:\(([^)]*)\))?\s*'
        r'(?:@\w+(?:\([^)]*\))?\s*)*'
        r'(?:public|private|protected)\s+',
        re.MULTILINE | re.DOTALL,
    )
    for match in method_pat.finditer(text):
        http = match.group(1).replace("Mapping", "").upper()
        for method_path in extract_paths(match.group(2)):
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
