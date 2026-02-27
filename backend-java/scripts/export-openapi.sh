#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
OUT_DIR="${2:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../contracts" && pwd)}"

mkdir -p "${OUT_DIR}"

curl -fsSL "${BASE_URL}/v3/api-docs/platform" > "${OUT_DIR}/openapi-platform.json"
curl -fsSL "${BASE_URL}/v3/api-docs/identity-course" > "${OUT_DIR}/openapi-identity-course.json"
curl -fsSL "${BASE_URL}/v3/api-docs/learning" > "${OUT_DIR}/openapi-learning.json"

echo "Exported OpenAPI contracts to ${OUT_DIR}"
