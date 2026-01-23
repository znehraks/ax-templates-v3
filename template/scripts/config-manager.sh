#!/bin/bash
# config-manager.sh - Pipeline configuration manager
# claude-symphony workflow pipeline

set -e

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

CONFIG_FILE="$PROJECT_ROOT/config/pipeline.yaml"
TASK_CONFIG_FILE="$PROJECT_ROOT/stages/05-task-management/config.yaml"
CONFIG_HISTORY="$PROJECT_ROOT/state/config_history.json"

# Check for yq (YAML parser)
check_yq() {
    if ! command -v yq &> /dev/null; then
        echo -e "${RED}Error:${NC} yq is required for configuration management."
        echo "  Install: brew install yq (macOS) or apt install yq (Linux)"
        exit 1
    fi
}

# Check for jq
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error:${NC} jq is required."
        exit 1
    fi
}

# Initialize config history if not exists
init_config_history() {
    if [ ! -f "$CONFIG_HISTORY" ]; then
        mkdir -p "$(dirname "$CONFIG_HISTORY")"
        echo '{"changes": []}' > "$CONFIG_HISTORY"
    fi
}

# Record config change
record_change() {
    local CATEGORY=$1
    local ACTION=$2
    local VALUE=$3

    init_config_history

    local ENTRY=$(cat << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "category": "$CATEGORY",
  "action": "$ACTION",
  "value": "$VALUE"
}
EOF
)

    jq ".changes += [$ENTRY]" "$CONFIG_HISTORY" > "${CONFIG_HISTORY}.tmp" \
        && mv "${CONFIG_HISTORY}.tmp" "$CONFIG_HISTORY"
}

# Sprint configuration
config_sprint() {
    local ACTION=$1
    local VALUE=$2

    check_yq
    check_jq

    case $ACTION in
        enable)
            yq -i '.sprint_mode.enabled = true' "$CONFIG_FILE"
            record_change "sprint" "enable" "true"
            echo -e "${GREEN}✅${NC} Sprint mode enabled"
            ;;

        disable)
            yq -i '.sprint_mode.enabled = false' "$CONFIG_FILE"
            record_change "sprint" "disable" "false"
            echo -e "${GREEN}✅${NC} Sprint mode disabled (single-pass mode)"
            ;;

        count)
            if [[ "$VALUE" =~ ^[0-9]+$ ]] && [ "$VALUE" -ge 1 ] && [ "$VALUE" -le 100 ]; then
                yq -i ".sprint_mode.sprint_config.default_sprints = $VALUE" "$CONFIG_FILE"

                # Also update progress.json
                if [ -f "$PROGRESS_FILE" ]; then
                    # Update total_sprints
                    jq ".current_iteration.total_sprints = $VALUE" "$PROGRESS_FILE" > "${PROGRESS_FILE}.tmp" \
                        && mv "${PROGRESS_FILE}.tmp" "$PROGRESS_FILE"

                    # Regenerate sprints object
                    local SPRINTS_JSON="{}"
                    for ((i=1; i<=VALUE; i++)); do
                        SPRINTS_JSON=$(echo "$SPRINTS_JSON" | jq ". + {\"Sprint $i\": {\"status\": \"pending\", \"tasks_total\": 0, \"tasks_completed\": 0, \"checkpoint_id\": null}}")
                    done
                    jq ".sprints = $SPRINTS_JSON" "$PROGRESS_FILE" > "${PROGRESS_FILE}.tmp" \
                        && mv "${PROGRESS_FILE}.tmp" "$PROGRESS_FILE"
                fi

                record_change "sprint" "count" "$VALUE"
                echo -e "${GREEN}✅${NC} Default sprint count: $VALUE"
            else
                echo -e "${RED}Error:${NC} Sprint count must be between 1 and 100"
                exit 1
            fi
            ;;

        status)
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo -e "⚙️  ${WHITE}Sprint Configuration${NC}"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

            local ENABLED=$(yq '.sprint_mode.enabled // false' "$CONFIG_FILE")
            local COUNT=$(yq '.sprint_mode.sprint_config.default_sprints // 3' "$CONFIG_FILE")
            local TYPE=$(yq '.sprint_mode.type // "sprint_based"' "$CONFIG_FILE")

            echo -e "Sprint mode:   ${CYAN}$ENABLED${NC}"
            echo -e "Type:          ${CYAN}$TYPE${NC}"
            echo -e "Default count: ${CYAN}$COUNT${NC}"

            if [ -f "$PROGRESS_FILE" ]; then
                echo ""
                echo "Current session:"
                local CURRENT=$(jq -r '.current_iteration.current_sprint // 1' "$PROGRESS_FILE")
                local TOTAL=$(jq -r '.current_iteration.total_sprints // 3' "$PROGRESS_FILE")
                echo -e "  Sprint:      ${CYAN}$CURRENT / $TOTAL${NC}"
            fi

            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            ;;

        *)
            echo -e "${RED}Error:${NC} Unknown sprint action: $ACTION"
            echo "  Available: enable, disable, count <n>, status"
            exit 1
            ;;
    esac
}

# Notion configuration
config_notion() {
    local ACTION=$1

    check_yq

    case $ACTION in
        enable)
            if [ -f "$TASK_CONFIG_FILE" ]; then
                yq -i '.notion_integration.enabled = true' "$TASK_CONFIG_FILE"
            fi
            record_change "notion" "enable" "true"
            echo -e "${GREEN}✅${NC} Notion integration enabled"
            ;;

        disable)
            if [ -f "$TASK_CONFIG_FILE" ]; then
                yq -i '.notion_integration.enabled = false' "$TASK_CONFIG_FILE"
            fi
            record_change "notion" "disable" "false"
            echo -e "${GREEN}✅${NC} Notion integration disabled"
            ;;

        status)
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo -e "📋 ${WHITE}Notion Configuration${NC}"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

            if [ -f "$TASK_CONFIG_FILE" ]; then
                local ENABLED=$(yq '.notion_integration.enabled // false' "$TASK_CONFIG_FILE")
                echo -e "Notion integration: ${CYAN}$ENABLED${NC}"
            else
                echo -e "Notion integration: ${YELLOW}config not found${NC}"
            fi

            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            ;;

        *)
            echo -e "${RED}Error:${NC} Unknown notion action: $ACTION"
            echo "  Available: enable, disable, status"
            exit 1
            ;;
    esac
}

# Loop-back configuration
config_loopback() {
    local ACTION=$1
    local VALUE=$2

    check_yq

    case $ACTION in
        enable)
            yq -i '.sprint_mode.loop_back.enabled = true' "$CONFIG_FILE"
            record_change "loopback" "enable" "true"
            echo -e "${GREEN}✅${NC} Loop-back enabled"
            ;;

        disable)
            yq -i '.sprint_mode.loop_back.enabled = false' "$CONFIG_FILE"
            record_change "loopback" "disable" "false"
            echo -e "${GREEN}✅${NC} Loop-back disabled"
            ;;

        max)
            if [[ "$VALUE" =~ ^[0-9]+$ ]] && [ "$VALUE" -ge 1 ] && [ "$VALUE" -le 10 ]; then
                yq -i ".sprint_mode.loop_back.max_stages_back = $VALUE" "$CONFIG_FILE"
                record_change "loopback" "max" "$VALUE"
                echo -e "${GREEN}✅${NC} Max loop-back stages: $VALUE"
            else
                echo -e "${RED}Error:${NC} Max stages must be between 1 and 10"
                exit 1
            fi
            ;;

        status)
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo -e "🔙 ${WHITE}Loop-back Configuration${NC}"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

            local ENABLED=$(yq '.sprint_mode.loop_back.enabled // true' "$CONFIG_FILE")
            local MAX=$(yq '.sprint_mode.loop_back.max_stages_back // 3' "$CONFIG_FILE")

            echo -e "Loop-back enabled: ${CYAN}$ENABLED${NC}"
            echo -e "Max stages back:   ${CYAN}$MAX${NC}"

            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            ;;

        *)
            echo -e "${RED}Error:${NC} Unknown loopback action: $ACTION"
            echo "  Available: enable, disable, max <n>, status"
            exit 1
            ;;
    esac
}

# Show all configurations
show_all() {
    config_sprint status
    echo ""
    config_notion status
    echo ""
    config_loopback status
}

# Show config history
show_history() {
    check_jq
    init_config_history

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "📜 ${WHITE}Configuration History${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    local COUNT=$(jq '.changes | length' "$CONFIG_HISTORY")

    if [ "$COUNT" == "0" ]; then
        echo "No configuration changes recorded."
    else
        jq -r '.changes | reverse | .[0:10] | .[] | "[\(.timestamp)] \(.category)/\(.action): \(.value)"' "$CONFIG_HISTORY"

        if [ "$COUNT" -gt 10 ]; then
            echo ""
            echo -e "${GRAY}(Showing last 10 of $COUNT changes)${NC}"
        fi
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Print usage
print_usage() {
    echo "Usage: config-manager.sh <category> <action> [value]"
    echo ""
    echo "Categories:"
    echo "  sprint      Sprint mode configuration"
    echo "  notion      Notion integration configuration"
    echo "  loopback    Loop-back configuration"
    echo "  all         Show all configurations"
    echo "  history     Show configuration change history"
    echo ""
    echo "Sprint actions:"
    echo "  enable      Enable sprint mode"
    echo "  disable     Disable sprint mode (single-pass)"
    echo "  count <n>   Set default sprint count"
    echo "  status      Show current sprint configuration"
    echo ""
    echo "Notion actions:"
    echo "  enable      Enable Notion integration"
    echo "  disable     Disable Notion integration"
    echo "  status      Show current Notion configuration"
    echo ""
    echo "Loopback actions:"
    echo "  enable      Enable loop-back"
    echo "  disable     Disable loop-back"
    echo "  max <n>     Set max stages for loop-back"
    echo "  status      Show current loop-back configuration"
    echo ""
    echo "Examples:"
    echo "  ./config-manager.sh sprint enable"
    echo "  ./config-manager.sh sprint count 5"
    echo "  ./config-manager.sh notion disable"
    echo "  ./config-manager.sh all"
}

# Main
CATEGORY=$1
ACTION=$2
VALUE=$3

case $CATEGORY in
    sprint)
        config_sprint "$ACTION" "$VALUE"
        ;;
    notion)
        config_notion "$ACTION"
        ;;
    loopback)
        config_loopback "$ACTION" "$VALUE"
        ;;
    all)
        show_all
        ;;
    history)
        show_history
        ;;
    --help|-h)
        print_usage
        ;;
    *)
        if [ -z "$CATEGORY" ]; then
            print_usage
        else
            echo -e "${RED}Error:${NC} Unknown category: $CATEGORY"
            print_usage
            exit 1
        fi
        ;;
esac
