#!/bin/bash
# show-dashboard.sh - Enhanced Progress Status Dashboard
# claude-symphony workflow pipeline
#
# Provides a rich visual dashboard for pipeline status monitoring.

set -e

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# =============================================================================
# Configuration
# =============================================================================
VERSION="1.0.0"
REFRESH_INTERVAL=5

# Options
WATCH_MODE=false
COMPACT_MODE=false
AI_METRICS=false
SPRINT_VIEW=false
HISTORY_VIEW=false

# =============================================================================
# Usage
# =============================================================================
usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Display an enhanced dashboard for claude-symphony pipeline status.

Options:
  --watch, -w     Auto-refresh every ${REFRESH_INTERVAL} seconds
  --compact, -c   Show minimal single-line output
  --ai            Show detailed AI usage metrics
  --sprint        Show sprint-focused view (Stage 06)
  --history       Show stage completion history
  --help, -h      Show this help message

Examples:
  $(basename "$0")              # Show full dashboard
  $(basename "$0") --watch      # Auto-refresh mode
  $(basename "$0") --compact    # Single-line output
  $(basename "$0") --ai         # Include AI metrics
EOF
    exit 0
}

# =============================================================================
# Data Extraction
# =============================================================================
extract_data() {
    if [ ! -f "$PROGRESS_FILE" ]; then
        echo -e "${RED}Error:${NC} Cannot find progress.json."
        echo "  Please run /init-project first."
        exit 1
    fi

    PROJECT_NAME=$(jq -r '.project_name // "unnamed"' "$PROGRESS_FILE")
    CURRENT_STAGE=$(jq -r '.current_stage // "none"' "$PROGRESS_FILE")
    CHECKPOINT_COUNT=$(jq -r '.checkpoints | length // 0' "$PROGRESS_FILE")
    STARTED_AT=$(jq -r '.started_at // ""' "$PROGRESS_FILE")

    # Stage info arrays
    STAGE_IDS=("01-brainstorm" "02-research" "03-planning" "04-ui-ux" "05-task-management" "06-implementation" "07-refactoring" "08-qa" "09-testing" "10-deployment")

    # Calculate completed stages
    COMPLETED=0
    CURRENT_NUM=0
    for i in "${!STAGE_IDS[@]}"; do
        STATUS=$(jq -r ".stages.\"${STAGE_IDS[$i]}\".status // \"pending\"" "$PROGRESS_FILE")
        if [ "$STATUS" == "completed" ]; then
            ((COMPLETED++)) || true
        fi
        if [ "${STAGE_IDS[$i]}" == "$CURRENT_STAGE" ]; then
            CURRENT_NUM=$((i + 1))
        fi
    done

    TOTAL=10
    PERCENT=$((COMPLETED * 100 / TOTAL))
}

# =============================================================================
# Drawing Functions
# =============================================================================
draw_box_top() {
    local width=$1
    printf "${CYAN}╔"
    printf '═%.0s' $(seq 1 $width)
    printf "╗${NC}\n"
}

draw_box_bottom() {
    local width=$1
    printf "${CYAN}╚"
    printf '═%.0s' $(seq 1 $width)
    printf "╝${NC}\n"
}

draw_box_divider() {
    local width=$1
    printf "${CYAN}╠"
    printf '═%.0s' $(seq 1 $width)
    printf "╣${NC}\n"
}

draw_box_line() {
    local content="$1"
    local width=$2
    local content_len=${#content}
    # Strip ANSI codes for length calculation
    local stripped=$(echo -e "$content" | sed 's/\x1b\[[0-9;]*m//g')
    local stripped_len=${#stripped}
    local padding=$((width - stripped_len - 2))

    printf "${CYAN}║${NC} %b" "$content"
    printf "%${padding}s" ""
    printf " ${CYAN}║${NC}\n"
}

draw_pipeline_visual() {
    local width=$1
    local line=""

    for i in "${!STAGE_IDS[@]}"; do
        STATUS=$(jq -r ".stages.\"${STAGE_IDS[$i]}\".status // \"pending\"" "$PROGRESS_FILE")

        if [ "$STATUS" == "completed" ]; then
            line+="${GREEN}●${NC}"
        elif [ "${STAGE_IDS[$i]}" == "$CURRENT_STAGE" ]; then
            line+="${YELLOW}◐${NC}"
        else
            line+="${GRAY}○${NC}"
        fi

        if [ $i -lt 9 ]; then
            if [ "$STATUS" == "completed" ]; then
                line+="${GREEN}──${NC}"
            else
                line+="${GRAY}──${NC}"
            fi
        fi
    done

    echo "$line"
}

get_stage_symbol() {
    local status=$1
    case $status in
        completed) echo "${GREEN}✓${NC}" ;;
        in_progress) echo "${YELLOW}▶${NC}" ;;
        pending) echo "${GRAY}○${NC}" ;;
        failed) echo "${RED}✗${NC}" ;;
        *) echo "${GRAY}○${NC}" ;;
    esac
}

# =============================================================================
# Dashboard Views
# =============================================================================
show_compact() {
    local pipeline_icons=""
    for i in "${!STAGE_IDS[@]}"; do
        STATUS=$(jq -r ".stages.\"${STAGE_IDS[$i]}\".status // \"pending\"" "$PROGRESS_FILE")
        if [ "$STATUS" == "completed" ]; then
            pipeline_icons+="${GREEN}●${NC}"
        elif [ "${STAGE_IDS[$i]}" == "$CURRENT_STAGE" ]; then
            pipeline_icons+="${YELLOW}◐${NC}"
        else
            pipeline_icons+="${GRAY}○${NC}"
        fi
    done

    echo -e "[${CYAN}$PROJECT_NAME${NC}] $pipeline_icons ${GREEN}$PERCENT%${NC} | Stage: ${YELLOW}$CURRENT_STAGE${NC} | CP: ${CYAN}$CHECKPOINT_COUNT${NC}"
}

show_full_dashboard() {
    local width=64

    clear 2>/dev/null || true

    draw_box_top $width
    draw_box_line "${WHITE}CLAUDE-SYMPHONY DASHBOARD${NC}                    [${CYAN}$PROJECT_NAME${NC}]" $width
    draw_box_divider $width

    # Pipeline progress
    local pipeline_visual=$(draw_pipeline_visual $width)
    draw_box_line "PIPELINE: $pipeline_visual   Stage $CURRENT_NUM/$TOTAL" $width
    draw_box_divider $width

    # Two-column layout: Stages | Current Focus
    draw_box_line "${WHITE}STAGES${NC}                          │ ${WHITE}CURRENT FOCUS${NC}" $width

    # Stage grid (2 rows of 5)
    local row1=""
    local row2=""
    for i in 0 1 2 3 4; do
        STATUS=$(jq -r ".stages.\"${STAGE_IDS[$i]}\".status // \"pending\"" "$PROGRESS_FILE")
        SYM=$(get_stage_symbol "$STATUS")
        NUM=$(printf "%02d" $((i + 1)))
        row1+="$NUM $SYM  "
    done
    for i in 5 6 7 8 9; do
        STATUS=$(jq -r ".stages.\"${STAGE_IDS[$i]}\".status // \"pending\"" "$PROGRESS_FILE")
        SYM=$(get_stage_symbol "$STATUS")
        NUM=$(printf "%02d" $((i + 1)))
        row2+="$NUM $SYM  "
    done

    # Current stage info
    local stage_name=$(get_stage_name "$CURRENT_STAGE")
    local current_ai=$(get_stage_ai "$CURRENT_STAGE")

    draw_box_line "┌─────────────────────────────┐ │ Stage: ${YELLOW}$CURRENT_STAGE${NC}" $width
    draw_box_line "│ $row1│ │ AI: ${CYAN}$current_ai${NC}" $width
    draw_box_line "│ $row2│ │ Name: $stage_name" $width
    draw_box_line "└─────────────────────────────┘ │ Progress: ${GREEN}$PERCENT%${NC}" $width
    draw_box_divider $width

    # AI Metrics | Checkpoints
    draw_box_line "${WHITE}AI METRICS${NC}                      │ ${WHITE}CHECKPOINTS${NC}" $width

    # Get primary model for current stage
    local primary_model=$(get_stage_ai "$CURRENT_STAGE" | cut -d'+' -f1 | tr '[:upper:]' '[:lower:]')

    # Count fallbacks (stages with secondary models)
    local fallback_count=0
    for stage in "${STAGE_IDS[@]}"; do
        local collab=$(jq -r ".stages.\"$stage\".collaboration // \"\"" "$PROGRESS_FILE" 2>/dev/null)
        if [ "$collab" == "parallel" ]; then
            ((fallback_count++)) || true
        fi
    done

    # Find latest handoff
    local latest_handoff="None"
    for ((i=${#STAGE_IDS[@]}-1; i>=0; i--)); do
        local hf="$STAGES_DIR/${STAGE_IDS[$i]}/HANDOFF.md"
        if [ -f "$hf" ]; then
            latest_handoff="${STAGE_IDS[$i]}"
            break
        fi
    done

    draw_box_line "Primary: ${CYAN}$primary_model${NC}              │ Total: ${CYAN}$CHECKPOINT_COUNT${NC}" $width
    draw_box_line "Parallel Stages: ${CYAN}5${NC}            │ Latest: ${GREEN}$latest_handoff${NC}" $width
    draw_box_line "Fallbacks: ${CYAN}claudecode${NC}          │ Recovery: ${GREEN}Available${NC}" $width

    draw_box_bottom $width

    # Timestamp
    echo -e "${GRAY}Last updated: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
}

show_ai_metrics() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  🤖 AI Usage Metrics${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    printf "  %-20s %-15s %-15s %-15s\n" "Stage" "Primary" "Secondary" "Mode"
    printf "  %-20s %-15s %-15s %-15s\n" "────────────────────" "───────────────" "───────────────" "───────────────"

    for stage in "${STAGE_IDS[@]}"; do
        local stage_config="$STAGES_DIR/$stage/config.yaml"
        if [ -f "$stage_config" ] && command -v yq &> /dev/null; then
            local primary=$(yq '.models.primary // "-"' "$stage_config" 2>/dev/null)
            local secondary=$(yq '.models.secondary // "-"' "$stage_config" 2>/dev/null)
            local collab=$(yq '.models.collaboration // "sequential"' "$stage_config" 2>/dev/null)
            [ "$secondary" == "null" ] && secondary="-"

            local status=$(jq -r ".stages.\"$stage\".status // \"pending\"" "$PROGRESS_FILE")
            local color=$GRAY
            [ "$status" == "completed" ] && color=$GREEN
            [ "$status" == "in_progress" ] && color=$YELLOW

            printf "  ${color}%-20s${NC} %-15s %-15s %-15s\n" "$stage" "$primary" "$secondary" "$collab"
        fi
    done

    echo ""
}

show_sprint_view() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  🏃 Sprint View (Stage 06: Implementation)${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    local impl_status=$(jq -r '.stages."06-implementation".status // "pending"' "$PROGRESS_FILE")
    local current_sprint=$(jq -r '.stages."06-implementation".current_sprint // 1' "$PROGRESS_FILE")
    local total_sprints=$(jq -r '.stages."06-implementation".total_sprints // 3' "$PROGRESS_FILE")

    echo -e "  Status: $(get_stage_symbol "$impl_status") ${impl_status^}"
    echo -e "  Sprint: ${YELLOW}$current_sprint${NC} / $total_sprints"
    echo ""

    # Sprint progress bar
    local sprint_percent=$((current_sprint * 100 / total_sprints))
    local bar_width=30
    local filled=$((sprint_percent * bar_width / 100))
    local empty=$((bar_width - filled))

    printf "  ["
    printf "${GREEN}%0.s█${NC}" $(seq 1 $filled) 2>/dev/null || true
    printf "${GRAY}%0.s░${NC}" $(seq 1 $empty) 2>/dev/null || true
    printf "] ${GREEN}%d%%${NC}\n" "$sprint_percent"

    echo ""
    echo -e "  ${GRAY}Use /sprint to manage sprints in Stage 06${NC}"
    echo ""
}

show_history() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  📜 Stage Completion History${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    printf "  %-20s %-12s %-25s\n" "Stage" "Status" "Completed At"
    printf "  %-20s %-12s %-25s\n" "────────────────────" "────────────" "─────────────────────────"

    for stage in "${STAGE_IDS[@]}"; do
        local status=$(jq -r ".stages.\"$stage\".status // \"pending\"" "$PROGRESS_FILE")
        local completed_at=$(jq -r ".stages.\"$stage\".completed_at // \"-\"" "$PROGRESS_FILE")

        local sym=$(get_stage_symbol "$status")
        printf "  %-20s %b %-10s %-25s\n" "$stage" "$sym" "$status" "$completed_at"
    done

    echo ""

    # Show checkpoints
    echo -e "  ${WHITE}Recent Checkpoints:${NC}"
    local cp_dir="$STATE_DIR/checkpoints"
    if [ -d "$cp_dir" ]; then
        ls -1t "$cp_dir" 2>/dev/null | head -5 | while read cp; do
            echo -e "    ${GREEN}•${NC} $cp"
        done
    else
        echo -e "    ${GRAY}No checkpoints found${NC}"
    fi

    echo ""
}

# =============================================================================
# Watch Mode
# =============================================================================
run_watch_mode() {
    while true; do
        extract_data
        show_full_dashboard

        if [ "$AI_METRICS" = true ]; then
            show_ai_metrics
        fi

        echo -e "${GRAY}Press Ctrl+C to exit watch mode${NC}"
        sleep $REFRESH_INTERVAL
    done
}

# =============================================================================
# Main
# =============================================================================
main() {
    # Parse arguments
    while [[ "$#" -gt 0 ]]; do
        case $1 in
            --watch|-w) WATCH_MODE=true ;;
            --compact|-c) COMPACT_MODE=true ;;
            --ai) AI_METRICS=true ;;
            --sprint) SPRINT_VIEW=true ;;
            --history) HISTORY_VIEW=true ;;
            --help|-h) usage ;;
            *) echo "Unknown option: $1"; usage ;;
        esac
        shift
    done

    # Check dependencies
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error:${NC} jq is required."
        exit 1
    fi

    # Extract data
    extract_data

    # Display based on mode
    if [ "$COMPACT_MODE" = true ]; then
        show_compact
    elif [ "$WATCH_MODE" = true ]; then
        run_watch_mode
    else
        show_full_dashboard

        if [ "$AI_METRICS" = true ]; then
            show_ai_metrics
        fi

        if [ "$SPRINT_VIEW" = true ]; then
            show_sprint_view
        fi

        if [ "$HISTORY_VIEW" = true ]; then
            show_history
        fi
    fi
}

main "$@"
