#!/bin/bash
# goto-stage.sh - Jump to previous stage (loop-back)
# claude-symphony workflow pipeline

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROGRESS_FILE="$PROJECT_ROOT/state/progress.json"
STAGES_DIR="$PROJECT_ROOT/stages"
CONFIG_FILE="$PROJECT_ROOT/config/pipeline.yaml"

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Stage info
declare -a STAGE_IDS=("01-brainstorm" "02-research" "03-planning" "04-ui-ux" "05-task-management" "06-implementation" "07-refactoring" "08-qa" "09-testing" "10-deployment")

# Option handling
TARGET_STAGE=""
LIST_MODE=false
HISTORY_MODE=false
REASON=""

print_usage() {
    echo "Usage: goto-stage.sh <stage-id> [--reason \"reason\"]"
    echo "       goto-stage.sh --list"
    echo "       goto-stage.sh --history"
    echo ""
    echo "Options:"
    echo "  <stage-id>          Target stage to jump to (e.g., 06-implementation)"
    echo "  --reason \"text\"     Reason for loop-back (required)"
    echo "  --list              Show available stages for loop-back"
    echo "  --history           Show loop-back history"
    echo ""
    echo "Examples:"
    echo "  ./goto-stage.sh 06-implementation --reason \"BUG-002 fix required\""
    echo "  ./goto-stage.sh --list"
}

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --list) LIST_MODE=true ;;
        --history) HISTORY_MODE=true ;;
        --reason) REASON="$2"; shift ;;
        --help|-h) print_usage; exit 0 ;;
        *)
            if [[ -z "$TARGET_STAGE" ]]; then
                TARGET_STAGE="$1"
            fi
            ;;
    esac
    shift
done

# Check jq
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error:${NC} jq is required."
    exit 1
fi

# Check progress.json
if [ ! -f "$PROGRESS_FILE" ]; then
    echo -e "${RED}Error:${NC} Cannot find progress.json."
    exit 1
fi

# Get current stage
CURRENT_STAGE=$(jq -r '.current_stage // "none"' "$PROGRESS_FILE")

if [ "$CURRENT_STAGE" == "none" ] || [ -z "$CURRENT_STAGE" ]; then
    echo -e "${RED}Error:${NC} No stage in progress."
    exit 1
fi

# Find current stage index
get_stage_index() {
    local STAGE_ID=$1
    for i in "${!STAGE_IDS[@]}"; do
        if [ "${STAGE_IDS[$i]}" == "$STAGE_ID" ]; then
            echo "$i"
            return
        fi
    done
    echo "-1"
}

CURRENT_IDX=$(get_stage_index "$CURRENT_STAGE")

# Handle --list
if [ "$LIST_MODE" = true ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "📋 ${WHITE}Available Loop-back Targets${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "Current stage: ${CYAN}$CURRENT_STAGE${NC}"
    echo ""
    echo "Available targets (max 3 stages back):"

    # Check max_stages_back from config (default 3)
    MAX_BACK=3
    if command -v yq &> /dev/null && [ -f "$CONFIG_FILE" ]; then
        MAX_BACK=$(yq '.sprint_mode.loop_back.max_stages_back // 3' "$CONFIG_FILE" 2>/dev/null)
    fi

    for ((i = CURRENT_IDX - 1; i >= 0 && i >= CURRENT_IDX - MAX_BACK; i--)); do
        STAGE_STATUS=$(jq -r ".stages[\"${STAGE_IDS[$i]}\"].status // \"pending\"" "$PROGRESS_FILE")
        if [ "$STAGE_STATUS" == "completed" ]; then
            echo -e "  ${GREEN}✓${NC} ${STAGE_IDS[$i]}"
        fi
    done

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
fi

# Handle --history
if [ "$HISTORY_MODE" = true ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "📜 ${WHITE}Loop-back History${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    HISTORY_COUNT=$(jq '.loop_back_history | length' "$PROGRESS_FILE" 2>/dev/null || echo "0")

    if [ "$HISTORY_COUNT" == "0" ]; then
        echo "No loop-back history found."
    else
        jq -r '.loop_back_history[] | "[\(.timestamp)] \(.from_stage) → \(.to_stage): \(.reason)"' "$PROGRESS_FILE" 2>/dev/null
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
fi

# Validate target stage
if [ -z "$TARGET_STAGE" ]; then
    echo -e "${RED}Error:${NC} Target stage is required."
    print_usage
    exit 1
fi

# Find target stage index
TARGET_IDX=$(get_stage_index "$TARGET_STAGE")

if [ "$TARGET_IDX" == "-1" ]; then
    echo -e "${RED}Error:${NC} Unknown stage: $TARGET_STAGE"
    exit 1
fi

# Validate loop-back (must go backwards)
if [ "$TARGET_IDX" -ge "$CURRENT_IDX" ]; then
    echo -e "${RED}Error:${NC} Can only loop back to previous stages."
    echo "  Current: $CURRENT_STAGE (index $CURRENT_IDX)"
    echo "  Target:  $TARGET_STAGE (index $TARGET_IDX)"
    exit 1
fi

# Check max stages back
MAX_BACK=3
if command -v yq &> /dev/null && [ -f "$CONFIG_FILE" ]; then
    MAX_BACK=$(yq '.sprint_mode.loop_back.max_stages_back // 3' "$CONFIG_FILE" 2>/dev/null)
fi

STAGES_BACK=$((CURRENT_IDX - TARGET_IDX))
if [ "$STAGES_BACK" -gt "$MAX_BACK" ]; then
    echo -e "${RED}Error:${NC} Cannot loop back more than $MAX_BACK stages."
    echo "  Attempted: $STAGES_BACK stages back"
    exit 1
fi

# Require reason
if [ -z "$REASON" ]; then
    echo -e "${RED}Error:${NC} Reason is required for loop-back."
    echo "  Use: --reason \"your reason\""
    exit 1
fi

# Execute loop-back
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "🔙 ${WHITE}Stage Loop-back${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "$CURRENT_STAGE → $TARGET_STAGE"
echo ""

# 1. Create checkpoint
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CHECKPOINT_ID="checkpoint_loopback_${TIMESTAMP}"
CHECKPOINT_DIR="$PROJECT_ROOT/state/checkpoints/$CHECKPOINT_ID"

mkdir -p "$CHECKPOINT_DIR"
echo -e "${GREEN}✓${NC} Checkpoint: $CHECKPOINT_ID"

# 2. Record loop-back in progress.json
LOOP_BACK_ENTRY=$(cat << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "from_stage": "$CURRENT_STAGE",
  "to_stage": "$TARGET_STAGE",
  "reason": "$REASON",
  "checkpoint_id": "$CHECKPOINT_ID"
}
EOF
)

jq ".loop_back_history += [$LOOP_BACK_ENTRY]" "$PROGRESS_FILE" > "${PROGRESS_FILE}.tmp" \
    && mv "${PROGRESS_FILE}.tmp" "$PROGRESS_FILE"
echo -e "${GREEN}✓${NC} Reason: $REASON"

# 3. Generate loop-back HANDOFF
HANDOFF_FILE="$STAGES_DIR/$CURRENT_STAGE/LOOPBACK_HANDOFF.md"
cat > "$HANDOFF_FILE" << EOF
# Loop-back Handoff: $CURRENT_STAGE → $TARGET_STAGE

Created: $(date "+%Y-%m-%d %H:%M")

## Reason

$REASON

## Context

This is an intentional loop-back to address issues discovered during $CURRENT_STAGE.

## Checkpoint

- ID: $CHECKPOINT_ID
- Location: state/checkpoints/$CHECKPOINT_ID

## Instructions

1. Review the reason for loop-back
2. Address the issues in $TARGET_STAGE
3. Return to $CURRENT_STAGE after resolution
4. Reference this file for context

## Previous Stage Status

- Stage: $CURRENT_STAGE
- Status at loop-back: in_progress
EOF

# Copy to handoffs archive
cp "$HANDOFF_FILE" "$PROJECT_ROOT/state/handoffs/loopback_${TIMESTAMP}_handoff.md"

# 4. Update progress.json - change stages
jq ".current_stage = \"$TARGET_STAGE\" | \
    .stages[\"$TARGET_STAGE\"].status = \"in_progress\" | \
    .stages[\"$TARGET_STAGE\"].started_at = \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"" \
    "$PROGRESS_FILE" > "${PROGRESS_FILE}.tmp" && mv "${PROGRESS_FILE}.tmp" "$PROGRESS_FILE"

echo ""
echo -e "${GREEN}✅${NC} Moved to ${WHITE}$TARGET_STAGE${NC}!"
echo ""
echo "Next steps:"
echo "  1. Reference stages/$TARGET_STAGE/CLAUDE.md"
echo "  2. Address: $REASON"
echo "  3. Use /next to proceed after resolution"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
