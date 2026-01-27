#!/bin/bash
# session-start.sh - Session start hook (TypeScript wrapper)
# claude-symphony workflow pipeline
#
# This is a thin shell wrapper that delegates to the TypeScript implementation.
# Actual logic is in dist/hooks/session-start.js

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Find the claude-symphony package root (where dist/ exists)
if [ -d "$PROJECT_ROOT/dist" ]; then
  PACKAGE_ROOT="$PROJECT_ROOT"
elif [ -d "$PROJECT_ROOT/node_modules/claude-symphony/dist" ]; then
  PACKAGE_ROOT="$PROJECT_ROOT/node_modules/claude-symphony"
else
  PACKAGE_ROOT=$(npm root -g 2>/dev/null)/claude-symphony
fi

# Check if the compiled TypeScript exists
if [ -f "$PACKAGE_ROOT/dist/hooks/session-start.js" ]; then
  exec node "$PACKAGE_ROOT/dist/hooks/session-start.js" "$@"
else
  # Fallback: Basic session start check
  # Check for recovery files
  PROGRESS_FILE="$PROJECT_ROOT/state/progress.json"
  if [ -f "$PROGRESS_FILE" ]; then
    echo "Session started - found existing progress state"
  else
    echo "Session started - new project detected"
  fi
  exit 0
fi
