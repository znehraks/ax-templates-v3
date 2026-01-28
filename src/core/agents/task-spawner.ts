/**
 * Task Tool-based agent spawner
 * Replaces Agent SDK wrapper with Claude Code native Task tool
 */
import { AgentRegistry } from './registry.js';
import type { AgentContext, AgentResult, AgentDefinition } from './types.js';
import { logInfo, logError, logWarning } from '../../utils/logger.js';

/**
 * Spawn agent using Claude Code's Task tool
 *
 * Note: This implementation demonstrates the architecture for Task tool integration.
 * In production, the actual Task tool call will be executed through Claude Code's
 * native runtime environment.
 */
export async function spawnAgent(
  agentName: string,
  context: AgentContext,
  mode: 'foreground' | 'background' = 'foreground'
): Promise<AgentResult> {
  const startTime = Date.now();

  try {
    // Load agent definition from registry
    const registry = new AgentRegistry(context.projectRoot);
    const agentDef = await registry.loadAgent(agentName);

    // Build prompt with context injection
    const prompt = buildPromptWithContext(agentDef, context);

    logInfo(`Spawning ${mode} agent: ${agentName}`);

    // In a real implementation, this would call Claude Code's Task tool directly
    // For now, we simulate the behavior with a placeholder
    const taskResult = await executeTaskTool({
      subagent_type: agentName,
      prompt,
      description: agentDef.description,
      run_in_background: mode === 'background',
      model: mapModelName(agentDef.model),
    });

    const duration = Date.now() - startTime;
    logInfo(`Agent ${agentName} completed in ${duration}ms`);

    return parseAgentResult(taskResult, mode, duration);
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`Agent ${agentName} failed after ${duration}ms: ${error}`);
    return {
      success: false,
      mode,
      errors: [String(error)],
    };
  }
}

/**
 * Build prompt with injected context variables
 */
function buildPromptWithContext(agentDef: AgentDefinition, context: AgentContext): string {
  let prompt = agentDef.prompt;

  // Replace context variables
  if (context.stage !== undefined) {
    prompt = prompt.replace(/\{\{STAGE_ID\}\}/g, context.stage);
  }
  if (context.projectRoot !== undefined) {
    prompt = prompt.replace(/\{\{PROJECT_ROOT\}\}/g, context.projectRoot);
  }

  // Add custom context data
  if (context.data && Object.keys(context.data).length > 0) {
    prompt += '\n\n## Context Data\n';
    for (const [key, value] of Object.entries(context.data)) {
      prompt += `\n**${key}**: ${JSON.stringify(value, null, 2)}`;
    }
  }

  return prompt;
}

/**
 * Map agent model names to Task tool model identifiers
 */
function mapModelName(model?: string): string | undefined {
  if (!model || model === 'inherit') {
    return undefined;
  }

  const modelMap: Record<string, string> = {
    'sonnet': 'sonnet',
    'opus': 'opus',
    'haiku': 'haiku',
  };

  return modelMap[model] || model;
}

/**
 * Parse Task tool result into AgentResult
 */
function parseAgentResult(taskResult: any, mode: string, duration: number): AgentResult {
  return {
    success: taskResult.success || false,
    mode: mode as 'foreground' | 'background',
    result: taskResult.output,
    agentId: taskResult.task_id,
    summary: {
      duration_ms: duration,
      num_turns: taskResult.num_turns || 0,
      total_cost_usd: taskResult.total_cost_usd || 0,
    },
  };
}

/**
 * Execute Task tool (placeholder implementation)
 *
 * This is a placeholder that demonstrates the interface for Task tool integration.
 * In production, this would be replaced with actual Task tool execution through
 * Claude Code's runtime environment.
 *
 * The Task tool is available in Claude Code's runtime and would be called via
 * the appropriate API mechanism provided by the platform.
 */
async function executeTaskTool(params: {
  subagent_type: string;
  prompt: string;
  description: string;
  run_in_background: boolean;
  model?: string;
}): Promise<any> {
  logWarning('Task tool placeholder - In production, this will use Claude Code\'s native Task tool');

  // For now, return a mock success result
  // In production, this would execute the actual Task tool call
  return {
    success: true,
    output: JSON.stringify({
      stage: 'validation',
      timestamp: new Date().toISOString(),
      totalChecks: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      score: 1.0,
      checks: [],
    }),
    task_id: `${params.subagent_type}-${Date.now()}`,
    num_turns: 1,
    total_cost_usd: 0,
  };
}
