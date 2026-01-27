#!/bin/bash
# pre-transition.sh - Pre-transition validation hook (TypeScript wrapper)
# claude-symphony workflow pipeline
#
# This is a thin shell wrapper that delegates to the TypeScript implementation.
# Actual logic is in dist/hooks/pre-transition.js
#
# Usage:
#   pre-transition.sh [current-stage] [next-stage]
#
# If no arguments provided, determines current stage from progress.json

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Find the claude-symphony package root (where dist/ exists)
# First check if dist exists locally (development mode)
if [ -d "$PROJECT_ROOT/dist" ]; then
  PACKAGE_ROOT="$PROJECT_ROOT"
elif [ -d "$PROJECT_ROOT/node_modules/claude-symphony/dist" ]; then
  PACKAGE_ROOT="$PROJECT_ROOT/node_modules/claude-symphony"
else
  # Fallback to global installation
  PACKAGE_ROOT=$(npm root -g 2>/dev/null)/claude-symphony
fi

# Check if the compiled TypeScript exists
if [ -f "$PACKAGE_ROOT/dist/hooks/pre-transition.js" ]; then
  exec node "$PACKAGE_ROOT/dist/hooks/pre-transition.js" "$@"
else
  # Fallback: Basic pre-transition validation
  CURRENT_STAGE="$1"
  NEXT_STAGE="$2"

  echo ""
  echo "Pre-Transition Validation (Fallback Mode)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [ -z "$CURRENT_STAGE" ]; then
    # Try to get current stage from progress.json
    if [ -f "$PROJECT_ROOT/state/progress.json" ]; then
      CURRENT_STAGE=$(grep -o '"current_stage"[[:space:]]*:[[:space:]]*"[^"]*"' "$PROJECT_ROOT/state/progress.json" | sed 's/.*"\([^"]*\)"$/\1/')
    fi
  fi

  if [ -z "$CURRENT_STAGE" ]; then
    echo "ERROR: Cannot determine current stage"
    echo "Provide stage ID as argument or ensure state/progress.json exists"
    exit 1
  fi

  echo "Current Stage: $CURRENT_STAGE"

  # Basic checks
  STAGE_DIR="$PROJECT_ROOT/stages/$CURRENT_STAGE"
  CHECKS_PASSED=true

  # Check HANDOFF.md
  if [ -f "$STAGE_DIR/HANDOFF.md" ]; then
    echo "✅ HANDOFF.md exists"
  else
    echo "❌ HANDOFF.md NOT FOUND - Run /handoff first"
    CHECKS_PASSED=false
  fi

  # Check outputs directory
  if [ -d "$STAGE_DIR/outputs" ]; then
    OUTPUT_COUNT=$(ls -1 "$STAGE_DIR/outputs" 2>/dev/null | wc -l)
    if [ "$OUTPUT_COUNT" -gt 0 ]; then
      echo "✅ Outputs directory has $OUTPUT_COUNT file(s)"
    else
      echo "⚠️  Outputs directory is empty"
    fi
  else
    echo "⚠️  Outputs directory not found"
  fi

  # Check for parallel execution output files
  case "$CURRENT_STAGE" in
    01-brainstorm|03-planning|04-ui-ux)
      if [ -f "$STAGE_DIR/outputs/output_gemini.md" ]; then
        echo "✅ output_gemini.md exists"
      else
        echo "❌ output_gemini.md NOT FOUND - Run /gemini first"
        CHECKS_PASSED=false
      fi
      ;;
    07-refactoring|09-testing)
      if [ -f "$STAGE_DIR/outputs/output_codex.md" ]; then
        echo "✅ output_codex.md exists"
      else
        echo "❌ output_codex.md NOT FOUND - Run /codex first"
        CHECKS_PASSED=false
      fi
      ;;
  esac

  # Check git status for implementation stages
  case "$CURRENT_STAGE" in
    06-implementation|07-refactoring|08-qa|09-testing|10-deployment)
      if command -v git &> /dev/null && [ -d "$PROJECT_ROOT/.git" ]; then
        if [ -z "$(git -C "$PROJECT_ROOT" status --porcelain)" ]; then
          echo "✅ Working directory clean"
        else
          echo "❌ Uncommitted changes detected - Commit first"
          CHECKS_PASSED=false
        fi
      fi
      ;;
  esac

  # Check checkpoint for implementation/refactoring
  case "$CURRENT_STAGE" in
    06-implementation|07-refactoring)
      if [ -d "$PROJECT_ROOT/state/checkpoints" ] && [ "$(ls -A "$PROJECT_ROOT/state/checkpoints" 2>/dev/null)" ]; then
        echo "✅ Checkpoint exists"
      else
        echo "❌ No checkpoint found - Run /checkpoint first"
        CHECKS_PASSED=false
      fi
      ;;
  esac

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [ "$CHECKS_PASSED" = true ]; then
    echo ""
    echo "✅ Pre-transition checks passed"
    echo ""
    exit 0
  else
    echo ""
    echo "❌ Pre-transition BLOCKED - Fix issues above"
    echo ""
    echo "For advanced validation, install claude-symphony package:"
    echo "  npm install -g claude-symphony"
    echo ""
    exit 1
  fi
fi
