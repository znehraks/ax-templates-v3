# /stages

10단계 파이프라인의 모든 스테이지 목록과 상세 정보를 표시합니다.

## 사용법
```
/stages
/stages [stage-id]
```

## 동작

1. **스테이지 목록 표시** (`/stages`)
   - 모든 스테이지 번호/이름
   - 담당 AI 모델
   - 현재 상태
   - 실행 모드

2. **특정 스테이지 상세** (`/stages [id]`)
   - 스테이지 config.yaml 정보
   - 입출력 파일 목록
   - 완료 조건

## 실행 스크립트

```bash
scripts/list-stages.sh "$ARGUMENTS"
```

## 출력 예시

### 목록 보기 (`/stages`)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Pipeline Stages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ##  Stage            AI Model        Mode          Status
─────────────────────────────────────────────────────────
 01  brainstorm       Gemini+Claude   YOLO          ✅
 02  research         Claude+MCP      Plan Mode     ✅
 03  planning         Gemini          Plan Mode     ✅
 04  ui-ux            Gemini          Plan Mode     🔄 ←
 05  task-management  ClaudeCode      Plan Mode     ⏳
 06  implementation   ClaudeCode      Plan+Sandbox  ⏳
 07  refactoring      Codex           Deep Dive     ⏳
 08  qa               ClaudeCode      Plan+Sandbox  ⏳
 09  testing          Codex           Playwright    ⏳
 10  deployment       ClaudeCode      Headless      ⏳
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
현재: 04-ui-ux | 다음: /run-stage 05 또는 /tasks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 상세 보기 (`/stages 06`)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Stage 06: Implementation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI Model:    ClaudeCode
Mode:        Plan Mode + Sandbox
Timeout:     240분 (가장 긴 스테이지)
Checkpoint:  필수

[Inputs]
 • 05-task-management/outputs/tasks.json
 • 05-task-management/outputs/sprint-plan.md
 • 04-ui-ux/outputs/wireframes/

[Outputs]
 • src/ (구현된 소스코드)
 • tests/ (단위 테스트)
 • implementation-notes.md

[Completion Criteria]
 □ 모든 태스크 구현 완료
 □ 단위 테스트 통과
 □ 린트/타입 체크 통과
 □ 체크포인트 생성 완료

[Quick Commands]
 • /implement     - 이 스테이지 바로 시작
 • /run-stage 06  - 전제조건 확인 후 시작
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 스테이지 정보 참조

| 스테이지 | 입력 | 출력 | 특징 |
|----------|------|------|------|
| 01-brainstorm | (없음) | ideas.md, decisions.md | YOLO 모드, 병렬 AI |
| 02-research | ideas.md | research.md, tech-stack.md | MCP 도구 활용 |
| 03-planning | research.md | PRD.md, architecture.md | 기획 문서화 |
| 04-ui-ux | PRD.md | wireframes/, components.md | 시각 설계 |
| 05-task-mgmt | PRD, wireframes | tasks.json, sprints.md | 태스크 분해 |
| 06-implementation | tasks.json | src/, tests/ | 핵심 구현 |
| 07-refactoring | src/ | src/ (개선) | 코드 품질 |
| 08-qa | src/ | qa-report.md | 품질 검증 |
| 09-testing | src/, qa | test-results.md | E2E 테스트 |
| 10-deployment | all | CI/CD, deploy | 배포 자동화 |

## 옵션

| 옵션 | 설명 |
|------|------|
| `--json` | JSON 형식으로 출력 |
| `--pending` | 대기 중인 스테이지만 표시 |
| `--completed` | 완료된 스테이지만 표시 |
