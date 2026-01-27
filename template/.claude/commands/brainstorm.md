# /brainstorm

Start the 01-brainstorm stage directly.

## CRITICAL: Parallel Execution Required

> **This stage MUST use Gemini + ClaudeCode parallel execution.**
>
> Gemini CLI provides creative, divergent thinking while ClaudeCode provides technical review.
> Skipping Gemini CLI significantly degrades idea quality and creativity.

**Mandatory Steps:**
1. Call `/gemini` with ideation prompt (Primary - Creative Ideas)
2. ClaudeCode technical review (Secondary - Technical Validation)
3. Synthesize both outputs into final `ideas.md`

## Usage
```
/brainstorm [topic]
```

## Stage Information

| Item | Value |
|------|-------|
| Stage | 01-brainstorm |
| AI Model | **Gemini + ClaudeCode (Parallel)** |
| Execution Mode | YOLO (Container) |
| Checkpoint | Optional |

## Parallel Execution Protocol

```
┌─────────────────────────────────────────────────┐
│              01-brainstorm Stage                │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌─────────────┐     ┌─────────────┐          │
│   │   Gemini    │     │ ClaudeCode  │          │
│   │  (Primary)  │     │ (Secondary) │          │
│   │  Creative   │     │  Technical  │          │
│   └──────┬──────┘     └──────┬──────┘          │
│          │                   │                  │
│          │   Parallel        │                  │
│          │   Execution       │                  │
│          ▼                   ▼                  │
│   output_gemini.md    output_claudecode.md     │
│          │                   │                  │
│          └─────────┬─────────┘                  │
│                    ▼                            │
│          ┌─────────────────┐                   │
│          │   Synthesizer   │                   │
│          │  (ClaudeCode)   │                   │
│          └────────┬────────┘                   │
│                   ▼                             │
│              ideas.md                           │
└─────────────────────────────────────────────────┘
```

## Execution Steps

### Step 1: Gemini CLI Call (Primary - Creative Ideas)

**MUST execute Gemini CLI for creative ideation:**

```bash
/gemini "Read stages/01-brainstorm/prompts/ideation.md and generate creative ideas for: $TOPIC"
```

- **Input**: `stages/01-brainstorm/prompts/ideation.md`
- **Output**: `stages/01-brainstorm/outputs/output_gemini.md`
- **Focus**: Divergent thinking, unconstrained exploration, novel approaches

### Step 2: ClaudeCode Technical Review (Secondary)

After Gemini output is generated, ClaudeCode performs technical review:

- **Input**: Gemini output + project context
- **Output**: `stages/01-brainstorm/outputs/output_claudecode.md`
- **Focus**: Technical feasibility, implementation complexity, risk assessment

### Step 3: Synthesis (ClaudeCode as Synthesizer)

Combine both outputs into final deliverables:

```bash
/synthesize
```

- **Inputs**: `output_gemini.md` + `output_claudecode.md`
- **Output**: `stages/01-brainstorm/outputs/ideas.md`
- **Criteria**:
  - Prioritize ideas both models agree on (HIGH CONFIDENCE)
  - Evaluate unique contributions from each
  - Filter low-quality or infeasible ideas

## Actions

1. **Prerequisite Check**
   - Project initialization status (progress.json)

2. **Stage Start**
   - Gemini CLI call (creative ideas) - **REQUIRED**
   - ClaudeCode parallel execution (technical review)

3. **Output Generation**
   - ideas.md - Synthesized brainstorming ideas
   - decisions.md - Key decisions

## Execution

```bash
# Same as /run-stage 01
scripts/run-stage.sh 01-brainstorm "$ARGUMENTS"
```

## Output Example

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Stage 01: Brainstorm
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI: Gemini + ClaudeCode (parallel)
Mode: YOLO (Container)

Topic: $ARGUMENTS

[Step 1] Gemini CLI - Generating creative ideas...
         Output: outputs/output_gemini.md

[Step 2] ClaudeCode - Technical review in progress...
         Output: outputs/output_claudecode.md

[Step 3] Synthesizing outputs...
         Final: outputs/ideas.md

After completion: /next or /research
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Output Files

| File | Description |
|------|-------------|
| `outputs/output_gemini.md` | Gemini creative ideas |
| `outputs/output_claudecode.md` | ClaudeCode technical review |
| `outputs/ideas.md` | Final synthesized ideas |
| `outputs/decisions.md` | Key decisions |

## Related Commands

- `/run-stage 01` - Start after prerequisite check
- `/next` - Next stage (02-research)
- `/gemini` - Direct Gemini CLI call
- `/synthesize` - Consolidate parallel outputs

## Tips

- YOLO mode: Failure is okay, creativity first
- Freely explore multiple ideas
- **Always call Gemini CLI first** for maximum creativity
- Record final selections in decisions.md
