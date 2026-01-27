# Claude Symphony Architecture

This document describes the internal architecture of the claude-symphony framework.

## Directory Structure

```
claude-symphony/
├── src/                    # TypeScript source code
│   └── cli/                # CLI implementation
│       ├── index.ts        # Entry point
│       └── commands/       # CLI command handlers
├── dist/                   # Compiled JavaScript (generated)
├── template/               # Project template
├── schemas/                # JSON schemas for config validation
└── scripts/                # Runtime and development scripts
```

## Core Components

### 1. CLI (`src/cli/`)

The CLI is built with Commander.js and provides:
- `claude-symphony init` - Project initialization
- `claude-symphony play` - Encore Mode session management
- `claude-symphony status` - Pipeline status

### 2. Template (`template/`)

The template directory is copied to user projects during `init`. It contains:

#### `.claude/` - Claude Code Configuration
- `commands/` - 30+ slash command definitions
- `hooks/` - 8 lifecycle hooks for stage transitions
- `skills/` - 7 AI skills for specialized tasks
- `settings.json` - Claude Code settings

#### `stages/` - 10-Stage Pipeline
Each stage directory contains:
- `CLAUDE.md` - Stage-specific AI instructions
- `config.yaml` - Stage configuration
- `prompts/` - Prompt templates
- `inputs/` - Input files (links to previous stage outputs)
- `outputs/` - Generated deliverables
- `HANDOFF.md` - Stage transition document (generated)

#### `config/` - Configuration Files
JSONC configuration files with JSON Schema validation:
- `pipeline.jsonc` - Pipeline stages and workflow
- `models.jsonc` - AI model assignments
- `context.jsonc` - Context management thresholds
- And 20+ more specialized configs

#### `state/` - State Management
- `progress.json` - Current pipeline state
- `checkpoints/` - Recovery points
- `context/` - Context snapshots
- `handoffs/` - Archived handoffs

### 3. Schemas (`schemas/`)

JSON Schema files for config validation:
- Provides IDE autocompletion in config files
- Validates configuration structure
- Published via GitHub raw URLs for user project access

### 4. Scripts (`scripts/`)

#### `scripts/dev/` - Development Scripts
- `build-schema.ts` - Generate JSON schemas from Zod types
- `migrate-yaml-to-jsonc.ts` - Config format migration

#### `scripts/memory-relay/` - Encore Mode
Session orchestration system:
- `orchestrator.sh` - Main orchestration logic
- `claude-wrapper.sh` - Claude session management
- `fifo-reader.sh` - Inter-process communication

#### `scripts/user/` - End-User Scripts
- `validate-env.ts` - Environment validation
- `rollback.ts` - State rollback utility

## Design Patterns

### 1. Sequential Workflow Architecture
Stages execute in sequence with explicit transitions. Each stage produces outputs that become inputs for subsequent stages.

### 2. Stateless Orchestration
Context is transferred via HANDOFF.md files rather than in-memory state. This enables:
- Session recovery
- Human-readable audit trail
- Context compression

### 3. State Machine Workflow
Pipeline state is managed via `progress.json`:
```json
{
  "current_stage": "06-implementation",
  "completed_stages": ["01", "02", "03", "04", "05"],
  "sprint": { "current": 2, "total": 3 }
}
```

### 4. Hook-Based Lifecycle
Hooks execute at key lifecycle points:
- `pre-stage.sh` - Before stage execution
- `post-stage.sh` - After stage completion
- `auto-checkpoint.sh` - Automatic state saving
- `statusline.sh` - Real-time context monitoring

### 5. Layered Configuration
Configuration flows from global → stage-specific:
1. `config/pipeline.jsonc` - Global settings
2. `stages/XX/config.yaml` - Stage overrides
3. Runtime context - Session-specific

## Multi-AI Orchestration

### Collaboration Modes
- **Parallel**: Multiple AIs execute same task, outputs synthesized
- **Sequential**: AI chain with review/handoff
- **Debate**: AIs argue positions to reach optimal solution

### Model Routing
The `ai-selector.sh` hook determines which AI handles a task based on:
- Stage configuration
- Task type
- Model availability

## Context Management

### Thresholds
- 60% remaining: Warning banner
- 50% remaining: Auto-save, suggest compression
- 40% remaining: Force save, require `/clear`

### Compression Strategies
1. **Summarize completed**: Replace done work with summaries
2. **Externalize code**: Replace code blocks with file references
3. **Handoff generation**: Export state to HANDOFF.md

## Build Process

```bash
# Build CLI
pnpm run build

# This runs:
# 1. tsup - Compile TypeScript to JavaScript
# 2. build:schema - Generate JSON schemas from Zod

# Output structure:
dist/
├── cli/
│   └── index.js    # CLI entry point
└── hooks/          # Compiled hook implementations
```

## Testing

See [testing-guide.md](testing-guide.md) for comprehensive testing documentation.

## Extension Points

### Adding Commands
1. Create markdown file in `template/.claude/commands/`
2. Define command syntax and behavior
3. Commands are automatically loaded by Claude Code

### Adding Hooks
1. Create shell script in `template/.claude/hooks/`
2. Hook names must match expected lifecycle events
3. Hooks should be idempotent

### Adding Skills
1. Create directory in `template/.claude/skills/`
2. Add README.md with skill description
3. Add prompt templates in `prompts/` subdirectory
