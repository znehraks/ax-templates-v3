# /run-stage

특정 스테이지를 실행합니다.

## 사용법
```
/run-stage [stage-id]
```

## 스테이지 ID
- `01-brainstorm` - 브레인스토밍
- `02-research` - 리서치
- `03-planning` - 기획
- `04-ui-ux` - UI/UX 설계
- `05-task-management` - 태스크 관리
- `06-implementation` - 구현
- `07-refactoring` - 리팩토링
- `08-qa` - QA
- `09-testing` - 테스팅
- `10-deployment` - 배포

## 동작

1. **전제조건 검증**
   - 이전 스테이지 완료 여부 확인
   - 이전 스테이지 HANDOFF.md 존재 확인
   - 필수 입력 파일 존재 확인

2. **스테이지 설정 로드**
   - `stages/[stage-id]/config.yaml` 로드
   - `stages/[stage-id]/CLAUDE.md` 로드

3. **상태 업데이트**
   - `state/progress.json` 현재 스테이지 업데이트
   - 시작 시간 기록

4. **스테이지 실행**
   - 스테이지 CLAUDE.md 지침 따름
   - 프롬프트 템플릿 활용

## 실행 스크립트

```bash
scripts/run-stage.sh "$ARGUMENTS"
```

## 예시

```
/run-stage 02-research

출력:
✓ 전제조건 검증 완료
  - 01-brainstorm: 완료 ✓
  - HANDOFF.md: 존재 ✓
✓ 스테이지 설정 로드됨
✓ 현재 스테이지: 02-research

[02-research CLAUDE.md 내용 표시]
```

## 전제조건 실패 시

```
/run-stage 03-planning

오류:
✗ 전제조건 미충족
  - 02-research: 진행 중 (미완료)
  - 02-research HANDOFF.md: 없음

먼저 02-research 스테이지를 완료해주세요.
/handoff 를 실행하여 핸드오프 문서를 생성하세요.
```

## 주의사항
- 스테이지 건너뛰기 불가 (순차 실행)
- 체크포인트 필수 스테이지 (06, 07)는 체크포인트 없이 진행 불가
