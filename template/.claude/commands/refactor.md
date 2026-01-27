# /refactor

Start the 07-refactoring stage directly.

## CRITICAL: Parallel Execution Required

> **This stage MUST use Codex + ClaudeCode parallel execution.**
>
> Codex provides deep code analysis and optimization suggestions while ClaudeCode provides implementation and verification.
> Both perspectives ensure thorough refactoring with proper validation.

**Mandatory Steps:**
1. Call `/codex` with analysis prompt (Primary - Deep Analysis)
2. ClaudeCode implementation review (Secondary - Apply & Verify)
3. Synthesize both outputs into final refactoring report

## Usage
```
/refactor [focus-area]
```

## Stage Information

| Item | Value |
|------|-------|
| Stage | 07-refactoring |
| AI Model | **Codex + ClaudeCode (Parallel)** |
| Execution Mode | Deep Dive |
| Checkpoint | **Required** |

## Parallel Execution Protocol

```
┌─────────────────────────────────────────────────┐
│            07-refactoring Stage                 │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌─────────────┐     ┌─────────────┐          │
│   │    Codex    │     │ ClaudeCode  │          │
│   │  (Primary)  │     │ (Secondary) │          │
│   │    Deep     │     │   Apply &   │          │
│   │  Analysis   │     │   Verify    │          │
│   └──────┬──────┘     └──────┬──────┘          │
│          │                   │                  │
│          │   Parallel        │                  │
│          │   Execution       │                  │
│          ▼                   ▼                  │
│   output_codex.md     output_claudecode.md     │
│          │                   │                  │
│          └─────────┬─────────┘                  │
│                    ▼                            │
│          ┌─────────────────┐                   │
│          │   Synthesizer   │                   │
│          │  (ClaudeCode)   │                   │
│          └────────┬────────┘                   │
│                   ▼                             │
│     refactoring-report.md + improved src/      │
└─────────────────────────────────────────────────┘
```

## Execution Steps

### Step 1: Codex CLI Call (Primary - Deep Analysis)

**MUST execute Codex CLI for deep code analysis:**

```bash
/codex "Analyze stages/06-implementation/outputs/src/ for refactoring opportunities: $FOCUS_AREA"
```

- **Input**: `stages/06-implementation/outputs/src/`, `tests/`
- **Output**: `stages/07-refactoring/outputs/output_codex.md`
- **Focus**: Code smells, optimization opportunities, architectural improvements

### Step 2: ClaudeCode Implementation Review (Secondary)

After Codex output is generated, ClaudeCode performs implementation review:

- **Input**: Codex analysis + source code
- **Output**: `stages/07-refactoring/outputs/output_claudecode.md`
- **Focus**: Implementation feasibility, test impact, backward compatibility

### Step 3: Synthesis & Apply (ClaudeCode as Synthesizer)

Combine both outputs and apply refactoring:

```bash
/synthesize
```

- **Inputs**: `output_codex.md` + `output_claudecode.md`
- **Output**: `refactoring-report.md` + improved `src/`
- **Verification**: Run tests after each refactoring

## Actions

1. **Prerequisite Check**
   - 06-implementation completion status
   - src/, tests/ exist
   - 06 checkpoint exists

2. **Execute Refactoring**
   - Codex CLI call (deep analysis) - **REQUIRED**
   - ClaudeCode parallel execution (apply & verify)
   - Apply refactoring changes

3. **Output Generation**
   - (Improved) src/
   - refactoring-report.md

## Execution

```bash
scripts/run-stage.sh 07-refactoring "$ARGUMENTS"
```

## Input Files

- `stages/06-implementation/outputs/src/`
- `stages/06-implementation/outputs/tests/`

## Output Files

| File | Description |
|------|-------------|
| `outputs/output_codex.md` | Codex deep analysis |
| `outputs/output_claudecode.md` | ClaudeCode review |
| `outputs/refactoring-report.md` | Final refactoring report |
| (Modified) `src/` | Improved source code |

## Checkpoint Required!

**Checkpoint required** before and after refactoring:

```bash
# Before refactoring
/checkpoint "Pre-refactoring state"

# After refactoring
/checkpoint "Refactoring completed"
```

## Refactoring Areas

- Code duplication removal
- Function/class separation
- Naming convention unification
- Performance optimization
- Security improvements

## Related Commands

- `/run-stage 07` - Start after prerequisite check
- `/next` - Next stage (08-qa)
- `/implement` - Previous stage
- `/codex` - Direct Codex CLI call
- `/checkpoint` - Create checkpoint
- `/restore` - Rollback
- `/synthesize` - Consolidate parallel outputs

## Tips

- Always checkpoint before refactoring
- **Always call Codex CLI first** for thorough analysis
- Incremental improvements in small units
- Commit after test pass verification
