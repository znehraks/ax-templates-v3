# Claude Symphony Hooks System

Hooks are automated triggers that spawn sub-agents to perform specialized tasks without consuming your main session's context.

## Available Hooks

| Hook | Trigger | Agent | Impact |
|------|---------|-------|--------|
| **stage-transition-hook** | `/next` command | handoff-generator, output-synthesis, validation | 0% context (isolated) |
| **auto-checkpoint-hook** | Tasks/files/time triggers | checkpoint-manager | 0% context (background) |
| **validation-hook** | `/validate`, stage completion | validation | 0% context (isolated) |

## How Hooks Work

```
User Action
    ↓
Hook Triggered
    ↓
Sub-Agent Spawned (Isolated Context)
    ↓
Agent Performs Task
    ↓
Results Returned
    ↓
Main Session Continues (Context Preserved)
```

## Key Benefits

### 1. Context Preservation
Hooks run agents in separate contexts, preserving your main session's context window.

**Example**:
```
Your session: 45% context remaining
/next → stage-transition-hook triggers
  ├─ handoff-generator-agent runs (separate context)
  ├─ validation-agent runs (separate context)
  └─ Results returned
Your session: Still 45% remaining! ✅
```

### 2. Automation
Hooks eliminate manual repetitive tasks:
- No need to manually run `/handoff` before `/next`
- Automatic checkpoints at key moments
- Automatic validation before stage transitions

### 3. Consistency
Hooks ensure best practices are always followed:
- Every stage transition has a HANDOFF
- Important work is automatically checkpointed
- Outputs are validated before moving forward

## Hook Configuration

All hooks can be configured in `config/hooks/`:

```yaml
# config/hooks/stage_transition.yaml
enabled: true
agents:
  handoff_generator:
    enabled: true
  output_synthesis:
    enabled: true
  validation:
    enabled: true
```

## Disable Hooks

### Temporary (Single Use)
```bash
/next --skip-hooks
/validate --skip-hooks
```

### Permanent (Session)
```bash
/config hooks disable
```

### Re-enable
```bash
/config hooks enable
```

## Hook Lifecycle

### Stage Transition Hook
```
User: /next

1. Check stage completion ✓
2. Spawn output-synthesis-agent (if parallel stage)
3. Spawn handoff-generator-agent
4. Spawn validation-agent (next stage requirements)
5. All agents complete
6. Transition to next stage
```

### Auto-Checkpoint Hook
```
Background Monitoring

Conditions checked every 30 seconds:
├─ Tasks completed ≥ 5? → Checkpoint
├─ Lines changed ≥ 100? → Checkpoint
├─ Time elapsed ≥ 30min? → Checkpoint
└─ Destructive op detected? → Immediate checkpoint

Agent runs in background (non-blocking)
```

### Validation Hook
```
User: /validate

1. Load stage config
2. Spawn validation-agent
3. Agent checks files, runs commands, scores quality
4. Results displayed
5. Save report to state/validations/
```

## Performance Impact

| Hook | Average Time | Blocking | Context Impact |
|------|-------------|----------|----------------|
| stage-transition | 30-60s | Yes | 0% |
| auto-checkpoint | 5-10s | No | 0% |
| validation | 30-60s | Yes (on /next) | 0% |

## Error Handling

All hooks have fallback strategies:
- **stage-transition**: Falls back to legacy bash scripts
- **auto-checkpoint**: Logs error, continues work
- **validation**: Falls back to basic file checks

Hooks are designed to enhance your workflow, not block it.

## Advanced Usage

### Custom Hook Triggers

You can manually trigger hook agents:

```bash
# Manual handoff generation
/handoff

# Manual checkpoint
/checkpoint

# Manual validation
/validate

# Manual synthesis
/synthesize
```

### Hook Debugging

```bash
# View hook execution log
cat state/hooks/execution.log

# View last hook results
cat state/hooks/last_execution.json
```

## Related Documentation

- `stage-transition-hook.md` - Detailed stage transition logic
- `auto-checkpoint-hook.md` - Checkpoint trigger conditions
- `validation-hook.md` - Validation rules by stage
- `../agents/*/CLAUDE.md` - Individual agent instructions
