/**
 * Context CLI commands
 * /context status, save, list, relay functionality
 */
import path from 'path';
import { existsSync, readdirSync, statSync } from 'fs';
import { ContextManager, checkContextStatus } from '../../core/state/context.js';
import { ProgressManager } from '../../core/state/progress.js';
import { getStageName } from '../../types/stage.js';
import type { StageId } from '../../types/stage.js';
import type { ContextState } from '../../types/state.js';
import { logWarning, logError, logSuccess } from '../../utils/logger.js';

/**
 * Context command options
 */
export interface ContextCommandOptions {
  save?: boolean;
  list?: boolean;
  relay?: boolean;
  json?: boolean;
  remainingPercent?: number;
}

/**
 * Show context status
 */
export async function showContext(
  projectRoot: string,
  options: ContextCommandOptions = {}
): Promise<void> {
  const { remainingPercent = 100 } = options;

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧠 Context Status');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const result = await checkContextStatus(projectRoot, remainingPercent);

  // Visual bar
  const filled = Math.round(remainingPercent / 5);
  const empty = 20 - filled;
  const color = result.level === 'critical' ? '🔴' :
                result.level === 'action' ? '🟡' :
                result.level === 'warning' ? '🟠' : '🟢';

  console.log('');
  console.log(`  Remaining: ${remainingPercent}%`);
  console.log(`  Level:     ${result.level.toUpperCase()}`);
  console.log(`  ${color} [${'█'.repeat(filled)}${'░'.repeat(empty)}] ${remainingPercent}%`);

  // Recommendations
  console.log('');
  console.log('  Recommended Action:');
  console.log(`    ${result.recommendedAction}`);

  if (result.shouldAutoSave) {
    logWarning('Auto-save recommended!');
  }

  // Memory Relay status
  console.log('');
  console.log('  Memory Relay:');
  const globalFifo = path.join(process.env.HOME || '', '.claude/memory-relay/orchestrator/signals/relay.fifo');
  const localFifo = path.join(projectRoot, 'scripts/memory-relay/orchestrator/signals/relay.fifo');

  if (existsSync(globalFifo) || existsSync(localFifo)) {
    console.log('    ✅ Active - auto-relay enabled');
  } else {
    console.log('    ⚠️ Not running - start with claude-symphony-play');
  }

  // Recent snapshots
  const contextDir = path.join(projectRoot, 'state', 'context');
  if (existsSync(contextDir)) {
    const snapshots = readdirSync(contextDir)
      .filter(f => f.startsWith('auto-snapshot-') && f.endsWith('.md'))
      .sort()
      .reverse();

    console.log('');
    console.log('  Recent Snapshots:');
    if (snapshots.length === 0) {
      console.log('    (none)');
    } else {
      for (const snapshot of snapshots.slice(0, 3)) {
        console.log(`    • ${snapshot}`);
      }
      if (snapshots.length > 3) {
        console.log(`    ... and ${snapshots.length - 3} more`);
      }
    }
  }

  // Thresholds
  console.log('');
  console.log('  Thresholds:');
  console.log('    60% - Warning: Consider running /compact');
  console.log('    50% - Action:  Run /compact, save state');
  console.log('    40% - Critical: Generate HANDOFF.md, run /clear');

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/**
 * Save context state manually
 */
export async function saveContext(
  projectRoot: string,
  options: { remainingPercent?: number; trigger?: string } = {}
): Promise<string | null> {
  const { remainingPercent = 100, trigger = 'manual' } = options;

  // Get current stage info
  const progressManager = new ProgressManager(projectRoot);
  const progress = await progressManager.load();

  if (!progress) {
    logError('Could not load progress.json');
    return null;
  }

  const currentStage = progress.current_stage as StageId;
  const stageName = getStageName(currentStage);

  // Create context state
  const state: ContextState = {
    stageId: currentStage,
    stageName,
    remainingPercent,
    saveTrigger: trigger,
    completedTasks: [],
    currentTask: '',
    pendingTasks: [],
    majorDecisions: [],
    modifiedFiles: [],
    activeIssues: [],
  };

  // Save using ContextManager
  const contextManager = new ContextManager(projectRoot);
  const savedPath = await contextManager.saveState(state);

  if (savedPath) {
    logSuccess(`Context state saved to: ${savedPath}`);
    return savedPath;
  } else {
    logError('Failed to save context state');
    return null;
  }
}

/**
 * List all context snapshots
 */
export async function listContextSnapshots(projectRoot: string): Promise<void> {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📁 Context Snapshots');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const contextDir = path.join(projectRoot, 'state', 'context');

  if (!existsSync(contextDir)) {
    console.log('');
    console.log('  No snapshots found (directory does not exist)');
    console.log('');
    return;
  }

  const files = readdirSync(contextDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.log('');
    console.log('  No snapshots found');
    console.log('');
    return;
  }

  console.log('');

  // Group by type
  const autoSnapshots = files.filter(f => f.startsWith('auto-snapshot-'));
  const stateSnapshots = files.filter(f => f.startsWith('state_'));
  const otherFiles = files.filter(f => !f.startsWith('auto-snapshot-') && !f.startsWith('state_'));

  if (autoSnapshots.length > 0) {
    console.log('  Auto Snapshots:');
    for (const file of autoSnapshots.slice(0, 5)) {
      const filePath = path.join(contextDir, file);
      const stat = statSync(filePath);
      const size = formatFileSize(stat.size);
      console.log(`    • ${file} (${size})`);
    }
    if (autoSnapshots.length > 5) {
      console.log(`    ... and ${autoSnapshots.length - 5} more`);
    }
    console.log('');
  }

  if (stateSnapshots.length > 0) {
    console.log('  State Snapshots:');
    for (const file of stateSnapshots.slice(0, 5)) {
      const filePath = path.join(contextDir, file);
      const stat = statSync(filePath);
      const size = formatFileSize(stat.size);
      console.log(`    • ${file} (${size})`);
    }
    if (stateSnapshots.length > 5) {
      console.log(`    ... and ${stateSnapshots.length - 5} more`);
    }
    console.log('');
  }

  if (otherFiles.length > 0) {
    console.log('  Other Files:');
    for (const file of otherFiles) {
      const filePath = path.join(contextDir, file);
      const stat = statSync(filePath);
      const size = formatFileSize(stat.size);
      console.log(`    • ${file} (${size})`);
    }
    console.log('');
  }

  console.log(`  Total: ${files.length} files`);
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/**
 * Trigger Memory Relay manually
 */
export async function triggerRelay(projectRoot: string): Promise<boolean> {
  const globalFifo = path.join(process.env.HOME || '', '.claude/memory-relay/orchestrator/signals/relay.fifo');
  const localFifo = path.join(projectRoot, 'scripts/memory-relay/orchestrator/signals/relay.fifo');

  let fifoPath = '';
  if (existsSync(localFifo)) {
    fifoPath = localFifo;
  } else if (existsSync(globalFifo)) {
    fifoPath = globalFifo;
  }

  if (!fifoPath) {
    logError('Memory Relay is not running');
    console.log('');
    console.log('  Start Memory Relay with:');
    console.log('    claude-symphony-play');
    console.log('');
    return false;
  }

  // Check if we're in tmux
  if (!process.env.TMUX) {
    logError('Not in a tmux session');
    console.log('');
    console.log('  Memory Relay requires tmux. Start with:');
    console.log('    claude-symphony-play');
    console.log('');
    return false;
  }

  // Generate HANDOFF.md first
  const handoffPath = path.join(projectRoot, 'HANDOFF.md');

  // Try to run context-manager.sh if available
  const contextManagerPath = path.join(projectRoot, 'scripts', 'context-manager.sh');
  if (existsSync(contextManagerPath)) {
    const { execSync } = await import('child_process');
    try {
      execSync(`"${contextManagerPath}" --auto-compact manual`, {
        cwd: projectRoot,
        env: { ...process.env, PROJECT_ROOT: projectRoot },
      });
      logSuccess('Relay signal sent via context-manager.sh');
      return true;
    } catch (error) {
      logWarning('context-manager.sh failed, sending signal directly');
    }
  }

  // Direct signal send
  const paneId = process.env.TMUX_PANE || 'unknown';
  const signal = `RELAY_READY:${handoffPath}:${paneId}`;

  const { execSync } = await import('child_process');
  try {
    execSync(`echo "${signal}" > "${fifoPath}"`, { cwd: projectRoot });
    logSuccess('Relay signal sent');
    console.log('');
    console.log('  A new session will be started automatically.');
    console.log('  You may exit this session when ready.');
    console.log('');
    return true;
  } catch (error) {
    logError('Failed to send relay signal');
    return false;
  }
}

/**
 * Main context command handler
 */
export async function contextCommand(
  projectRoot: string,
  options: ContextCommandOptions = {}
): Promise<boolean> {
  if (options.save) {
    const result = await saveContext(projectRoot, {
      remainingPercent: options.remainingPercent,
      trigger: 'manual',
    });
    return result !== null;
  }

  if (options.list) {
    await listContextSnapshots(projectRoot);
    return true;
  }

  if (options.relay) {
    return triggerRelay(projectRoot);
  }

  // Default: show status
  await showContext(projectRoot, options);
  return true;
}

/**
 * Format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
