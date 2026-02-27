#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
OUT_FILE="${2:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../contracts" && pwd)/frontend-api-paths.txt}"

mkdir -p "$(dirname "${OUT_FILE}")"

cd "${REPO_ROOT}"

SEARCH_DIRS=()
for dir in lms cms common openedx frontend-app-studio-dashboard; do
  if [[ -d "${dir}" ]]; then
    SEARCH_DIRS+=("${dir}")
  fi
done

if [[ ${#SEARCH_DIRS[@]} -eq 0 ]]; then
  : > "${OUT_FILE}"
  echo "Frontend API paths exported to ${OUT_FILE}"
  exit 0
fi

rg -o --no-filename \
  "/[^\"' ]*api/[^\"' ]*v[0-9]+[^\"' ]*" \
  "${SEARCH_DIRS[@]}" \
  --glob "*.{js,jsx,ts,tsx,html,mako}" \
  --glob "!**/vendor/**" \
  --glob "!**/node_modules/**" \
  --glob "!**/tests/**" \
  | sed '/^\/\//d' \
  | sed -E 's/[^A-Za-z0-9_\/\.\-\?\&=\{\}\$:%,+]*$//' \
  | sed -E 's/[`]+$//' \
  | sed -E 's/\)\.done$//' \
  | sort -u > "${OUT_FILE}" || true

echo "Frontend API paths exported to ${OUT_FILE}"
