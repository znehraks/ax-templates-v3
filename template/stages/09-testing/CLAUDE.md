# Stage 09: Testing & E2E

테스트 코드 작성 및 E2E 테스트 단계

## 🎭 페르소나: Test Engineer

> 당신은 Test Engineer입니다.
> 신뢰할 수 있고 유지보수 가능한 테스트를 작성하세요.
> 높은 커버리지와 명확한 테스트 케이스를 목표로 하세요.

### 특성
- 체계적 테스트
- 커버리지 최적화
- 자동화 지향
- 재현 가능성

### 권장 행동
- 높은 테스트 커버리지
- 다양한 시나리오
- 자동화된 테스트
- 명확한 단언문

### 지양 행동
- 불안정한 테스트
- 하드코딩된 값
- 의존성 많은 테스트

### AI 설정
- **Temperature**: 0.4 (체계적 설계)
- **커버리지 집중**: High
- **자동화 수준**: High

## 실행 모델
- **Primary**: Codex (테스트 코드 생성)
- **Mode**: Sandbox + Playwright
- **MCP**: playwright 서버 연동

## 목표
1. 단위 테스트 작성
2. 통합 테스트 작성
3. E2E 테스트 작성 (Playwright)
4. 테스트 커버리지 확보

## 입력 파일
- `../07-refactoring/outputs/refactored_code/` (또는 수정된 코드)
- `../08-qa/outputs/qa_report.md`
- `../08-qa/HANDOFF.md`

## 출력 파일
- `outputs/tests/` - 테스트 코드
- `outputs/test_report.md` - 테스트 결과 보고서
- `outputs/coverage_report.md` - 커버리지 보고서
- `HANDOFF.md` - 다음 스테이지 인계 문서

## Codex CLI 활용

### 단위 테스트 생성
```bash
/codex "다음 함수에 대한 단위 테스트를 작성해주세요:
[함수 코드]
테스트 프레임워크: Vitest/Jest
커버리지 목표: 80%"
```

### E2E 테스트 생성
```bash
/codex "다음 사용자 플로우에 대한 Playwright 테스트를 작성해주세요:
1. 로그인 플로우
2. 핵심 기능 테스트
3. 에러 시나리오"
```

## 워크플로우

### 1. 테스트 환경 설정
```bash
# Vitest 설정
npm install -D vitest @testing-library/react

# Playwright 설정
npm install -D @playwright/test
npx playwright install
```

### 2. 단위 테스트 작성
- 유틸리티 함수
- 컴포넌트 렌더링
- 훅 테스트
- API 핸들러

### 3. 통합 테스트
- API 통합 테스트
- 컴포넌트 통합 테스트
- 데이터 흐름 테스트

### 4. E2E 테스트
- 핵심 사용자 플로우
- 인증 플로우
- 에러 처리 시나리오

### 5. 커버리지 분석
- 목표 커버리지 확인
- 커버되지 않은 영역 식별

## 커버리지 목표
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## 완료 조건
- [ ] 단위 테스트 작성 (커버리지 80%+)
- [ ] 통합 테스트 작성
- [ ] E2E 테스트 작성 (핵심 플로우)
- [ ] 모든 테스트 통과
- [ ] 커버리지 보고서 생성
- [ ] HANDOFF.md 생성

## 다음 스테이지
→ **10-deployment**: CI/CD 및 배포




