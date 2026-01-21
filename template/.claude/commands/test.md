# /test

09-testing 스테이지를 바로 시작합니다.

## 사용법
```
/test [test-type]
```

## 스테이지 정보

| 항목 | 값 |
|------|-----|
| 스테이지 | 09-testing |
| AI 모델 | Codex |
| 실행 모드 | Sandbox + Playwright MCP |
| 체크포인트 | 선택 |

## 동작

1. **전제 조건 확인**
   - 08-qa 완료 여부
   - qa-report.md 존재

2. **테스팅 실행**
   - 통합 테스트
   - E2E 테스트 (Playwright)
   - 회귀 테스트

3. **산출물 생성**
   - test-results.md - 테스트 결과
   - coverage-report.html - 커버리지

## 실행

```bash
scripts/run-stage.sh 09-testing "$ARGUMENTS"
```

## 입력 파일

- `stages/06-implementation/outputs/src/`
- `stages/06-implementation/outputs/tests/`
- `stages/08-qa/outputs/qa-report.md`

## 출력 파일

- `stages/09-testing/outputs/test-results.md`
- `stages/09-testing/outputs/e2e-results/`
- `stages/09-testing/outputs/coverage/`

## 테스트 유형

| 유형 | 도구 | 설명 |
|------|------|------|
| Unit | Jest/Vitest | 단위 테스트 |
| Integration | Testing Library | 통합 테스트 |
| E2E | Playwright | 엔드투엔드 |
| Visual | Playwright | 스크린샷 비교 |

## Playwright MCP 활용

```bash
# 브라우저 스냅샷
mcp__playwright__browser_snapshot

# 스크린샷
mcp__playwright__browser_take_screenshot

# 폼 테스트
mcp__playwright__browser_fill_form
```

## 관련 명령어

- `/run-stage 09` - 전제조건 확인 후 시작
- `/next` - 다음 스테이지 (10-deployment)
- `/qa` - 이전 스테이지
- `/deploy` - 배포 바로 시작

## 커버리지 목표

| 메트릭 | 목표 |
|--------|------|
| Line | ≥ 80% |
| Branch | ≥ 70% |
| Function | ≥ 80% |

## Tips

- E2E는 핵심 플로우 중심
- 실패 시 스크린샷 자동 저장
- CI에서 headless 모드 실행
