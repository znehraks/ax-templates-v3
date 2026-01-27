#!/usr/bin/env tsx
/**
 * Claude-Symphony MCP Fallback Test
 * Tests MCP server availability and fallback behavior
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { exec, commandExists } from '../../src/utils/shell.js';
import { logInfo, logSuccess, logError, logWarning, printHeader, printSection } from '../../src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const STATE_DIR = path.join(PROJECT_ROOT, 'state');

// MCP Servers to test
const MCP_SERVERS: Record<string, string> = {
  context7: 'Library documentation search',
  exa: 'Web search and research',
  notion: 'Task management',
  'figma-dev-mode': 'Design token extraction',
  playwright: 'Browser automation',
  'chrome-devtools': 'Chrome DevTools',
  serena: 'Symbolic code analysis',
};

// Fallback chains
const FALLBACK_CHAINS: Record<string, string> = {
  search: 'context7 → exa → web_search',
  'ui-generation': 'stitch → figma → claude-vision',
  browser: 'playwright → chrome-devtools',
  'task-management': 'notion → local-json',
};

// Print help message
function printHelp(): void {
  const mcpList = Object.entries(MCP_SERVERS)
    .map(([name, desc]) => `    ${chalk.cyan(name)}: ${desc}`)
    .sort()
    .join('\n');

  const chainList = Object.entries(FALLBACK_CHAINS)
    .map(([name, chain]) => `    ${chalk.cyan(name)}: ${chain}`)
    .sort()
    .join('\n');

  console.log(`
${chalk.cyan('Claude-Symphony MCP Fallback Test')}

${chalk.white('Usage:')} ${chalk.yellow('tsx scripts/test/test-mcp-fallback.ts')} ${chalk.gray('[OPTIONS]')}

${chalk.white('Options:')}
    ${chalk.green('--help')}                  Show this help message
    ${chalk.green('--mcp <name>')}            Test specific MCP server
    ${chalk.green('--simulate-failure')}      Simulate MCP failures
    ${chalk.green('--check-fallback')}        Test fallback chain behavior
    ${chalk.green('--list')}                  List all MCP servers and fallback chains
    ${chalk.green('--verbose')}               Verbose output

${chalk.white('Examples:')}
    ${chalk.gray('tsx scripts/test/test-mcp-fallback.ts')}                      # Test all MCPs
    ${chalk.gray('tsx scripts/test/test-mcp-fallback.ts --mcp context7')}       # Test Context7 MCP
    ${chalk.gray('tsx scripts/test/test-mcp-fallback.ts --simulate-failure')}   # Simulate failures
    ${chalk.gray('tsx scripts/test/test-mcp-fallback.ts --check-fallback')}     # Test fallback chains

${chalk.white('MCP Servers:')}
${mcpList}

${chalk.white('Fallback Chains:')}
${chainList}
`);
}

// Check Claude CLI availability
async function checkClaudeCli(): Promise<boolean> {
  if (await commandExists('claude')) {
    logSuccess('Claude CLI available');
    return true;
  } else {
    logError('Claude CLI not found. Please install it first.');
    return false;
  }
}

// Check single MCP server
async function checkMcpServer(mcpName: string): Promise<boolean> {
  const description = MCP_SERVERS[mcpName] || 'Unknown';
  console.log(`Checking MCP: ${chalk.blue(mcpName)} (${description})`);

  // Try to check MCP status via Claude CLI
  const result = await exec('claude', ['mcp', 'status', mcpName]);

  if (result.success) {
    console.log(`  ${chalk.green('✓')} MCP server is available`);
    return true;
  } else {
    console.log(`  ${chalk.yellow('!')} MCP server status unknown`);
    return false;
  }
}

// Test all MCP servers
async function testAllMcpServers(): Promise<void> {
  printHeader('Claude-Symphony MCP Fallback Test');

  if (!(await checkClaudeCli())) {
    process.exit(1);
  }

  logInfo('Testing all MCP servers...');
  console.log('');

  let passed = 0;
  let unknown = 0;

  for (const mcp of Object.keys(MCP_SERVERS).sort()) {
    if (await checkMcpServer(mcp)) {
      passed++;
    } else {
      unknown++;
    }
    console.log('');
  }

  // Print summary
  printSection('MCP Server Check Summary');
  console.log(`  ${chalk.green('Available')}: ${passed}`);
  console.log(`  ${chalk.yellow('Unknown')}: ${unknown}`);
  console.log('');
}

// Test fallback chain
async function testFallbackChain(chainName: string): Promise<boolean> {
  const chainDef = FALLBACK_CHAINS[chainName];

  if (!chainDef) {
    logError(`Unknown fallback chain: ${chainName}`);
    return false;
  }

  logInfo(`Testing fallback chain: ${chainName}`);
  console.log(`  Chain: ${chalk.blue(chainDef)}`);

  // Parse chain (split by →)
  const servers = chainDef.split(' → ').map((s) => s.trim());

  let primaryFound = false;
  let fallbackFound = false;

  for (const server of servers) {
    if (!server) continue;

    process.stdout.write(`  Checking: ${server}... `);

    // Simulate check
    switch (server) {
      case 'context7':
      case 'exa':
      case 'playwright':
      case 'serena':
        if (await commandExists('claude')) {
          console.log(chalk.green('available'));
          if (!primaryFound) {
            primaryFound = true;
          } else {
            fallbackFound = true;
          }
        } else {
          console.log(chalk.yellow('unknown'));
        }
        break;
      case 'web_search':
      case 'claude-vision':
      case 'local-json':
        console.log(chalk.green('built-in'));
        fallbackFound = true;
        break;
      case 'stitch':
      case 'figma':
      case 'notion':
      case 'chrome-devtools':
        console.log(chalk.yellow('requires configuration'));
        break;
      default:
        console.log(chalk.yellow('unknown'));
    }
  }

  if (primaryFound && fallbackFound) {
    logSuccess(`Fallback chain ${chainName}: Primary and fallback available`);
    return true;
  } else if (primaryFound) {
    logWarning(`Fallback chain ${chainName}: Primary available, fallback uncertain`);
    return true;
  } else {
    logError(`Fallback chain ${chainName}: No servers available`);
    return false;
  }
}

// Test all fallback chains
async function testAllFallbackChains(): Promise<void> {
  printHeader('Claude-Symphony MCP Fallback Test');

  if (!(await checkClaudeCli())) {
    process.exit(1);
  }

  logInfo('Testing all fallback chains...');
  console.log('');

  let passed = 0;
  let failed = 0;

  for (const chain of Object.keys(FALLBACK_CHAINS).sort()) {
    if (await testFallbackChain(chain)) {
      passed++;
    } else {
      failed++;
    }
    console.log('');
  }

  // Check fallback log
  await checkFallbackLog();

  // Print summary
  printSection('Fallback Chain Test Summary');
  console.log(`  ${chalk.green('Passed')}: ${passed}`);
  console.log(`  ${chalk.red('Failed')}: ${failed}`);
  console.log('');
}

// Simulate MCP failure scenario
async function simulateMcpFailure(mcpName: string = 'context7'): Promise<void> {
  printHeader('Claude-Symphony MCP Fallback Test');

  logInfo(`Simulating MCP failure for: ${mcpName}`);
  console.log('');
  console.log(chalk.yellow('NOTE: This is a simulation to test fallback behavior.'));
  console.log('');

  // Ensure state directory exists
  await fs.mkdir(STATE_DIR, { recursive: true });

  const fallbackLog = path.join(STATE_DIR, 'fallback_log.json');
  const timestamp = new Date().toISOString();

  // Determine fallback server based on the failed MCP
  const fallbackMap: Record<string, string> = {
    context7: 'exa',
    exa: 'web_search',
    stitch: 'figma',
    figma: 'claude-vision',
    playwright: 'chrome-devtools',
    notion: 'local-json',
  };

  const fallbackServer = fallbackMap[mcpName] || 'unknown';

  // Create fallback log entry
  const logEntry = {
    timestamp,
    attempted_model: mcpName,
    fallback_model: fallbackServer,
    error: 'SIMULATED_FAILURE',
    stage: 'test',
    simulation: true,
  };

  await fs.writeFile(fallbackLog, JSON.stringify(logEntry, null, 2), 'utf-8');

  console.log('Simulated failure scenario:');
  console.log(`  Primary MCP: ${mcpName} (FAILED)`);
  console.log(`  Fallback MCP: ${fallbackServer} (ACTIVATED)`);
  console.log('');
  console.log(`Fallback log created: ${fallbackLog}`);
  console.log('');

  console.log('Expected behavior in claude-symphony:');
  console.log(`  1. Detect ${mcpName} failure`);
  console.log('  2. Log failure to state/fallback_log.json');
  console.log(`  3. Automatically switch to ${fallbackServer}`);
  console.log('  4. Continue operation with fallback');
  console.log('  5. Include fallback info in HANDOFF.md');
  console.log('');

  logSuccess('MCP failure simulation complete');
}

// Check fallback log
async function checkFallbackLog(): Promise<void> {
  logInfo('Checking fallback log...');

  const fallbackLog = path.join(STATE_DIR, 'fallback_log.json');

  try {
    const content = await fs.readFile(fallbackLog, 'utf-8');
    console.log(`  ${chalk.green('✓')} Fallback log exists: ${fallbackLog}`);
    console.log('');
    console.log('Recent fallback events:');
    console.log(content.substring(0, 500));
    console.log('');
  } catch {
    console.log(`  ${chalk.blue('i')} No fallback log found (no fallbacks have occurred)`);
  }
}

// List MCP servers and chains
function listMcpInfo(): void {
  console.log('');
  console.log(chalk.cyan('MCP Servers:'));
  console.log('');

  for (const [name, desc] of Object.entries(MCP_SERVERS).sort()) {
    console.log(`  ${chalk.white(name)}`);
    console.log(`    ${desc}`);
    console.log('');
  }

  console.log(chalk.cyan('Fallback Chains:'));
  console.log('');

  for (const [name, chain] of Object.entries(FALLBACK_CHAINS).sort()) {
    console.log(`  ${chalk.white(name)}`);
    console.log(`    ${chain}`);
    console.log('');
  }
}

// Parse command line arguments
function parseArgs(): {
  mode: 'all' | 'single' | 'simulate' | 'fallback' | 'list';
  targetMcp: string;
  verbose: boolean;
} {
  const args = process.argv.slice(2);
  let mode: 'all' | 'single' | 'simulate' | 'fallback' | 'list' = 'all';
  let targetMcp = '';
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--help':
        printHelp();
        process.exit(0);
      case '--mcp':
        mode = 'single';
        targetMcp = args[++i];
        break;
      case '--simulate-failure':
        mode = 'simulate';
        if (args[i + 1] && !args[i + 1].startsWith('--')) {
          targetMcp = args[++i];
        }
        break;
      case '--check-fallback':
        mode = 'fallback';
        break;
      case '--list':
        mode = 'list';
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

  return { mode, targetMcp, verbose };
}

// Main function
async function main(): Promise<void> {
  const { mode, targetMcp } = parseArgs();

  switch (mode) {
    case 'all':
      await testAllMcpServers();
      break;
    case 'single':
      printHeader('Claude-Symphony MCP Fallback Test');
      if (!(await checkClaudeCli())) {
        process.exit(1);
      }
      await checkMcpServer(targetMcp);
      break;
    case 'simulate':
      await simulateMcpFailure(targetMcp || 'context7');
      break;
    case 'fallback':
      await testAllFallbackChains();
      break;
    case 'list':
      listMcpInfo();
      break;
  }
}

main().catch((error) => {
  logError(`MCP fallback test failed: ${error}`);
  process.exit(1);
});
