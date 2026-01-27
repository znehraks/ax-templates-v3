#!/bin/bash
# Memory Relay Orchestrator
# Listens for relay signals via FIFO and manages Claude session handoffs
# Part of claude-symphony package
#
# DEPRECATION NOTICE: This script is being replaced by TypeScript module
# See: src/relay/orchestrator.ts
# This shell script is kept for efficient FIFO blocking reads

set -euo pipefail

# Determine base directory (supports both package and global installation)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Configuration - prefer project-local, fallback to global
if [[ -f "${SCRIPT_DIR}/../config.json" ]]; then
    RELAY_BASE="$(dirname "${SCRIPT_DIR}")"
else
    RELAY_BASE="${HOME}/.claude/memory-relay"
fi

ORCHESTRATOR_DIR="${RELAY_BASE}/orchestrator"
SIGNALS_DIR="${ORCHESTRATOR_DIR}/signals"
FIFO_PATH="${SIGNALS_DIR}/relay.fifo"
LOG_DIR="${RELAY_BASE}/logs"
LOG_FILE="${LOG_DIR}/orchestrator.log"
PID_FILE="${ORCHESTRATOR_DIR}/orchestrator.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    mkdir -p "${LOG_DIR}"
    echo "[${timestamp}] [${level}] ${message}" >> "${LOG_FILE}"

    case "${level}" in
        INFO)  echo -e "${GREEN}[INFO]${NC} ${message}" ;;
        WARN)  echo -e "${YELLOW}[WARN]${NC} ${message}" ;;
        ERROR) echo -e "${RED}[ERROR]${NC} ${message}" ;;
        DEBUG) echo -e "${BLUE}[DEBUG]${NC} ${message}" ;;
    esac
}

# Cleanup function
cleanup() {
    log "INFO" "Context Manager shutting down..."
    rm -f "${PID_FILE}"
    # Kill entire tmux session when orchestrator exits
    tmux kill-session -t "symphony-session" 2>/dev/null || true
}

trap cleanup EXIT

# Ensure directories exist
mkdir -p "${SIGNALS_DIR}"
mkdir -p "${LOG_DIR}"

# Create FIFO if it doesn't exist
create_fifo() {
    if [[ ! -p "${FIFO_PATH}" ]]; then
        log "INFO" "Creating FIFO at ${FIFO_PATH}"
        rm -f "${FIFO_PATH}"
        mkfifo "${FIFO_PATH}"
        chmod 600 "${FIFO_PATH}"
    fi
}

# Check if orchestrator is already running
check_running() {
    if [[ -f "${PID_FILE}" ]]; then
        local pid=$(cat "${PID_FILE}")
        if kill -0 "${pid}" 2>/dev/null; then
            log "WARN" "Context Manager already running (PID: ${pid})"
            return 0
        else
            log "INFO" "Removing stale PID file"
            rm -f "${PID_FILE}"
        fi
    fi
    return 1
}

# Wait for /clear to complete
wait_for_clear_complete() {
    local pane_id="$1"
    local timeout="${2:-15}"
    local elapsed=0

    log "INFO" "Waiting for /clear to complete in pane ${pane_id} (timeout: ${timeout}s)"

    while [[ ${elapsed} -lt ${timeout} ]]; do
        # Capture last few lines of pane output
        local output
        output=$(tmux capture-pane -t "${pane_id}" -p -S -5 2>/dev/null || echo "")

        # Check for Claude prompt ready state (ends with > or is empty/minimal)
        local trimmed
        trimmed=$(echo "${output}" | tr -d '[:space:]')

        if [[ -z "${trimmed}" ]] || [[ "${output}" =~ \>$ ]]; then
            sleep 0.5  # Small stabilization delay
            log "INFO" "/clear completed, Claude is ready for input"
            return 0
        fi

        sleep 0.5
        ((elapsed++))
    done

    log "ERROR" "Timeout waiting for /clear to complete after ${timeout}s"
    return 1
}

# Send prompt to pane
send_prompt_to_pane() {
    local pane_id="$1"
    local prompt="$2"

    log "INFO" "Sending handoff prompt to pane ${pane_id}"

    if tmux send-keys -t "${pane_id}" "${prompt}" Enter 2>/dev/null; then
        log "INFO" "Handoff prompt sent successfully"
        return 0
    else
        log "ERROR" "Failed to send prompt to pane ${pane_id}"
        return 1
    fi
}

# Build continuation prompt
build_continuation_prompt() {
    local handoff_path="$1"
    echo "${handoff_path} 파일을 읽고 이어서 작업을 진행해주세요."
}

# Handle relay signal
handle_relay_signal() {
    local signal="$1"
    log "INFO" "Received signal: ${signal}"

    # Parse signal: RELAY_READY:handoff_path:source_pane
    if [[ "${signal}" =~ ^RELAY_READY:(.+):(.+)$ ]]; then
        local handoff_path="${BASH_REMATCH[1]}"
        local pane_id="${BASH_REMATCH[2]}"

        log "INFO" "Processing relay request"
        log "INFO" "  Handoff path: ${handoff_path}"
        log "INFO" "  Pane: ${pane_id}"

        if [[ ! -f "${handoff_path}" ]]; then
            log "ERROR" "Handoff file not found: ${handoff_path}"
            return 1
        fi

        # Step 1: Send /clear command to current pane
        log "INFO" "Sending /clear to pane ${pane_id}"
        if ! tmux send-keys -t "${pane_id}" "/clear" Enter 2>/dev/null; then
            log "ERROR" "Failed to send /clear to pane ${pane_id}"
            return 1
        fi

        # Step 2: Wait for /clear to complete
        if ! wait_for_clear_complete "${pane_id}" 15; then
            log "ERROR" "Clear did not complete in time"
            return 1
        fi

        # Step 3: Send handoff prompt
        local prompt
        prompt=$(build_continuation_prompt "${handoff_path}")
        if ! send_prompt_to_pane "${pane_id}" "${prompt}"; then
            log "ERROR" "Failed to send handoff prompt"
            return 1
        fi

        log "INFO" "Session handoff complete via /clear injection"

        # Archive the handoff file
        archive_handoff "${handoff_path}"
        return 0
    else
        log "WARN" "Invalid signal format: ${signal}"
        return 1
    fi
}

# Archive handoff file
archive_handoff() {
    local handoff_path="$1"
    local archive_dir="${RELAY_BASE}/handoffs"
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local archive_name="handoff_${timestamp}.md"

    mkdir -p "${archive_dir}"
    cp "${handoff_path}" "${archive_dir}/${archive_name}"
    log "INFO" "Handoff archived to ${archive_dir}/${archive_name}"
}

# Main loop
main_loop() {
    log "INFO" "Orchestrator main loop started"
    log "INFO" "Listening on FIFO: ${FIFO_PATH}"

    while true; do
        if read -r signal < "${FIFO_PATH}"; then
            if [[ -n "${signal}" ]]; then
                handle_relay_signal "${signal}" || true
            fi
        else
            log "DEBUG" "FIFO read returned empty, reopening..."
            sleep 0.5
        fi
    done
}

# Status command
show_status() {
    echo -e "${BLUE}Memory Relay Context Manager Status${NC}"
    echo "=================================="
    echo "Base: ${RELAY_BASE}"
    echo ""

    if [[ -f "${PID_FILE}" ]]; then
        local pid=$(cat "${PID_FILE}")
        if kill -0 "${pid}" 2>/dev/null; then
            echo -e "Status: ${GREEN}Running${NC} (PID: ${pid})"
        else
            echo -e "Status: ${RED}Stopped${NC} (stale PID file)"
        fi
    else
        echo -e "Status: ${YELLOW}Not running${NC}"
    fi

    echo ""
    echo "FIFO Path: ${FIFO_PATH}"
    [[ -p "${FIFO_PATH}" ]] && echo -e "FIFO: ${GREEN}Exists${NC}" || echo -e "FIFO: ${RED}Missing${NC}"

    echo ""
    echo "Recent logs:"
    tail -5 "${LOG_FILE}" 2>/dev/null || echo "(no logs)"
}

# Stop command
stop_orchestrator() {
    if [[ -f "${PID_FILE}" ]]; then
        local pid=$(cat "${PID_FILE}")
        if kill -0 "${pid}" 2>/dev/null; then
            log "INFO" "Stopping Context Manager (PID: ${pid})"
            kill "${pid}"
            rm -f "${PID_FILE}"
            echo "Context Manager stopped"
        else
            echo "Context Manager not running (stale PID)"
            rm -f "${PID_FILE}"
        fi
    else
        echo "Context Manager not running"
    fi
}

# Parse arguments
case "${1:-start}" in
    start)
        if check_running; then
            echo "Context Manager is already running"
            exit 1
        fi

        create_fifo
        echo $$ > "${PID_FILE}"
        log "INFO" "Context Manager starting (PID: $$)"
        main_loop
        ;;
    stop)
        stop_orchestrator
        ;;
    status)
        show_status
        ;;
    restart)
        stop_orchestrator
        sleep 1
        exec "$0" start
        ;;
    *)
        echo "Usage: $0 {start|stop|status|restart}"
        exit 1
        ;;
esac
