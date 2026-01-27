# Configuration Guide

Claude Symphony uses JSONC configuration files in the `config/` directory.

## Configuration Files

| File | Purpose |
|------|---------|
| `pipeline.jsonc` | Pipeline stages and workflow |
| `models.jsonc` | AI model assignments |
| `context.jsonc` | Context management thresholds |
| `git.jsonc` | Git auto-commit rules |
| `ai_collaboration.jsonc` | Multi-AI collaboration settings |
| `output_validation.jsonc` | Stage output validation |
| `memory_integration.jsonc` | Memory system integration |

## Key Settings

### Context Thresholds

In `config/context.jsonc`:

```jsonc
{
  "thresholds": {
    "warning": 60,    // Show warning at 60% remaining
    "action": 50,     // Auto-save at 50% remaining
    "critical": 40    // Require /clear at 40%
  }
}
```

### Sprint Configuration

In `config/pipeline.jsonc`:

```jsonc
{
  "sprint_mode": {
    "enabled": true,
    "default_sprints": 3
  }
}
```

### AI Model Assignment

In `config/models.jsonc`:

```jsonc
{
  "stages": {
    "01-brainstorm": ["gemini", "claudecode"],
    "02-research": ["claude"],
    "06-implementation": ["claudecode"]
  }
}
```

### Git Auto-Commit

In `config/git.jsonc`:

```jsonc
{
  "auto_commit": {
    "on_task_complete": true,
    "on_stage_complete": true,
    "message_format": "conventional"
  }
}
```

## Environment Variables

Some features may require environment variables:

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Gemini CLI access |
| `OPENAI_API_KEY` | Codex CLI access |

## MCP Server Integration

Configure MCP servers for enhanced capabilities:

- **Exa Search**: Web research
- **Context7**: Code documentation
- **Notion**: Task management
- **Figma**: Design token extraction
- **Playwright**: E2E testing

See `config/mcp_fallbacks.jsonc` for fallback settings.

## Customization

### Adding Custom Stages

Modify `config/pipeline.jsonc` to add or modify stages.

### Changing AI Models

Update `config/models.jsonc` to change which AI handles each stage.

### Adjusting Thresholds

Modify threshold values in `config/context.jsonc` and `config/auto_checkpoint.jsonc`.
