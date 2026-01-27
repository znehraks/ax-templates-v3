# Getting Started with Claude Symphony

This guide walks you through your first project with Claude Symphony.

## Prerequisites

- Claude Code CLI installed
- A project idea or brief

## Your First Project

### Step 1: Create Your Project Brief

Edit the project brief file to describe your project:

```
stages/01-brainstorm/inputs/project_brief.md
```

Include:
- Project name and description
- Target users
- Core features
- Technical constraints (if any)

### Step 2: Start Brainstorming

Begin the creative exploration phase:

```
/brainstorm
```

This stage uses multiple AI models to generate diverse ideas and explore requirements.

### Step 3: Research Phase

After brainstorming, move to research:

```
/research
```

The system will conduct technical research and market analysis based on your ideas.

### Step 4: Continue Through the Pipeline

Use `/next` to progress through each stage, or use stage-specific commands:

- `/planning` - Architecture and tech stack
- `/ui-ux` - Design and wireframes
- `/tasks` - Task breakdown
- `/implement` - Build your project
- `/refactor` - Optimize code
- `/qa` - Quality checks
- `/test` - E2E testing
- `/deploy` - Ship it!

## Stage Transitions

Each stage produces a `HANDOFF.md` document that captures:
- Completed work
- Key decisions
- Next steps

Generate a handoff with:
```
/handoff
```

## Checkpoints

Save your progress with:
```
/checkpoint
```

Restore from a checkpoint with:
```
/restore
```

## Monitoring Context

Check your context usage:
```
/context
```

If context is running low, use `/compact` to compress.

## Tips

1. **Review outputs** - Check `stages/XX/outputs/` after each stage
2. **Use checkpoints** - Save before major changes
3. **Generate handoffs** - Required before stage transitions
4. **Stay in one stage** - Complete a stage before moving on
