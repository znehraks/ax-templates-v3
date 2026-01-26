#!/bin/bash
# Memory Relay Installation Script
# Installs memory-relay to ~/.claude/memory-relay
# Part of claude-symphony package

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get script directory (source)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Target directory
TARGET_DIR="${HOME}/.claude/memory-relay"

echo ""
echo -e "${CYAN}+====================================================+${NC}"
echo -e "${CYAN}|${NC}     Claude Symphony - Memory Relay Installer       ${CYAN}|${NC}"
echo -e "${CYAN}+====================================================+${NC}"
echo ""

# Check dependencies
echo -e "${BLUE}Checking dependencies...${NC}"

# Check tmux
if command -v tmux &> /dev/null; then
    echo -e "  tmux: ${GREEN}installed${NC} ($(tmux -V))"
else
    echo -e "  tmux: ${RED}not installed${NC}"
    echo ""
    echo "Please install tmux first:"
    echo "  macOS:  brew install tmux"
    echo "  Ubuntu: apt install tmux"
    exit 1
fi

# Check claude
if command -v claude &> /dev/null; then
    echo -e "  claude: ${GREEN}installed${NC}"
else
    echo -e "  claude: ${YELLOW}not found${NC}"
    echo ""
    echo -e "${YELLOW}Warning: Claude CLI not found in PATH${NC}"
    echo "Memory Relay requires Claude CLI to function."
    echo ""
    read -p "Continue anyway? [y/N]: " continue_install
    if [[ ! "${continue_install}" =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 1
    fi
fi

echo ""

# Check if already installed
if [[ -d "${TARGET_DIR}" ]]; then
    echo -e "${YELLOW}Memory Relay is already installed at ${TARGET_DIR}${NC}"
    echo ""
    echo "Options:"
    echo "  1. Update (overwrite existing files)"
    echo "  2. Cancel"
    echo ""
    read -p "Choice [1/2]: " choice

    case "${choice}" in
        1)
            echo "Updating installation..."
            ;;
        *)
            echo "Installation cancelled."
            exit 0
            ;;
    esac
else
    echo -e "${BLUE}Installing to ${TARGET_DIR}...${NC}"
fi

# Create target directory
mkdir -p "${TARGET_DIR}"
mkdir -p "${TARGET_DIR}/orchestrator"
mkdir -p "${TARGET_DIR}/orchestrator/signals"
mkdir -p "${TARGET_DIR}/handoffs"
mkdir -p "${TARGET_DIR}/logs"
mkdir -p "${TARGET_DIR}/queue"

# Copy files
echo ""
echo "Copying files..."

# Copy orchestrator scripts
cp "${SCRIPT_DIR}/orchestrator/orchestrator.sh" "${TARGET_DIR}/orchestrator/"
cp "${SCRIPT_DIR}/orchestrator/claude-wrapper.sh" "${TARGET_DIR}/orchestrator/"
cp "${SCRIPT_DIR}/orchestrator/tmux-startup.sh" "${TARGET_DIR}/orchestrator/"
cp "${SCRIPT_DIR}/orchestrator/claude-symphony-play" "${TARGET_DIR}/orchestrator/"

# Copy config and readme
cp "${SCRIPT_DIR}/config.json" "${TARGET_DIR}/"
cp "${SCRIPT_DIR}/README.md" "${TARGET_DIR}/"

# Make scripts executable
chmod +x "${TARGET_DIR}/orchestrator/orchestrator.sh"
chmod +x "${TARGET_DIR}/orchestrator/claude-wrapper.sh"
chmod +x "${TARGET_DIR}/orchestrator/tmux-startup.sh"
chmod +x "${TARGET_DIR}/orchestrator/claude-symphony-play"

echo -e "  ${GREEN}OK${NC} Copied orchestrator scripts"
echo -e "  ${GREEN}OK${NC} Copied configuration files"
echo -e "  ${GREEN}OK${NC} Set executable permissions"

# Create symlink in ~/.local/bin (if exists) or offer to add alias
echo ""
echo -e "${BLUE}Setting up command access...${NC}"

LOCAL_BIN="${HOME}/.local/bin"
SYMLINK_PATH="${LOCAL_BIN}/claude-symphony-play"

if [[ -d "${LOCAL_BIN}" ]]; then
    # Create symlink
    ln -sf "${TARGET_DIR}/orchestrator/claude-symphony-play" "${SYMLINK_PATH}"
    echo -e "  ${GREEN}OK${NC} Created symlink at ${SYMLINK_PATH}"
    echo ""
    echo -e "${GREEN}You can now run: claude-symphony-play${NC}"
else
    echo -e "  ${YELLOW}~/.local/bin not found${NC}"
    echo ""
    echo "To add the command to your shell, add one of these to your shell profile:"
    echo ""
    echo -e "  ${CYAN}# Option 1: Alias${NC}"
    echo "  alias claude-symphony-play=\"${TARGET_DIR}/orchestrator/claude-symphony-play\""
    echo ""
    echo -e "  ${CYAN}# Option 2: Add to PATH${NC}"
    echo "  export PATH=\"\${PATH}:${TARGET_DIR}/orchestrator\""
    echo ""

    # Detect shell and offer to add alias
    SHELL_RC=""
    if [[ -f "${HOME}/.zshrc" ]]; then
        SHELL_RC="${HOME}/.zshrc"
    elif [[ -f "${HOME}/.bashrc" ]]; then
        SHELL_RC="${HOME}/.bashrc"
    fi

    if [[ -n "${SHELL_RC}" ]]; then
        echo ""
        read -p "Add alias to ${SHELL_RC}? [y/N]: " add_alias

        if [[ "${add_alias}" =~ ^[Yy]$ ]]; then
            echo "" >> "${SHELL_RC}"
            echo "# Claude Symphony - Memory Relay" >> "${SHELL_RC}"
            echo "alias claude-symphony-play=\"${TARGET_DIR}/orchestrator/claude-symphony-play\"" >> "${SHELL_RC}"
            echo -e "  ${GREEN}OK${NC} Added alias to ${SHELL_RC}"
            echo ""
            echo -e "${YELLOW}Run 'source ${SHELL_RC}' or restart your shell to use the command.${NC}"
        fi
    fi
fi

# Print success message
echo ""
echo -e "${GREEN}+====================================================+${NC}"
echo -e "${GREEN}|${NC}         Installation Complete!                     ${GREEN}|${NC}"
echo -e "${GREEN}+====================================================+${NC}"
echo ""
echo "Usage:"
echo "  claude-symphony-play              # Start orchestrated session"
echo "  claude-symphony-play status       # Show status"
echo "  claude-symphony-play logs         # View logs"
echo "  claude-symphony-play help         # Show help"
echo ""
echo "Or run directly:"
echo "  ${TARGET_DIR}/orchestrator/claude-symphony-play"
echo ""
echo -e "Configuration: ${BLUE}${TARGET_DIR}/config.json${NC}"
echo -e "Documentation: ${BLUE}${TARGET_DIR}/README.md${NC}"
echo ""
