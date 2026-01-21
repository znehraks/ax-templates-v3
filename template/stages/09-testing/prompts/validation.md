# 산출물 검증 프롬프트 - Testing & E2E

## 검증 대상

| 산출물 | 필수 조건 | 검증 방법 |
|--------|----------|----------|
| `tests/` | 커버리지 80%+ | `npm run test:coverage` |
| `test_report.md` | 100% 통과 | 결과 확인 |
| `coverage_report.md` | 메트릭 포함 | 구조 확인 |
| `HANDOFF.md` | 배포 준비 상태 | 항목 확인 |

## 검증 명령

```bash
/validate --stage 09-testing
```

## 품질 기준

### tests/
- [ ] 단위 테스트 존재
- [ ] 통합 테스트 존재
- [ ] E2E 테스트 존재 (핵심 플로우)
- [ ] 모든 테스트 통과

### 커버리지 목표
- [ ] Statements: 80%+
- [ ] Branches: 75%+
- [ ] Functions: 80%+
- [ ] Lines: 80%+

### test_report.md
- [ ] 테스트 케이스 목록
- [ ] 통과/실패 현황
- [ ] 실패 테스트 분석 (있는 경우)

### coverage_report.md
- [ ] 커버리지 요약
- [ ] 파일별 커버리지
- [ ] 커버되지 않은 영역 식별

### HANDOFF.md
- [ ] 테스트 통과 확인
- [ ] 커버리지 달성 확인
- [ ] 배포 준비 체크리스트

## 자동 검증 스크립트

```bash
# 단위/통합 테스트 실행
npm run test

# 커버리지 측정
npm run test:coverage

# E2E 테스트 실행
npm run test:e2e

# 커버리지 임계값 확인
npm run test:coverage -- --coverageThreshold='{"global":{"statements":80,"branches":75,"functions":80,"lines":80}}'
```

## 커버리지 메트릭

| 메트릭 | 목표 | 실제 | 상태 |
|--------|------|------|------|
| Statements | 80% | - | - |
| Branches | 75% | - | - |
| Functions | 80% | - | - |
| Lines | 80% | - | - |

## E2E 테스트 체크리스트

- [ ] 인증 플로우 테스트
- [ ] 핵심 기능 플로우 테스트
- [ ] 에러 시나리오 테스트
- [ ] 반응형 테스트 (선택적)

## 실패 시 조치

1. 테스트 실패 → 버그 수정 후 재실행
2. 커버리지 미달 → 테스트 추가
3. E2E 실패 → UI/로직 수정
