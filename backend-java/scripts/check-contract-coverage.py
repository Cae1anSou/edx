#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path


def normalize_path(path: str) -> str:
    p = path.strip()
    # Drop template vars used to append optional query suffixes.
    p = re.sub(r"/?\$\{[^}]*?(suffix|query|problemQuery)[^}]*\}?", "", p)
    # Handle malformed/dangling template expressions without closing "}".
    p = re.sub(r"/?\$\{(suffix|query|problemQuery)[^/]*$", "", p)
    p = p.split("?", 1)[0]
    # Normalize JS template vars so route parameters can still match.
    p = re.sub(r"\$\{[^}]+\}", "placeholder", p)
    p = p.replace("`", "").rstrip(",")
    # Trim trailing non-path noise from string templates/chaining.
    p = re.sub(r"[^A-Za-z0-9_/\.\-{},:]+$", "", p)
    # Handle malformed extracted values where comma-separated IDs were split by "/".
    p = re.sub(r",[^/]+/[^/]+$", ",placeholder", p)
    # Handle partially extracted "{id}," style paths from string concatenation.
    if p.endswith(","):
        if "/team_membership/" in p or "/topics/" in p:
            p = p + "placeholder"
        else:
            p = p[:-1]
    return p.rstrip("/")


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
    unresolved_templates: list[str] = []
    for path in frontend_lines:
        normalized = normalize_path(path)
        if "${" in normalized:
            unresolved_templates.append(path)
            unmatched.append(path)
            continue
        if any(p.match(normalized) for p in spring_patterns):
            matched.append(normalized)
        else:
            unmatched.append(path)

    report = [
        "# API Contract Coverage Report",
        "",
        f"- Spring endpoints indexed: {len(spring_paths)}",
        f"- Frontend-discovered API paths: {len(frontend_lines)}",
        f"- Matched: {len(set(matched))}",
        f"- Unmatched: {len(unmatched)}",
        f"- Unresolved template expressions: {len(unresolved_templates)}",
        "",
        "## Matched Frontend Paths",
    ]
    report.extend([f"- {p}" for p in sorted(set(matched))] or ["- (none)"])
    report.append("")
    report.append("## Unresolved Template Paths")
    report.extend([f"- {p}" for p in sorted(set(unresolved_templates))] or ["- (none)"])
    report.append("")
    report.append("## Unmatched Frontend Paths")
    report.extend([f"- {p}" for p in unmatched] or ["- (none)"])
    report.append("")

    out_file.write_text("\n".join(report), encoding="utf-8")
    print(f"Wrote coverage report to {out_file}")


if __name__ == "__main__":
    main()
