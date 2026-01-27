#!/usr/bin/env tsx
/**
 * Claude-Symphony Environment Validation
 * Validates environment variables and configuration for deployment
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { exec, commandExists } from '../../src/utils/shell.js';
import { logInfo, logSuccess, logError, logWarning, printHeader, printSection } from '../../src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Environment variables to check
const REQUIRED_ENV_VARS = ['NODE_ENV'];

const OPTIONAL_ENV_VARS = [
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'NOTION_API_KEY',
  'FIGMA_ACCESS_TOKEN',
  'DATABASE_URL',
  'REDIS_URL',
];

// Sensitive patterns to detect
const SENSITIVE_PATTERNS = [
  'api_key',
  'api-key',
  'apikey',
  'secret',
  'password',
  'token',
  'credential',
  'private_key',
  'private-key',
];

// Files that should not contain secrets
const SENSITIVE_FILES = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'credentials.json',
  'secrets.json',
];

// Print help message
function printHelp(): void {
  console.log(`
${chalk.cyan('Claude-Symphony Environment Validation')}

${chalk.white('Usage:')} ${chalk.yellow('tsx scripts/user/validate-env.ts')} ${chalk.gray('[OPTIONS]')}

${chalk.white('Options:')}
    ${chalk.green('--help')}                  Show this help message
    ${chalk.green('--env <environment>')}     Validate specific environment (development|staging|production)
    ${chalk.green('--check-secrets')}         Scan for exposed secrets in codebase
    ${chalk.green('--check-gitignore')}       Verify .gitignore includes sensitive files
    ${chalk.green('--check-node')}            Validate Node.js environment
    ${chalk.green('--full')}                  Run all checks
    ${chalk.green('--verbose')}               Verbose output

${chalk.white('Examples:')}
    ${chalk.gray('tsx scripts/user/validate-env.ts')}                          # Basic validation
    ${chalk.gray('tsx scripts/user/validate-env.ts --env production')}         # Validate production environment
    ${chalk.gray('tsx scripts/user/validate-env.ts --check-secrets')}          # Scan for secrets
    ${chalk.gray('tsx scripts/user/validate-env.ts --full')}                   # Run all checks
`);
}

// Check required environment variables
function checkRequiredEnvVars(): number {
  logInfo('Checking required environment variables...');
  let missing = 0;

  for (const varName of REQUIRED_ENV_VARS) {
    if (process.env[varName]) {
      console.log(`  ${chalk.green('✓')} ${varName} is set`);
    } else {
      console.log(`  ${chalk.red('✗')} ${varName} is not set (required)`);
      missing++;
    }
  }

  console.log('');
  return missing;
}

// Check optional environment variables
function checkOptionalEnvVars(): void {
  logInfo('Checking optional environment variables...');

  for (const varName of OPTIONAL_ENV_VARS) {
    const value = process.env[varName];
    if (value) {
      // Mask the value for security
      const masked = value.length > 8 ? `${value.slice(0, 4)}****${value.slice(-4)}` : '****';
      console.log(`  ${chalk.green('✓')} ${varName} is set (${masked})`);
    } else {
      console.log(`  ${chalk.yellow('!')} ${varName} is not set (optional)`);
    }
  }

  console.log('');
}

// Check .gitignore
async function checkGitignore(): Promise<number> {
  logInfo('Checking .gitignore configuration...');

  const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');

  try {
    const content = await fs.readFile(gitignorePath, 'utf-8');
    console.log(`  ${chalk.green('✓')} .gitignore exists`);

    let missing = 0;

    for (const file of SENSITIVE_FILES) {
      const patterns = [
        new RegExp(`^${file.replace('.', '\\.')}$`, 'm'),
        new RegExp(`/${file.replace('.', '\\.')}$`, 'm'),
      ];

      if (patterns.some((p) => p.test(content))) {
        console.log(`  ${chalk.green('✓')} ${file} is ignored`);
      } else {
        console.log(`  ${chalk.red('✗')} ${file} is NOT ignored (security risk!)`);
        missing++;
      }
    }

    // Check common patterns
    const patterns = ['.env*', '*.pem', '*.key', 'node_modules'];
    for (const pattern of patterns) {
      if (content.includes(pattern)) {
        console.log(`  ${chalk.green('✓')} Pattern '${pattern}' is ignored`);
      } else {
        console.log(`  ${chalk.yellow('!')} Pattern '${pattern}' might not be ignored`);
      }
    }

    console.log('');
    return missing;
  } catch {
    console.log(`  ${chalk.red('✗')} .gitignore not found`);
    console.log('');
    return 1;
  }
}

// Scan for exposed secrets in codebase
async function checkSecrets(): Promise<number> {
  logInfo('Scanning for exposed secrets...');

  let foundSecrets = 0;

  // Directories to scan
  const scanDirs = ['src', 'config', 'scripts', 'stages', 'template'];

  for (const dir of scanDirs) {
    const fullPath = path.join(PROJECT_ROOT, dir);

    try {
      await fs.access(fullPath);
    } catch {
      continue;
    }

    for (const pattern of SENSITIVE_PATTERNS) {
      // Use grep to search for patterns followed by actual values
      const result = await exec(
        'grep',
        ['-rnil', '--include=*.ts', '--include=*.js', '--include=*.json', `${pattern}.*['"][a-zA-Z0-9_-]{10,}['"]`],
        { cwd: fullPath }
      );

      if (result.stdout) {
        console.log(`  ${chalk.red('!')} Potential secret found (pattern: ${pattern}):`);
        const matches = result.stdout.split('\n').slice(0, 5);
        for (const match of matches) {
          if (match) {
            console.log(`    ${chalk.yellow('→')} ${match}`);
          }
        }
        foundSecrets++;
      }
    }
  }

  // Check for hardcoded API keys (common patterns)
  const keyPatterns = [
    'sk-[a-zA-Z0-9]{48}', // OpenAI API key
    'anthropic-[a-zA-Z0-9]{32}', // Anthropic API key (hypothetical)
    'secret_[a-zA-Z0-9]{32}', // Notion API key pattern
  ];

  for (const pattern of keyPatterns) {
    const result = await exec('grep', ['-rnoE', pattern, path.join(PROJECT_ROOT, 'src'), path.join(PROJECT_ROOT, 'config')]);

    if (result.stdout) {
      console.log(`  ${chalk.red('✗')} Hardcoded API key found:`);
      const matches = result.stdout.split('\n').slice(0, 3);
      for (const match of matches) {
        if (match) {
          console.log(`    ${chalk.yellow('→')} ${match}`);
        }
      }
      foundSecrets++;
    }
  }

  if (foundSecrets === 0) {
    console.log(`  ${chalk.green('✓')} No exposed secrets found`);
  } else {
    console.log(`  ${chalk.red(`Found ${foundSecrets} potential secret exposure(s)`)}`);
  }

  console.log('');
  return foundSecrets;
}

// Check git history for secrets
async function checkGitHistory(): Promise<void> {
  logInfo('Checking git history for secrets...');

  const gitDir = path.join(PROJECT_ROOT, '.git');

  try {
    await fs.access(gitDir);
  } catch {
    console.log(`  ${chalk.yellow('!')} Not a git repository, skipping`);
    return;
  }

  let foundInHistory = 0;

  // Check for common secret patterns in git history
  for (const pattern of ['api_key', 'secret', 'password']) {
    const result = await exec('git', ['log', '-p', '--all', '-S', pattern], { cwd: PROJECT_ROOT });

    const count = (result.stdout.match(new RegExp(pattern, 'gi')) || []).length;
    if (count > 0) {
      console.log(`  ${chalk.yellow('!')} Pattern '${pattern}' found ${count} times in git history`);
      foundInHistory++;
    }
  }

  if (foundInHistory === 0) {
    console.log(`  ${chalk.green('✓')} No secrets found in git history`);
  } else {
    console.log(`  ${chalk.yellow('Warning: Secrets may exist in git history')}`);
    console.log('  Consider using git-filter-repo or BFG to clean history');
  }

  console.log('');
}

// Validate Node.js environment
async function checkNodeEnv(): Promise<number> {
  logInfo('Checking Node.js environment...');

  // Check Node.js version
  if (await commandExists('node')) {
    const result = await exec('node', ['--version']);
    const nodeVersion = result.stdout.trim();
    const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);

    if (majorVersion >= 18) {
      console.log(`  ${chalk.green('✓')} Node.js version: ${nodeVersion}`);
    } else {
      console.log(`  ${chalk.red('✗')} Node.js version: ${nodeVersion} (requires v18+)`);
      return 1;
    }
  } else {
    console.log(`  ${chalk.red('✗')} Node.js not found`);
    return 1;
  }

  // Check npm version
  if (await commandExists('npm')) {
    const result = await exec('npm', ['--version']);
    console.log(`  ${chalk.green('✓')} npm version: ${result.stdout.trim()}`);
  } else {
    console.log(`  ${chalk.red('✗')} npm not found`);
    return 1;
  }

  // Check package.json
  const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
  try {
    const content = await fs.readFile(packageJsonPath, 'utf-8');
    console.log(`  ${chalk.green('✓')} package.json exists`);

    // Check for required scripts
    const scripts = ['build', 'test', 'lint'];
    for (const script of scripts) {
      if (content.includes(`"${script}":`)) {
        console.log(`  ${chalk.green('✓')} Script '${script}' defined`);
      } else {
        console.log(`  ${chalk.yellow('!')} Script '${script}' not found`);
      }
    }
  } catch {
    console.log(`  ${chalk.red('✗')} package.json not found`);
    return 1;
  }

  // Check node_modules
  const nodeModulesPath = path.join(PROJECT_ROOT, 'node_modules');
  try {
    await fs.access(nodeModulesPath);
    console.log(`  ${chalk.green('✓')} node_modules exists`);
  } catch {
    console.log(`  ${chalk.yellow('!')} node_modules not found (run npm install)`);
  }

  console.log('');
  return 0;
}

// Validate environment for specific target
function validateEnvironment(env: string): void {
  logInfo(`Validating ${env} environment...`);

  switch (env) {
    case 'development':
      console.log(`  ${chalk.blue('i')} Development environment checks:`);
      console.log(`  ${chalk.green('✓')} Relaxed security requirements`);
      console.log(`  ${chalk.green('✓')} Debug mode allowed`);
      break;
    case 'staging':
      console.log(`  ${chalk.blue('i')} Staging environment checks:`);
      console.log(`  ${chalk.yellow('!')} Should mirror production configuration`);
      console.log(`  ${chalk.yellow('!')} Use staging API keys`);
      break;
    case 'production':
      console.log(`  ${chalk.blue('i')} Production environment checks:`);
      console.log(`  ${chalk.red('!')} Strict security requirements`);
      console.log(`  ${chalk.red('!')} No debug mode`);
      console.log(`  ${chalk.red('!')} All secrets from environment variables`);

      // Additional production checks
      if (process.env.NODE_ENV !== 'production') {
        console.log(`  ${chalk.red('✗')} NODE_ENV should be 'production'`);
      }
      break;
  }

  console.log('');
}

// Run all checks
async function runFullValidation(): Promise<boolean> {
  printHeader('Claude-Symphony Environment Validation');

  let totalErrors = 0;

  // Required checks
  totalErrors += checkRequiredEnvVars();
  checkOptionalEnvVars();
  totalErrors += await checkGitignore();
  totalErrors += await checkSecrets();
  await checkGitHistory();
  totalErrors += await checkNodeEnv();

  // Print summary
  printSection('Environment Validation Summary');
  if (totalErrors === 0) {
    console.log(`  ${chalk.green('All checks passed!')}`);
  } else {
    console.log(`  ${chalk.red(`${totalErrors} check(s) failed`)}`);
  }
  console.log('');

  return totalErrors === 0;
}

// Parse command line arguments
function parseArgs(): {
  mode: 'basic' | 'secrets' | 'gitignore' | 'node' | 'full';
  targetEnv: string;
  verbose: boolean;
} {
  const args = process.argv.slice(2);
  let mode: 'basic' | 'secrets' | 'gitignore' | 'node' | 'full' = 'basic';
  let targetEnv = 'development';
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--help':
        printHelp();
        process.exit(0);
      case '--env':
        targetEnv = args[++i];
        break;
      case '--check-secrets':
        mode = 'secrets';
        break;
      case '--check-gitignore':
        mode = 'gitignore';
        break;
      case '--check-node':
        mode = 'node';
        break;
      case '--full':
        mode = 'full';
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

  return { mode, targetEnv, verbose };
}

// Main function
async function main(): Promise<void> {
  const { mode, targetEnv } = parseArgs();

  switch (mode) {
    case 'basic':
      printHeader('Claude-Symphony Environment Validation');
      checkRequiredEnvVars();
      checkOptionalEnvVars();
      validateEnvironment(targetEnv);
      break;
    case 'secrets':
      printHeader('Claude-Symphony Environment Validation');
      await checkSecrets();
      await checkGitHistory();
      break;
    case 'gitignore':
      printHeader('Claude-Symphony Environment Validation');
      await checkGitignore();
      break;
    case 'node':
      printHeader('Claude-Symphony Environment Validation');
      await checkNodeEnv();
      break;
    case 'full': {
      const success = await runFullValidation();
      process.exit(success ? 0 : 1);
    }
  }
}

main().catch((error) => {
  logError(`Environment validation failed: ${error}`);
  process.exit(1);
});
