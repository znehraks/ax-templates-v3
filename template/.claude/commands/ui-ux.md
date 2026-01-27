# /ui-ux

Start the 04-ui-ux stage directly.

## CRITICAL: Parallel Execution Required

> **This stage MUST use Gemini + ClaudeCode parallel execution.**
>
> Gemini provides creative design exploration while ClaudeCode provides technical component specification.
> Both perspectives ensure designs are both innovative and implementable.

**Mandatory Steps:**
1. Call `/gemini` with design prompt (Primary - Creative Design)
2. ClaudeCode component specification (Secondary - Technical Spec)
3. Synthesize both outputs into final design documents

## Usage
```
/ui-ux
```

## Stage Information

| Item | Value |
|------|-------|
| Stage | 04-ui-ux |
| AI Model | **Gemini + ClaudeCode (Parallel)** |
| Execution Mode | Plan Mode |
| Checkpoint | Optional |

## Parallel Execution Protocol

```
┌─────────────────────────────────────────────────┐
│               04-ui-ux Stage                    │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌─────────────┐     ┌─────────────┐          │
│   │   Gemini    │     │ ClaudeCode  │          │
│   │  (Primary)  │     │ (Secondary) │          │
│   │  Creative   │     │  Technical  │          │
│   │   Design    │     │    Spec     │          │
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
│   wireframes/ + component-spec.md              │
└─────────────────────────────────────────────────┘
```

## Execution Steps

### Step 1: Gemini CLI Call (Primary - Creative Design)

**MUST execute Gemini CLI for creative design exploration:**

```bash
/gemini "Read stages/04-ui-ux/prompts/design.md and PRD to create innovative UI/UX designs"
```

- **Input**: `stages/03-planning/outputs/PRD.md`, `architecture.md`
- **Output**: `stages/04-ui-ux/outputs/output_gemini.md`
- **Focus**: Creative layouts, user flow innovation, visual concepts

### Step 2: ClaudeCode Technical Specification (Secondary)

After Gemini output is generated, ClaudeCode performs technical specification:

- **Input**: Gemini output + PRD + architecture
- **Output**: `stages/04-ui-ux/outputs/output_claudecode.md`
- **Focus**: Component structure, state management, implementation feasibility

### Step 3: Synthesis (ClaudeCode as Synthesizer)

Combine both outputs into final deliverables:

```bash
/synthesize
```

- **Inputs**: `output_gemini.md` + `output_claudecode.md`
- **Output**: `wireframes/`, `component-spec.md`, `design-system.md`

## Actions

1. **Prerequisite Check**
   - 03-planning completion status
   - PRD.md exists

2. **UI/UX Design**
   - Gemini CLI call (creative design) - **REQUIRED**
   - ClaudeCode parallel execution (technical spec)
   - Wireframe design
   - Component specification
   - Design system

3. **Output Generation**
   - wireframes/ - Wireframe files
   - component-spec.md - Component specification
   - design-system.md - Design system

## Execution

```bash
scripts/run-stage.sh 04-ui-ux "$ARGUMENTS"
```

## Input Files

- `stages/03-planning/outputs/PRD.md`
- `stages/03-planning/outputs/architecture.md`

## Output Files

| File | Description |
|------|-------------|
| `outputs/output_gemini.md` | Gemini creative designs |
| `outputs/output_claudecode.md` | ClaudeCode technical spec |
| `outputs/wireframes/` | Wireframe files |
| `outputs/component-spec.md` | Component specification |
| `outputs/design-system.md` | Design system |

## Related Commands

- `/run-stage 04` - Start after prerequisite check
- `/next` - Next stage (05-task-management)
- `/planning` - Previous stage
- `/gemini` - Direct Gemini CLI call
- `/synthesize` - Consolidate parallel outputs

## Tool Utilization

- Figma MCP - Design context (if configured)
- 21st Magic - UI component inspiration
