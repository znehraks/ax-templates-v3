#!/bin/bash
# auto-checkpoint.sh - Auto-checkpoint hook (TypeScript wrapper)
# claude-symphony workflow pipeline
#
# This is a thin shell wrapper that delegates to the TypeScript implementation.
# Actual logic is in dist/hooks/auto-checkpoint.js

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
if [ -f "$PACKAGE_ROOT/dist/hooks/auto-checkpoint.js" ]; then
  exec node "$PACKAGE_ROOT/dist/hooks/auto-checkpoint.js" "$@"
else
  # Fallback: Checkpoint creation via basic file operations
  CHECKPOINT_DIR="$PROJECT_ROOT/state/checkpoints"
  mkdir -p "$CHECKPOINT_DIR"

  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  echo "Auto-checkpoint available at: $CHECKPOINT_DIR"
  echo "Use /checkpoint command to create manual checkpoints"
  exit 0
fi
