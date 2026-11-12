#!/usr/bin/env bash
# Build the landing page and upload it to the server.
# Usage: npm run deploy            (from the repo root)
# Override the target with DEPLOY_HOST (an SSH host or alias) and DEPLOY_DIR.
set -euo pipefail

HOST="${DEPLOY_HOST:-hetzner}"
REMOTE_DIR="${DEPLOY_DIR:-/var/www/onebyte}"

# --delete below removes remote files that are no longer in the build, so refuse odd targets.
case "$REMOTE_DIR" in
  /var/www/?*) ;;
  *) echo "Refusing to deploy to '$REMOTE_DIR' (expected a folder under /var/www/)." >&2; exit 1 ;;
esac

cd "$(dirname "$0")/.."
npm run build

ssh "$HOST" "mkdir -p '$REMOTE_DIR'"
rsync -az --delete apps/landing/dist/ "$HOST:$REMOTE_DIR/"
ssh "$HOST" "chown -R deploy:deploy '$REMOTE_DIR'"

echo "Deployed apps/landing/dist to $HOST:$REMOTE_DIR"
