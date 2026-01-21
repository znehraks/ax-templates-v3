# 산출물 검증 프롬프트 - Task Management

## 검증 대상

| 산출물 | 필수 조건 | 검증 방법 |
|--------|----------|----------|
| `tasks.md` | 전체 태스크 목록 | 구조 확인 |
| `sprint_plan.md` | 스프린트 3개+ | 수량 확인 |
| `milestones.md` | 산출물 정의 | 구조 확인 |
| `HANDOFF.md` | 첫 스프린트 태스크 | 항목 확인 |

## 검증 명령

```bash
/validate --stage 05-task-management
```

## 품질 기준

### tasks.md
- [ ] MoSCoW 분류 적용
- [ ] 각 태스크에 예상 시간
- [ ] 의존성 명시
- [ ] 담당 스테이지 지정

### sprint_plan.md
- [ ] 스프린트 3개 이상
- [ ] 각 스프린트 용량 계산
- [ ] 버퍼 시간 포함
- [ ] 우선순위 기반 할당

### milestones.md
- [ ] 마일스톤별 산출물 정의
- [ ] 성공 기준 명시
- [ ] 검증 방법 포함

### HANDOFF.md
- [ ] 스프린트 1 태스크 목록
- [ ] 의존성 그래프
- [ ] 우선 구현 항목

## 자동 검증 스크립트

```bash
# 태스크 수 확인
grep -c "^- TASK-" outputs/tasks.md

# 스프린트 수 확인
grep -c "^## Sprint" outputs/sprint_plan.md

# 마일스톤 수 확인
grep -c "^## Milestone" outputs/milestones.md

# 의존성 그래프 존재 확인
grep -c "→" outputs/tasks.md
```

## 태스크 품질 체크

```bash
# 예상 시간 누락 확인
grep -E "^- TASK-" outputs/tasks.md | grep -v -E "\([0-9]+h\)"

# 의존성 누락 확인
grep -E "^- TASK-" outputs/tasks.md | grep -v "의존성"
```
