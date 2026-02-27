#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
OUT_FILE="${2:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../contracts" && pwd)/frontend-api-paths.txt}"

mkdir -p "$(dirname "${OUT_FILE}")"

cd "${REPO_ROOT}"

rg -o --no-filename \
  "[\"'\`]/[^\"'\`]*(api/v[0-9]+|api/legacy)[^\"'\`]*[\"'\`]" \
  lms cms common openedx \
  --glob "*.{js,jsx,ts,tsx,py}" \
  --glob "!**/vendor/**" \
  --glob "!**/node_modules/**" \
  --glob "!**/tests/**" \
  | sed "s/^[\"'\`]//; s/[\"'\`]$//" \
  | sort -u > "${OUT_FILE}" || true

echo "Frontend API paths exported to ${OUT_FILE}"
