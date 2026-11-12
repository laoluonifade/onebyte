#!/usr/bin/env bash
# Render apps/landing/og/og.html to apps/landing/public/og.png (1200×630) with headless Chrome.
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=3000 \
  --screenshot="$PWD/apps/landing/public/og.png" "file://$PWD/apps/landing/og/og.html" >/dev/null 2>&1
echo "Wrote apps/landing/public/og.png"
