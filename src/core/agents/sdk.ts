/**
 * Agent SDK wrapper for spawning and managing sub-agents
 * Provides simplified interface to @anthropic-ai/claude-agent-sdk
 */
import { query } from '@anthropic-ai/claude-agent-sdk';
import type {
  Options,
  SDKMessage,
  SDKResultMessage,
} from '@anthropic-ai/claude-agent-sdk';
import { logInfo, logSuccess, logError } from '../../utils/logger.js';
import { AgentRegistry } from './registry.js';
import type { AgentDefinition, AgentContext, AgentResult } from './types.js';

/**
 * Agent SDK wrapper class
 */
export class AgentSDK {
  private registry: AgentRegistry;

  constructor(projectRoot: string) {
    this.registry = new AgentRegistry(projectRoot);
  }

  /**
   * Spawn an agent (foreground or background)
   */
  async spawnAgent(
    agentName: string,
    context: AgentContext,
    mode: 'foreground' | 'background' = 'foreground'
  ): Promise<AgentResult> {
    const startTime = Date.now();

    try {
      // Load agent definition
      logInfo(`Loading agent definition: ${agentName}`);
      const agentDef = await this.registry.loadAgent(agentName);

      // Build SDK options
      const options = this.buildSDKOptions(agentDef, context);

      // Build prompt with context
      const prompt = this.buildPromptWithContext(agentDef, context);

      logInfo(`Spawning ${mode} agent: ${agentName}`);
      if (mode === 'background') {
        // Background execution - return immediately with agent ID
        const agentId = this.spawnBackgroundAgent(agentName, prompt, options);
        return {
          success: true,
          agentId,
          mode: 'background',
          message: `Agent ${agentName} running in background with ID: ${agentId}`,
        };
      } else {
        // Foreground execution - wait for result
        const result = await this.runForegroundAgent(agentName, prompt, options);
        const duration = Date.now() - startTime;

        logSuccess(`Agent ${agentName} completed in ${duration}ms`);
        return {
          success: !result.is_error,
          agentId: result.session_id,
          mode: 'foreground',
          result: result.subtype === 'success' ? result.result : undefined,
          errors: result.subtype !== 'success' ? result.errors : undefined,
          summary: {
            duration_ms: result.duration_ms,
            num_turns: result.num_turns,
            total_cost_usd: result.total_cost_usd,
          },
        };
      }
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
   * Build SDK options from agent definition and context
   */
  private buildSDKOptions(agentDef: AgentDefinition, context: AgentContext): Options {
    const options: Options = {
      cwd: context.projectRoot,
      allowedTools: agentDef.tools || ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'],
      permissionMode: agentDef.permissionMode || 'acceptEdits',
      model: this.mapModel(agentDef.model),
    };

    // Extended thinking
    if (agentDef.extendedThinking) {
      // Note: The SDK uses maxThinkingTokens to control extended thinking
      options.maxThinkingTokens = 8000; // Medium budget
    }

    // Session persistence
    if (agentDef.sessionPersistence && context.sessionId) {
      options.resume = context.sessionId;
    }

    // MCP servers
    if (agentDef.mcpServers && agentDef.mcpServers.length > 0) {
      options.mcpServers = {};
      for (const mcpName of agentDef.mcpServers) {
        // Map common MCP server names to configurations
        const mcpConfig = this.getMcpServerConfig(mcpName);
        if (mcpConfig) {
          options.mcpServers[mcpName] = mcpConfig;
        }
      }
    }

    return options;
  }

  /**
   * Map agent model names to SDK model identifiers
   */
  private mapModel(model?: string): string | undefined {
    if (!model) return undefined;

    const modelMap: Record<string, string> = {
      'sonnet': 'claude-sonnet-4-5',
      'opus': 'claude-opus-4-5',
      'haiku': 'claude-haiku-4',
      'inherit': undefined as any,
    };

    return modelMap[model] || model;
  }

  /**
   * Get MCP server configuration by name
   */
  private getMcpServerConfig(name: string): any {
    const configs: Record<string, any> = {
      serena: {
        type: 'stdio',
        command: 'npx',
        args: ['-y', '@serenaai/mcp-server'],
      },
      context7: {
        type: 'stdio',
        command: 'npx',
        args: ['-y', '@context7/mcp-server'],
      },
      playwright: {
        type: 'stdio',
        command: 'npx',
        args: ['@playwright/mcp@latest'],
      },
    };

    return configs[name];
  }

  /**
   * Build prompt with injected context
   */
  private buildPromptWithContext(agentDef: AgentDefinition, context: AgentContext): string {
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
   * Run agent in foreground and wait for result
   */
  private async runForegroundAgent(
    agentName: string,
    prompt: string,
    options: Options
  ): Promise<SDKResultMessage> {
    const messages: SDKMessage[] = [];

    for await (const message of query({ prompt, options })) {
      messages.push(message);

      // Log assistant messages in verbose mode
      if (message.type === 'assistant') {
        const content = message.message.content;
        for (const block of content) {
          if (block.type === 'text') {
            logInfo(`[${agentName}] ${block.text.slice(0, 100)}...`);
          } else if (block.type === 'tool_use') {
            logInfo(`[${agentName}] Using tool: ${block.name}`);
          }
        }
      }

      // Return result message
      if (message.type === 'result') {
        return message;
      }
    }

    throw new Error(`Agent ${agentName} completed without result message`);
  }

  /**
   * Spawn agent in background (returns immediately)
   */
  private spawnBackgroundAgent(
    agentName: string,
    prompt: string,
    options: Options
  ): string {
    const agentId = `${agentName}-${Date.now()}`;

    // Start agent in background (non-blocking)
    (async () => {
      try {
        for await (const message of query({ prompt, options })) {
          if (message.type === 'result') {
            if (message.is_error) {
              logError(`Background agent ${agentName} (${agentId}) failed`);
            } else {
              logSuccess(`Background agent ${agentName} (${agentId}) completed`);
            }
          }
        }
      } catch (error) {
        logError(`Background agent ${agentName} (${agentId}) crashed: ${error}`);
      }
    })();

    return agentId;
  }

  /**
   * Load agent definition (delegates to registry)
   */
  async loadAgent(agentName: string): Promise<AgentDefinition> {
    return this.registry.loadAgent(agentName);
  }

  /**
   * List all available agents
   */
  async listAgents(): Promise<string[]> {
    return this.registry.listAgents();
  }
}
