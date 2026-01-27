#!/usr/bin/env tsx
/**
 * Claude-Symphony Pipeline Integration Test
 * Tests the complete 10-stage pipeline workflow
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { exec, commandExists } from '../../src/utils/shell.js';
import { logInfo, logSuccess, logError, logWarning, printHeader, printSection } from '../../src/utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Stage definitions
const STAGES = [
  '01-brainstorm',
  '02-research',
  '03-planning',
  '04-ui-ux',
  '05-task-management',
  '06-implementation',
  '07-refactoring',
  '08-qa',
  '09-testing',
  '10-deployment',
] as const;

// Required outputs per stage
const REQUIRED_OUTPUTS: Record<string, string> = {
  '01-brainstorm': 'ideas.md',
  '02-research': 'research_report.md',
  '03-planning': 'architecture.md',
  '04-ui-ux': 'wireframes.md',
  '05-task-management': 'sprint_plan.md',
  '06-implementation': 'src',
  '07-refactoring': 'refactoring_report.md',
  '08-qa': 'qa_report.md',
  '09-testing': 'test_report.md',
  '10-deployment': 'deployment_guide.md',
};

interface VerificationResult {
  stage: string;
  passed: boolean;
  errors: string[];
}

// Print help message
function printHelp(): void {
  console.log(`
${chalk.cyan('Claude-Symphony Pipeline Integration Test')}

${chalk.white('Usage:')} ${chalk.yellow('tsx scripts/test/test-pipeline.ts')} ${chalk.gray('[OPTIONS]')}

${chalk.white('Options:')}
    ${chalk.green('--help')}              Show this help message
    ${chalk.green('--stage <ID>')}        Test specific stage only (e.g., 01, 02, 03...)
    ${chalk.green('--verify-only')}       Only verify outputs, don't run stages
    ${chalk.green('--project <PATH>')}    Test an existing project at PATH
    ${chalk.green('--quick')}             Quick test (stage 01 only)
    ${chalk.green('--verbose')}           Verbose output

${chalk.white('Examples:')}
    ${chalk.gray('tsx scripts/test/test-pipeline.ts')}                          # Run full pipeline test
    ${chalk.gray('tsx scripts/test/test-pipeline.ts --stage 01')}               # Test stage 01 only
    ${chalk.gray('tsx scripts/test/test-pipeline.ts --verify-only')}            # Verify existing outputs
    ${chalk.gray('tsx scripts/test/test-pipeline.ts --project ./my-project')}   # Test existing project
`);
}

// Check prerequisites
async function checkPrerequisites(): Promise<boolean> {
  logInfo('Checking prerequisites...');
  let missing = 0;

  // Required tools
  const requiredTools = ['node', 'npm'];
  const optionalTools = ['claude', 'tmux', 'gemini', 'codex'];

  for (const tool of requiredTools) {
    if (await commandExists(tool)) {
      const result = await exec(tool, ['--version']);
      const version = result.stdout.split('\n')[0];
      console.log(`  ${chalk.green('✓')} ${tool} (${version.trim()})`);
    } else {
      console.log(`  ${chalk.red('✗')} ${tool} (required)`);
      missing++;
    }
  }

  for (const tool of optionalTools) {
    if (await commandExists(tool)) {
      console.log(`  ${chalk.green('✓')} ${tool}`);
    } else {
      console.log(`  ${chalk.yellow('!')} ${tool} (optional)`);
    }
  }

  console.log('');

  if (missing > 0) {
    logError(`Missing ${missing} required tool(s). Please install and retry.`);
    return false;
  }

  logSuccess('Prerequisites check passed');
  return true;
}

// Verify project structure
async function verifyProjectStructure(projectPath: string): Promise<number> {
  logInfo(`Verifying project structure at: ${projectPath}`);
  let errors = 0;

  // Check essential directories
  const dirs = ['stages', 'config', 'state'];
  for (const dir of dirs) {
    const fullPath = path.join(projectPath, dir);
    try {
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        console.log(`  ${chalk.green('✓')} ${dir}/`);
      } else {
        console.log(`  ${chalk.red('✗')} ${dir}/ (not a directory)`);
        errors++;
      }
    } catch {
      console.log(`  ${chalk.red('✗')} ${dir}/ (missing)`);
      errors++;
    }
  }

  // Check essential files
  const files = ['CLAUDE.md'];
  for (const file of files) {
    const fullPath = path.join(projectPath, file);
    try {
      await fs.access(fullPath);
      console.log(`  ${chalk.green('✓')} ${file}`);
    } catch {
      console.log(`  ${chalk.yellow('!')} ${file} (missing, may be generated)`);
    }
  }

  // Check project brief
  const projectBrief = path.join(projectPath, 'stages/01-brainstorm/inputs/project_brief.md');
  try {
    await fs.access(projectBrief);
    console.log(`  ${chalk.green('✓')} project_brief.md`);
  } catch {
    console.log(`  ${chalk.red('✗')} project_brief.md (required for stage 01)`);
    errors++;
  }

  console.log('');
  return errors;
}

// Verify stage outputs
async function verifyStageOutputs(projectPath: string, stage: string): Promise<VerificationResult> {
  logInfo(`Verifying outputs for stage: ${stage}`);

  const stageDir = path.join(projectPath, 'stages', stage);
  const outputsDir = path.join(stageDir, 'outputs');
  const handoffFile = path.join(stageDir, 'HANDOFF.md');
  const errors: string[] = [];
  let passed = true;

  // Check outputs directory
  try {
    const stat = await fs.stat(outputsDir);
    if (stat.isDirectory()) {
      console.log(`  ${chalk.green('✓')} outputs/ directory exists`);

      // Check required output file
      const required = REQUIRED_OUTPUTS[stage];
      if (required) {
        const requiredPath = path.join(outputsDir, required);
        try {
          await fs.access(requiredPath);
          console.log(`  ${chalk.green('✓')} ${required}`);
        } catch {
          console.log(`  ${chalk.red('✗')} ${required} (missing)`);
          errors.push(`Missing required output: ${required}`);
          passed = false;
        }
      }

      // List other outputs
      const files = await fs.readdir(outputsDir);
      console.log(`  ${chalk.blue('i')} Total outputs: ${files.length} file(s)`);
    }
  } catch {
    console.log(`  ${chalk.red('✗')} outputs/ directory missing`);
    errors.push('Missing outputs directory');
    passed = false;
  }

  // Check HANDOFF.md
  try {
    await fs.access(handoffFile);
    console.log(`  ${chalk.green('✓')} HANDOFF.md`);

    // Verify HANDOFF sections
    const handoffContent = await fs.readFile(handoffFile, 'utf-8');
    const sections = ['Completed Tasks', 'Key Decisions', 'Modified Files'];
    for (const section of sections) {
      if (handoffContent.includes(`## ${section}`)) {
        console.log(`    ${chalk.green('✓')} Section: ${section}`);
      } else {
        console.log(`    ${chalk.yellow('!')} Section: ${section} (missing)`);
      }
    }
  } catch {
    console.log(`  ${chalk.yellow('!')} HANDOFF.md (not yet generated)`);
  }

  console.log('');

  if (passed) {
    logSuccess(`Stage ${stage}: All outputs verified`);
  } else {
    logError(`Stage ${stage}: ${errors.length} output(s) missing`);
  }

  return { stage, passed, errors };
}

// Check progress.json
async function checkProgress(projectPath: string): Promise<void> {
  logInfo('Checking progress state...');

  const progressFile = path.join(projectPath, 'state/progress.json');

  try {
    const content = await fs.readFile(progressFile, 'utf-8');
    const progress = JSON.parse(content);

    console.log(`  ${chalk.green('✓')} progress.json is valid JSON`);
    console.log(`  ${chalk.blue('i')} Current stage: ${progress.current_stage || 'unknown'}`);
    console.log(`  ${chalk.blue('i')} Stage status: ${progress.stage_status || 'unknown'}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(`  ${chalk.yellow('!')} progress.json not found (will be created on first run)`);
    } else {
      console.log(`  ${chalk.red('✗')} progress.json is invalid`);
    }
  }

  console.log('');
}

// Check collaboration outputs
async function checkCollaborationOutputs(projectPath: string, stage: string): Promise<void> {
  const collabDir = path.join(projectPath, 'state/collaborations', stage);

  try {
    await fs.access(collabDir);
    logInfo(`Checking collaboration outputs for ${stage}...`);

    const sessions = await fs.readdir(collabDir);
    if (sessions.length === 0) {
      console.log(`  ${chalk.yellow('!')} No collaboration sessions found`);
      return;
    }

    const latest = sessions.sort().reverse()[0];
    const sessionDir = path.join(collabDir, latest);

    const expectedFiles = ['output_gemini.md', 'output_claudecode.md', 'execution_summary.md'];
    for (const file of expectedFiles) {
      try {
        await fs.access(path.join(sessionDir, file));
        console.log(`  ${chalk.green('✓')} ${file}`);
      } catch {
        console.log(`  ${chalk.yellow('!')} ${file} (not found)`);
      }
    }

    console.log('');
  } catch {
    console.log(`  ${chalk.blue('i')} No collaboration outputs for ${stage}`);
  }
}

// Run verification for all stages
async function runVerification(projectPath: string): Promise<boolean> {
  printHeader('Claude-Symphony Pipeline Integration Test');

  if (!(await checkPrerequisites())) {
    return false;
  }

  logInfo(`Running verification for project: ${projectPath}`);
  console.log('');

  const structureErrors = await verifyProjectStructure(projectPath);
  if (structureErrors > 0) {
    logError('Project structure verification failed');
    return false;
  }

  await checkProgress(projectPath);

  let totalPassed = 0;
  let totalFailed = 0;

  for (const stage of STAGES) {
    const result = await verifyStageOutputs(projectPath, stage);
    if (result.passed) {
      totalPassed++;
    } else {
      totalFailed++;
    }

    // Check collaboration outputs for parallel stages
    const parallelStages = ['01-brainstorm', '03-planning', '04-ui-ux', '07-refactoring', '09-testing'];
    if (parallelStages.includes(stage)) {
      await checkCollaborationOutputs(projectPath, stage);
    }
  }

  // Print summary
  printSection('VERIFICATION SUMMARY');
  console.log(`  Total Stages: ${STAGES.length}`);
  console.log(`  ${chalk.green('Passed')}: ${totalPassed}`);
  console.log(`  ${chalk.red('Failed')}: ${totalFailed}`);
  console.log('');

  if (totalFailed === 0) {
    console.log(chalk.green('All verifications passed!'));
    return true;
  } else {
    console.log(chalk.yellow('Some verifications failed. Check log for details.'));
    return false;
  }
}

// Run single stage test
async function runStageTest(projectPath: string, stage: string): Promise<void> {
  logInfo(`Testing stage: ${stage}`);
  console.log('');
  console.log(chalk.yellow('NOTE: Stage execution requires an interactive Claude CLI session.'));
  console.log(`To run stage ${stage}:`);
  console.log(`  cd ${projectPath}`);
  console.log('  claude');
  console.log(`  /run-stage ${stage}`);
  console.log('');

  await verifyStageOutputs(projectPath, stage);
}

// Parse command line arguments
function parseArgs(): {
  mode: 'full' | 'stage' | 'verify' | 'quick';
  targetStage: string;
  projectPath: string;
  verbose: boolean;
} {
  const args = process.argv.slice(2);
  let mode: 'full' | 'stage' | 'verify' | 'quick' = 'full';
  let targetStage = '';
  let projectPath = PROJECT_ROOT;
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--help':
        printHelp();
        process.exit(0);
      case '--stage':
        mode = 'stage';
        targetStage = args[++i];
        break;
      case '--verify-only':
        mode = 'verify';
        break;
      case '--project':
        projectPath = args[++i];
        break;
      case '--quick':
        mode = 'quick';
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

  return { mode, targetStage, projectPath, verbose };
}

// Main function
async function main(): Promise<void> {
  const { mode, targetStage, projectPath } = parseArgs();

  switch (mode) {
    case 'full':
    case 'verify': {
      const success = await runVerification(projectPath);
      process.exit(success ? 0 : 1);
    }
    case 'stage': {
      // Convert stage number to full name
      let fullStage = targetStage;
      if (targetStage.length === 2) {
        const found = STAGES.find((s) => s.startsWith(`${targetStage}-`));
        if (found) fullStage = found;
      }
      await runStageTest(projectPath, fullStage);
      break;
    }
    case 'quick':
      await runStageTest(projectPath, '01-brainstorm');
      break;
  }
}

main().catch((error) => {
  logError(`Pipeline test failed: ${error}`);
  process.exit(1);
});
