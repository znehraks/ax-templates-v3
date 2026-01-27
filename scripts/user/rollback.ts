#!/usr/bin/env tsx
/**
 * Claude-Symphony Rollback Script
 * Provides automated rollback capabilities for deployments and state
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { exec } from '../../src/utils/shell.js';
import { logInfo, logSuccess, logError, logWarning, printHeader, printSection } from '../../src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const STATE_DIR = path.join(PROJECT_ROOT, 'state');
const CHECKPOINTS_DIR = path.join(STATE_DIR, 'checkpoints');

interface CheckpointManifest {
  stage?: string;
  created_at?: string;
  description?: string;
  files?: string[];
}

// Print help message
function printHelp(): void {
  console.log(`
${chalk.cyan('Claude-Symphony Rollback Utility')}

${chalk.white('Usage:')} ${chalk.yellow('tsx scripts/user/rollback.ts')} ${chalk.gray('[OPTIONS]')}

${chalk.white('Options:')}
    ${chalk.green('--help')}                  Show this help message
    ${chalk.green('--list')}                  List all available rollback points
    ${chalk.green('--checkpoint <id>')}       Rollback to a specific checkpoint
    ${chalk.green('--git <commit>')}          Rollback to a git commit
    ${chalk.green('--deployment <tag>')}      Rollback deployment to a specific tag
    ${chalk.green('--stage <id>')}            Rollback to a specific stage state
    ${chalk.green('--partial <files>')}       Partial rollback (specific files only)
    ${chalk.green('--dry-run')}               Show what would be changed without executing
    ${chalk.green('--force')}                 Skip confirmation prompts
    ${chalk.green('--verbose')}               Verbose output

${chalk.white('Rollback Types:')}
    checkpoint    State checkpoint from claude-symphony pipeline
    git           Git commit (revert or reset)
    deployment    Production deployment version
    stage         Pipeline stage state

${chalk.white('Examples:')}
    ${chalk.gray('tsx scripts/user/rollback.ts --list')}                                    # List rollback points
    ${chalk.gray('tsx scripts/user/rollback.ts --checkpoint checkpoint_20240127_103000')}   # Rollback to checkpoint
    ${chalk.gray('tsx scripts/user/rollback.ts --git HEAD~1 --dry-run')}                    # Preview git rollback
    ${chalk.gray('tsx scripts/user/rollback.ts --deployment v1.0.0')}                       # Rollback to v1.0.0 tag
    ${chalk.gray('tsx scripts/user/rollback.ts --partial "src/auth/*" --checkpoint <id>')}  # Partial rollback
`);
}

// List available checkpoints
async function listCheckpoints(): Promise<void> {
  logInfo('Available checkpoints:');
  console.log('');

  try {
    await fs.access(CHECKPOINTS_DIR);
  } catch {
    console.log(`  ${chalk.yellow('No checkpoints directory found')}`);
    return;
  }

  const entries = await fs.readdir(CHECKPOINTS_DIR);
  const checkpoints = entries.sort().reverse().slice(0, 20);

  if (checkpoints.length === 0) {
    console.log(`  ${chalk.yellow('No checkpoints found')}`);
    return;
  }

  console.log(`  ${chalk.blue('ID                              Stage           Created')}`);
  console.log('  ' + '─'.repeat(65));

  for (const checkpoint of checkpoints) {
    const manifestPath = path.join(CHECKPOINTS_DIR, checkpoint, 'manifest.json');
    let stage = 'unknown';
    let created = 'unknown';

    try {
      const content = await fs.readFile(manifestPath, 'utf-8');
      const manifest: CheckpointManifest = JSON.parse(content);
      stage = manifest.stage || 'unknown';
      created = manifest.created_at || 'unknown';
    } catch {
      // Use defaults
    }

    console.log(`  ${checkpoint.padEnd(30)} ${stage.padEnd(15)} ${created}`);
  }

  console.log('');
}

// List git rollback points
async function listGitRollbackPoints(): Promise<void> {
  logInfo('Recent git commits:');
  console.log('');

  const gitDir = path.join(PROJECT_ROOT, '.git');

  try {
    await fs.access(gitDir);
  } catch {
    console.log(`  ${chalk.yellow('Not a git repository')}`);
    return;
  }

  const result = await exec('git', ['log', '--oneline', '-20', '--pretty=format:  %h  %s (%cr)'], {
    cwd: PROJECT_ROOT,
  });

  if (result.stdout) {
    console.log(result.stdout);
  }
  console.log('');
}

// List deployment tags
async function listDeploymentTags(): Promise<void> {
  logInfo('Deployment tags:');
  console.log('');

  const gitDir = path.join(PROJECT_ROOT, '.git');

  try {
    await fs.access(gitDir);
  } catch {
    console.log(`  ${chalk.yellow('Not a git repository')}`);
    return;
  }

  const result = await exec('git', ['tag', '-l', 'v*', '--sort=-v:refname'], { cwd: PROJECT_ROOT });

  const tags = result.stdout
    .split('\n')
    .filter(Boolean)
    .slice(0, 10);

  if (tags.length === 0) {
    console.log(`  ${chalk.yellow('No deployment tags found')}`);
    return;
  }

  for (const tag of tags) {
    const dateResult = await exec('git', ['log', '-1', '--format=%ci', tag], { cwd: PROJECT_ROOT });
    const date = dateResult.stdout.trim().split(' ')[0];
    console.log(`  ${tag.padEnd(15)} ${date}`);
  }

  console.log('');
}

// List all rollback points
async function listAllRollbackPoints(): Promise<void> {
  printHeader('Claude-Symphony Rollback Utility');
  await listCheckpoints();
  await listGitRollbackPoints();
  await listDeploymentTags();
}

// Verify checkpoint
async function verifyCheckpoint(checkpointId: string): Promise<boolean> {
  const checkpointDir = path.join(CHECKPOINTS_DIR, checkpointId);

  try {
    await fs.access(checkpointDir);
  } catch {
    logError(`Checkpoint not found: ${checkpointId}`);
    return false;
  }

  const manifestPath = path.join(checkpointDir, 'manifest.json');

  try {
    await fs.access(manifestPath);
  } catch {
    logWarning('Checkpoint manifest not found, cannot verify integrity');
    return true;
  }

  logInfo('Verifying checkpoint integrity...');

  try {
    const content = await fs.readFile(manifestPath, 'utf-8');
    const manifest: CheckpointManifest = JSON.parse(content);

    // Count files
    const manifestFileCount = manifest.files?.length || 0;

    const entries = await fs.readdir(checkpointDir, { recursive: true });
    const actualCount = entries.filter((e) => e !== 'manifest.json').length;

    console.log(`  Manifest files: ${manifestFileCount}`);
    console.log(`  Actual files: ${actualCount}`);

    if (manifestFileCount !== actualCount) {
      logWarning('File count mismatch, checkpoint may be incomplete');
    } else {
      logSuccess('Checkpoint verified');
    }

    console.log('');
    return true;
  } catch {
    logError('Checkpoint manifest is corrupt');
    return false;
  }
}

// Rollback to checkpoint
async function rollbackToCheckpoint(
  checkpointId: string,
  partialFiles: string = '',
  dryRun: boolean = false,
  force: boolean = false
): Promise<void> {
  printHeader('Claude-Symphony Rollback Utility');
  logInfo(`Rolling back to checkpoint: ${checkpointId}`);

  const checkpointDir = path.join(CHECKPOINTS_DIR, checkpointId);

  // Verify checkpoint
  if (!(await verifyCheckpoint(checkpointId))) {
    return;
  }

  // Get checkpoint info
  const manifestPath = path.join(checkpointDir, 'manifest.json');
  let stage = 'unknown';
  let description = '';

  try {
    const content = await fs.readFile(manifestPath, 'utf-8');
    const manifest: CheckpointManifest = JSON.parse(content);
    stage = manifest.stage || 'unknown';
    description = manifest.description || '';
  } catch {
    // Use defaults
  }

  console.log('Checkpoint details:');
  console.log(`  ID: ${checkpointId}`);
  console.log(`  Stage: ${stage}`);
  console.log(`  Description: ${description}`);
  console.log('');

  // Get files to restore
  const allEntries = await fs.readdir(checkpointDir, { recursive: true, withFileTypes: true });
  let filesToRestore = allEntries
    .filter((e) => e.isFile() && e.name !== 'manifest.json')
    .map((e) => path.join(e.parentPath || checkpointDir, e.name));

  if (partialFiles) {
    logInfo(`Partial rollback: ${partialFiles}`);
    filesToRestore = filesToRestore.filter((f) => f.includes(partialFiles));
  }

  const fileCount = filesToRestore.length;
  console.log(`Files to restore: ${fileCount}`);

  if (dryRun) {
    console.log('');
    console.log(chalk.yellow('DRY RUN - No changes will be made'));
    console.log('');
    console.log('Files that would be restored:');
    for (const file of filesToRestore.slice(0, 20)) {
      const relPath = path.relative(checkpointDir, file);
      console.log(`  ${relPath}`);
    }
    if (filesToRestore.length > 20) {
      console.log(`  ... and ${filesToRestore.length - 20} more files`);
    }
    return;
  }

  // Confirm
  if (!force) {
    console.log('');
    console.log(chalk.yellow('WARNING: This will overwrite current files with checkpoint versions.'));
    console.log('Continue? [y/N]: ');
    // Note: In a real implementation, you would use readline or inquirer for prompts
    // For simplicity, we'll just proceed with a warning
    logWarning('Use --force to skip confirmation in non-interactive mode');
    return;
  }

  // Create backup before rollback
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(CHECKPOINTS_DIR, `pre_rollback_${timestamp}`);
  await fs.mkdir(backupDir, { recursive: true });
  logInfo(`Creating backup: ${backupDir}`);

  // Perform rollback
  logInfo('Restoring files...');

  let restored = 0;
  let failed = 0;

  for (const srcFile of filesToRestore) {
    const relPath = path.relative(checkpointDir, srcFile);
    const destFile = path.join(PROJECT_ROOT, relPath);
    const destDir = path.dirname(destFile);

    try {
      // Backup existing file
      try {
        await fs.access(destFile);
        const backupPath = path.join(backupDir, relPath);
        await fs.mkdir(path.dirname(backupPath), { recursive: true });
        await fs.copyFile(destFile, backupPath);
      } catch {
        // File doesn't exist, no backup needed
      }

      // Restore file
      await fs.mkdir(destDir, { recursive: true });
      await fs.copyFile(srcFile, destFile);
      restored++;
      console.log(`  ${chalk.green('✓')} ${relPath}`);
    } catch (error) {
      failed++;
      console.log(`  ${chalk.red('✗')} ${relPath}`);
    }
  }

  console.log('');
  console.log('Rollback complete:');
  console.log(`  Restored: ${restored} files`);
  console.log(`  Failed: ${failed} files`);
  console.log(`  Backup: ${backupDir}`);
  console.log('');

  if (failed === 0) {
    logSuccess('Rollback successful');
  } else {
    logWarning('Rollback completed with errors');
  }
}

// Rollback git
async function rollbackGit(target: string, dryRun: boolean = false, force: boolean = false): Promise<void> {
  printHeader('Claude-Symphony Rollback Utility');
  logInfo(`Git rollback to: ${target}`);

  const gitDir = path.join(PROJECT_ROOT, '.git');

  try {
    await fs.access(gitDir);
  } catch {
    logError('Not a git repository');
    return;
  }

  // Show what will change
  console.log(`Changes between current and ${target}:`);
  const diffResult = await exec('git', ['diff', '--stat', 'HEAD', target], { cwd: PROJECT_ROOT });
  console.log(diffResult.stdout || diffResult.stderr);
  console.log('');

  if (dryRun) {
    console.log(chalk.yellow('DRY RUN - No changes will be made'));
    return;
  }

  // Confirm
  if (!force) {
    console.log(chalk.yellow('WARNING: This will modify your git history.'));
    console.log('');
    console.log('Options:');
    console.log('  1. Revert (create new commit undoing changes)');
    console.log('  2. Reset --soft (keep changes staged)');
    console.log('  3. Reset --hard (discard all changes)');
    console.log('  4. Cancel');
    console.log('');
    logWarning('Use --force to skip confirmation in non-interactive mode');
    return;
  }

  // Default to revert for --force
  const result = await exec('git', ['revert', '--no-commit', `${target}..HEAD`], { cwd: PROJECT_ROOT });

  if (result.success) {
    await exec('git', ['commit', '-m', `Revert to ${target}`], { cwd: PROJECT_ROOT });
    logSuccess('Git rollback complete');
  } else {
    // Fallback to checkout
    await exec('git', ['checkout', target], { cwd: PROJECT_ROOT });
    logSuccess('Git checkout complete');
  }
}

// Rollback deployment
async function rollbackDeployment(tag: string, dryRun: boolean = false, force: boolean = false): Promise<void> {
  printHeader('Claude-Symphony Rollback Utility');
  logInfo(`Deployment rollback to: ${tag}`);

  const gitDir = path.join(PROJECT_ROOT, '.git');

  try {
    await fs.access(gitDir);
  } catch {
    logError('Not a git repository');
    return;
  }

  // Verify tag exists
  const tagResult = await exec('git', ['rev-parse', tag], { cwd: PROJECT_ROOT });
  if (!tagResult.success) {
    logError(`Tag not found: ${tag}`);
    return;
  }

  // Show tag info
  console.log('Tag information:');
  const showResult = await exec('git', ['show', tag, '--no-patch', '--format=  Commit: %h%n  Date: %ci%n  Message: %s'], {
    cwd: PROJECT_ROOT,
  });
  console.log(showResult.stdout);
  console.log('');

  if (dryRun) {
    console.log(chalk.yellow('DRY RUN - No changes will be made'));
    console.log('');
    console.log('This would:');
    console.log(`  1. Checkout tag ${tag}`);
    console.log(`  2. Create deployment branch: deploy-rollback-${tag}`);
    console.log('  3. Trigger CI/CD pipeline (if configured)');
    return;
  }

  // Confirm
  if (!force) {
    console.log(chalk.yellow('WARNING: This will deploy the older version.'));
    logWarning('Use --force to skip confirmation in non-interactive mode');
    return;
  }

  // Create rollback branch
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const rollbackBranch = `deploy-rollback-${tag}-${timestamp}`;
  logInfo(`Creating rollback branch: ${rollbackBranch}`);

  await exec('git', ['checkout', tag, '-b', rollbackBranch], { cwd: PROJECT_ROOT });

  console.log('');
  console.log(`Rollback branch created: ${rollbackBranch}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Verify the rollback locally');
  console.log('  2. Push to trigger deployment:');
  console.log(`     git push origin ${rollbackBranch}`);
  console.log('  3. After verification, merge to main:');
  console.log(`     git checkout main && git merge ${rollbackBranch}`);
  console.log('');

  logSuccess('Deployment rollback prepared');
}

// Rollback to stage state
async function rollbackToStage(stageId: string, dryRun: boolean = false): Promise<void> {
  printHeader('Claude-Symphony Rollback Utility');
  logInfo(`Rolling back to stage: ${stageId}`);

  // Find latest checkpoint for this stage
  try {
    await fs.access(CHECKPOINTS_DIR);
  } catch {
    logError(`No checkpoint found for stage: ${stageId}`);
    await listCheckpoints();
    return;
  }

  const entries = await fs.readdir(CHECKPOINTS_DIR);

  // First try to find checkpoint ending with stage ID
  let checkpoint = entries.filter((e) => e.endsWith(`_${stageId}`)).sort().reverse()[0];

  if (!checkpoint) {
    // Try finding any checkpoint from that stage
    for (const entry of entries.sort().reverse()) {
      const manifestPath = path.join(CHECKPOINTS_DIR, entry, 'manifest.json');
      try {
        const content = await fs.readFile(manifestPath, 'utf-8');
        const manifest: CheckpointManifest = JSON.parse(content);
        if (manifest.stage?.includes(stageId)) {
          checkpoint = entry;
          break;
        }
      } catch {
        continue;
      }
    }
  }

  if (!checkpoint) {
    logError(`No checkpoint found for stage: ${stageId}`);
    console.log('');
    console.log('Available checkpoints:');
    await listCheckpoints();
    return;
  }

  console.log(`Found checkpoint: ${checkpoint}`);
  await rollbackToCheckpoint(checkpoint, '', dryRun);
}

// Parse command line arguments
function parseArgs(): {
  mode: 'list' | 'checkpoint' | 'git' | 'deployment' | 'stage';
  target: string;
  partialFiles: string;
  dryRun: boolean;
  force: boolean;
  verbose: boolean;
} {
  const args = process.argv.slice(2);
  let mode: 'list' | 'checkpoint' | 'git' | 'deployment' | 'stage' = 'list';
  let target = '';
  let partialFiles = '';
  let dryRun = false;
  let force = false;
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--help':
        printHelp();
        process.exit(0);
      case '--list':
        mode = 'list';
        break;
      case '--checkpoint':
        mode = 'checkpoint';
        target = args[++i];
        break;
      case '--git':
        mode = 'git';
        target = args[++i];
        break;
      case '--deployment':
        mode = 'deployment';
        target = args[++i];
        break;
      case '--stage':
        mode = 'stage';
        target = args[++i];
        break;
      case '--partial':
        partialFiles = args[++i];
        break;
      case '--dry-run':
        dryRun = true;
        break;
      case '--force':
        force = true;
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

  return { mode, target, partialFiles, dryRun, force, verbose };
}

// Main function
async function main(): Promise<void> {
  const { mode, target, partialFiles, dryRun, force } = parseArgs();

  switch (mode) {
    case 'list':
      await listAllRollbackPoints();
      break;
    case 'checkpoint':
      await rollbackToCheckpoint(target, partialFiles, dryRun, force);
      break;
    case 'git':
      await rollbackGit(target, dryRun, force);
      break;
    case 'deployment':
      await rollbackDeployment(target, dryRun, force);
      break;
    case 'stage':
      await rollbackToStage(target, dryRun);
      break;
  }
}

main().catch((error) => {
  logError(`Rollback failed: ${error}`);
  process.exit(1);
});
