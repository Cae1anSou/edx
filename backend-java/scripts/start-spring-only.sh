#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="${SCRIPT_DIR}/../deploy"
REPO_ROOT="${SCRIPT_DIR}/../.."

echo "[start] building studio dashboard frontend"
(cd "${REPO_ROOT}" && npm run studio-dashboard-build >/dev/null)

docker compose -f "${DEPLOY_DIR}/docker-compose.spring-only.yml" up -d --build
docker compose -f "${DEPLOY_DIR}/docker-compose.spring-only.yml" ps
