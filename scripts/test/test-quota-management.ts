#!/usr/bin/env tsx
/**
 * Claude-Symphony Quota Management Test
 * Tests MCP quota tracking and management (especially Stitch MCP)
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { logInfo, logSuccess, logWarning, printHeader, printSection } from '../../src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const STATE_DIR = path.join(PROJECT_ROOT, 'state');
const QUOTA_LOG = path.join(STATE_DIR, 'mcp_quota_usage.json');

// Quota limits
const QUOTA_LIMITS: Record<string, number> = {
  stitch_standard: 350, // per month
  stitch_experimental: 50, // per month
  exa_daily: 1000, // per day (example)
  context7_daily: 10000, // per day (example)
};

// Warning thresholds (percentage)
const WARNING_THRESHOLD = 80;
const CRITICAL_THRESHOLD = 95;

interface QuotaData {
  version: string;
  created_at: string;
  current_period: string;
  quotas: {
    stitch: {
      standard: { used: number; limit: number; period: string; reset_date: string };
      experimental: { used: number; limit: number; period: string; reset_date: string };
    };
    exa: { used: number; limit: number; period: string; reset_date: string };
    context7: { used: number; limit: number; period: string; reset_date: string };
  };
  history: Array<{
    timestamp: string;
    service: string;
    tier?: string;
    calls: number;
    action: string;
  }>;
}

// Print help message
function printHelp(): void {
  console.log(`
${chalk.cyan('Claude-Symphony Quota Management Test')}

${chalk.white('Usage:')} ${chalk.yellow('tsx scripts/test/test-quota-management.ts')} ${chalk.gray('[OPTIONS]')}

${chalk.white('Options:')}
    ${chalk.green('--help')}                  Show this help message
    ${chalk.green('--stitch')}                Check Stitch MCP quota
    ${chalk.green('--exa')}                   Check Exa Search quota
    ${chalk.green('--context7')}              Check Context7 quota
    ${chalk.green('--all')}                   Check all quotas
    ${chalk.green('--simulate-usage <n>')}    Simulate n quota usage
    ${chalk.green('--reset')}                 Reset quota tracking (for testing)
    ${chalk.green('--verbose')}               Verbose output

${chalk.white('Quota Limits:')}
    Stitch (Standard):      350/month
    Stitch (Experimental):  50/month
    Exa Search:             1000/day (example)
    Context7:               10000/day (example)

${chalk.white('Warning Thresholds:')}
    80% - Warning displayed
    95% - Critical warning, fallback recommended

${chalk.white('Examples:')}
    ${chalk.gray('tsx scripts/test/test-quota-management.ts')}                 # Check all quotas
    ${chalk.gray('tsx scripts/test/test-quota-management.ts --stitch')}        # Check Stitch quota
    ${chalk.gray('tsx scripts/test/test-quota-management.ts --simulate-usage 10')}   # Simulate 10 API calls
    ${chalk.gray('tsx scripts/test/test-quota-management.ts --reset')}         # Reset quota tracking
`);
}

// Initialize quota tracking file
async function initQuotaTracking(): Promise<QuotaData> {
  await fs.mkdir(STATE_DIR, { recursive: true });

  try {
    const content = await fs.readFile(QUOTA_LOG, 'utf-8');
    return JSON.parse(content) as QuotaData;
  } catch {
    // Create new quota tracking file
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentDate = new Date().toISOString().slice(0, 10);

    const data: QuotaData = {
      version: '1.0',
      created_at: new Date().toISOString(),
      current_period: currentMonth,
      quotas: {
        stitch: {
          standard: {
            used: 0,
            limit: QUOTA_LIMITS.stitch_standard,
            period: 'monthly',
            reset_date: `${currentMonth}-01`,
          },
          experimental: {
            used: 0,
            limit: QUOTA_LIMITS.stitch_experimental,
            period: 'monthly',
            reset_date: `${currentMonth}-01`,
          },
        },
        exa: {
          used: 0,
          limit: QUOTA_LIMITS.exa_daily,
          period: 'daily',
          reset_date: currentDate,
        },
        context7: {
          used: 0,
          limit: QUOTA_LIMITS.context7_daily,
          period: 'daily',
          reset_date: currentDate,
        },
      },
      history: [],
    };

    await fs.writeFile(QUOTA_LOG, JSON.stringify(data, null, 2), 'utf-8');
    logInfo(`Initialized quota tracking file: ${QUOTA_LOG}`);

    return data;
  }
}

// Get quota usage
function getQuotaUsage(
  data: QuotaData,
  service: string,
  tier?: string
): { used: number; limit: number; remaining: number } {
  if (service === 'stitch' && tier) {
    const tierData = tier === 'experimental' ? data.quotas.stitch.experimental : data.quotas.stitch.standard;
    return {
      used: tierData.used,
      limit: tierData.limit,
      remaining: tierData.limit - tierData.used,
    };
  }

  const serviceData = data.quotas[service as keyof typeof data.quotas];
  if (serviceData && 'used' in serviceData) {
    return {
      used: serviceData.used as number,
      limit: serviceData.limit as number,
      remaining: (serviceData.limit as number) - (serviceData.used as number),
    };
  }

  return { used: 0, limit: 0, remaining: 0 };
}

// Display quota status with visual bar
function displayQuotaStatus(service: string, tier: string | undefined, used: number, limit: number): void {
  const remaining = limit - used;
  const percentage = Math.round((used * 100) / limit);

  // Determine color based on percentage
  let color = chalk.green;
  let status = 'OK';
  if (percentage >= CRITICAL_THRESHOLD) {
    color = chalk.red;
    status = 'CRITICAL';
  } else if (percentage >= WARNING_THRESHOLD) {
    color = chalk.yellow;
    status = 'WARNING';
  }

  // Create progress bar
  const barWidth = 30;
  const filled = Math.round((percentage * barWidth) / 100);
  const empty = barWidth - filled;

  const bar = color('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));

  // Display
  const label = tier ? `${service} (${tier})` : service;

  console.log(`  ${chalk.blue(label)}`);
  console.log(`  [${bar}] ${percentage}% (${used}/${limit})`);
  console.log(`  Remaining: ${remaining} | Status: ${color(status)}`);
  console.log('');
}

// Check Stitch quota
async function checkStitchQuota(): Promise<void> {
  const data = await initQuotaTracking();
  logInfo('Checking Stitch MCP quota...');
  console.log('');

  // Standard tier
  const standard = getQuotaUsage(data, 'stitch', 'standard');
  displayQuotaStatus('Stitch', 'standard', standard.used, standard.limit);

  // Experimental tier
  const experimental = getQuotaUsage(data, 'stitch', 'experimental');
  displayQuotaStatus('Stitch', 'experimental', experimental.used, experimental.limit);

  // Check if fallback is needed
  if (standard.remaining <= 10) {
    console.log(chalk.red('  ⚠ WARNING: Stitch standard quota almost exhausted!'));
    console.log('  Recommended: Use Figma MCP fallback or wait for quota reset');
    console.log('');
  }
}

// Check Exa quota
async function checkExaQuota(): Promise<void> {
  const data = await initQuotaTracking();
  logInfo('Checking Exa Search quota...');
  console.log('');

  const usage = getQuotaUsage(data, 'exa');
  displayQuotaStatus('Exa Search', undefined, usage.used, usage.limit);
}

// Check Context7 quota
async function checkContext7Quota(): Promise<void> {
  const data = await initQuotaTracking();
  logInfo('Checking Context7 quota...');
  console.log('');

  const usage = getQuotaUsage(data, 'context7');
  displayQuotaStatus('Context7', undefined, usage.used, usage.limit);
}

// Check all quotas
async function checkAllQuotas(): Promise<void> {
  printHeader('Claude-Symphony Quota Management Test');

  await checkStitchQuota();
  await checkExaQuota();
  await checkContext7Quota();

  // Print summary
  printSection('Quota Tracking Info');
  console.log(`  Quota tracking file: ${QUOTA_LOG}`);
  console.log(`  Warning threshold: ${WARNING_THRESHOLD}%`);
  console.log(`  Critical threshold: ${CRITICAL_THRESHOLD}%`);
  console.log('');
}

// Simulate quota usage
async function simulateQuotaUsage(
  service: string = 'stitch',
  tier: string = 'standard',
  count: number = 1
): Promise<void> {
  logInfo(`Simulating ${count} API call(s) to ${service} (${tier})...`);

  const data = await initQuotaTracking();

  // Update quota
  if (service === 'stitch') {
    if (tier === 'experimental') {
      data.quotas.stitch.experimental.used += count;
    } else {
      data.quotas.stitch.standard.used += count;
    }
  } else if (service === 'exa') {
    data.quotas.exa.used += count;
  } else if (service === 'context7') {
    data.quotas.context7.used += count;
  }

  // Add to history
  data.history.push({
    timestamp: new Date().toISOString(),
    service,
    tier: service === 'stitch' ? tier : undefined,
    calls: count,
    action: 'simulated',
  });

  await fs.writeFile(QUOTA_LOG, JSON.stringify(data, null, 2), 'utf-8');

  const usage = getQuotaUsage(data, service, service === 'stitch' ? tier : undefined);
  console.log(`Updated ${service}.${tier}: ${usage.used}/${usage.limit}`);
  console.log('');
  console.log('Current quota status:');

  if (service === 'stitch') {
    await checkStitchQuota();
  } else {
    await checkAllQuotas();
  }
}

// Reset quota tracking
async function resetQuotaTracking(): Promise<void> {
  logWarning('Resetting quota tracking...');

  try {
    // Backup existing file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backup = `${QUOTA_LOG}.backup.${timestamp}`;
    await fs.copyFile(QUOTA_LOG, backup);
    console.log(`Backed up existing quota log to: ${backup}`);
  } catch {
    // No existing file to backup
  }

  try {
    await fs.unlink(QUOTA_LOG);
  } catch {
    // File might not exist
  }

  await initQuotaTracking();

  logSuccess('Quota tracking reset complete');
  console.log('');
  await checkAllQuotas();
}

// Parse command line arguments
function parseArgs(): {
  mode: 'all' | 'stitch' | 'exa' | 'context7' | 'simulate' | 'reset';
  service: string;
  tier: string;
  count: number;
  verbose: boolean;
} {
  const args = process.argv.slice(2);
  let mode: 'all' | 'stitch' | 'exa' | 'context7' | 'simulate' | 'reset' = 'all';
  let service = 'stitch';
  let tier = 'standard';
  let count = 1;
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--help':
        printHelp();
        process.exit(0);
      case '--stitch':
        mode = 'stitch';
        break;
      case '--exa':
        mode = 'exa';
        break;
      case '--context7':
        mode = 'context7';
        break;
      case '--all':
        mode = 'all';
        break;
      case '--simulate-usage':
        mode = 'simulate';
        if (args[i + 1] && !args[i + 1].startsWith('--')) {
          count = parseInt(args[++i], 10) || 1;
        }
        break;
      case '--reset':
        mode = 'reset';
        break;
      case '--verbose':
        verbose = true;
        break;
      default:
        console.log(`Unknown option: ${args[i]}`);
        printHelp();
        process.exit(1);
    }
  }

  return { mode, service, tier, count, verbose };
}

// Main function
async function main(): Promise<void> {
  const { mode, service, tier, count } = parseArgs();

  switch (mode) {
    case 'all':
      await checkAllQuotas();
      break;
    case 'stitch':
      printHeader('Claude-Symphony Quota Management Test');
      await checkStitchQuota();
      break;
    case 'exa':
      printHeader('Claude-Symphony Quota Management Test');
      await checkExaQuota();
      break;
    case 'context7':
      printHeader('Claude-Symphony Quota Management Test');
      await checkContext7Quota();
      break;
    case 'simulate':
      printHeader('Claude-Symphony Quota Management Test');
      await simulateQuotaUsage(service, tier, count);
      break;
    case 'reset':
      printHeader('Claude-Symphony Quota Management Test');
      await resetQuotaTracking();
      break;
  }
}

main().catch((error) => {
  console.error(chalk.red(`Quota management test failed: ${error}`));
  process.exit(1);
});
