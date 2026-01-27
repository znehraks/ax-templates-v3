# /next

Complete the current stage and transition to the next stage.

## Usage
```
/next
/next --force    # Skip condition verification (requires justification)
/next --preview  # Preview transition without executing
/next --stage    # Force stage transition (skip Sprint check)
```

## CRITICAL: Pre-Transition Checklist

Before transitioning, the system automatically runs the **Stage Checklist Validation**.

### Automatic Validation

When `/next` is called, the pre-transition hook validates:

```bash
# Internal execution
npx tsx dist/hooks/pre-transition.js $CURRENT_STAGE $NEXT_STAGE
```

### Checklist Categories

| Category | Description | Blocking |
|----------|-------------|----------|
| **INPUT** | Required files from previous stages | Yes |
| **MCP** | Required MCP servers available | No (warning) |
| **CLI** | Required CLI calls made (output files exist) | Yes |
| **OUTPUT** | Required deliverables generated | Yes |
| **TEST** | Smoke/regression tests passing | Yes |
| **GIT** | No uncommitted changes (stages 06+) | Yes |
| **CHECKPOINT** | Checkpoint exists (stages 06, 07) | Yes |

### Per-Stage Requirements

#### Parallel Execution Stages (01, 03, 04, 07, 09)
- Must call primary AI CLI (`/gemini` or `/codex`)
- Must have `output_gemini.md` or `output_codex.md` generated
- Synthesis must complete to final output

#### Implementation Stages (06-10)
- Git commits required with proper format
- All tests must pass
- Checkpoints required (06, 07)

### Blockers

If ANY required check fails:
- Transition is **BLOCKED**
- Fix all issues listed
- Run `/next` again

### Example Output

```
/next

🔍 Pre-Transition Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current: 03-planning (Planning)
Next: 04-ui-ux (UI/UX Design)

📋 Stage 03-planning Checklist
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ [INPUT] Required input: stages/02-research/outputs/tech_research.md
✅ [MCP] Required MCP: context7
✅ [CLI] Required CLI: /gemini
✅ [OUTPUT] Required output: outputs/output_gemini.md
✅ [OUTPUT] Required output: outputs/architecture.md
✅ [OUTPUT] Required output: outputs/implementation.yaml (CRITICAL)
✅ [OUTPUT] Required output: HANDOFF.md (CRITICAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All checks passed - Ready for stage transition

Summary: 7 passed, 0 failed, 0 warnings

✅ STAGE TRANSITION ALLOWED

Ready to proceed from 03-planning to 04-ui-ux
```

### Blocked Example

```
/next

📋 Stage 06-implementation Checklist
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ [INPUT] Required input: stages/03-planning/outputs/implementation.yaml
✅ [INPUT] Required input: stages/05-task-management/outputs/tasks.md
✅ [OUTPUT] Required output: outputs/source_code/
❌ [TEST] Test: lint - Run linter
   └─ lint FAILED
❌ [GIT] Git: No uncommitted changes (format: feat(impl): <description>)
   └─ Uncommitted changes detected
❌ [CHECKPOINT] Checkpoint: Recent checkpoint exists
   └─ No checkpoint found - Run /checkpoint first
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ BLOCKED - Fix the following issues:

  1. [TEST] lint FAILED
  2. [GIT] Uncommitted changes detected
  3. [CHECKPOINT] No checkpoint found

Suggested Actions:
  1. Fix linting errors and run npm run lint
  2. Commit changes with proper format before transition
  3. Run /checkpoint to create a checkpoint

To force transition (not recommended):
  /next --force --reason "justification"
```

## Actions

1. **Run Pre-Transition Checklist**
   - Validates all stage requirements
   - Blocks transition if checks fail
   - Records validation results

2. **Auto-Generate HANDOFF.md** (if not exists)
   - Completed work summary
   - Key decisions
   - Next step guidance

3. **Update State**
   - Current stage: `completed`
   - Next stage: `in_progress`
   - Update progress.json

4. **Start Next Stage**
   - Load next stage CLAUDE.md
   - Check input files

## Options

| Option | Description |
|--------|-------------|
| `--force` | Skip completion criteria verification (requires `--reason`) |
| `--preview` | Preview only (no actual transition) |
| `--no-handoff` | Skip HANDOFF.md generation |
| `--stage` | Force stage transition (skip Sprint check in Stage 06) |
| `--reason "text"` | Justification for force override |

## Completion Criteria (By Stage)

| Stage | Required Outputs | CLI | Checkpoint | Git |
|-------|------------------|-----|------------|-----|
| 01-brainstorm | ideas.md, output_gemini.md | /gemini | - | - |
| 02-research | tech_research.md | - | - | - |
| 03-planning | architecture.md, **implementation.yaml** | /gemini | - | - |
| 04-ui-ux | wireframes.md, design_system.md | /gemini, /moodboard | - | - |
| 05-task-mgmt | tasks.md, sprint_plan.md | - | - | - |
| 06-implementation | source_code/, tests pass | /config order | Required | Required |
| 07-refactoring | refactoring_report.md | /codex | Required | Required |
| 08-qa | qa_report.md | - | - | Required |
| 09-testing | tests/, coverage 80%+ | /codex | - | Required |
| 10-deployment | CI/CD workflows | - | - | Required |

## Frequently Missed Items

1. **Primary AI CLI not called** (Stages 01, 03, 04, 07, 09)
   - Run `/gemini` or `/codex` first

2. **implementation.yaml missing** (Stage 03)
   - Critical for Stage 06

3. **Smoke tests not run** (Stage 06)
   - `npm run lint`, `npm run typecheck`

4. **Git commits missing** (Stages 06-10)
   - Commit with proper format

5. **Checkpoint not created** (Stages 06, 07)
   - Run `/checkpoint`

6. **HANDOFF.md missing** (All stages)
   - Run `/handoff`

## Related Commands

- `/status` - Check current status
- `/handoff` - Generate HANDOFF.md only
- `/checkpoint` - Create checkpoint
- `/validate` - Run output validation
- `/sprint` - Sprint management (Stage 06)
- `/run-stage [id]` - Move to specific stage
