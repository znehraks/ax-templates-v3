# /refactor

07-refactoring 스테이지를 바로 시작합니다.

## 사용법
```
/refactor [focus-area]
```

## 스테이지 정보

| 항목 | 값 |
|------|-----|
| 스테이지 | 07-refactoring |
| AI 모델 | Codex → ClaudeCode |
| 실행 모드 | Deep Dive |
| 체크포인트 | **필수** |

## 동작

1. **전제 조건 확인**
   - 06-implementation 완료 여부
   - src/, tests/ 존재
   - 06 체크포인트 존재

2. **리팩토링 실행**
   - Codex: 코드 분석 및 개선 제안
   - ClaudeCode: 리팩토링 적용

3. **산출물 생성**
   - (개선된) src/
   - refactoring-report.md

## 실행

```bash
scripts/run-stage.sh 07-refactoring "$ARGUMENTS"
```

## 워크플로우

```
Codex (분석)
    ↓
개선점 식별
    ↓
ClaudeCode (적용)
    ↓
테스트 검증
```

## 입력 파일

- `stages/06-implementation/outputs/src/`
- `stages/06-implementation/outputs/tests/`

## 출력 파일

- (수정된) `src/`
- `stages/07-refactoring/outputs/refactoring-report.md`

## 체크포인트 필수!

리팩토링 전후로 **체크포인트 필수**:

```bash
# 리팩토링 전
/checkpoint "리팩토링 전 상태"

# 리팩토링 후
/checkpoint "리팩토링 완료"
```

## 리팩토링 영역

- 코드 중복 제거
- 함수/클래스 분리
- 명명 규칙 통일
- 성능 최적화
- 보안 개선

## 관련 명령어

- `/run-stage 07` - 전제조건 확인 후 시작
- `/next` - 다음 스테이지 (08-qa)
- `/implement` - 이전 스테이지
- `/codex` - Codex CLI 직접 호출
- `/checkpoint` - 체크포인트 생성
- `/restore` - 롤백

## Tips

- 리팩토링 전 반드시 체크포인트
- 작은 단위로 점진적 개선
- 테스트 통과 확인 후 커밋
