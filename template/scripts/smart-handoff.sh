#!/bin/bash
# claude-symphony Smart HANDOFF Script
# Smart context extraction and HANDOFF generation

set -e

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

CONTEXT_DIR="$PROJECT_ROOT/state/context"
TEMPLATES_DIR="$PROJECT_ROOT/state/templates"

# Override log functions with HANDOFF prefix
log_info() { echo -e "${BLUE}[HANDOFF]${NC} $1"; }
log_success() { echo -e "${GREEN}[HANDOFF]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[HANDOFF]${NC} $1"; }

# Extract changed files from Git
extract_changed_files() {
    log_info "Extracting changed files..."

    if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
        echo "### Modified Files"
        echo ""
        echo "| File | Change Type | Changes |"
        echo "|------|-------------|---------|"

        git diff --stat HEAD~10 2>/dev/null | head -20 | while read -r line; do
            if [[ "$line" =~ ^[[:space:]]*([^|]+)\|[[:space:]]*([0-9]+) ]]; then
                local file="${BASH_REMATCH[1]}"
                local changes="${BASH_REMATCH[2]}"
                echo "| ${file} | modified | ${changes} |"
            fi
        done

        echo ""
    else
        echo "Not a Git repository."
    fi
}

# Extract recent commits
extract_recent_commits() {
    log_info "Extracting recent commits..."

    if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
        echo "### Recent Commits"
        echo ""

        git log --oneline -5 2>/dev/null | while read -r line; do
            echo "- $line"
        done

        echo ""
    fi
}

# Generate HANDOFF template
generate_handoff() {
    local stage="$1"
    local mode="$2"
    local stage_dir="$PROJECT_ROOT/stages/$stage"
    local handoff_file="$stage_dir/HANDOFF.md"

    log_info "Generating HANDOFF: $stage"

    mkdir -p "$stage_dir"

    # Timestamp
    local timestamp=$(date +%Y-%m-%d\ %H:%M:%S)

    cat > "$handoff_file" << EOF
# HANDOFF - $stage

> Generated: $timestamp
> Mode: $mode

## Summary

[Summarize stage completion status in 1-2 sentences]

## Completed Tasks

- [ ] Completed task 1
- [ ] Completed task 2
- [ ] Completed task 3

## Key Decisions

### Decision 1
- **Choice**: [Selected option]
- **Reason**: [Selection rationale]
- **Alternatives**: [Considered alternatives]

$(extract_changed_files)

$(extract_recent_commits)

## Pending Issues

- [ ] Issue 1 (Priority: High)
- [ ] Issue 2 (Priority: Medium)

## Next Steps

1. [First immediately actionable item]
2. [Second action]
3. [Third action]

## References

- Previous HANDOFF: [link]
- Related documents: [link]

---

## AI Call Log

| AI | Time | Purpose | Result |
|----|------|---------|--------|
| - | - | - | - |

EOF

    log_success "HANDOFF generated: $handoff_file"
}

# Template-based HANDOFF generation with variable substitution
generate_template_handoff() {
    local stage="$1"
    local mode="${2:-smart}"
    local template="$TEMPLATES_DIR/handoff_base.md.template"
    local stage_dir="$STAGES_DIR/$stage"
    local output="$stage_dir/HANDOFF.md"

    log_info "Generating template-based HANDOFF: $stage"

    mkdir -p "$stage_dir"

    # Check if template exists
    if [ ! -f "$template" ]; then
        log_warning "Template not found: $template, falling back to standard generation"
        generate_handoff "$stage" "$mode"
        return
    fi

    # Collect data for template substitution
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local next_stage=$(get_next_stage "$stage")
    local primary_ai=$(get_stage_ai "$stage")

    # Get git info
    local git_commits=""
    local modified_files=""
    if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
        git_commits=$(git log --oneline -5 2>/dev/null || echo "No recent commits")
        modified_files=$(git diff --stat HEAD~10 2>/dev/null | head -15 || echo "")
    fi

    # Perform template substitution using sed
    # Replace basic variables that sed can handle
    sed -e "s|{{CURRENT_STAGE}}|$stage|g" \
        -e "s|{{NEXT_STAGE}}|$next_stage|g" \
        -e "s|{{TIMESTAMP}}|$timestamp|g" \
        -e "s|{{PRIMARY_AI}}|$primary_ai|g" \
        -e "s|{{INTENDED_PRIMARY_AI}}|$primary_ai|g" \
        -e "s|{{ACTUAL_PRIMARY_AI}}|$primary_ai|g" \
        -e "s|{{DURATION}}|TBD|g" \
        -e "s|{{INTENDED_SECONDARY_AI}}|N/A|g" \
        -e "s|{{ACTUAL_SECONDARY_AI}}|N/A|g" \
        -e "s|{{PRIMARY_MATCH}}|✓|g" \
        -e "s|{{SECONDARY_MATCH}}|N/A|g" \
        -e "s|{{MODE_MATCH}}|N/A|g" \
        -e "s|{{EXTERNAL_MATCH}}|N/A|g" \
        -e "s|{{COLLABORATION_MODE}}|sequential|g" \
        -e "s|{{INTENDED_COLLABORATION_MODE}}|sequential|g" \
        -e "s|{{ACTUAL_COLLABORATION_MODE}}|sequential|g" \
        -e "s|{{MODE_EXECUTED}}|Yes|g" \
        -e "s|{{NON_EXECUTION_REASON}}|N/A|g" \
        -e "s|{{LATEST_CP_ID}}|checkpoint_${stage}_$(date +%Y%m%d)|g" \
        -e "s|{{FILE_COUNT}}|0|g" \
        -e "s|{{SMOKE_TEST_RUN}}|false|g" \
        -e "s|{{BUGS_FOUND_COUNT}}|0|g" \
        -e "s|{{BUGS_FIXED_COUNT}}|0|g" \
        -e "s|{{FALLBACK_COUNT}}|0|g" \
        -e "s|{{MATCH_RATE}}|100%|g" \
        -e "s|{{DEV_SERVER_STATUS}}|Not Run|g" \
        -e "s|{{BASIC_FUNCTIONALITY}}|Not Tested|g" \
        -e "s|{{PLAYWRIGHT_SMOKE}}|Not Run|g" \
        -e "s|{{EPIC_CYCLE_ENABLED}}|false|g" \
        -e "s|{{CURRENT_CYCLE}}|0|g" \
        -e "s|{{TOTAL_CYCLES}}|1|g" \
        -e "s|{{SCOPE_START}}||g" \
        -e "s|{{SCOPE_END}}||g" \
        -e "s|{{COMPLETED_CYCLES}}|0|g" \
        -e "s|{{MOODBOARD_ACTIVE}}|false|g" \
        -e "s|{{FEEDBACK_ITERATIONS}}|0|g" \
        -e "s|{{DESIGN_TOKENS_GENERATED}}|false|g" \
        -e "s|{{REFINEMENT_ACTIVE}}|false|g" \
        -e "s|{{REFINEMENT_ITERATION}}|0|g" \
        -e "s|{{VALIDATION_STATUS}}|pending|g" \
        -e "s|{{IMPLEMENTATION_ORDER}}||g" \
        -e "s|{{CURRENT_PHASE}}|0|g" \
        -e "s|{{PHASE_NAME}}||g" \
        "$template" > "$output"

    # Remove Handlebars each blocks (they need manual filling)
    # Keep placeholder for manual completion
    sed -i.bak -e '/{{#each/,/{{\/each}}/d' "$output" 2>/dev/null || \
        sed -e '/{{#each/,/{{\/each}}/d' "$output" > "${output}.tmp" && mv "${output}.tmp" "$output"
    rm -f "${output}.bak" 2>/dev/null

    # Append git activity section
    echo "" >> "$output"
    echo "## Recent Git Activity" >> "$output"
    echo "" >> "$output"
    echo "\`\`\`" >> "$output"
    echo "$git_commits" >> "$output"
    echo "\`\`\`" >> "$output"

    if [ -n "$modified_files" ]; then
        echo "" >> "$output"
        echo "### Modified Files Summary" >> "$output"
        echo "" >> "$output"
        echo "\`\`\`" >> "$output"
        echo "$modified_files" >> "$output"
        echo "\`\`\`" >> "$output"
    fi

    log_success "Template HANDOFF generated: $output"
}

# Compact mode HANDOFF
generate_compact_handoff() {
    local stage="$1"
    local stage_dir="$PROJECT_ROOT/stages/$stage"
    local handoff_file="$stage_dir/HANDOFF.md"

    log_info "Generating compact HANDOFF: $stage"

    mkdir -p "$stage_dir"

    cat > "$handoff_file" << EOF
# HANDOFF - $stage (Compact)

> $(date +%Y-%m-%d\ %H:%M:%S)

## Critical

[Blocking issues and items requiring immediate resolution]

## Next Actions

1. [First immediately actionable item]
2. [Second action]

## Context

[Minimum essential context]

EOF

    log_success "Compact HANDOFF generated: $handoff_file"
}

# Recovery detailed HANDOFF
generate_recovery_handoff() {
    local stage="$1"
    local stage_dir="$PROJECT_ROOT/stages/$stage"
    local handoff_file="$stage_dir/HANDOFF_RECOVERY.md"

    log_info "Generating recovery HANDOFF: $stage"

    mkdir -p "$stage_dir"

    cat > "$handoff_file" << EOF
# HANDOFF - $stage (Recovery)

> $(date +%Y-%m-%d\ %H:%M:%S)

## Full Context

### Current State
[Detailed state description]

### All Completed Tasks
[Complete task list]

### All Decisions
[Full decision list]

$(extract_changed_files)

$(extract_recent_commits)

## Step-by-Step Recovery

### Step 1: Verify Environment
\`\`\`bash
# Required commands
\`\`\`

### Step 2: Restore State
[Restoration procedure]

### Step 3: Resume Work
[Resume procedure]

## Related Checkpoints

- [Checkpoint list]

EOF

    log_success "Recovery HANDOFF generated: $handoff_file"
}

# Main execution
main() {
    local mode="${1:-default}"
    local stage="${2:-$(get_current_stage)}"

    if [ "$stage" = "unknown" ]; then
        log_warning "Cannot determine current stage. Using default value"
        stage="00-unknown"
    fi

    case "$mode" in
        "default"|"smart")
            generate_template_handoff "$stage" "smart"
            ;;
        "basic")
            generate_handoff "$stage" "basic"
            ;;
        "compact")
            generate_compact_handoff "$stage"
            ;;
        "recovery")
            generate_recovery_handoff "$stage"
            ;;
        *)
            echo "Usage: $0 [default|smart|basic|compact|recovery] [stage_id]"
            echo ""
            echo "Modes:"
            echo "  default/smart  - Template-based HANDOFF (recommended)"
            echo "  basic          - Simple placeholder HANDOFF"
            echo "  compact        - Minimum essential info only"
            echo "  recovery       - Detailed recovery HANDOFF"
            exit 1
            ;;
    esac
}

main "$@"
