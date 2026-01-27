# /planning

Start the 03-planning stage directly.

## CRITICAL: Parallel Execution Required

> **This stage MUST use Gemini + ClaudeCode parallel execution.**
>
> Gemini provides strategic architectural vision while ClaudeCode provides detailed technical planning.
> Both perspectives are essential for robust architecture design.

**Mandatory Steps:**
1. Call `/gemini` with architecture prompt (Primary - Strategic Vision)
2. ClaudeCode detailed planning (Secondary - Technical Specification)
3. Synthesize both outputs into final architecture documents

## Usage
```
/planning
```

## Stage Information

| Item | Value |
|------|-------|
| Stage | 03-planning |
| AI Model | **Gemini + ClaudeCode (Parallel)** |
| Execution Mode | Plan Mode |
| Checkpoint | Optional |

## Parallel Execution Protocol

```
┌─────────────────────────────────────────────────┐
│              03-planning Stage                  │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌─────────────┐     ┌─────────────┐          │
│   │   Gemini    │     │ ClaudeCode  │          │
│   │  (Primary)  │     │ (Secondary) │          │
│   │  Strategic  │     │  Technical  │          │
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
│         PRD.md + architecture.md               │
└─────────────────────────────────────────────────┘
```

## Execution Steps

### Step 1: Gemini CLI Call (Primary - Strategic Vision)

**MUST execute Gemini CLI for strategic planning:**

```bash
/gemini "Read stages/03-planning/prompts/architecture.md and research output to create strategic architecture vision"
```

- **Input**: `stages/02-research/outputs/research.md`, `tech-stack.md`
- **Output**: `stages/03-planning/outputs/output_gemini.md`
- **Focus**: High-level architecture, strategic decisions, scalability vision

### Step 2: ClaudeCode Technical Planning (Secondary)

After Gemini output is generated, ClaudeCode performs detailed planning:

- **Input**: Gemini output + research results
- **Output**: `stages/03-planning/outputs/output_claudecode.md`
- **Focus**: Technical specifications, implementation details, risk mitigation

### Step 3: Synthesis (ClaudeCode as Synthesizer)

Combine both outputs into final deliverables:

```bash
/synthesize
```

- **Inputs**: `output_gemini.md` + `output_claudecode.md`
- **Output**: `stages/03-planning/outputs/PRD.md`, `architecture.md`

## Actions

1. **Prerequisite Check**
   - 02-research completion status
   - research.md, tech-stack.md exist

2. **Execute Planning**
   - Gemini CLI call (strategic vision) - **REQUIRED**
   - ClaudeCode parallel execution (technical details)
   - PRD (Product Requirements Document) writing
   - Architecture design

3. **Output Generation**
   - PRD.md - Product Requirements Document
   - architecture.md - Architecture design

## Execution

```bash
scripts/run-stage.sh 03-planning "$ARGUMENTS"
```

## Input Files

- `stages/02-research/outputs/research.md`
- `stages/02-research/outputs/tech-stack.md`

## Output Files

| File | Description |
|------|-------------|
| `outputs/output_gemini.md` | Gemini strategic vision |
| `outputs/output_claudecode.md` | ClaudeCode technical spec |
| `outputs/PRD.md` | Product Requirements Document |
| `outputs/architecture.md` | Architecture design |

## Related Commands

- `/run-stage 03` - Start after prerequisite check
- `/next` - Next stage (04-ui-ux)
- `/research` - Previous stage
- `/gemini` - Direct Gemini CLI call
- `/synthesize` - Consolidate parallel outputs

## PRD Structure

```markdown
# PRD: [Project Name]

## Overview
## Goals
## Functional Requirements
## Non-Functional Requirements
## Tech Stack
## Timeline
## Risk Factors
```
