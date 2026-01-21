# Stage Validation Logic

현재 스테이지의 완료 조건을 검증합니다.

## 검증 프로세스

### 1. 현재 스테이지 식별

```bash
# progress.json에서 현재 스테이지 확인
CURRENT_STAGE=$(jq -r '.current_stage' state/progress.json)
```

### 2. 완료 조건 로드

각 스테이지별 필수 outputs:

| 스테이지 | 필수 파일 | 체크포인트 |
|----------|----------|------------|
| 01-brainstorm | ideas.md, decisions.md | - |
| 02-research | research.md, tech-stack.md | - |
| 03-planning | PRD.md, architecture.md | - |
| 04-ui-ux | wireframes/, component-spec.md | - |
| 05-task-management | tasks.json, sprints.md | - |
| 06-implementation | src/, tests/ | ✅ 필수 |
| 07-refactoring | src/ (수정됨) | ✅ 필수 |
| 08-qa | qa-report.md | - |
| 09-testing | test-results.md | - |
| 10-deployment | CI/CD 파일 | - |

### 3. 파일 존재 확인

```bash
STAGE_DIR="stages/$CURRENT_STAGE/outputs"

# 필수 파일 체크
check_required_files() {
    local files=("$@")
    local missing=()

    for file in "${files[@]}"; do
        if [ ! -e "$STAGE_DIR/$file" ]; then
            missing+=("$file")
        fi
    done

    echo "${missing[@]}"
}
```

### 4. 체크포인트 확인 (해당 시)

```bash
# 06, 07 스테이지는 체크포인트 필수
if [[ "$CURRENT_STAGE" == "06-"* ]] || [[ "$CURRENT_STAGE" == "07-"* ]]; then
    STAGE_NUM=$(echo "$CURRENT_STAGE" | cut -d'-' -f1)
    CP_EXISTS=$(ls -d state/checkpoints/CP-$STAGE_NUM-* 2>/dev/null | head -1)

    if [ -z "$CP_EXISTS" ]; then
        echo "⚠️ 체크포인트 필수: /checkpoint 실행 필요"
    fi
fi
```

## 검증 결과 형식

### 성공

```
✅ 스테이지 완료 조건 충족

[04-ui-ux]
✓ wireframes/ 존재 (3개 파일)
✓ component-spec.md 생성됨
✓ design-system.md 생성됨

다음 단계: /next 또는 /tasks
```

### 실패

```
⚠️ 스테이지 완료 조건 미충족

[06-implementation]
✓ src/ 존재
✓ tests/ 존재
✗ 체크포인트 없음

필요 작업:
1. /checkpoint "구현 완료" 실행
2. /next로 전환
```

## 자동 액션

검증 결과에 따른 자동 제안:

1. **모든 조건 충족**
   → HANDOFF.md 생성 제안
   → `/next` 명령어 안내

2. **일부 조건 미충족**
   → 누락된 항목 안내
   → 해결 방법 제안

3. **체크포인트 필요**
   → `/checkpoint` 명령어 안내
