# /test

Start the 09-testing stage directly.

## CRITICAL: Parallel Execution Required

> **This stage MUST use Codex + ClaudeCode parallel execution.**
>
> Codex provides comprehensive test generation while ClaudeCode provides E2E testing with Playwright.
> Both perspectives ensure thorough test coverage across all test types.

**Mandatory Steps:**
1. Call `/codex` with testing prompt (Primary - Test Generation)
2. ClaudeCode E2E testing (Secondary - Playwright Integration)
3. Synthesize both outputs into final test results

## Usage
```
/test [test-type]
```

## Stage Information

| Item | Value |
|------|-------|
| Stage | 09-testing |
| AI Model | **Codex + ClaudeCode (Parallel)** |
| Execution Mode | Sandbox + Playwright MCP |
| Checkpoint | Optional |

## Parallel Execution Protocol

```
┌─────────────────────────────────────────────────┐
│              09-testing Stage                   │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌─────────────┐     ┌─────────────┐          │
│   │    Codex    │     │ ClaudeCode  │          │
│   │  (Primary)  │     │ (Secondary) │          │
│   │    Test     │     │    E2E &    │          │
│   │ Generation  │     │ Playwright  │          │
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
│    test-results.md + coverage-report.html      │
└─────────────────────────────────────────────────┘
```

## Execution Steps

### Step 1: Codex CLI Call (Primary - Test Generation)

**MUST execute Codex CLI for comprehensive test generation:**

```bash
/codex "Analyze stages/06-implementation/outputs/src/ and generate comprehensive tests: $TEST_TYPE"
```

- **Input**: `stages/06-implementation/outputs/src/`, `tests/`, `qa-report.md`
- **Output**: `stages/09-testing/outputs/output_codex.md`
- **Focus**: Unit tests, integration tests, edge cases, regression tests

### Step 2: ClaudeCode E2E Testing (Secondary)

After Codex output is generated, ClaudeCode performs E2E testing:

- **Input**: Codex analysis + application
- **Output**: `stages/09-testing/outputs/output_claudecode.md`
- **Focus**: E2E flows, Playwright automation, visual testing

### Step 3: Synthesis (ClaudeCode as Synthesizer)

Combine both outputs into final test suite:

```bash
/synthesize
```

- **Inputs**: `output_codex.md` + `output_claudecode.md`
- **Output**: `test-results.md`, `e2e-results/`, `coverage/`

## Actions

1. **Prerequisite Check**
   - 08-qa completion status
   - qa-report.md exists

2. **Execute Testing**
   - Codex CLI call (test generation) - **REQUIRED**
   - ClaudeCode parallel execution (E2E with Playwright)
   - Integration tests
   - Regression tests

3. **Output Generation**
   - test-results.md - Test results
   - coverage-report.html - Coverage

## Execution

```bash
scripts/run-stage.sh 09-testing "$ARGUMENTS"
```

## Input Files

- `stages/06-implementation/outputs/src/`
- `stages/06-implementation/outputs/tests/`
- `stages/08-qa/outputs/qa-report.md`

## Output Files

| File | Description |
|------|-------------|
| `outputs/output_codex.md` | Codex test generation |
| `outputs/output_claudecode.md` | ClaudeCode E2E results |
| `outputs/test-results.md` | Final test results |
| `outputs/e2e-results/` | E2E test results |
| `outputs/coverage/` | Coverage reports |

## Test Types

| Type | Tool | Description |
|------|------|-------------|
| Unit | Jest/Vitest | Unit tests |
| Integration | Testing Library | Integration tests |
| E2E | Playwright | End-to-end |
| Visual | Playwright | Screenshot comparison |

## Playwright MCP Usage

```bash
# Browser snapshot
mcp__playwright__browser_snapshot

# Screenshot
mcp__playwright__browser_take_screenshot

# Form testing
mcp__playwright__browser_fill_form
```

## Related Commands

- `/run-stage 09` - Start after prerequisite check
- `/next` - Next stage (10-deployment)
- `/qa` - Previous stage
- `/deploy` - Start deployment directly
- `/codex` - Direct Codex CLI call
- `/synthesize` - Consolidate parallel outputs

## Coverage Targets

| Metric | Target |
|--------|--------|
| Line | ≥ 80% |
| Branch | ≥ 70% |
| Function | ≥ 80% |

## Tips

- **Always call Codex CLI first** for comprehensive test generation
- E2E focuses on critical flows
- Auto-save screenshots on failure
- Run headless mode in CI
