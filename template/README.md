# Claude Symphony Project

This is a Claude Symphony project - a 10-stage software development workflow powered by multi-AI orchestration.

## Quick Start

1. **Start your project** by reviewing the project brief:
   ```
   Read: stages/01-brainstorm/inputs/project_brief.md
   ```

2. **Check current status**:
   ```
   /status
   ```

3. **Begin the workflow**:
   ```
   /brainstorm
   ```

## Pipeline Stages

| Stage | Command | Description |
|-------|---------|-------------|
| 01 | `/brainstorm` | Idea generation and requirements exploration |
| 02 | `/research` | Technical research and market analysis |
| 03 | `/planning` | System architecture and tech decisions |
| 04 | `/ui-ux` | UI/UX design and wireframes |
| 05 | `/tasks` | Task breakdown and sprint planning |
| 06 | `/implement` | Core feature implementation |
| 07 | `/refactor` | Code quality and optimization |
| 08 | `/qa` | Quality assurance and testing |
| 09 | `/test` | E2E testing and coverage |
| 10 | `/deploy` | CI/CD and deployment |

## Key Commands

- `/status` - Check pipeline progress
- `/next` - Move to next stage
- `/handoff` - Generate stage transition document
- `/checkpoint` - Save current state
- `/context` - Check context usage

## Documentation

See the `docs/` directory for detailed guides:
- [Getting Started](docs/getting-started.md)
- [Commands Reference](docs/commands.md)
- [Configuration Guide](docs/configuration.md)

## Stage Outputs

Each stage generates outputs in `stages/XX-stage/outputs/`. These outputs feed into subsequent stages automatically.

## Need Help?

- Run `/stages` to see all available stages
- Run `/status` for current pipeline state
- Check `CLAUDE.md` for detailed AI instructions
