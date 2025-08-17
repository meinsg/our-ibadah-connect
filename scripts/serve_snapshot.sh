#!/usr/bin/env bash
set -euo pipefail
DIR=${1:-"production-snapshot"}
PORT=${2:-5179}
which npx >/dev/null 2>&1 || { echo "Please install Node.js"; exit 1; }
# Use a simple static server to preview
npx http-server "$DIR" -p $PORT -c-1