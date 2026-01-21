# /tasks

05-task-management 스테이지를 바로 시작합니다.

## 사용법
```
/tasks
```

## 스테이지 정보

| 항목 | 값 |
|------|-----|
| 스테이지 | 05-task-management |
| AI 모델 | ClaudeCode |
| 실행 모드 | Plan Mode |
| 체크포인트 | 선택 |

## 동작

1. **전제 조건 확인**
   - 04-ui-ux 완료 여부
   - wireframes/, component-spec.md 존재

2. **태스크 분해**
   - PRD 기반 태스크 추출
   - 의존성 분석
   - 스프린트 계획

3. **산출물 생성**
   - tasks.json - 태스크 목록 (구조화)
   - sprints.md - 스프린트 계획

## 실행

```bash
scripts/run-stage.sh 05-task-management "$ARGUMENTS"
```

## 입력 파일

- `stages/03-planning/outputs/PRD.md`
- `stages/04-ui-ux/outputs/wireframes/`
- `stages/04-ui-ux/outputs/component-spec.md`

## 출력 파일

- `stages/05-task-management/outputs/tasks.json`
- `stages/05-task-management/outputs/sprints.md`

## tasks.json 구조

```json
{
  "tasks": [
    {
      "id": "T001",
      "title": "사용자 인증 구현",
      "sprint": 1,
      "priority": "high",
      "dependencies": [],
      "estimate": "4h",
      "status": "pending"
    }
  ]
}
```

## 관련 명령어

- `/run-stage 05` - 전제조건 확인 후 시작
- `/next` - 다음 스테이지 (06-implementation)
- `/ui-ux` - 이전 스테이지
- `/implement` - 구현 바로 시작

## Tips

- 태스크는 4시간 이내로 분해
- 의존성 명확히 표시
- 스프린트당 5-7개 태스크 권장
