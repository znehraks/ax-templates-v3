#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function main() {
  const args = process.argv.slice(2);
  const projectName = args[0] || '.';

  // 도움말
  if (projectName === '--help' || projectName === '-h') {
    console.log(`
${colors.cyan}create-ax-project${colors.reset} - Multi-AI Workflow Pipeline 프로젝트 생성

${colors.yellow}사용법:${colors.reset}
  npx create-ax-project <project-name>
  npx create-ax-project .  (현재 디렉토리에 생성)

${colors.yellow}예시:${colors.reset}
  npx create-ax-project my-saas-app
  npx create-ax-project my-game

${colors.yellow}생성 후:${colors.reset}
  1. cd <project-name>
  2. stages/01-brainstorm/inputs/project_brief.md 작성
  3. /run-stage 01-brainstorm 실행
`);
    process.exit(0);
  }

  // 프로젝트 이름 검증
  if (projectName !== '.' && !/^[a-z0-9-]+$/.test(projectName)) {
    log('오류: 프로젝트 이름은 영문 소문자, 숫자, 하이픈만 허용됩니다.', 'red');
    process.exit(1);
  }

  const templateDir = path.join(__dirname, '..', 'template');
  const targetDir = path.resolve(projectName);
  const actualProjectName = projectName === '.' ? path.basename(targetDir) : projectName;

  // 템플릿 존재 확인
  if (!fs.existsSync(templateDir)) {
    log(`오류: 템플릿 디렉토리를 찾을 수 없습니다: ${templateDir}`, 'red');
    process.exit(1);
  }

  // 대상 디렉토리 확인
  if (projectName !== '.' && fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir);
    if (files.length > 0) {
      log(`오류: 디렉토리가 비어있지 않습니다: ${targetDir}`, 'red');
      process.exit(1);
    }
  }

  console.log('');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log(`🚀 ax-templates 프로젝트 생성: ${actualProjectName}`, 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  console.log('');

  // 1. 대상 디렉토리 생성
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  log(`✓ 프로젝트 디렉토리: ${targetDir}`, 'green');

  // 2. 템플릿 복사
  log('  템플릿 복사 중...', 'blue');
  copyRecursiveSync(templateDir, targetDir);
  log('✓ 템플릿 복사 완료', 'green');

  // 3. progress.json 초기화
  const progressTemplatePath = path.join(targetDir, 'state', 'progress.json.template');
  const progressPath = path.join(targetDir, 'state', 'progress.json');

  if (fs.existsSync(progressTemplatePath)) {
    let progressContent = fs.readFileSync(progressTemplatePath, 'utf8');
    const timestamp = new Date().toISOString();

    progressContent = progressContent
      .replace('{{PROJECT_NAME}}', actualProjectName)
      .replace('{{STARTED_AT}}', timestamp);

    fs.writeFileSync(progressPath, progressContent);
    fs.unlinkSync(progressTemplatePath); // 템플릿 파일 삭제
    log('✓ progress.json 초기화 완료', 'green');
  }

  // 4. project_brief.md 생성
  const briefPath = path.join(targetDir, 'stages', '01-brainstorm', 'inputs', 'project_brief.md');
  const briefDir = path.dirname(briefPath);

  if (!fs.existsSync(briefDir)) {
    fs.mkdirSync(briefDir, { recursive: true });
  }

  const briefContent = `# Project Brief

## 프로젝트 이름
${actualProjectName}

## 한 줄 설명
[프로젝트를 한 줄로 설명해주세요]

## 문제 정의
[해결하려는 문제는 무엇인가요?]

## 타겟 사용자
[주요 사용자는 누구인가요?]

## 핵심 기능 (초안)
1. [기능 1]
2. [기능 2]
3. [기능 3]

## 성공 기준
[프로젝트가 성공했다고 판단하는 기준은?]

## 제약조건
- 일정:
- 예산:
- 기술:

## 참고 자료
- [URL 또는 문서]
`;

  fs.writeFileSync(briefPath, briefContent);
  log('✓ project_brief.md 생성 완료', 'green');

  // 5. 완료 메시지
  console.log('');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green');
  log(`✓ 프로젝트 '${actualProjectName}' 생성 완료!`, 'green');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green');
  console.log('');
  log('다음 단계:', 'yellow');
  if (projectName !== '.') {
    console.log(`  1. cd ${projectName}`);
    console.log('  2. stages/01-brainstorm/inputs/project_brief.md 작성');
    console.log('  3. /run-stage 01-brainstorm 실행');
  } else {
    console.log('  1. stages/01-brainstorm/inputs/project_brief.md 작성');
    console.log('  2. /run-stage 01-brainstorm 실행');
  }
  console.log('');
  log('파이프라인 스테이지:', 'cyan');
  console.log('  01-brainstorm → 02-research → 03-planning → 04-ui-ux');
  console.log('  → 05-task-management → 06-implementation → 07-refactoring');
  console.log('  → 08-qa → 09-testing → 10-deployment');
  console.log('');
}

main();
