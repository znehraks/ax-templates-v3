#!/bin/bash
# common.sh - claude-symphony Common Library
# Shared functions and variables for all pipeline scripts
# Usage: source "$SCRIPT_DIR/common.sh"

# =============================================================================
# Color Definitions
# =============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# =============================================================================
# Logging Functions
# =============================================================================

# Generic log function with color support
log() {
    local msg="$1"
    local color="${2:-NC}"
    case $color in
        "red") echo -e "${RED}$msg${NC}" ;;
        "green") echo -e "${GREEN}$msg${NC}" ;;
        "yellow") echo -e "${YELLOW}$msg${NC}" ;;
        "blue") echo -e "${BLUE}$msg${NC}" ;;
        "cyan") echo -e "${CYAN}$msg${NC}" ;;
        *) echo "$msg" ;;
    esac
}

# Prefixed log functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# =============================================================================
# Stage Navigation Functions
# =============================================================================

# Get next stage based on current stage
get_next_stage() {
    local current="$1"
    case "$current" in
        "01-brainstorm") echo "02-research" ;;
        "02-research") echo "03-planning" ;;
        "03-planning") echo "04-ui-ux" ;;
        "04-ui-ux") echo "05-task-management" ;;
        "05-task-management") echo "06-implementation" ;;
        "06-implementation") echo "07-refactoring" ;;
        "07-refactoring") echo "08-qa" ;;
        "08-qa") echo "09-testing" ;;
        "09-testing") echo "10-deployment" ;;
        "10-deployment") echo "completed" ;;
        *) echo "unknown" ;;
    esac
}

# Get previous stage based on current stage
get_prev_stage() {
    local current="$1"
    case "$current" in
        "02-research") echo "01-brainstorm" ;;
        "03-planning") echo "02-research" ;;
        "04-ui-ux") echo "03-planning" ;;
        "05-task-management") echo "04-ui-ux" ;;
        "06-implementation") echo "05-task-management" ;;
        "07-refactoring") echo "06-implementation" ;;
        "08-qa") echo "07-refactoring" ;;
        "09-testing") echo "08-qa" ;;
        "10-deployment") echo "09-testing" ;;
        "01-brainstorm") echo "none" ;;
        *) echo "unknown" ;;
    esac
}

# Get current stage from progress.json
get_current_stage() {
    local progress_file="${PROGRESS_FILE:-$PROJECT_ROOT/state/progress.json}"
    if [ -f "$progress_file" ]; then
        if command -v jq &> /dev/null; then
            jq -r '.current_stage // "unknown"' "$progress_file" 2>/dev/null
        else
            cat "$progress_file" 2>/dev/null | grep -o '"current_stage"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4
        fi
    else
        echo "unknown"
    fi
}

# Get primary AI model for stage
get_stage_ai() {
    local stage="$1"
    case "$stage" in
        "01-brainstorm") echo "Gemini + ClaudeCode" ;;
        "02-research") echo "Claude" ;;
        "03-planning") echo "Gemini" ;;
        "04-ui-ux") echo "Gemini" ;;
        "05-task-management") echo "ClaudeCode" ;;
        "06-implementation") echo "ClaudeCode" ;;
        "07-refactoring") echo "Codex" ;;
        "08-qa") echo "ClaudeCode" ;;
        "09-testing") echo "Codex" ;;
        "10-deployment") echo "ClaudeCode" ;;
        *) echo "Unknown" ;;
    esac
}

# Get stage name from stage ID
get_stage_name() {
    local stage="$1"
    case "$stage" in
        "01-brainstorm") echo "Brainstorming" ;;
        "02-research") echo "Research" ;;
        "03-planning") echo "Planning" ;;
        "04-ui-ux") echo "UI/UX Design" ;;
        "05-task-management") echo "Task Management" ;;
        "06-implementation") echo "Implementation" ;;
        "07-refactoring") echo "Refactoring" ;;
        "08-qa") echo "QA" ;;
        "09-testing") echo "Testing" ;;
        "10-deployment") echo "Deployment" ;;
        *) echo "Unknown Stage" ;;
    esac
}

# =============================================================================
# Path Initialization
# =============================================================================

# Initialize common paths (call after SCRIPT_DIR is set)
init_common_paths() {
    PROJECT_ROOT="${PROJECT_ROOT:-$(cd "${SCRIPT_DIR:-.}/.." && pwd)}"
    STATE_DIR="${STATE_DIR:-$PROJECT_ROOT/state}"
    STAGES_DIR="${STAGES_DIR:-$PROJECT_ROOT/stages}"
    CONFIG_DIR="${CONFIG_DIR:-$PROJECT_ROOT/config}"
    PROGRESS_FILE="${PROGRESS_FILE:-$STATE_DIR/progress.json}"
}

# Auto-initialize if SCRIPT_DIR is set
if [ -n "$SCRIPT_DIR" ]; then
    init_common_paths
fi

# =============================================================================
# Utility Functions
# =============================================================================

# Check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Ensure directory exists
ensure_dir() {
    local dir="$1"
    [ -d "$dir" ] || mkdir -p "$dir"
}

# Get timestamp in ISO format
get_timestamp() {
    date -u +"%Y-%m-%dT%H:%M:%SZ"
}

# Get readable timestamp
get_readable_timestamp() {
    date "+%Y-%m-%d %H:%M:%S"
}
