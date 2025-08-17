#!/usr/bin/env bash
set -euo pipefail
PROD_URL=${1:-"https://ouribadah.com"}
OUT_DIR=${2:-"production-snapshot"}
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"
# Mirror static site (html, assets); convert links for local use
wget \
  --mirror \
  --page-requisites \
  --adjust-extension \
  --convert-links \
  --no-parent \
  --directory-prefix="$OUT_DIR" \
  "$PROD_URL"

# Optional: normalize folder to serve from root
# Many hosts place files under ouribadah.com/; move inner dir up if needed
INNER=$(find "$OUT_DIR" -maxdepth 2 -type d -name "ouribadah.com" | head -n1)
if [ -n "$INNER" ]; then
  shopt -s dotglob
  mv "$INNER"/* "$OUT_DIR"/
  rmdir "$INNER"
fi

echo "Snapshot saved in $OUT_DIR"