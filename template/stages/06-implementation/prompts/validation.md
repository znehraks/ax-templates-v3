# 산출물 검증 프롬프트 - Implementation

## 검증 대상

| 산출물 | 필수 조건 | 검증 방법 |
|--------|----------|----------|
| `source_code/` | Lint 통과 | `npm run lint` |
| `source_code/` | Type 체크 통과 | `npm run typecheck` |
| `implementation_log.md` | 변경 기록 | 구조 확인 |
| `HANDOFF.md` | 체크포인트 참조 | 항목 확인 |

## 검증 명령

```bash
/validate --stage 06-implementation
```

## 품질 기준

### source_code/
- [ ] ESLint 에러 없음
- [ ] TypeScript 타입 에러 없음
- [ ] 폴더 구조 준수 (implementation.yaml)
- [ ] 네이밍 규칙 준수
- [ ] 코드 포맷팅 적용

### implementation_log.md
- [ ] 구현된 태스크 목록
- [ ] 변경된 파일 목록
- [ ] 알려진 이슈/기술 부채

### HANDOFF.md
- [ ] 완료된 기능 체크리스트
- [ ] 체크포인트 참조
- [ ] 리팩토링 필요 항목

## 자동 검증 스크립트

```bash
# Lint 검사
npm run lint

# Type 검사
npm run typecheck

# 빌드 검증
npm run build

# 기본 테스트
npm run test -- --passWithNoTests
```

## 코드 품질 메트릭

| 메트릭 | 기준 | 명령 |
|--------|------|------|
| Lint 에러 | 0 | `npm run lint` |
| Type 에러 | 0 | `npm run typecheck` |
| 빌드 성공 | Yes | `npm run build` |

## 실패 시 조치

1. Lint 에러 → `npm run lint --fix`
2. Type 에러 → 타입 수정
3. 빌드 실패 → 에러 로그 분석 후 수정
