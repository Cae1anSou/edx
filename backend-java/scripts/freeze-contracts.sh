#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

"${SCRIPT_DIR}/export-spring-endpoint-index.py"
"${SCRIPT_DIR}/discover-frontend-api-paths.sh" "${REPO_ROOT}" "${SCRIPT_DIR}/../contracts/frontend-api-paths.txt"
"${SCRIPT_DIR}/check-contract-coverage.py"

echo "Contract freeze artifacts updated under backend-java/contracts/"
