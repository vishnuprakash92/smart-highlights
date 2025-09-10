#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/dist"
mkdir -p "$OUT_DIR"

if [ ! -f "$ROOT/manifest.json" ]; then
  echo "manifest.json not found"
  exit 1
fi

echo "Validating manifest.json..."
jq . "$ROOT/manifest.json" > /dev/null

ZIP_PATH="$OUT_DIR/smart-highlights-$(date +%Y%m%d%H%M%S).zip"
echo "Packaging extension to $ZIP_PATH"
cd "$ROOT"
zip -r "$ZIP_PATH" src manifest.json icons || true
echo "Done"
