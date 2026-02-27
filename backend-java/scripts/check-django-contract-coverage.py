#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path


def normalize(path: str) -> str:
    p = path.strip().split("?", 1)[0]
    p = re.sub(r"\{[^}]+\}", "placeholder", p)
    return p.rstrip("/")


def main() -> None:
    script_dir = Path(__file__).resolve().parent
    contracts_dir = script_dir.parent / "contracts"
    spring_file = contracts_dir / "spring-endpoints.txt"
    django_file = contracts_dir / "django-api-paths.txt"
    out_file = contracts_dir / "django-coverage-report.md"

    spring_lines = [line.strip() for line in spring_file.read_text(encoding="utf-8").splitlines() if line.strip()]
    django_lines = [line.strip() for line in django_file.read_text(encoding="utf-8").splitlines() if line.strip()]

    spring_paths = sorted({normalize(line.split(" ", 1)[1]) for line in spring_lines})

    matched: list[str] = []
    unmatched: list[str] = []
    for path in django_lines:
        normalized = normalize(path)
        if any(s == normalized or s.startswith(normalized + "/") for s in spring_paths):
            matched.append(path)
        else:
            unmatched.append(path)

    lines = [
        "# Django API Coverage Report",
        "",
        f"- Spring endpoints indexed: {len(spring_paths)}",
        f"- Django-discovered API paths: {len(django_lines)}",
        f"- Matched: {len(matched)}",
        f"- Unmatched: {len(unmatched)}",
        "",
        "## Unmatched Django Paths (Top 200)",
    ]
    lines.extend([f"- {p}" for p in unmatched[:200]] or ["- (none)"])
    lines.append("")

    out_file.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote Django coverage report to {out_file}")


if __name__ == "__main__":
    main()
