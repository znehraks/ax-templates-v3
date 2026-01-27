# Commands Reference

Complete list of Claude Symphony commands.

## Stage Commands

| Command | Stage | Description |
|---------|-------|-------------|
| `/brainstorm` | 01 | Start brainstorming phase |
| `/research` | 02 | Start research phase |
| `/planning` | 03 | Start planning phase |
| `/ui-ux` | 04 | Start UI/UX design phase |
| `/tasks` | 05 | Start task management phase |
| `/implement` | 06 | Start implementation phase |
| `/refactor` | 07 | Start refactoring phase |
| `/qa` | 08 | Start QA phase |
| `/test` | 09 | Start testing phase |
| `/deploy` | 10 | Start deployment phase |

## Navigation Commands

| Command | Description |
|---------|-------------|
| `/status` | Show current pipeline status |
| `/stages` | List all stages with details |
| `/next` | Move to next stage or sprint |
| `/next --stage` | Force stage transition |
| `/goto <stage>` | Jump to a previous stage |
| `/restore` | Restore from checkpoint |

## State Management

| Command | Description |
|---------|-------------|
| `/handoff` | Generate HANDOFF.md for current stage |
| `/handoff --compact` | Generate minimal handoff |
| `/checkpoint` | Create a checkpoint |
| `/context` | Check context usage |

## Sprint Commands

| Command | Description |
|---------|-------------|
| `/sprint` | Show current sprint status |
| `/sprint tasks` | List sprint tasks |
| `/sprint complete` | Mark sprint complete |

## Multi-AI Commands

| Command | Description |
|---------|-------------|
| `/collaborate` | Run multi-AI collaboration |
| `/benchmark` | Compare AI model outputs |
| `/synthesize` | Consolidate parallel outputs |
| `/gemini [prompt]` | Call Gemini CLI |
| `/codex [prompt]` | Call Codex CLI |

## Configuration

| Command | Description |
|---------|-------------|
| `/config sprint enable` | Enable sprint mode |
| `/config sprint disable` | Disable sprint mode |
| `/config sprint count <n>` | Set sprint count |

## Validation

| Command | Description |
|---------|-------------|
| `/validate` | Validate current stage outputs |
| `/validate --fix` | Validate and auto-fix |
| `/fork` | Manage pipeline branches |

## Requirements & Design

| Command | Description |
|---------|-------------|
| `/refine` | Interactive requirements refinement |
| `/refine --validate` | Validate against INVEST criteria |
| `/moodboard` | Collect design references |
| `/moodboard analyze` | Extract design tokens |

## Project Setup

| Command | Description |
|---------|-------------|
| `/init-project` | Initialize new project |
| `/run-stage [id]` | Run specific stage |
