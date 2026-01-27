#!/usr/bin/env npx tsx
/**
 * Stitch MCP Setup Script
 * Sets up Google Stitch MCP for claude-symphony UI/UX stage
 *
 * Usage: npx tsx template/scripts/setup-stitch-mcp.ts
 */

import { execa, type ExecaError } from 'execa';
import { input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';

interface CommandCheck {
  name: string;
  command: string;
  installUrl: string;
}

const PREREQUISITES: CommandCheck[] = [
  {
    name: 'gcloud CLI',
    command: 'gcloud',
    installUrl: 'https://cloud.google.com/sdk/docs/install',
  },
  {
    name: 'npx',
    command: 'npx',
    installUrl: 'https://nodejs.org/',
  },
  {
    name: 'Claude CLI',
    command: 'claude',
    installUrl: 'npm install -g @anthropic-ai/claude-code',
  },
];

async function checkCommand(cmd: string): Promise<boolean> {
  try {
    await execa('which', [cmd]);
    return true;
  } catch {
    return false;
  }
}

async function checkPrerequisites(): Promise<boolean> {
  console.log(chalk.blue('[1/4] Checking prerequisites...'));

  for (const prereq of PREREQUISITES) {
    const exists = await checkCommand(prereq.command);
    if (!exists) {
      console.log(chalk.red(`ERROR: ${prereq.name} is required but not installed.`));
      console.log(`Install: ${prereq.installUrl}`);
      return false;
    }
    console.log(`  - ${prereq.name}: ${chalk.green('OK')}`);
  }
  console.log('');
  return true;
}

async function checkGCloudAuth(): Promise<void> {
  console.log(chalk.blue('[2/4] Checking Google Cloud authentication...'));

  // Check if already authenticated
  try {
    await execa('gcloud', ['auth', 'print-access-token'], { stdio: 'pipe' });
    console.log('  Already authenticated.');
  } catch {
    console.log('  Google Cloud not authenticated. Starting login...');
    await execa('gcloud', ['auth', 'login'], { stdio: 'inherit' });
  }

  // Check for application-default credentials
  try {
    await execa('gcloud', ['auth', 'application-default', 'print-access-token'], { stdio: 'pipe' });
  } catch {
    console.log('  Setting up application-default credentials...');
    await execa('gcloud', ['auth', 'application-default', 'login'], { stdio: 'inherit' });
  }
  console.log('');
}

async function getCurrentProject(): Promise<string> {
  try {
    const { stdout } = await execa('gcloud', ['config', 'get-value', 'project'], { stdio: 'pipe' });
    return stdout.trim();
  } catch {
    return '';
  }
}

async function setQuotaProject(): Promise<string> {
  console.log(chalk.blue('[3/4] Setting quota project...'));

  const currentProject = await getCurrentProject();
  let projectId: string;

  if (currentProject) {
    projectId = await input({
      message: `Enter GCP project ID for Stitch API quota [${currentProject}]:`,
      default: currentProject,
    });
  } else {
    projectId = await input({
      message: 'Enter GCP project ID for Stitch API quota:',
    });
  }

  if (!projectId.trim()) {
    throw new Error('Project ID is required.');
  }

  projectId = projectId.trim();
  console.log(`  Setting quota project to: ${projectId}`);
  await execa('gcloud', ['auth', 'application-default', 'set-quota-project', projectId]);

  // Enable Stitch API
  console.log('');
  console.log('  Enabling Stitch API...');

  try {
    // Check if already enabled
    const { stdout } = await execa('gcloud', ['services', 'list', '--enabled', `--project=${projectId}`], {
      stdio: 'pipe',
    });
    if (stdout.includes('stitch.googleapis.com')) {
      console.log('  Stitch API already enabled.');
    } else {
      throw new Error('Not enabled');
    }
  } catch {
    // Try to enable
    try {
      await execa('gcloud', ['beta', 'services', 'mcp', 'enable', 'stitch.googleapis.com', `--project=${projectId}`]);
    } catch {
      try {
        await execa('gcloud', ['services', 'enable', 'stitch.googleapis.com', `--project=${projectId}`]);
      } catch {
        console.log(
          chalk.yellow(
            '  Note: Could not auto-enable API. Enable manually at: https://console.cloud.google.com/apis/library/stitch.googleapis.com'
          )
        );
      }
    }
  }
  console.log('');

  return projectId;
}

async function isStitchMcpConfigured(): Promise<boolean> {
  try {
    const { stdout } = await execa('claude', ['mcp', 'list'], { stdio: 'pipe' });
    return stdout.includes('stitch');
  } catch {
    return false;
  }
}

async function addStitchMcp(): Promise<void> {
  console.log(chalk.blue('[4/4] Adding Stitch MCP to Claude...'));

  const alreadyConfigured = await isStitchMcpConfigured();

  if (alreadyConfigured) {
    console.log('  Stitch MCP already configured.');
  } else {
    console.log('  Adding Stitch MCP...');
    await execa('claude', ['mcp', 'add', '--transport', 'stdio', 'stitch', '--', 'npx', '-y', 'stitch-mcp'], {
      stdio: 'inherit',
    });
  }
  console.log('');
}

async function verifyInstallation(): Promise<void> {
  console.log(chalk.green('=== Setup Complete ==='));
  console.log('');
  console.log('Verification:');

  const configured = await isStitchMcpConfigured();
  if (configured) {
    console.log(`  Stitch MCP: ${chalk.green('CONFIGURED')}`);
  } else {
    console.log(`  Stitch MCP: ${chalk.yellow('NOT FOUND')} (manual configuration may be needed)`);
  }
  console.log('');
  console.log('Quota limits (monthly):');
  console.log('  - Standard requests: 350');
  console.log('  - Experimental requests: 50');
  console.log('');
  console.log('Usage in Stage 04 (UI/UX):');
  console.log('  /stitch              # Show status');
  console.log('  /stitch dna          # Extract Design DNA from moodboard');
  console.log('  /stitch generate     # Generate UI from description');
  console.log('  /stitch quota        # Check usage');
  console.log('');
  console.log('For more info: template/.claude/commands/stitch.md');
}

async function main(): Promise<void> {
  console.log(chalk.blue('=== Google Stitch MCP Setup ==='));
  console.log('');

  // Check prerequisites
  const prereqsOk = await checkPrerequisites();
  if (!prereqsOk) {
    process.exit(1);
  }

  // Check/setup GCloud auth
  await checkGCloudAuth();

  // Set quota project
  await setQuotaProject();

  // Add MCP to Claude
  await addStitchMcp();

  // Verify installation
  await verifyInstallation();
}

// CLI entry point
main().catch((error: Error) => {
  console.error(chalk.red(`ERROR: ${error.message}`));
  process.exit(1);
});
