# Claude-Symphony Testing Guide

Comprehensive testing guide for the 10-stage pipeline workflow.

## Table of Contents

- [Quick Start](#quick-start)
- [MCP Server Reference](#mcp-server-reference)
- [Stage-by-Stage Testing](#stage-by-stage-testing)
- [Advanced Testing Scenarios](#advanced-testing-scenarios)
- [Troubleshooting](#troubleshooting)
- [Glossary](#glossary)

---

## Quick Start

### Prerequisites

```bash
# Check required tools
which claude && echo "✓ Claude CLI"
which node && echo "✓ Node.js"
which npm && echo "✓ npm"
which tmux && echo "✓ tmux"

# Optional AI CLIs (fallback to Claude if missing)
which gemini || echo "⚠ Gemini CLI not found (will use Claude)"
which codex || echo "⚠ Codex CLI not found (will use Claude)"

# Check MCP servers
claude mcp list
```

### 5-Minute Quick Test

```bash
# Step 1: Create test project
npx claude-symphony simplenotes-test
cd simplenotes-test

# Step 2: Use sample project brief
cp template/stages/01-brainstorm/inputs/project_brief_sample.md \
   stages/01-brainstorm/inputs/project_brief.md

# Step 3: Run first stage
/run-stage 01-brainstorm

# Step 4: Verify output
ls stages/01-brainstorm/outputs/
cat stages/01-brainstorm/outputs/ideas.md | head -30

# Success indicators:
# ✓ ideas.md file exists
# ✓ Contains 5+ ideas
# ✓ state/progress.json updated
```

---

## MCP Server Reference

### MCP Servers by Stage

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
Search Chain:
  Context7 → Exa Search → web_search (built-in)

UI Generation Chain (Stage 04):
  Stitch MCP → Figma MCP → Claude Vision → Manual Wireframes

Browser Automation Chain:
  Playwright MCP → Chrome DevTools MCP

Task Management Chain:
  Notion MCP → Local JSON (state/tasks.json)
```

### Stitch MCP Commands (Stage 04)

| Command | Description | Quota Cost |
|---------|-------------|------------|
| `/stitch` | Check status and quota | 0 |
| `/stitch dna` | Extract Design DNA from moodboard | 1 |
| `/stitch generate "..."` | Text-to-UI generation | 1 |
| `/stitch image <path>` | Sketch-to-UI conversion | 1 |
| `/stitch variants N` | Generate N design variants | N |
| `/stitch export [format]` | Export to Figma/HTML | 0 |
| `/stitch quota` | Check usage limits | 0 |

**Quota Limits**: 350/month (standard), 50/month (experimental)

---

## Stage-by-Stage Testing

### Stage 01: Brainstorming

**Mode**: Parallel (Gemini + ClaudeCode)

```bash
# Run stage
/run-stage 01-brainstorm

# Verification checklist
□ tmux session created (symphony-gemini)
□ state/collaborations/01-brainstorm/ contains:
  └─ output_gemini.md
  └─ output_claudecode.md
  └─ execution_summary.md
□ /synthesize creates merged output
□ stages/01-brainstorm/outputs/ideas.md has 5+ ideas
□ HANDOFF.md generated with AI call log
□ state/progress.json updated
```

### Stage 02: Research

**Mode**: Sequential (Claude) + Plan Mode

**MCPs**: Context7, Exa Search

```bash
# Run stage
/next  # or /run-stage 02-research

# Verification checklist
□ Context7 MCP queries logged
□ Exa Search MCP queries logged
□ stages/02-research/outputs/:
  └─ research_report.md
  └─ competitor_analysis.md
  └─ tech_recommendations.md
□ HANDOFF.md generated
```

### Stage 03: Planning

**Mode**: Parallel (Gemini + ClaudeCode) + Debate Mode

```bash
# Run stage
/next

# Verification checklist
□ Parallel execution confirmed
□ Debate/discussion logged (if debate mode)
□ stages/03-planning/outputs/:
  └─ architecture.md
  └─ tech_stack.md
  └─ data_model.md
  └─ api_design.md
□ Fork decision point offered (optional)
□ HANDOFF.md generated
```

### Stage 04: UI/UX Planning

**Mode**: Parallel (Gemini + ClaudeCode) + Stitch MCP

```bash
# Run stage
/next

# Moodboard collection (optional)
/moodboard
/moodboard add figma <url>  # If Figma file available

# Stitch MCP workflow
/stitch dna                          # Extract Design DNA
/stitch generate "Dashboard with..."  # Generate UI
/stitch variants 3                    # Create alternatives
/stitch export both                   # Export files

# Verification checklist
□ /stitch quota shows usage
□ outputs/design_dna.json created
□ outputs/stitch_generated/ directory exists
□ outputs/stitch_exports/ created (if exported)
□ stages/04-ui-ux/outputs/:
  └─ wireframes.md
  └─ component_library.md
  └─ user_flows.md
  └─ design_system.md
□ HANDOFF.md includes design tokens
```

### Stage 05: Task Management

**Mode**: Sequential (ClaudeCode) + Notion Integration

```bash
# Run stage
/next

# Requirements refinement
/refine
/refine --validate  # INVEST criteria check

# Verification checklist
□ Epic → Feature → Task breakdown complete
□ INVEST validation passed
□ stages/05-task-management/outputs/sprint_plan.md
□ Notion sync (if enabled) or state/tasks.json created
□ Sprint 1, 2, 3 tasks defined
□ HANDOFF.md generated
```

### Stage 06: Implementation

**Mode**: Sequential (ClaudeCode) + Sprint Mode + Sandbox

**MCP**: Context7

```bash
# Run stage
/next

# Sprint management
/sprint              # View current sprint
/sprint tasks        # List sprint tasks
/config sprint status

# Per-sprint workflow
# [Implement tasks]
/sprint complete     # Mark sprint done
/next               # Move to next sprint (not stage!)

# After all sprints
/next --stage       # Force stage transition

# Verification checklist
□ [project]/src/ directory created
□ Components implemented
□ Auto-checkpoint every 5 tasks
□ Smoke tests pass per sprint:
  - npm run dev (server starts)
  - npm run lint (passes)
  - npm run typecheck (passes)
□ Git commits with conventional format
□ All sprints complete → HANDOFF.md
```

### Stage 07: Refactoring

**Mode**: Parallel (Codex + ClaudeCode) + Deep Dive

**MCP**: Serena MCP

```bash
# Run stage
/next --stage

# Verification checklist
□ Parallel analysis:
  └─ output_codex.md (Codex analysis)
  └─ output_claudecode.md (Claude analysis)
□ /synthesize merges analysis
□ Refactoring priorities (High/Medium/Low)
□ Checkpoint created before refactoring
□ Code improvements applied
□ Regression tests pass: npm run test
□ stages/07-refactoring/outputs/refactoring_report.md
□ HANDOFF.md with changes summary
```

### Stage 08: QA

**Mode**: Sequential (ClaudeCode) + Plan Mode + Sandbox

**MCP**: Notion (bug tracking)

```bash
# Run stage
/next

# Verification checklist
□ QA checklist auto-generated
□ Automated tests: npm run test
□ Coverage ≥ 80%
□ Bugs found → fixed → committed
□ stages/08-qa/outputs/qa_report.md
□ Test gates pass

# Loop-back (if critical bug)
/goto 06-implementation --reason "Critical bug: ..."
```

### Stage 09: Testing & E2E

**Mode**: Parallel (Codex + ClaudeCode) + Playwright MCP

```bash
# Run stage
/next

# Playwright MCP commands
mcp__playwright__browser_navigate --url "http://localhost:3000"
mcp__playwright__browser_fill_form --selector "#form" --values '{"field": "value"}'
mcp__playwright__browser_click --selector "button[type=submit]"
mcp__playwright__browser_take_screenshot --path "screenshot.png"

# Verification checklist
□ Parallel test design:
  └─ output_codex.md (E2E tests)
  └─ output_claudecode.md (Unit tests)
□ tests/e2e/*.spec.ts files created
□ Cross-browser tests pass (Chromium, Firefox, WebKit)
□ Coverage ≥ 80%
□ stages/09-testing/outputs/:
  └─ test_report.md
  └─ playwright-report/
  └─ coverage/
□ HANDOFF.md with test summary
```

### Stage 10: CI/CD & Deployment

**Mode**: Sequential (ClaudeCode) + Headless

```bash
# Run stage
/next

# Verification checklist
□ .github/workflows/ci.yml created
□ .github/workflows/deploy.yml created
□ Pre-deployment checks pass
□ git tag v1.0.0 created
□ stages/10-deployment/outputs/deployment_guide.md
□ Final HANDOFF.md generated

# Deploy (optional)
git push origin main --tags
```

---

## Advanced Testing Scenarios

### A. Parallel AI Execution

```bash
# Manual parallel execution
/collaborate --mode parallel --models gemini,claudecode --task "Generate ideas"

# Verify parallel outputs
ls state/collaborations/01-brainstorm/
# Expected: output_gemini.md, output_claudecode.md, execution_summary.md

# Synthesis
/synthesize --verbose
# Check quality score ≥ 0.8
```

### B. MCP Fallback Testing

```bash
# Test H1: Context7 unavailable
# Simulate by disconnecting MCP
# Expected: Auto-fallback to Exa Search
cat state/fallback_log.json

# Test I1: Stitch quota exhausted
/stitch quota  # Check remaining
# If low, trigger quota exhaustion
# Expected: Fallback to Figma MCP
```

### C. Checkpoint & Rollback

```bash
# Create checkpoint
/checkpoint --description "Before risky change"

# Verify checkpoint
ls state/checkpoints/

# Rollback
/restore --list
/restore checkpoint_20240127_103000
/restore checkpoint_id --partial --files "src/*"
```

### D. Sprint Iteration (Stage 06)

```bash
# Check sprint config
/config sprint status

# Sprint workflow
/sprint              # Current status
/sprint tasks        # Task list
# [Complete tasks]
/sprint complete     # Finish sprint
/next               # Move to next sprint

# Force stage transition
/next --stage
```

### E. Loop-back Testing

```bash
# From Stage 08 (QA)
/goto 06-implementation --reason "Critical bug found"

# Verify loop-back
cat state/loopback_history.json

# Return to QA after fix
/next  # Progress through stages again
```

---

## Troubleshooting

### Common Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| MCP not found | "MCP server not connected" | Run `claude mcp list` and verify server |
| Stitch quota | "Quota exhausted" | Check `/stitch quota`, use Figma fallback |
| Tmux session | "Session not found" | Run `tmux ls` to check session status |
| Synthesis fails | Score < 0.8 | Use `/synthesize --force` or re-run parallel |
| Sprint blocked | Test gates fail | Fix tests, then `/sprint complete` |
| HANDOFF missing | Stage transition fails | Run `/handoff` manually |

### Error Recovery

```bash
# Reset progress
# WARNING: This clears all progress!
rm state/progress.json
# Restart from stage 01

# Recover from checkpoint
/restore --list
/restore <checkpoint_id>

# Force stage skip (not recommended)
# Edit state/progress.json manually
```

### Debug Commands

```bash
# View logs
cat state/fallback_log.json
cat state/loopback_history.json

# Check MCP status
claude mcp list
claude mcp status <server_name>

# View tmux sessions
tmux ls
tmux attach -t symphony-gemini

# Check progress
cat state/progress.json | jq '.'
```

---

## Glossary

| Term | Description | Example |
|------|-------------|---------|
| **Stage** | One phase of the 10-step pipeline | 01-brainstorm, 06-implementation |
| **MCP** | Model Context Protocol - AI plugin system | Context7, Stitch, Playwright |
| **HANDOFF.md** | Context transfer file between stages | Contains completed tasks, decisions |
| **Fallback** | Automatic switch when primary service fails | Context7 fails → use Exa |
| **Sprint** | Iteration unit within Stage 06 | Sprint 1, 2, 3 |
| **Synthesis** | Merging parallel AI outputs | Gemini + Claude results combined |
| **Checkpoint** | State snapshot for rollback | Saved restore point |
| **Loop-back** | Return to previous stage | QA → Implementation for bug fix |
| **INVEST** | Task quality criteria | Independent, Negotiable, Valuable, Estimable, Small, Testable |
| **Smoke Test** | Quick verification tests | Dev server starts, lint passes |
| **Test Gate** | Required tests before proceeding | Must pass to move to next sprint |
| **Design DNA** | Extracted design tokens from moodboard | Colors, typography, spacing |

---

## Test Coverage Summary

| Test Area | Coverage | Status |
|-----------|----------|--------|
| Happy Path (10 Stages) | 100% | ✅ |
| Parallel Execution | 100% | ✅ |
| MCP Basic Usage | 100% | ✅ |
| Sprint Iteration | 100% | ✅ |
| Checkpoint/Rollback | 50% | 🟡 |
| Loop-back | 50% | 🟡 |
| MCP Failure Handling | 50% | 🟡 |
| Quota Management | 67% | 🟡 |
| Edge Cases | 30% | 🟡 |

---

## Quick Reference Card

### Essential Commands

```bash
# Stage Navigation
/run-stage 01-brainstorm    # Run specific stage
/next                       # Next sprint or stage
/next --stage               # Force stage transition
/goto <stage>               # Loop-back to stage

# Sprint Management
/sprint                     # Current sprint status
/sprint tasks               # List tasks
/sprint complete            # Mark complete

# Checkpoints
/checkpoint                 # Create checkpoint
/restore --list             # List checkpoints
/restore <id>               # Restore checkpoint

# Multi-AI
/collaborate --mode parallel
/synthesize --verbose

# Stitch MCP
/stitch dna
/stitch generate "..."
/stitch quota

# Debugging
/status                     # Pipeline status
/context                    # Token usage
/validate                   # Output validation
```

### File Locations

| File | Path | Description |
|------|------|-------------|
| Project Brief | `stages/01-brainstorm/inputs/project_brief.md` | Initial requirements |
| Progress | `state/progress.json` | Pipeline state |
| Checkpoints | `state/checkpoints/` | Saved states |
| HANDOFF | `stages/XX-stage/HANDOFF.md` | Stage transitions |
| Outputs | `stages/XX-stage/outputs/` | Stage deliverables |
| Fallback Log | `state/fallback_log.json` | MCP fallback history |
