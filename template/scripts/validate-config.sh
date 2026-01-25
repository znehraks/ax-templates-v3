#!/bin/bash
# validate-config.sh - Configuration Validation Script
# claude-symphony workflow pipeline
#
# Validates cross-file YAML consistency across configuration files.
# Exit codes: 0 (pass), 1 (critical errors), 2 (warnings only)

set -e

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# =============================================================================
# Configuration
# =============================================================================
VERSION="1.0.0"

# Counters
CRITICAL_COUNT=0
HIGH_COUNT=0
MEDIUM_COUNT=0
PASS_COUNT=0
FIX_COUNT=0

# Options
FIX_MODE=false
VERBOSE=false
OUTPUT_JSON=false
STAGE_FILTER=""
RULE_FILTER=""

# Results storage
declare -a RESULTS=()
declare -a FIXES=()

# =============================================================================
# Usage
# =============================================================================
usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Validates configuration consistency across claude-symphony YAML files.

Options:
  --fix           Auto-fix correctable issues
  --verbose       Show detailed validation output
  --json          Output results as JSON
  --stage STAGE   Validate specific stage only (e.g., 01-brainstorm)
  --rule RULE     Run specific rule only (see rules below)
  --help          Show this help message

Validation Rules:
  model_references        [CRITICAL] Model references exist in models.yaml
  parallel_alignment      [CRITICAL] Parallel stage config alignment
  collaboration_consistency [CRITICAL] Parallel stages have 2+ models
  auto_invoke            [HIGH] Wrapper scripts and fallback validation
  execution_mode         [HIGH] Stage mode aligns with model capabilities
  mcp_servers            [MEDIUM] MCP server fallback configs exist
  prerequisites          [MEDIUM] Stage prerequisites are valid

Exit Codes:
  0 - All validations passed
  1 - Critical errors found
  2 - Warnings only (non-critical)

Examples:
  $(basename "$0")                    # Run all validations
  $(basename "$0") --fix              # Auto-fix correctable issues
  $(basename "$0") --stage 09-testing # Validate specific stage
  $(basename "$0") --rule model_references --verbose
EOF
    exit 0
}

# =============================================================================
# Output Functions
# =============================================================================
print_header() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  🔧 claude-symphony Configuration Validator v${VERSION}${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${BLUE}▸ $1${NC}"
    echo -e "${BLUE}────────────────────────────────────────────────────${NC}"
}

result_critical() {
    echo -e "  ${RED}✗ [CRITICAL]${NC} $1"
    CRITICAL_COUNT=$((CRITICAL_COUNT + 1))
    RESULTS+=("CRITICAL: $1")
}

result_high() {
    echo -e "  ${YELLOW}⚠ [HIGH]${NC} $1"
    HIGH_COUNT=$((HIGH_COUNT + 1))
    RESULTS+=("HIGH: $1")
}

result_medium() {
    echo -e "  ${MAGENTA}○ [MEDIUM]${NC} $1"
    MEDIUM_COUNT=$((MEDIUM_COUNT + 1))
    RESULTS+=("MEDIUM: $1")
}

result_pass() {
    if [ "$VERBOSE" = true ]; then
        echo -e "  ${GREEN}✓${NC} $1"
    fi
    PASS_COUNT=$((PASS_COUNT + 1))
}

result_fixed() {
    echo -e "  ${GREEN}⚡ [FIXED]${NC} $1"
    FIX_COUNT=$((FIX_COUNT + 1))
    FIXES+=("$1")
}

verbose_log() {
    if [ "$VERBOSE" = true ]; then
        echo -e "    ${GRAY}$1${NC}"
    fi
}

# =============================================================================
# Helper Functions
# =============================================================================
check_yq() {
    if ! command -v yq &> /dev/null; then
        echo -e "${RED}Error:${NC} yq is required for YAML parsing."
        echo "Install with: brew install yq (macOS) or snap install yq (Linux)"
        exit 1
    fi
}

get_all_stages() {
    echo "01-brainstorm 02-research 03-planning 04-ui-ux 05-task-management 06-implementation 07-refactoring 08-qa 09-testing 10-deployment"
}

get_parallel_stages() {
    yq '.execution_policy.stage_classification.parallel_capable[]' "$CONFIG_DIR/ai_collaboration.yaml" 2>/dev/null | tr '\n' ' '
}

get_sequential_stages() {
    yq '.execution_policy.stage_classification.sequential_only[]' "$CONFIG_DIR/ai_collaboration.yaml" 2>/dev/null | tr '\n' ' '
}

get_defined_models() {
    yq '.models | keys | .[]' "$CONFIG_DIR/models.yaml" 2>/dev/null
}

# =============================================================================
# Rule 1: Model References (CRITICAL)
# Every model in stage config must exist in models.yaml
# =============================================================================
validate_model_references() {
    print_section "Rule: model_references [CRITICAL]"
    verbose_log "Checking that all model references exist in models.yaml"

    local defined_models
    defined_models=$(get_defined_models)

    local stages
    if [ -n "$STAGE_FILTER" ]; then
        stages="$STAGE_FILTER"
    else
        stages=$(get_all_stages)
    fi

    for stage in $stages; do
        local stage_config="$STAGES_DIR/$stage/config.yaml"
        if [ ! -f "$stage_config" ]; then
            verbose_log "Skipping $stage - no config.yaml"
            continue
        fi

        # Check primary model
        local primary
        primary=$(yq '.models.primary // ""' "$stage_config" 2>/dev/null)
        if [ -n "$primary" ] && [ "$primary" != "null" ]; then
            if echo "$defined_models" | grep -qw "$primary"; then
                result_pass "$stage: primary model '$primary' valid"
            else
                result_critical "$stage: primary model '$primary' not defined in models.yaml"
            fi
        fi

        # Check secondary model
        local secondary
        secondary=$(yq '.models.secondary // ""' "$stage_config" 2>/dev/null)
        if [ -n "$secondary" ] && [ "$secondary" != "null" ]; then
            if echo "$defined_models" | grep -qw "$secondary"; then
                result_pass "$stage: secondary model '$secondary' valid"
            else
                result_critical "$stage: secondary model '$secondary' not defined in models.yaml"
            fi
        fi

        # Check auto_invoke model
        local auto_model
        auto_model=$(yq '.auto_invoke.model // ""' "$stage_config" 2>/dev/null)
        if [ -n "$auto_model" ] && [ "$auto_model" != "null" ]; then
            if echo "$defined_models" | grep -qw "$auto_model"; then
                result_pass "$stage: auto_invoke model '$auto_model' valid"
            else
                result_critical "$stage: auto_invoke model '$auto_model' not defined in models.yaml"
            fi
        fi

        # Check fallback model
        local fallback_model
        fallback_model=$(yq '.auto_invoke.fallback.model // ""' "$stage_config" 2>/dev/null)
        if [ -n "$fallback_model" ] && [ "$fallback_model" != "null" ]; then
            if echo "$defined_models" | grep -qw "$fallback_model"; then
                result_pass "$stage: fallback model '$fallback_model' valid"
            else
                result_critical "$stage: fallback model '$fallback_model' not defined in models.yaml"
            fi
        fi
    done
}

# =============================================================================
# Rule 2: Parallel Alignment (CRITICAL)
# parallel_capable stages must match config.yaml collaboration settings
# =============================================================================
validate_parallel_alignment() {
    print_section "Rule: parallel_alignment [CRITICAL]"
    verbose_log "Checking parallel stage classification matches stage configs"

    local parallel_stages
    parallel_stages=$(get_parallel_stages)

    local stages
    if [ -n "$STAGE_FILTER" ]; then
        stages="$STAGE_FILTER"
    else
        stages=$(get_all_stages)
    fi

    for stage in $stages; do
        local stage_config="$STAGES_DIR/$stage/config.yaml"
        if [ ! -f "$stage_config" ]; then
            continue
        fi

        local collab_mode
        collab_mode=$(yq '.models.collaboration // ""' "$stage_config" 2>/dev/null)
        local is_parallel_capable=false

        if echo "$parallel_stages" | grep -qw "$stage"; then
            is_parallel_capable=true
        fi

        if [ "$is_parallel_capable" = true ]; then
            if [ "$collab_mode" = "parallel" ]; then
                result_pass "$stage: parallel classification matches config (parallel)"
            else
                result_critical "$stage: listed as parallel_capable but config has collaboration='$collab_mode'"

                if [ "$FIX_MODE" = true ]; then
                    # Auto-fix: update stage config to parallel
                    yq -i '.models.collaboration = "parallel"' "$stage_config"
                    result_fixed "$stage: set collaboration to 'parallel'"
                fi
            fi
        else
            if [ "$collab_mode" = "parallel" ]; then
                result_critical "$stage: has parallel collaboration but not in parallel_capable list"
            else
                result_pass "$stage: sequential classification matches config"
            fi
        fi
    done
}

# =============================================================================
# Rule 3: Collaboration Consistency (CRITICAL)
# Parallel stages need 2+ models configured
# =============================================================================
validate_collaboration_consistency() {
    print_section "Rule: collaboration_consistency [CRITICAL]"
    verbose_log "Checking parallel stages have sufficient model configuration"

    local parallel_stages
    parallel_stages=$(get_parallel_stages)

    for stage in $parallel_stages; do
        if [ -n "$STAGE_FILTER" ] && [ "$STAGE_FILTER" != "$stage" ]; then
            continue
        fi

        local stage_config="$STAGES_DIR/$stage/config.yaml"
        if [ ! -f "$stage_config" ]; then
            result_critical "$stage: parallel stage missing config.yaml"
            continue
        fi

        local primary secondary
        primary=$(yq '.models.primary // ""' "$stage_config" 2>/dev/null)
        secondary=$(yq '.models.secondary // ""' "$stage_config" 2>/dev/null)

        local model_count=0
        [ -n "$primary" ] && [ "$primary" != "null" ] && model_count=$((model_count + 1))
        [ -n "$secondary" ] && [ "$secondary" != "null" ] && model_count=$((model_count + 1))

        if [ "$model_count" -ge 2 ]; then
            result_pass "$stage: has $model_count models for parallel execution"
        else
            result_critical "$stage: parallel stage needs 2+ models, has $model_count"
        fi
    done
}

# =============================================================================
# Rule 4: Auto-Invoke (HIGH)
# Wrapper scripts exist, fallback model defined
# =============================================================================
validate_auto_invoke() {
    print_section "Rule: auto_invoke [HIGH]"
    verbose_log "Checking auto-invoke configurations"

    local stages
    if [ -n "$STAGE_FILTER" ]; then
        stages="$STAGE_FILTER"
    else
        stages=$(get_all_stages)
    fi

    for stage in $stages; do
        local stage_config="$STAGES_DIR/$stage/config.yaml"
        if [ ! -f "$stage_config" ]; then
            continue
        fi

        local auto_enabled
        auto_enabled=$(yq '.auto_invoke.enabled // false' "$stage_config" 2>/dev/null)

        if [ "$auto_enabled" != "true" ]; then
            verbose_log "$stage: auto_invoke disabled, skipping"
            continue
        fi

        # Check wrapper script exists
        local wrapper
        wrapper=$(yq '.auto_invoke.wrapper // ""' "$stage_config" 2>/dev/null)
        if [ -n "$wrapper" ] && [ "$wrapper" != "null" ]; then
            local wrapper_path="$PROJECT_ROOT/$wrapper"
            if [ -f "$wrapper_path" ]; then
                if [ -x "$wrapper_path" ]; then
                    result_pass "$stage: wrapper script exists and executable"
                else
                    result_high "$stage: wrapper script exists but not executable: $wrapper"
                    if [ "$FIX_MODE" = true ]; then
                        chmod +x "$wrapper_path"
                        result_fixed "$stage: made $wrapper executable"
                    fi
                fi
            else
                result_high "$stage: wrapper script not found: $wrapper"
            fi
        fi

        # Check prompt file exists
        local prompt_file
        prompt_file=$(yq '.auto_invoke.prompt_file // ""' "$stage_config" 2>/dev/null)
        if [ -n "$prompt_file" ] && [ "$prompt_file" != "null" ]; then
            local prompt_path="$STAGES_DIR/$stage/$prompt_file"
            if [ -f "$prompt_path" ]; then
                result_pass "$stage: prompt file exists: $prompt_file"
            else
                result_high "$stage: auto_invoke prompt file missing: $prompt_file"
            fi
        fi

        # Check fallback configuration
        local fallback_enabled
        fallback_enabled=$(yq '.auto_invoke.fallback.enabled // false' "$stage_config" 2>/dev/null)
        if [ "$fallback_enabled" = "true" ]; then
            local fallback_model
            fallback_model=$(yq '.auto_invoke.fallback.model // ""' "$stage_config" 2>/dev/null)
            if [ -n "$fallback_model" ] && [ "$fallback_model" != "null" ]; then
                result_pass "$stage: fallback model configured: $fallback_model"
            else
                result_high "$stage: fallback enabled but no model specified"
            fi
        fi
    done
}

# =============================================================================
# Rule 5: Execution Mode (HIGH)
# Stage mode aligns with model capabilities
# =============================================================================
validate_execution_mode() {
    print_section "Rule: execution_mode [HIGH]"
    verbose_log "Checking execution modes align with model capabilities"

    local stages
    if [ -n "$STAGE_FILTER" ]; then
        stages="$STAGE_FILTER"
    else
        stages=$(get_all_stages)
    fi

    for stage in $stages; do
        local stage_config="$STAGES_DIR/$stage/config.yaml"
        if [ ! -f "$stage_config" ]; then
            continue
        fi

        local exec_mode primary
        exec_mode=$(yq '.execution.mode // ""' "$stage_config" 2>/dev/null)
        primary=$(yq '.models.primary // ""' "$stage_config" 2>/dev/null)

        if [ -z "$exec_mode" ] || [ "$exec_mode" = "null" ]; then
            verbose_log "$stage: no execution mode defined"
            continue
        fi

        # Check model supports the execution mode
        local model_modes
        model_modes=$(yq ".models.$primary.modes | keys | .[]" "$CONFIG_DIR/models.yaml" 2>/dev/null || echo "")

        # Map execution modes to model mode keys
        local mode_key=""
        case "$exec_mode" in
            "plan") mode_key="plan" ;;
            "plan_sandbox") mode_key="plan_sandbox" ;;
            "yolo") mode_key="yolo" ;;
            "sandbox_playwright") mode_key="sandbox_playwright" ;;
            "deep_dive") mode_key="deep_dive" ;;
            "headless") mode_key="headless" ;;
        esac

        if [ -n "$mode_key" ]; then
            if echo "$model_modes" | grep -qw "$mode_key"; then
                result_pass "$stage: execution mode '$exec_mode' supported by $primary"
            else
                result_high "$stage: execution mode '$exec_mode' may not be supported by $primary"
            fi
        fi
    done
}

# =============================================================================
# Rule 6: MCP Servers (MEDIUM)
# Referenced MCP servers have fallback configs
# =============================================================================
validate_mcp_servers() {
    print_section "Rule: mcp_servers [MEDIUM]"
    verbose_log "Checking MCP server configurations"

    local fallback_config="$CONFIG_DIR/mcp_fallbacks.yaml"
    if [ ! -f "$fallback_config" ]; then
        result_medium "mcp_fallbacks.yaml not found, cannot validate MCP fallbacks"
        return
    fi

    local stages
    if [ -n "$STAGE_FILTER" ]; then
        stages="$STAGE_FILTER"
    else
        stages=$(get_all_stages)
    fi

    for stage in $stages; do
        local stage_config="$STAGES_DIR/$stage/config.yaml"
        if [ ! -f "$stage_config" ]; then
            continue
        fi

        local mcp_servers
        mcp_servers=$(yq '.mcp_servers[]' "$stage_config" 2>/dev/null || echo "")

        if [ -z "$mcp_servers" ]; then
            verbose_log "$stage: no MCP servers configured"
            continue
        fi

        for server in $mcp_servers; do
            local has_fallback
            has_fallback=$(yq ".servers.$server // null" "$fallback_config" 2>/dev/null)

            if [ "$has_fallback" != "null" ] && [ -n "$has_fallback" ]; then
                result_pass "$stage: MCP server '$server' has fallback config"
            else
                result_medium "$stage: MCP server '$server' has no fallback configuration"
            fi
        done
    done
}

# =============================================================================
# Rule 7: Prerequisites (MEDIUM)
# Stage prerequisites are valid stage IDs
# =============================================================================
validate_prerequisites() {
    print_section "Rule: prerequisites [MEDIUM]"
    verbose_log "Checking stage prerequisites are valid"

    local all_stages
    all_stages=$(get_all_stages)

    local stages
    if [ -n "$STAGE_FILTER" ]; then
        stages="$STAGE_FILTER"
    else
        stages="$all_stages"
    fi

    for stage in $stages; do
        local stage_config="$STAGES_DIR/$stage/config.yaml"
        if [ ! -f "$stage_config" ]; then
            continue
        fi

        local prereqs
        prereqs=$(yq '.transition.prerequisites[]' "$stage_config" 2>/dev/null || echo "")

        if [ -z "$prereqs" ]; then
            verbose_log "$stage: no prerequisites defined"
            continue
        fi

        for prereq in $prereqs; do
            if echo "$all_stages" | grep -qw "$prereq"; then
                result_pass "$stage: prerequisite '$prereq' is valid"
            else
                result_medium "$stage: prerequisite '$prereq' is not a valid stage ID"
            fi
        done
    done
}

# =============================================================================
# Summary Output
# =============================================================================
print_summary() {
    local total=$((CRITICAL_COUNT + HIGH_COUNT + MEDIUM_COUNT + PASS_COUNT))

    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  📊 Validation Summary${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    printf "  %-12s %s\n" "Severity" "Count"
    printf "  %-12s %s\n" "────────────" "─────"
    printf "  ${RED}%-12s${NC} %d\n" "CRITICAL" "$CRITICAL_COUNT"
    printf "  ${YELLOW}%-12s${NC} %d\n" "HIGH" "$HIGH_COUNT"
    printf "  ${MAGENTA}%-12s${NC} %d\n" "MEDIUM" "$MEDIUM_COUNT"
    printf "  ${GREEN}%-12s${NC} %d\n" "PASSED" "$PASS_COUNT"

    if [ "$FIX_COUNT" -gt 0 ]; then
        echo ""
        printf "  ${GREEN}%-12s${NC} %d\n" "FIXED" "$FIX_COUNT"
    fi

    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    if [ "$CRITICAL_COUNT" -gt 0 ]; then
        echo -e "${RED}  ❌ $CRITICAL_COUNT critical issues found. Please fix before running pipeline.${NC}"
    elif [ "$HIGH_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}  ⚠ $HIGH_COUNT high-severity warnings. Review recommended.${NC}"
    elif [ "$MEDIUM_COUNT" -gt 0 ]; then
        echo -e "${MAGENTA}  ○ $MEDIUM_COUNT medium-severity notices. Optional improvements available.${NC}"
    else
        echo -e "${GREEN}  ✅ All validations passed!${NC}"
    fi

    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_json_output() {
    local exit_code=0
    [ "$CRITICAL_COUNT" -gt 0 ] && exit_code=1
    [ "$CRITICAL_COUNT" -eq 0 ] && [ "$HIGH_COUNT" -gt 0 ] && exit_code=2

    jq -n \
        --argjson critical "$CRITICAL_COUNT" \
        --argjson high "$HIGH_COUNT" \
        --argjson medium "$MEDIUM_COUNT" \
        --argjson passed "$PASS_COUNT" \
        --argjson fixed "$FIX_COUNT" \
        --argjson exit_code "$exit_code" \
        --arg stage_filter "$STAGE_FILTER" \
        --arg rule_filter "$RULE_FILTER" \
        '{
            summary: {
                critical: $critical,
                high: $high,
                medium: $medium,
                passed: $passed,
                fixed: $fixed
            },
            exit_code: $exit_code,
            filters: {
                stage: (if $stage_filter == "" then null else $stage_filter end),
                rule: (if $rule_filter == "" then null else $rule_filter end)
            }
        }'
}

# =============================================================================
# Main
# =============================================================================
main() {
    # Parse arguments
    while [[ "$#" -gt 0 ]]; do
        case $1 in
            --fix) FIX_MODE=true ;;
            --verbose) VERBOSE=true ;;
            --json) OUTPUT_JSON=true ;;
            --stage) STAGE_FILTER="$2"; shift ;;
            --rule) RULE_FILTER="$2"; shift ;;
            --help|-h) usage ;;
            *) echo "Unknown option: $1"; usage ;;
        esac
        shift
    done

    # Check dependencies
    check_yq

    # Validate stage filter
    if [ -n "$STAGE_FILTER" ]; then
        if [ ! -d "$STAGES_DIR/$STAGE_FILTER" ]; then
            echo -e "${RED}Error:${NC} Invalid stage: $STAGE_FILTER"
            exit 1
        fi
    fi

    if [ "$OUTPUT_JSON" != true ]; then
        print_header
    fi

    # Run validations
    local rules="model_references parallel_alignment collaboration_consistency auto_invoke execution_mode mcp_servers prerequisites"

    if [ -n "$RULE_FILTER" ]; then
        if ! echo "$rules" | grep -qw "$RULE_FILTER"; then
            echo -e "${RED}Error:${NC} Invalid rule: $RULE_FILTER"
            echo "Valid rules: $rules"
            exit 1
        fi
        rules="$RULE_FILTER"
    fi

    for rule in $rules; do
        case $rule in
            model_references) validate_model_references ;;
            parallel_alignment) validate_parallel_alignment ;;
            collaboration_consistency) validate_collaboration_consistency ;;
            auto_invoke) validate_auto_invoke ;;
            execution_mode) validate_execution_mode ;;
            mcp_servers) validate_mcp_servers ;;
            prerequisites) validate_prerequisites ;;
        esac
    done

    # Output results
    if [ "$OUTPUT_JSON" = true ]; then
        print_json_output
    else
        print_summary
    fi

    # Exit code
    if [ "$CRITICAL_COUNT" -gt 0 ]; then
        exit 1
    elif [ "$HIGH_COUNT" -gt 0 ] || [ "$MEDIUM_COUNT" -gt 0 ]; then
        exit 2
    else
        exit 0
    fi
}

main "$@"
