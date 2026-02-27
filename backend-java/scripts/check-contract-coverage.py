#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path


def normalize_path(path: str) -> str:
    return path.split("?", 1)[0].rstrip("/")


def to_regex(spring_path: str) -> re.Pattern[str]:
    escaped = re.escape(spring_path.rstrip("/"))
    escaped = re.sub(r"\\\{[^}]+\\\}", r"[^/]+", escaped)
    return re.compile(rf"^{escaped}$")


def main() -> None:
    script_dir = Path(__file__).resolve().parent
    contracts_dir = script_dir.parent / "contracts"
    spring_file = contracts_dir / "spring-endpoints.txt"
    frontend_file = contracts_dir / "frontend-api-paths.txt"
    out_file = contracts_dir / "coverage-report.md"

    spring_lines = [line.strip() for line in spring_file.read_text(encoding="utf-8").splitlines() if line.strip()]
    frontend_lines = [line.strip() for line in frontend_file.read_text(encoding="utf-8").splitlines() if line.strip()]

    spring_paths = sorted({line.split(" ", 1)[1].rstrip("/") for line in spring_lines})
    spring_patterns = [to_regex(p) for p in spring_paths]

    matched: list[str] = []
    unmatched: list[str] = []
    for path in frontend_lines:
        normalized = normalize_path(path)
        if any(p.match(normalized) for p in spring_patterns):
            matched.append(path)
        else:
            unmatched.append(path)

    report = [
        "# API Contract Coverage Report",
        "",
        f"- Spring endpoints indexed: {len(spring_paths)}",
        f"- Frontend-discovered API paths: {len(frontend_lines)}",
        f"- Matched: {len(matched)}",
        f"- Unmatched: {len(unmatched)}",
        "",
        "## Matched Frontend Paths",
    ]
    report.extend([f"- {p}" for p in matched] or ["- (none)"])
    report.append("")
    report.append("## Unmatched Frontend Paths")
    report.extend([f"- {p}" for p in unmatched] or ["- (none)"])
    report.append("")

    out_file.write_text("\n".join(report), encoding="utf-8")
    print(f"Wrote coverage report to {out_file}")


if __name__ == "__main__":
    main()
