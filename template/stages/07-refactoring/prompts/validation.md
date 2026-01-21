# 산출물 검증 프롬프트 - Refactoring

## 검증 대상

| 산출물 | 필수 조건 | 검증 방법 |
|--------|----------|----------|
| `refactored_code/` | 동작 유지 | 테스트 통과 |
| `refactored_code/` | 품질 개선 | 메트릭 비교 |
| `refactoring_report.md` | 변경 내역 | 구조 확인 |
| `HANDOFF.md` | 체크포인트 참조 | 항목 확인 |

## 검증 명령

```bash
/validate --stage 07-refactoring
```

## 품질 기준

### refactored_code/
- [ ] 모든 기존 테스트 통과
- [ ] Lint 에러 없음
- [ ] 타입 에러 없음
- [ ] 복잡도 감소 (목표: 20%↓)
- [ ] 중복 코드 감소 (목표: 50%↓)

### refactoring_report.md
- [ ] 리팩토링된 함수/클래스 목록
- [ ] 변경 전후 비교
- [ ] 성능 개선 측정값
- [ ] 남은 기술 부채

### HANDOFF.md
- [ ] 완료된 리팩토링 목록
- [ ] 체크포인트 참조
- [ ] QA 필요 영역

## 자동 검증 스크립트

```bash
# 테스트 통과 확인
npm run test

# Lint 검사
npm run lint

# 번들 사이즈 비교
npm run build && du -sh dist/

# 복잡도 측정 (선택적)
npx complexity-report src/**/*.ts
```

## 품질 메트릭 비교

| 메트릭 | 이전 | 이후 | 개선율 |
|--------|------|------|--------|
| 평균 복잡도 | - | - | - |
| 중복 코드 | - | - | - |
| 번들 사이즈 | - | - | - |

## 회귀 테스트

```bash
# 전체 테스트 실행
npm run test

# E2E 테스트 실행 (있는 경우)
npm run test:e2e
```

## 실패 시 조치

1. 테스트 실패 → 체크포인트로 롤백 후 재시도
2. 성능 저하 → 변경 사항 검토 및 최적화
3. 타입 에러 → 타입 수정 후 재검증
