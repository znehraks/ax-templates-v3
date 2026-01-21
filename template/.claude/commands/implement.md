# /implement

06-implementation 스테이지를 바로 시작합니다.

## 사용법
```
/implement [task-id]
```

## 스테이지 정보

| 항목 | 값 |
|------|-----|
| 스테이지 | 06-implementation |
| AI 모델 | ClaudeCode |
| 실행 모드 | Plan Mode + Sandbox |
| 체크포인트 | **필수** |
| 타임아웃 | 240분 (최장) |

## 동작

1. **전제 조건 확인**
   - 05-task-management 완료 여부
   - tasks.json 존재

2. **구현 실행**
   - 태스크별 구현
   - 단위 테스트 작성
   - 코드 품질 검증

3. **산출물 생성**
   - src/ - 소스코드
   - tests/ - 단위 테스트
   - implementation-notes.md

## 실행

```bash
scripts/run-stage.sh 06-implementation "$ARGUMENTS"
```

## 입력 파일

- `stages/05-task-management/outputs/tasks.json`
- `stages/05-task-management/outputs/sprints.md`
- `stages/04-ui-ux/outputs/wireframes/`

## 출력 파일

- `stages/06-implementation/outputs/src/`
- `stages/06-implementation/outputs/tests/`
- `stages/06-implementation/outputs/implementation-notes.md`

## 체크포인트 필수!

이 스테이지는 **체크포인트 필수**입니다:

```bash
# 주요 마일스톤마다 실행
/checkpoint "스프린트 1 완료"
```

## 완료 조건

- [ ] 모든 태스크 구현 완료
- [ ] 단위 테스트 통과
- [ ] 린트/타입 체크 통과
- [ ] 체크포인트 생성 완료

## 관련 명령어

- `/run-stage 06` - 전제조건 확인 후 시작
- `/next` - 다음 스테이지 (07-refactoring)
- `/tasks` - 이전 스테이지
- `/checkpoint` - 체크포인트 생성
- `/restore` - 체크포인트 복구

## Tips

- 스프린트 단위로 체크포인트 생성
- 테스트와 함께 구현
- implementation-notes.md에 결정사항 기록
