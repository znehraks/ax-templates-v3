# Claude-Symphony Workflow Simulation

This document provides a comprehensive simulation of how each of the 10 pipeline stages executes in practice.

## Table of Contents

- [MCP Server Usage Mapping](#mcp-server-usage-mapping)
- [Stage 01: Brainstorming](#stage-01-brainstorming-simulation)
- [Stage 02: Research](#stage-02-research-simulation)
- [Stage 03: Planning](#stage-03-planning-simulation)
- [Stage 04: UI/UX Planning](#stage-04-uiux-planning-simulation)
- [Stage 05: Task Management](#stage-05-task-management-simulation)
- [Stage 06: Implementation](#stage-06-implementation-simulation)
- [Stage 07: Refactoring](#stage-07-refactoring-simulation)
- [Stage 08: QA](#stage-08-qa-simulation)
- [Stage 09: Testing & E2E](#stage-09-testing--e2e-simulation)
- [Stage 10: CI/CD & Deployment](#stage-10-cicd--deployment-simulation)
- [Pipeline Flow Summary](#pipeline-flow-summary)

---

## MCP Server Usage Mapping

### Stage-by-Stage MCP Assignment

| Stage | Primary MCP | Secondary MCP | Fallback | Purpose |
|-------|-------------|---------------|----------|---------|
| **01-brainstorm** | Exa Search | web_search | - | Idea/community search |
| **02-research** | Context7 | Exa Search | web_search | Tech docs + market research |
| **03-planning** | Context7 | Exa Search | - | Architecture patterns |
| **04-ui-ux** | **Stitch MCP** | Figma MCP | Claude Vision | UI generation + design tokens |
| **05-task-management** | Notion MCP | - | JSON files | Task database |
| **06-implementation** | Context7 | - | - | Library docs |
| **07-refactoring** | Serena MCP | - | - | Symbolic code analysis |
| **08-qa** | Notion MCP | Playwright | - | Bug tracking + testing |
| **09-testing** | **Playwright MCP** | Chrome DevTools | - | E2E test execution |
| **10-deployment** | - | - | - | CLI-based |

### MCP Fallback Chains

```
┌─────────────────────────────────────────────────────────────────┐
│  Search Fallback Chain                                          │
│  Context7 → Exa Search → web_search (built-in)                  │
├─────────────────────────────────────────────────────────────────┤
│  UI Generation Fallback Chain (Stage 04)                        │
│  Stitch MCP → Figma MCP → Claude Vision → Manual Wireframes     │
├─────────────────────────────────────────────────────────────────┤
│  Browser Automation Fallback Chain                              │
│  Playwright MCP → Chrome DevTools MCP                           │
├─────────────────────────────────────────────────────────────────┤
│  Task Management Fallback Chain                                 │
│  Notion MCP → Local JSON (state/tasks.json)                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 01: Brainstorming Simulation

### Execution Mode: Parallel (Gemini + ClaudeCode)

```
┌─────────────────────────────────────────────────────────────────┐
│  [1] User: /run-stage 01-brainstorm                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [2] Pre-Stage Hook Execution                                   │
│      $ .claude/hooks/pre-stage.sh 01-brainstorm                 │
│      ✓ Verify project_brief.md exists                           │
│      ✓ Input validation complete                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [3] Progress Update                                            │
│      state/progress.json:                                       │
│      {                                                          │
│        "current_stage": "01-brainstorm",                        │
│        "stage_status": "in_progress",                           │
│        "started_at": "2024-01-27T10:00:00Z"                     │
│      }                                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [4] Parallel Execution Start                                   │
│                                                                 │
│  ┌──────────────────┐      ┌──────────────────┐                 │
│  │    GEMINI        │      │   CLAUDECODE     │                 │
│  │                  │      │                  │                 │
│  │ tmux session:    │      │ Current session  │                 │
│  │ symphony-gemini  │      │ direct execution │                 │
│  │                  │      │                  │                 │
│  │ Prompt:          │      │ Prompt:          │                 │
│  │ prompts/         │      │ CLAUDE.md +      │                 │
│  │ ideation.md      │      │ same input       │                 │
│  │                  │      │                  │                 │
│  │ Output:          │      │ Output:          │                 │
│  │ output_gemini.md │      │ output_claude.md │                 │
│  └────────┬─────────┘      └────────┬─────────┘                 │
│           │                         │                           │
│           └──────────┬──────────────┘                           │
│                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  [5] Output Synthesis                                       ││
│  │                                                             ││
│  │  ClaudeCode analyzes both outputs:                          ││
│  │  ├─ Extract commonalities (HIGH CONFIDENCE)                 ││
│  │  ├─ Analyze differences (compare unique ideas)              ││
│  │  ├─ Complementary integration (best of both)                ││
│  │  └─ Quality filtering (threshold: 0.8)                      ││
│  │                                                             ││
│  │  Final output: stages/01-brainstorm/outputs/ideas.md        ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [6] Stage Completion                                           │
│                                                                 │
│  ├─ HANDOFF.md auto-generated                                   │
│  │   - Completed tasks: 5+ ideas generated                      │
│  │   - Key decisions: Selected concept direction                │
│  │   - Next stage input: ideas.md                               │
│  │                                                              │
│  ├─ Progress update                                             │
│  │   stage_status: "completed"                                  │
│  │   completed_at: "2024-01-27T10:30:00Z"                       │
│  │                                                              │
│  └─ AI call log recorded                                        │
│      | AI     | Time  | Prompt        | Result        | Status │
│      |--------|-------|---------------|---------------|--------|│
│      | Gemini | 10:05 | ideation.md   | output_g.md   | Success│
│      | Claude | 10:00 | CLAUDE.md     | output_c.md   | Success│
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 02: Research Simulation

### Execution Mode: Sequential (Claude Only) + Plan Mode

### MCP Servers Used
| MCP | Role | Priority |
|-----|------|----------|
| **Context7** | Tech docs, library API search | Primary |
| **Exa Search** | Web research, market analysis | Secondary |
| **web_search** | General web search | Fallback |

```
┌─────────────────────────────────────────────────────────────────┐
│  [1] Auto-transition: /next or manual: /run-stage 02-research   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [2] Input Validation                                           │
│      ├─ Verify stages/01-brainstorm/HANDOFF.md                  │
│      └─ Link stages/01-brainstorm/outputs/ideas.md              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [3] Claude Plan Mode Execution                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Phase 1: Research Plan Development                         ││
│  │                                                             ││
│  │  Claude analyzes:                                           ││
│  │  - Extract tech requirements from ideas.md                  ││
│  │  - Identify research areas                                  ││
│  │                                                             ││
│  │  Plan:                                                      ││
│  │  1. Competitor analysis (Exa Search)                        ││
│  │  2. Tech stack investigation (Context7)                     ││
│  │  3. API/library documentation (Context7)                    ││
│  │  4. Market trend analysis (Exa Search)                      ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Phase 2: MCP Server Research                               ││
│  │                                                             ││
│  │  [Exa Search MCP]                                           ││
│  │  ├─ Query: "AI orchestration frameworks 2024"               ││
│  │  ├─ Query: "multi-agent workflow automation"                ││
│  │  └─ Results → research_market.md                            ││
│  │                                                             ││
│  │  [Context7 MCP]                                             ││
│  │  ├─ Library: "langchain documentation"                      ││
│  │  ├─ Library: "autogen framework"                            ││
│  │  └─ Results → research_technical.md                         ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Phase 3: Research Consolidation                            ││
│  │                                                             ││
│  │  Output files:                                              ││
│  │  ├─ stages/02-research/outputs/research_report.md           ││
│  │  ├─ stages/02-research/outputs/competitor_analysis.md       ││
│  │  └─ stages/02-research/outputs/tech_recommendations.md      ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [4] HANDOFF.md Generation and Completion                       │
│      - Research key findings                                    │
│      - Tech stack recommendations                               │
│      - Constraints for next stage (Planning)                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 03: Planning Simulation

### Execution Mode: Parallel (Gemini + ClaudeCode) + Plan Mode

```
┌─────────────────────────────────────────────────────────────────┐
│  [1] Parallel Architecture Design Start                         │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌─────────────────────────┐          ┌─────────────────────────┐
│  GEMINI                 │          │  CLAUDECODE             │
│  Creative Architect     │          │  Pragmatic Architect    │
│                         │          │                         │
│  Characteristics:       │          │  Characteristics:       │
│  - High temperature     │          │  - Low temperature      │
│  - Innovative approach  │          │  - Stable approach      │
│  - Diverse alternatives │          │  - Practical impl focus │
│                         │          │                         │
│  Output:                │          │  Output:                │
│  architecture_gemini.md │          │  architecture_claude.md │
│  - Microservices        │          │  - Monolith + modules   │
│  - Event-driven         │          │  - REST API centered    │
└───────────┬─────────────┘          └───────────┬─────────────┘
            │                                    │
            └────────────────┬───────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  [2] Architecture Debate (Debate Mode)                          │
│                                                                 │
│  Round 1: Analyze pros/cons of each approach                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Gemini argues:                                             ││
│  │  "Microservices enable scalability and independent deploy"  ││
│  │                                                             ││
│  │  Claude counters:                                           ││
│  │  "Initial dev complexity high, operational costs increase"  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Round 2: Project-appropriate selection                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Consensus reached:                                         ││
│  │  "Start monolithic but design modular structure to          ││
│  │   enable future microservices migration if needed"          ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [3] Final Architecture Documentation                           │
│                                                                 │
│  stages/03-planning/outputs/                                    │
│  ├─ architecture.md          (Final architecture decision)      │
│  ├─ tech_stack.md            (Tech stack specification)         │
│  ├─ data_model.md            (Data model)                       │
│  └─ api_design.md            (API design draft)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [4] Fork Decision Point (Optional)                             │
│                                                                 │
│  If both approaches are valid:                                  │
│                                                                 │
│  /fork create --reason "architecture exploration"               │
│       --direction "microservices"                               │
│                                                                 │
│  Fork created: state/forks/fork_microservices_20240127          │
│  Main branch proceeds with monolithic                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 04: UI/UX Planning Simulation

### Execution Mode: Parallel (Gemini + ClaudeCode) + Moodboard + Stitch MCP

### MCP Servers Used
| MCP | Role | Command |
|-----|------|---------|
| **Stitch MCP** | Text→UI generation, Design DNA extraction | `/stitch generate`, `/stitch dna` |
| **Figma MCP** | Design token extraction, component inspection | `get_design_context`, `get_variable_defs` |
| **Claude Vision** | Image analysis (Fallback) | Built-in |

```
┌─────────────────────────────────────────────────────────────────┐
│  [1] /moodboard - Collect Design References                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  User input:                                                ││
│  │  - Figma file URL (optional)                                ││
│  │  - Reference image URLs                                     ││
│  │  - Design keywords: "minimal", "dark mode", "dashboard"     ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  [Figma MCP] Design Token Extraction (if Figma file)        ││
│  │  ├─ mcp__figma-dev-mode__get_design_context                 ││
│  │  ├─ mcp__figma-dev-mode__get_variable_defs                  ││
│  │  │                                                          ││
│  │  │  Extracted:                                              ││
│  │  │  ├─ Colors: Primary, Secondary, Neutral                  ││
│  │  │  ├─ Typography: Heading, Body, Caption                   ││
│  │  │  ├─ Spacing: 4px grid system                             ││
│  │  │  └─ Result → design_tokens.json                          ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [2] Stitch MCP - Extract Design DNA                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  /stitch dna                                                ││
│  │                                                             ││
│  │  Moodboard image analysis:                                  ││
│  │  ├─ Input: stages/04-ui-ux/inputs/moodboard/*               ││
│  │  │                                                          ││
│  │  │  [Stitch MCP] Design DNA Extraction                      ││
│  │  │  ├─ Color Palette: {primary: #3B82F6, ...}               ││
│  │  │  ├─ Typography: {heading: "Inter Bold", ...}             ││
│  │  │  ├─ Layout Patterns: {"card-grid", "sidebar-main"}       ││
│  │  │  ├─ Component Styles: {buttons: "rounded-lg", ...}       ││
│  │  │  └─ Visual Tone: "modern-minimal"                        ││
│  │  │                                                          ││
│  │  └─ Output: outputs/design_dna.json                         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ⚠️ Quota management: standard 350/month, experimental 50/month │
│  └─ Check with /stitch quota                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [3] Stitch MCP - Generate UI                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  /stitch generate "A login page with email and password     ││
│  │                    fields, forgot password link, and        ││
│  │                    social login buttons for Google/Apple"   ││
│  │                                                             ││
│  │  [Stitch MCP] Text→UI Conversion                            ││
│  │  ├─ Apply Design DNA (from Step 2)                          ││
│  │  ├─ Responsive breakpoints: mobile, tablet, desktop         ││
│  │  │                                                          ││
│  │  │  Generated:                                              ││
│  │  │  ├─ outputs/stitch_generated/ui_20240127_110000/         ││
│  │  │  │   ├─ login_page.html                                  ││
│  │  │  │   ├─ login_page.css                                   ││
│  │  │  │   └─ preview.png                                      ││
│  │  │  │                                                       ││
│  │  │  └─ Auto-generate component inventory                    ││
│  │  │                                                          ││
│  │  └─ /stitch variants 3 → Generate 3 design alternatives     ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [4] Parallel UI/UX Design (Based on Stitch Output)             │
│                                                                 │
│  ┌──────────────────┐      ┌──────────────────┐                 │
│  │    GEMINI        │      │   CLAUDECODE     │                 │
│  │                  │      │                  │                 │
│  │  Creative UI:    │      │  Practical UI:   │                 │
│  │  - Animations    │      │  - Accessibility │                 │
│  │  - Interactions  │      │  - Responsive    │                 │
│  │  - Micro UX      │      │  - Component     │                 │
│  │                  │      │    reuse         │                 │
│  │  Reference       │      │  Reference       │                 │
│  │  Stitch output   │      │  Stitch output   │                 │
│  │  for expansion   │      │  for impl plan   │                 │
│  │                  │      │                  │                 │
│  │  Output:         │      │  Output:         │                 │
│  │  wireframes_g.md │      │  wireframes_c.md │                 │
│  └────────┬─────────┘      └────────┬─────────┘                 │
│           └──────────┬──────────────┘                           │
│                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Integration and Refinement                                 ││
│  │                                                             ││
│  │  Final outputs:                                             ││
│  │  ├─ wireframes.md (Wireframe specification)                 ││
│  │  ├─ component_library.md (Component definitions)            ││
│  │  ├─ user_flows.md (User flow diagrams)                      ││
│  │  └─ design_system.md (Design system guide)                  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [5] Stitch Export (Optional)                                   │
│                                                                 │
│  /stitch export figma  → outputs/stitch_exports/figma/          │
│  /stitch export html   → outputs/stitch_exports/html/           │
│  /stitch export both   → Export both formats                    │
│                                                                 │
│  ⚠️ Fallback behavior (if Stitch fails):                        │
│  Stitch MCP → Figma MCP → Claude Vision → Manual Wireframes     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 05: Task Management Simulation

### Execution Mode: Sequential (ClaudeCode) + Notion Integration

### MCP Servers Used
| MCP | Role | Fallback |
|-----|------|----------|
| **Notion MCP** | Task DB creation/management, Sprint tracking | Local JSON |
| `notion-create-pages` | Task page creation | - |
| `notion-update-page` | Status updates | - |
| `notion-search` | Duplicate checking | - |

```
┌─────────────────────────────────────────────────────────────────┐
│  [1] /refine - Requirements Refinement                          │
│                                                                 │
│  Epic → Feature → Task decomposition:                           │
│                                                                 │
│  Epic: "User Authentication System"                             │
│    ├─ Feature: "Login"                                          │
│    │    ├─ Task: "Login form component"                         │
│    │    ├─ Task: "JWT token handling"                           │
│    │    └─ Task: "Login API integration"                        │
│    └─ Feature: "Registration"                                   │
│         ├─ Task: "Registration form"                            │
│         └─ Task: "Email verification"                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [2] INVEST Criteria Validation                                 │
│                                                                 │
│  For each Task:                                                 │
│  ├─ I (Independent): Can be implemented independently?          │
│  ├─ N (Negotiable): Scope negotiable?                           │
│  ├─ V (Valuable): Provides business value?                      │
│  ├─ E (Estimable): Can be estimated?                            │
│  ├─ S (Small): Appropriate size?                                │
│  └─ T (Testable): Can be tested?                                │
│                                                                 │
│  Validation failure: Task re-decomposition                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [3] Notion Sync (if enabled)                                   │
│                                                                 │
│  [Notion MCP]                                                   │
│  ├─ Create Database: "Project Tasks"                            │
│  ├─ Properties:                                                 │
│  │   - Status: Not Started | In Progress | Done                 │
│  │   - Priority: P0 | P1 | P2                                   │
│  │   - Sprint: Sprint 1 | Sprint 2 | Sprint 3                   │
│  │   - Assignee: AI | Human                                     │
│  │                                                              │
│  ├─ Task creation (sequential, 100ms delay):                    │
│  │   Task 1 → success → Task 2 → success → ...                  │
│  │                                                              │
│  └─ Duplicate check: check_duplicates: true                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [4] Sprint Planning                                            │
│                                                                 │
│  Sprint 1 (MVP):                                                │
│  ├─ [P0] Login form component                                   │
│  ├─ [P0] JWT token handling                                     │
│  └─ [P0] Login API integration                                  │
│                                                                 │
│  Sprint 2:                                                      │
│  ├─ [P1] Registration form                                      │
│  └─ [P1] Email verification                                     │
│                                                                 │
│  Sprint 3 (Polish):                                             │
│  └─ [P2] Password reset                                         │
│                                                                 │
│  Output: stages/05-task-management/outputs/sprint_plan.md       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 06: Implementation Simulation

### Execution Mode: Sequential (ClaudeCode) + Plan Mode + Sandbox + Sprint Iteration

### MCP Servers Used
| MCP | Role | Purpose |
|-----|------|---------|
| **Context7** | Library documentation search | API reference, code examples |
| **Serena MCP** | Symbolic code analysis | Function/class navigation |

```
┌─────────────────────────────────────────────────────────────────┐
│  [Sprint 1 Start]                                               │
│                                                                 │
│  current_iteration:                                             │
│    current_sprint: 1                                            │
│    total_sprints: 3                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [1] Pre-Implementation Planning (Plan Mode)                    │
│                                                                 │
│  Task: "Login form component"                                   │
│                                                                 │
│  Plan:                                                          │
│  1. Component structure design                                  │
│  2. UI implementation (React + TypeScript)                      │
│  3. Form validation logic                                       │
│  4. Styling (reference design_system.md)                        │
│  5. Unit test writing                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [2] Code Implementation (Sandbox Mode)                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Created files:                                             ││
│  │  [project-name]/src/                                        ││
│  │  ├─ components/auth/LoginForm.tsx                           ││
│  │  ├─ components/auth/LoginForm.test.tsx                      ││
│  │  ├─ hooks/useAuth.ts                                        ││
│  │  └─ styles/auth.css                                         ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [3] Auto-Checkpoint on 5 Task Completion                       │
│                                                                 │
│  Checkpoint created:                                            │
│  ├─ ID: checkpoint_20240127_103000                              │
│  ├─ Stage: 06-implementation                                    │
│  ├─ Description: "Sprint 1 - Auth components completed"         │
│  └─ Saved: state/checkpoints/checkpoint_20240127_103000/        │
│                                                                 │
│  Auto-commit:                                                   │
│  git commit -m "feat(impl): implement login form component"     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [4] Sprint 1 Complete → Smoke Test                             │
│                                                                 │
│  Test Gates:                                                    │
│  ├─ npm run dev        → ✓ Server starts (60s timeout)          │
│  ├─ npm run lint       → ✓ Lint passes (120s timeout)           │
│  ├─ npm run typecheck  → ✓ Typecheck passes (120s timeout)      │
│  └─ playwright @smoke  → ✓ Smoke tests pass (180s timeout)      │
│                                                                 │
│  On failure: block_handoff (cannot proceed to next Sprint)      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [5] /next → Sprint Transition                                  │
│                                                                 │
│  Sprint 1 → Sprint 2                                            │
│                                                                 │
│  current_iteration:                                             │
│    current_sprint: 2   (updated)                                │
│    total_sprints: 3                                             │
│                                                                 │
│  Loading Sprint 2 tasks...                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────┴─────────────────────┐
        │   Sprint 2, 3 - Same cycle repeats...     │
        └─────────────────────┬─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [6] All Sprints Complete → Stage Transition                    │
│                                                                 │
│  /next --stage or auto-transition                               │
│                                                                 │
│  HANDOFF.md generated:                                          │
│  ├─ Completed tasks: 15                                         │
│  ├─ Modified files: 23                                          │
│  ├─ Checkpoints: 3                                              │
│  ├─ Known issues: 2 (minor)                                     │
│  └─ Next stage recommendation: Areas needing refactoring        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 07: Refactoring Simulation

### Execution Mode: Parallel (Codex + ClaudeCode) + Deep Dive

```
┌─────────────────────────────────────────────────────────────────┐
│  [1] Code Analysis Start                                        │
│                                                                 │
│  Codex and ClaudeCode analyze codebase in parallel:             │
│                                                                 │
│  ┌──────────────────┐      ┌──────────────────┐                 │
│  │     CODEX        │      │   CLAUDECODE     │                 │
│  │  Deep Analysis   │      │  Pattern Review  │                 │
│  │                  │      │                  │                 │
│  │  Analysis areas: │      │  Analysis areas: │                 │
│  │  - Code complexity│     │  - Design patterns│                │
│  │  - Performance   │      │  - Code duplication│               │
│  │  - Memory usage  │      │  - Naming conventions│             │
│  │  - Algorithm     │      │  - Modularity     │                │
│  │    optimization  │      │                  │                 │
│  │                  │      │                  │                 │
│  │  Output:         │      │  Output:         │                 │
│  │  analysis_codex.md│     │  analysis_claude.md│               │
│  └────────┬─────────┘      └────────┬─────────┘                 │
│           └──────────┬──────────────┘                           │
│                      ▼                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [2] Refactoring Priority Decision                              │
│                                                                 │
│  Integrated analysis results:                                   │
│                                                                 │
│  High Priority (immediate fix):                                 │
│  ├─ [PERF] useAuth hook unnecessary re-renders                  │
│  ├─ [DUP] API call logic duplicated (3 places)                  │
│  └─ [COMPLEX] handleSubmit function high complexity             │
│                                                                 │
│  Medium Priority (recommended):                                 │
│  ├─ [PATTERN] Repository pattern not applied                    │
│  └─ [NAMING] Inconsistent variable names                        │
│                                                                 │
│  Low Priority (optional):                                       │
│  └─ [STYLE] Consider CSS-in-JS migration                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [3] Execute Refactoring                                        │
│                                                                 │
│  Checkpoint created (pre-refactoring):                          │
│  checkpoint_20240127_140000 "Pre-refactoring snapshot"          │
│                                                                 │
│  Refactoring work:                                              │
│  ├─ useAuth hook optimization (useMemo, useCallback)            │
│  ├─ Extract API service layer                                   │
│  └─ Split handleSubmit function                                 │
│                                                                 │
│  Auto-commits:                                                  │
│  git commit -m "refactor(refactor): optimize auth hook"         │
│  git commit -m "refactor(refactor): extract API service layer"  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [4] Regression Test                                            │
│                                                                 │
│  ├─ npm run test    → ✓ All tests pass (300s timeout)           │
│  ├─ npm run lint    → ✓ Lint passes                             │
│                                                                 │
│  Failure handling: warn_and_continue (warn then proceed)        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [5] Refactoring Report Generation                              │
│                                                                 │
│  stages/07-refactoring/outputs/refactoring_report.md:           │
│  ├─ Change summary                                              │
│  ├─ Performance improvement metrics                             │
│  ├─ Code quality metrics (before/after)                         │
│  └─ Remaining technical debt                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 08: QA Simulation

### Execution Mode: Sequential (ClaudeCode) + Plan Mode + Sandbox

```
┌─────────────────────────────────────────────────────────────────┐
│  [1] QA Checklist Generation                                    │
│                                                                 │
│  Test areas identified from HANDOFF.md:                         │
│                                                                 │
│  Functional Testing:                                            │
│  ├─ [ ] Login form works correctly                              │
│  ├─ [ ] Registration flow                                       │
│  ├─ [ ] Session management                                      │
│  └─ [ ] Error handling                                          │
│                                                                 │
│  Non-Functional Testing:                                        │
│  ├─ [ ] Responsive layout                                       │
│  ├─ [ ] Accessibility (a11y)                                    │
│  └─ [ ] Performance (Lighthouse)                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [2] Manual + Automated QA Execution                            │
│                                                                 │
│  Automated tests:                                               │
│  ├─ npm run test           → ✓ 45/45 passed                     │
│  ├─ npm run test:coverage  → 82% (threshold: 80%)               │
│  └─ npm run lint           → ✓ 0 errors, 3 warnings             │
│                                                                 │
│  Manual tests (ClaudeCode simulation):                          │
│  ├─ Login scenario testing                                      │
│  │   1. Valid credentials → ✓ Success                           │
│  │   2. Invalid password → ✓ Error message displayed            │
│  │   3. Empty field submit → ✓ Validation works                 │
│  │                                                              │
│  └─ Edge case testing                                           │
│      1. Network error → ⚠️ Bug found!                           │
│      2. Concurrent requests → ✓ Normal                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [3] Bug Discovery and Fix                                      │
│                                                                 │
│  Bug #1: Infinite loading on network error                      │
│  ├─ Severity: Medium                                            │
│  ├─ Reproduction steps: [...]                                   │
│  ├─ Fix: Add try-catch and timeout                              │
│  └─ Commit: "fix(qa): handle network error in login"            │
│                                                                 │
│  Notion sync (if enabled):                                      │
│  └─ Bug tracking database updated                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [4] Loop-back Decision Point                                   │
│                                                                 │
│  On Critical Bug discovery:                                     │
│  ├─ /goto 06-implementation (implementation fix needed)         │
│  └─ Loop-back log: state/loopback_history.json                  │
│                                                                 │
│  Minor Bug only:                                                │
│  └─ Fix in current Stage and proceed                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [5] QA Report Generation                                       │
│                                                                 │
│  stages/08-qa/outputs/qa_report.md:                             │
│  ├─ Test coverage: 82%                                          │
│  ├─ Bugs found: 1 (fixed)                                       │
│  ├─ Known issues: 0                                             │
│  └─ QA approval: ✓ PASS                                         │
│                                                                 │
│  Test Gate:                                                     │
│  ├─ npm run test     → ✓ Pass                                   │
│  └─ playwright test  → ✓ Pass (E2E)                             │
│                                                                 │
│  On failure: block_handoff (bug fix required)                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 09: Testing & E2E Simulation

### Execution Mode: Parallel (Codex + ClaudeCode) + Sandbox + Playwright

### MCP Servers Used
| MCP | Role | Commands/Functions |
|-----|------|-------------------|
| **Playwright MCP** | E2E test execution, browser automation | Primary |
| `browser_navigate` | Page navigation | - |
| `browser_click` | Element click | - |
| `browser_fill_form` | Form input | - |
| `browser_take_screenshot` | Screenshot capture | - |
| `browser_snapshot` | DOM snapshot | - |
| **Chrome DevTools MCP** | Browser testing (Fallback) | Secondary |

```
┌─────────────────────────────────────────────────────────────────┐
│  [1] Test Strategy Development                                  │
│                                                                 │
│  Codex and ClaudeCode design tests in parallel:                 │
│                                                                 │
│  ┌──────────────────┐      ┌──────────────────┐                 │
│  │     CODEX        │      │   CLAUDECODE     │                 │
│  │  E2E Test Focus  │      │  Unit Test Focus │                 │
│  │                  │      │                  │                 │
│  │  Design:         │      │  Design:         │                 │
│  │  - Happy paths   │      │  - Edge cases    │                 │
│  │  - User flows    │      │  - Error handling│                 │
│  │  - Cross-browser │      │  - Mocking       │                 │
│  │                  │      │                  │                 │
│  │  Output:         │      │  Output:         │                 │
│  │  e2e_tests.md    │      │  unit_tests.md   │                 │
│  └────────┬─────────┘      └────────┬─────────┘                 │
│           └──────────┬──────────────┘                           │
│                      ▼                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [2] Test Code Writing                                          │
│                                                                 │
│  E2E Tests (Playwright):                                        │
│  ├─ tests/e2e/auth.spec.ts                                      │
│  │   - test('user can login with valid credentials')            │
│  │   - test('user sees error with invalid password')            │
│  │   - test('user can register new account')                    │
│  │                                                              │
│  ├─ tests/e2e/navigation.spec.ts                                │
│  │   - test('user can navigate between pages')                  │
│  │                                                              │
│  └─ playwright.config.ts (config)                               │
│      - browsers: ['chromium', 'firefox', 'webkit']              │
│      - retries: 2                                               │
│      - timeout: 30000                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [3] Test Execution                                             │
│                                                                 │
│  [Playwright MCP or Chrome DevTools MCP]                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Chromium Tests:                                            ││
│  │  ├─ auth.spec.ts        → ✓ 3/3 passed                      ││
│  │  └─ navigation.spec.ts  → ✓ 2/2 passed                      ││
│  │                                                             ││
│  │  Firefox Tests:                                             ││
│  │  ├─ auth.spec.ts        → ✓ 3/3 passed                      ││
│  │  └─ navigation.spec.ts  → ✓ 2/2 passed                      ││
│  │                                                             ││
│  │  WebKit Tests:                                              ││
│  │  ├─ auth.spec.ts        → ✓ 3/3 passed                      ││
│  │  └─ navigation.spec.ts  → ✓ 2/2 passed                      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Coverage Report:                                               │
│  ├─ Statements: 85%                                             │
│  ├─ Branches: 78%                                               │
│  ├─ Functions: 90%                                              │
│  └─ Lines: 85%                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [4] Test Report Generation                                     │
│                                                                 │
│  stages/09-testing/outputs/                                     │
│  ├─ test_report.md                                              │
│  ├─ coverage/                                                   │
│  │   └─ lcov-report/index.html                                  │
│  └─ playwright-report/                                          │
│      └─ index.html                                              │
│                                                                 │
│  Commit:                                                        │
│  git commit -m "test(test): add E2E tests for auth flow"        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stage 10: CI/CD & Deployment Simulation

### Execution Mode: Sequential (ClaudeCode) + Headless

```
┌─────────────────────────────────────────────────────────────────┐
│  [1] CI/CD Pipeline Setup                                       │
│                                                                 │
│  GitHub Actions workflow created:                               │
│                                                                 │
│  .github/workflows/ci.yml:                                      │
│  ├─ name: CI Pipeline                                           │
│  ├─ on: [push, pull_request]                                    │
│  ├─ jobs:                                                       │
│  │   ├─ lint:                                                   │
│  │   │   └─ npm run lint                                        │
│  │   ├─ test:                                                   │
│  │   │   └─ npm run test:coverage                               │
│  │   ├─ e2e:                                                    │
│  │   │   └─ npx playwright test                                 │
│  │   └─ build:                                                  │
│  │       └─ npm run build                                       │
│  └─ needs: [lint, test, e2e]                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [2] Deployment Configuration                                   │
│                                                                 │
│  .github/workflows/deploy.yml:                                  │
│  ├─ name: Deploy to Production                                  │
│  ├─ on:                                                         │
│  │   └─ push:                                                   │
│  │       branches: [main]                                       │
│  ├─ jobs:                                                       │
│  │   └─ deploy:                                                 │
│  │       ├─ Build Docker image                                  │
│  │       ├─ Push to registry                                    │
│  │       └─ Deploy to cloud (Vercel/AWS/GCP)                    │
│  └─ environment: production                                     │
│                                                                 │
│  Environment variables:                                         │
│  ├─ PRODUCTION_URL                                              │
│  ├─ DATABASE_URL                                                │
│  └─ API_KEYS (secrets)                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [3] Headless Deployment Execution                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Pre-deployment Checks:                                     ││
│  │  ├─ [ ] All tests passing                                   ││
│  │  ├─ [ ] Build successful                                    ││
│  │  ├─ [ ] Security scan passed                                ││
│  │  └─ [ ] Environment variables set                           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Deployment process:                                            │
│  1. git tag v1.0.0                                              │
│  2. git push origin main --tags                                 │
│  3. CI Pipeline trigger                                         │
│  4. Auto-deployment start                                       │
│                                                                 │
│  Deployment status:                                             │
│  ├─ Build:  ✓ Success                                           │
│  ├─ Deploy: ✓ Success                                           │
│  └─ URL: https://my-app.vercel.app                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [4] Post-Deployment Verification                               │
│                                                                 │
│  Smoke Tests (Production):                                      │
│  ├─ Health check endpoint → ✓ 200 OK                            │
│  ├─ Login page loads → ✓ Success                                │
│  └─ API response time → ✓ < 200ms                               │
│                                                                 │
│  Monitoring setup:                                              │
│  ├─ Error tracking (Sentry)                                     │
│  ├─ Performance monitoring (Lighthouse CI)                      │
│  └─ Uptime monitoring                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  [5] Pipeline Complete                                          │
│                                                                 │
│  Final HANDOFF.md:                                              │
│  ├─ Deployment URL: https://my-app.vercel.app                   │
│  ├─ Version: v1.0.0                                             │
│  ├─ Deployed: 2024-01-27T16:00:00Z                              │
│  ├─ All checkpoints preserved                                   │
│  └─ Operations guide link                                       │
│                                                                 │
│  Commits:                                                       │
│  git commit -m "ci(deploy): configure GitHub Actions pipeline"  │
│  git tag -a v1.0.0 -m "Release v1.0.0"                          │
│                                                                 │
│  ══════════════════════════════════════════════════════════════ │
│  ║  🎉 PIPELINE COMPLETED SUCCESSFULLY                        ║ │
│  ║                                                            ║ │
│  ║  Total Stages: 10                                          ║ │
│  ║  Total Sprints: 3                                          ║ │
│  ║  Total Checkpoints: 12                                     ║ │
│  ║  Total Commits: 47                                         ║ │
│  ║                                                            ║ │
│  ║  Next: Monitor production & iterate                        ║ │
│  ══════════════════════════════════════════════════════════════ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pipeline Flow Summary

```
┌────────────────────────────────────────────────────────────────────────┐
│                     CLAUDE-SYMPHONY PIPELINE FLOW                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [01-brainstorm] ──HANDOFF──► [02-research] ──HANDOFF──►              │
│  Gemini+Claude              Claude                                     │
│  (Parallel)                 (Sequential)                               │
│       │                          │                                     │
│       │                          ▼                                     │
│       │                    [03-planning] ──HANDOFF──►                  │
│       │                    Gemini+Claude                               │
│       │                    (Parallel+Debate)                           │
│       │                          │                                     │
│       │                          ▼                                     │
│       │                    [04-ui-ux] ──HANDOFF──►                     │
│       │                    Gemini+Claude                               │
│       │                    (Parallel+Stitch)                           │
│       │                          │                                     │
│       │                          ▼                                     │
│       │                    [05-task-management] ──HANDOFF──►           │
│       │                    ClaudeCode                                  │
│       │                    (+Notion)                                   │
│       │                          │                                     │
│       │                          ▼                                     │
│       │    ┌────────────────────────────────────────┐                  │
│       │    │  [06-implementation]                   │                  │
│       │    │  ClaudeCode (Sprint Mode)              │                  │
│       │    │                                        │                  │
│       │    │  Sprint 1 → Sprint 2 → Sprint 3       │                  │
│       │    │      │          │          │          │                  │
│       │    │      └──────────┴──────────┘          │                  │
│       │    │            Smoke Tests                 │                  │
│       │    └────────────────┬───────────────────────┘                  │
│       │                     │                                          │
│       │                     ▼                                          │
│       │              [07-refactoring] ──HANDOFF──►                     │
│       │              Codex+Claude                                      │
│       │              (Parallel+Deep Dive)                              │
│       │                     │                                          │
│       │                     ▼                                          │
│       │              [08-qa] ◄──loop-back (if critical bug)            │
│       │              ClaudeCode                                        │
│       │                     │                                          │
│       │                     ▼                                          │
│       │              [09-testing]                                      │
│       │              Codex+Claude                                      │
│       │              (Parallel+Playwright)                             │
│       │                     │                                          │
│       │                     ▼                                          │
│       │              [10-deployment]                                   │
│       │              ClaudeCode                                        │
│       │              (Headless)                                        │
│       │                     │                                          │
│       │                     ▼                                          │
│       │              ✅ PRODUCTION                                     │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  Legend:                                                               │
│  ──HANDOFF──►  Stage transition with HANDOFF.md                        │
│  ◄──loop-back  Backward jump for bug fixes                             │
│  (Parallel)    Multiple AI models in parallel                          │
│  (Sequential)  Single AI model                                         │
│  (+Notion)     Notion MCP integration                                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Key Automation Points

| Automation | Trigger | Action |
|------------|---------|--------|
| **Checkpoint** | 5 tasks complete | Save to `state/checkpoints/` |
| **HANDOFF** | Stage complete | Auto-extract and generate |
| **Git Commit** | Task complete | Conventional Commit |
| **Sprint Transition** | `/next` | Sprint N → N+1 |
| **Stage Transition** | All Sprints complete | Stage N → N+1 |
| **Loop-back** | Critical Bug | Stage 08 → Stage 06 |
| **Fallback** | AI failure | Gemini/Codex → ClaudeCode |
| **Synthesis** | Parallel complete | Multi-output integration |

---

## Related Documentation

- [Testing Guide](./testing-guide.md) - Comprehensive testing instructions
- [Sample Project Brief](../template/stages/01-brainstorm/inputs/project_brief_sample.md) - Example project brief
