#!/usr/bin/env bash
set -euo pipefail
DIR=${1:-"production-snapshot"}
# Try to pull .map files referenced by JS assets
MAP_URLS=$(grep -RhoE "sourceMappingURL=([^\"')]+)" "$DIR" | cut -d= -f2 | sort -u || true)
if [ -z "$MAP_URLS" ]; then
  echo "No sourceMappingURL found."; exit 0; fi
for m in $MAP_URLS; do
  if [[ "$m" =~ ^https?:// ]]; then
    echo "Downloading $m";
    (cd "$DIR" && curl -fsSLO "$m" || true)
  fi
done