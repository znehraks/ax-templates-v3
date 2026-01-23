#!/bin/bash
# parallel-execute.sh - Execute AI models in parallel for designated stages
# claude-symphony workflow pipeline
# Usage: ./parallel-execute.sh <stage-id> <prompt-file>

set -e

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

OUTPUT_DIR="$STATE_DIR/collaborations"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Override log function with PARALLEL prefix
log() {
    local msg="$1"
    local color="${2:-NC}"
    case $color in
        "red") echo -e "${RED}[PARALLEL]${NC} $msg" ;;
        "green") echo -e "${GREEN}[PARALLEL]${NC} $msg" ;;
        "yellow") echo -e "${YELLOW}[PARALLEL]${NC} $msg" ;;
        "blue") echo -e "${BLUE}[PARALLEL]${NC} $msg" ;;
        "cyan") echo -e "${CYAN}[PARALLEL]${NC} $msg" ;;
        *) echo "[PARALLEL] $msg" ;;
    esac
}

# Parallel-capable stages (from config/ai_collaboration.yaml)
PARALLEL_STAGES=("01-brainstorm" "03-planning" "04-ui-ux" "07-refactoring" "09-testing")

# Get models for stage
get_stage_models() {
    local stage="$1"
    case "$stage" in
        "01-brainstorm") echo "gemini claudecode" ;;
        "03-planning") echo "gemini claudecode" ;;
        "04-ui-ux") echo "gemini claudecode" ;;
        "07-refactoring") echo "codex claudecode" ;;
        "09-testing") echo "codex claudecode" ;;
        *) echo "claudecode" ;;
    esac
}

# Check if stage supports parallel execution
is_parallel_stage() {
    local stage="$1"
    for ps in "${PARALLEL_STAGES[@]}"; do
        [[ "$stage" == "$ps" ]] && return 0
    done
    return 1
}

# Check CLI availability
check_cli() {
    local cli="$1"
    if command -v "$cli" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Usage
if [ -z "$1" ]; then
    echo "Usage: $0 <stage-id> [prompt-file]"
    echo ""
    echo "Parallel-capable stages:"
    for stage in "${PARALLEL_STAGES[@]}"; do
        echo "  - $stage"
    done
    echo ""
    echo "Sequential-only stages:"
    echo "  - 02-research, 05-task-management, 06-implementation, 08-qa, 10-deployment"
    echo ""
    echo "Options:"
    echo "  --dry-run    Preview what would be executed without running"
    echo "  --force      Force parallel execution even for sequential stages"
    exit 1
fi

STAGE="$1"
PROMPT_FILE="$2"
DRY_RUN=false
FORCE=false

# Parse additional flags
for arg in "$@"; do
    case $arg in
        --dry-run) DRY_RUN=true ;;
        --force) FORCE=true ;;
    esac
done

# Validate stage
if [ ! -d "$STAGES_DIR/$STAGE" ]; then
    log "Stage not found: $STAGE" "red"
    exit 1
fi

# Check if parallel execution is appropriate
if ! is_parallel_stage "$STAGE" && [ "$FORCE" != "true" ]; then
    log "Stage $STAGE is sequential-only, running single model" "yellow"
    log "Use --force to override this check" "yellow"
    exit 1
fi

# Setup output directory
mkdir -p "$OUTPUT_DIR/$STAGE"
STAGE_OUTPUT_DIR="$OUTPUT_DIR/$STAGE/$TIMESTAMP"
mkdir -p "$STAGE_OUTPUT_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🚀 Parallel AI Execution${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Stage: $STAGE"
echo "  Models: $(get_stage_models $STAGE)"
echo "  Output: $STAGE_OUTPUT_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get models for this stage
MODELS=$(get_stage_models "$STAGE")
PIDS=()
MODELS_EXECUTED=()

# Read prompt content if file provided
PROMPT_CONTENT=""
if [ -n "$PROMPT_FILE" ] && [ -f "$PROMPT_FILE" ]; then
    PROMPT_CONTENT=$(cat "$PROMPT_FILE")
    log "Prompt loaded from: $PROMPT_FILE" "blue"
else
    # Use default stage prompt
    DEFAULT_PROMPT="$STAGES_DIR/$STAGE/prompts/default.md"
    if [ -f "$DEFAULT_PROMPT" ]; then
        PROMPT_CONTENT=$(cat "$DEFAULT_PROMPT")
        log "Using default stage prompt" "blue"
    else
        PROMPT_CONTENT="Execute stage $STAGE tasks as defined in CLAUDE.md"
        log "Using generic prompt (no prompt file found)" "yellow"
    fi
fi

if [ "$DRY_RUN" = "true" ]; then
    echo ""
    log "=== DRY RUN MODE ===" "cyan"
    log "Would execute the following:" "cyan"
    for model in $MODELS; do
        echo "  - $model → $STAGE_OUTPUT_DIR/output_${model}.md"
    done
    log "Synthesizer: ClaudeCode" "cyan"
    log "Final output: $STAGE_OUTPUT_DIR/final_output.md" "cyan"
    exit 0
fi

# Execute each model
for model in $MODELS; do
    OUTPUT_FILE="$STAGE_OUTPUT_DIR/output_${model}.md"

    case "$model" in
        "gemini")
            if check_cli "gemini"; then
                log "Starting Gemini..." "blue"
                "$SCRIPT_DIR/gemini-wrapper.sh" "$PROMPT_CONTENT" > "$OUTPUT_FILE" 2>&1 &
                PIDS+=($!)
                MODELS_EXECUTED+=("gemini")
            else
                log "Gemini CLI not available, skipping" "yellow"
                echo "# Gemini Output (Skipped)" > "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
                echo "Gemini CLI not installed. Install with:" >> "$OUTPUT_FILE"
                echo "\`\`\`bash" >> "$OUTPUT_FILE"
                echo "# Follow Gemini CLI installation instructions" >> "$OUTPUT_FILE"
                echo "\`\`\`" >> "$OUTPUT_FILE"
            fi
            ;;
        "codex")
            if check_cli "codex"; then
                log "Starting Codex..." "blue"
                "$SCRIPT_DIR/codex-wrapper.sh" "$PROMPT_CONTENT" > "$OUTPUT_FILE" 2>&1 &
                PIDS+=($!)
                MODELS_EXECUTED+=("codex")
            else
                log "Codex CLI not available, skipping" "yellow"
                echo "# Codex Output (Skipped)" > "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
                echo "Codex CLI not installed." >> "$OUTPUT_FILE"
            fi
            ;;
        "claudecode")
            # ClaudeCode runs in current session - output will be collected separately
            log "ClaudeCode will synthesize results" "blue"
            echo "# ClaudeCode Output" > "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            echo "ClaudeCode runs in the current session." >> "$OUTPUT_FILE"
            echo "This output is a placeholder - actual work happens interactively." >> "$OUTPUT_FILE"
            MODELS_EXECUTED+=("claudecode")
            ;;
    esac
done

# Wait for background processes
if [ ${#PIDS[@]} -gt 0 ]; then
    log "Waiting for background processes..." "blue"
    for i in "${!PIDS[@]}"; do
        pid="${PIDS[$i]}"
        if wait "$pid"; then
            log "Process $pid completed successfully" "green"
        else
            log "Process $pid completed with errors" "red"
        fi
    done
fi

# Create summary file
SUMMARY_FILE="$STAGE_OUTPUT_DIR/execution_summary.md"
cat > "$SUMMARY_FILE" << EOF
# Parallel Execution Summary

**Stage**: $STAGE
**Timestamp**: $TIMESTAMP
**Models Executed**: ${MODELS_EXECUTED[*]}

## Output Files

| Model | Output File | Status |
|-------|-------------|--------|
EOF

for model in $MODELS; do
    OUTPUT_FILE="$STAGE_OUTPUT_DIR/output_${model}.md"
    if [ -f "$OUTPUT_FILE" ] && [ -s "$OUTPUT_FILE" ]; then
        echo "| $model | output_${model}.md | ✓ Generated |" >> "$SUMMARY_FILE"
    else
        echo "| $model | output_${model}.md | ⚠ Empty/Missing |" >> "$SUMMARY_FILE"
    fi
done

cat >> "$SUMMARY_FILE" << EOF

## Next Steps

1. Review individual outputs in \`$STAGE_OUTPUT_DIR/\`
2. Run \`/synthesize\` to consolidate results
3. Or manually merge insights into final output

## Synthesis Command

\`\`\`bash
# Consolidate parallel outputs
/synthesize --stage $STAGE --dir $STAGE_OUTPUT_DIR
\`\`\`
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "Parallel execution complete" "green"
echo ""
echo "  Outputs: $STAGE_OUTPUT_DIR/"
for model in $MODELS; do
    echo "    - output_${model}.md"
done
echo "    - execution_summary.md"
echo ""
log "Run /synthesize to consolidate results" "cyan"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
