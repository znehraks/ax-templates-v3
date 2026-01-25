#!/bin/bash
# ai-call.sh - Unified AI call router with automatic fallback
# claude-symphony workflow pipeline
#
# This script routes AI calls to the appropriate wrapper and handles
# fallback to ClaudeCode automatically when external AI calls fail.
#
# Usage: ai-call.sh <ai_model> "<prompt>" [timeout]
#        ai_model: gemini, codex, claudecode
#        prompt: The prompt to execute
#        timeout: Optional timeout in seconds (default: 300)
#
# Exit codes:
#   0: Success
#   1: General error
#   200: Fallback executed (prompt should be handled by ClaudeCode)

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

AI_MODEL="${1:-claudecode}"
PROMPT="$2"
TIMEOUT="${3:-300}"

# Usage check
if [ -z "$PROMPT" ]; then
    echo "Usage: $0 <ai_model> \"<prompt>\" [timeout]"
    echo ""
    echo "AI Models:"
    echo "  gemini     - Google Gemini CLI"
    echo "  codex      - OpenAI Codex CLI"
    echo "  claudecode - Claude Code (default fallback)"
    echo ""
    echo "Examples:"
    echo "  $0 gemini \"Generate creative ideas for a todo app\""
    echo "  $0 codex \"Refactor this function for better performance\" 600"
    exit 1
fi

# Normalize AI model name
AI_MODEL=$(echo "$AI_MODEL" | tr '[:upper:]' '[:lower:]')

# Log start
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🤖 AI Call Router${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Model: $AI_MODEL"
echo "  Timeout: ${TIMEOUT}s"
echo ""

# Handle ClaudeCode directly (no wrapper needed)
if [ "$AI_MODEL" == "claudecode" ] || [ "$AI_MODEL" == "claude" ]; then
    echo -e "${CYAN}Routing to ClaudeCode...${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}📋 EXECUTE WITH CLAUDECODE${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "$PROMPT"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "ACTION_REQUIRED: CLAUDECODE_EXECUTE"
    exit 200
fi

# Determine wrapper script
case "$AI_MODEL" in
    gemini)
        WRAPPER="$SCRIPT_DIR/gemini-wrapper.sh"
        ;;
    codex)
        WRAPPER="$SCRIPT_DIR/codex-wrapper.sh"
        ;;
    *)
        echo -e "${RED}Error:${NC} Unknown AI model: $AI_MODEL"
        echo "  Supported: gemini, codex, claudecode"
        exit 1
        ;;
esac

# Check if wrapper exists
if [ ! -f "$WRAPPER" ]; then
    echo -e "${RED}Error:${NC} Wrapper not found: $WRAPPER"
    exit 1
fi

# Execute wrapper
echo -e "${CYAN}Executing $AI_MODEL wrapper...${NC}"
echo ""

OUTPUT_FILE=$(mktemp)
"$WRAPPER" "$PROMPT" "$TIMEOUT" 2>&1 | tee "$OUTPUT_FILE"
EXIT_CODE=${PIPESTATUS[0]}

# Check for fallback conditions
if [ $EXIT_CODE -ge 100 ] && [ $EXIT_CODE -le 103 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${YELLOW}🔄 AUTO-FALLBACK TRIGGERED${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  Primary AI: $AI_MODEL"
    echo "  Exit code: $EXIT_CODE"

    case $EXIT_CODE in
        100) echo "  Reason: CLI not installed" ;;
        101) echo "  Reason: API timeout" ;;
        102) echo "  Reason: API error" ;;
        103) echo "  Reason: Output capture failed" ;;
    esac

    echo ""
    echo -e "${GREEN}Falling back to ClaudeCode...${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}📋 EXECUTE WITH CLAUDECODE${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "$PROMPT"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "ACTION_REQUIRED: CLAUDECODE_FALLBACK"
    echo "ORIGINAL_AI: $AI_MODEL"
    echo "FALLBACK_REASON: EXIT_CODE_$EXIT_CODE"

    # Log fallback to state
    FALLBACK_LOG="$PROJECT_ROOT/state/fallback_log.json"
    if command -v jq &> /dev/null && [ -d "$PROJECT_ROOT/state" ]; then
        TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        if [ ! -f "$FALLBACK_LOG" ]; then
            echo '{"fallbacks":[]}' > "$FALLBACK_LOG"
        fi
        jq --arg ts "$TIMESTAMP" --arg ai "$AI_MODEL" --arg code "$EXIT_CODE" \
            '.fallbacks += [{"timestamp": $ts, "original_ai": $ai, "exit_code": $code}]' \
            "$FALLBACK_LOG" > "${FALLBACK_LOG}.tmp" && mv "${FALLBACK_LOG}.tmp" "$FALLBACK_LOG"
    fi

    rm -f "$OUTPUT_FILE"
    exit 200
fi

# Clean up and return original exit code
rm -f "$OUTPUT_FILE"
exit $EXIT_CODE
