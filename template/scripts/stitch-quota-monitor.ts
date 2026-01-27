#!/usr/bin/env npx tsx
/**
 * Stitch Quota Monitor
 * Tracks Google Stitch MCP usage for claude-symphony
 *
 * Usage:
 *   npx tsx template/scripts/stitch-quota-monitor.ts [command] [options]
 *
 * Commands:
 *   status              Show quota status (default)
 *   increment [mode]    Increment usage (standard|experimental)
 *   remaining           Show remaining quota
 *   json                Output raw JSON
 *   history             Show usage history
 *   reset               Reset current month usage
 *   help                Show this help
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

// Configuration
const USAGE_FILE = 'state/stitch_usage.json';
const QUOTA_STANDARD = 350;
const QUOTA_EXPERIMENTAL = 50;
const WARNING_THRESHOLD = 80;

interface HistoryEntry {
  month: string;
  standard: number;
  experimental: number;
}

interface UsageData {
  standard: number;
  experimental: number;
  month: string;
  history: HistoryEntry[];
}

function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

async function ensureDirectory(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

function getDefaultUsageData(): UsageData {
  return {
    standard: 0,
    experimental: 0,
    month: getCurrentMonth(),
    history: [],
  };
}

async function readUsageFile(): Promise<UsageData> {
  try {
    const content = await fs.readFile(USAGE_FILE, 'utf-8');
    return JSON.parse(content) as UsageData;
  } catch {
    return getDefaultUsageData();
  }
}

async function writeUsageFile(data: UsageData): Promise<void> {
  await ensureDirectory(USAGE_FILE);
  await fs.writeFile(USAGE_FILE, JSON.stringify(data, null, 2));
}

async function initializeUsage(): Promise<void> {
  const data = getDefaultUsageData();
  await writeUsageFile(data);
}

async function checkMonthlyReset(): Promise<UsageData> {
  let data = await readUsageFile();
  const currentMonth = getCurrentMonth();

  if (data.month !== currentMonth) {
    // Archive previous month's usage
    if (data.month) {
      data.history.push({
        month: data.month,
        standard: data.standard,
        experimental: data.experimental,
      });
    }

    // Reset for new month
    data.standard = 0;
    data.experimental = 0;
    data.month = currentMonth;

    await writeUsageFile(data);
    console.log(chalk.yellow('Monthly quota reset. Previous usage archived.'));
  }

  return data;
}

function renderProgressBar(percent: number, width: number = 20): string {
  const filled = Math.min(Math.floor(percent / (100 / width)), width);
  const bar = '#'.repeat(filled) + '-'.repeat(width - filled);
  return `[${bar}]`;
}

async function displayStatus(): Promise<void> {
  const data = await checkMonthlyReset();

  const stdPercent = Math.floor((data.standard * 100) / QUOTA_STANDARD);
  const expPercent = Math.floor((data.experimental * 100) / QUOTA_EXPERIMENTAL);

  console.log(chalk.blue('=== Stitch MCP Quota Status ==='));
  console.log('');

  // Standard quota
  const stdColor = stdPercent >= WARNING_THRESHOLD ? chalk.red : stdPercent >= 60 ? chalk.yellow : chalk.green;
  console.log(`Standard:     ${data.standard} / ${QUOTA_STANDARD} (${stdPercent}%)`);
  console.log(`              ${stdColor(renderProgressBar(stdPercent))}`);

  console.log('');

  // Experimental quota
  const expColor = expPercent >= WARNING_THRESHOLD ? chalk.red : expPercent >= 60 ? chalk.yellow : chalk.green;
  console.log(`Experimental: ${data.experimental} / ${QUOTA_EXPERIMENTAL} (${expPercent}%)`);
  console.log(`              ${expColor(renderProgressBar(expPercent))}`);

  console.log('');

  // Warnings
  if (stdPercent >= WARNING_THRESHOLD) {
    console.log(chalk.red(`WARNING: Standard quota at ${stdPercent}%. Consider using fallback.`));
  }
  if (expPercent >= WARNING_THRESHOLD) {
    console.log(chalk.red(`WARNING: Experimental quota at ${expPercent}%. Consider using fallback.`));
  }

  console.log('');
  console.log('Reset date: 1st of next month');
}

async function incrementUsage(mode: 'standard' | 'experimental' = 'standard'): Promise<void> {
  if (mode !== 'standard' && mode !== 'experimental') {
    console.error(chalk.red("ERROR: Invalid mode. Use 'standard' or 'experimental'."));
    process.exit(1);
  }

  const data = await checkMonthlyReset();
  data[mode] += 1;
  await writeUsageFile(data);

  const limit = mode === 'standard' ? QUOTA_STANDARD : QUOTA_EXPERIMENTAL;
  const percent = Math.floor((data[mode] * 100) / limit);

  console.log(`Stitch ${mode} usage: ${data[mode]} / ${limit} (${percent}%)`);

  if (percent >= WARNING_THRESHOLD) {
    console.log(chalk.yellow('WARNING: Approaching quota limit!'));
  }

  if (data[mode] >= limit) {
    console.error(chalk.red('ERROR: Quota exceeded! Fallback to Figma MCP recommended.'));
    process.exit(1);
  }
}

async function outputJson(): Promise<void> {
  const data = await checkMonthlyReset();
  console.log(JSON.stringify(data, null, 2));
}

async function checkRemaining(): Promise<void> {
  const data = await checkMonthlyReset();

  const stdRemaining = QUOTA_STANDARD - data.standard;
  const expRemaining = QUOTA_EXPERIMENTAL - data.experimental;

  console.log('Remaining quota:');
  console.log(`  Standard:     ${stdRemaining} requests`);
  console.log(`  Experimental: ${expRemaining} requests`);
}

async function showHistory(): Promise<void> {
  const data = await checkMonthlyReset();

  console.log(chalk.blue('=== Usage History ==='));

  if (data.history.length === 0) {
    console.log('  No history available');
    return;
  }

  for (const entry of data.history) {
    console.log(`  ${entry.month}: Standard=${entry.standard}, Experimental=${entry.experimental}`);
  }
}

function showHelp(): void {
  console.log('Stitch Quota Monitor');
  console.log('');
  console.log('Usage: npx tsx stitch-quota-monitor.ts [command] [options]');
  console.log('');
  console.log('Commands:');
  console.log('  status              Show quota status (default)');
  console.log('  increment [mode]    Increment usage (standard|experimental)');
  console.log('  remaining           Show remaining quota');
  console.log('  json                Output raw JSON');
  console.log('  history             Show usage history');
  console.log('  reset               Reset current month usage');
  console.log('  help                Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  npx tsx stitch-quota-monitor.ts                        # Show status');
  console.log('  npx tsx stitch-quota-monitor.ts increment standard     # Increment standard usage');
  console.log('  npx tsx stitch-quota-monitor.ts increment experimental # Increment experimental usage');
  console.log('  npx tsx stitch-quota-monitor.ts remaining              # Check remaining quota');
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  switch (command) {
    case 'status':
    case '':
      await displayStatus();
      break;

    case 'increment':
      const mode = (args[1] || 'standard') as 'standard' | 'experimental';
      await incrementUsage(mode);
      break;

    case 'json':
      await outputJson();
      break;

    case 'remaining':
      await checkRemaining();
      break;

    case 'history':
      await showHistory();
      break;

    case 'reset':
      await initializeUsage();
      console.log('Usage reset to 0.');
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    default:
      console.error(chalk.red(`Unknown command: ${command}`));
      console.error("Run with 'help' for usage.");
      process.exit(1);
  }
}

// CLI entry point
main().catch((error: Error) => {
  console.error(chalk.red(`ERROR: ${error.message}`));
  process.exit(1);
});
