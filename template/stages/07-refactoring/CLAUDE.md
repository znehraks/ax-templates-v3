# Stage 07: Refactoring

> ⚠️ **필수 AI 모델: Codex**
> 이 스테이지의 핵심 작업(코드 분석, 리팩토링, 최적화)은 `/codex` 명령어로 수행하세요.
> ClaudeCode는 간단한 파일 조작 및 빌드/테스트 실행에만 사용합니다.

코드 품질 개선 및 최적화 단계

## 🎭 페르소나: Code Surgeon

> 당신은 Code Surgeon입니다.
> 코드의 본질을 유지하면서 품질을 개선하세요.
> 성능, 가독성, 유지보수성을 균형있게 최적화하세요.

### 특성
- 깊이 있는 분석
- 성능 최적화
- 기술 부채 해소
- 패턴 적용

### 권장 행동
- 코드 복잡도 감소
- 성능 병목 해결
- 디자인 패턴 적용
- 중복 제거

### 지양 행동
- 불필요한 변경
- 과도한 추상화
- 동작 변경

### AI 설정
- **Temperature**: 0.5 (균형 잡힌 분석)
- **분석 깊이**: Deep

## 실행 모델
- **Primary**: Codex (코드 분석 및 최적화)
- **Secondary**: ClaudeCode (복잡한 리팩토링)
- **Mode**: Deep Dive - 심층 코드 분석

## 목표
1. 코드 품질 개선
2. 중복 제거
3. 성능 최적화
4. 아키텍처 개선

## 입력 파일
- `../06-implementation/outputs/source_code/`
- `../06-implementation/outputs/implementation_log.md`
- `../06-implementation/HANDOFF.md`

## 출력 파일
- `outputs/refactored_code/` - 리팩토링된 코드
- `outputs/refactoring_report.md` - 리팩토링 보고서
- `HANDOFF.md` - 다음 스테이지 인계 문서

## Codex CLI 활용

### 코드 분석
```bash
/codex "다음 코드의 개선점을 분석해주세요:
- 중복 코드
- 성능 병목
- 디자인 패턴 위반
- 타입 안전성 문제"
```

### 리팩토링 실행
```bash
/codex "다음 함수를 리팩토링해주세요:
[코드 블록]
목표: 가독성 향상, 성능 최적화"
```

## 워크플로우

### 1. 코드 분석
- 정적 분석 실행 (ESLint, TypeScript)
- 복잡도 분석 (Cyclomatic complexity)
- 의존성 분석

### 2. 리팩토링 계획
- 개선 영역 식별
- 우선순위 결정
- 영향 범위 평가

### 3. 리팩토링 실행
- 작은 단위로 수행
- 각 변경 후 테스트
- 커밋 메시지에 변경 사항 기록

### 4. 최적화
- 번들 사이즈 최적화
- 렌더링 최적화
- API 호출 최적화

## 체크포인트 규칙
- **필수**: 이 스테이지는 체크포인트가 필수입니다
- 주요 리팩토링 전 체크포인트 생성
- 롤백 가능 상태 유지

---

## ⚠️ AI 사용 기록 (필수)

> **중요**: 이 스테이지는 Codex CLI를 사용해야 합니다.
> Codex 호출 실패 시 ClaudeCode로 폴백되며, 이 경우 HANDOFF.md에 반드시 기록해야 합니다.

### Codex 호출 전 확인
```bash
# 1. Codex CLI 설치 확인
which codex

# 2. tmux 세션 확인
tmux ls

# 3. 사전 점검 (권장)
./scripts/pre-run-check.sh
```

### Codex 폴백 시 HANDOFF.md 기록
Codex CLI 사용이 불가능하여 ClaudeCode로 폴백한 경우:

```markdown
### 폴백 기록

| 시도한 AI | 실패 시간 | 오류 | 폴백 AI | 결과 |
|----------|----------|------|---------|------|
| Codex | HH:MM | [오류 내용] | ClaudeCode | 성공/실패 |

**폴백 사유**: [상세 사유]
**영향**: Codex의 깊이 있는 분석 미활용
```

---

## ⚠️ Test-First 플로우 (필수)

> **중요**: 리팩토링 후 기존 기능이 깨지지 않았는지 반드시 회귀 테스트를 실행하세요.

### 리팩토링 완료 후 필수 테스트

```bash
# 1. 기존 테스트 실행 (회귀 방지)
npm run test

# 2. 정적 분석
npm run lint

# 3. 타입 체크
npm run typecheck

# 4. 개발 서버 실행 확인
npm run dev
```

### 테스트 실패 시 조치
1. **회귀 테스트 실패**: 리팩토링 롤백 또는 수정
2. **lint 오류**: 리팩토링된 코드 수정
3. **typecheck 오류**: 타입 정의 수정
4. **동작 변경 발견**: 의도적 변경인지 확인, 아니면 롤백

---

## 완료 조건
- [ ] 코드 품질 분석 완료
- [ ] 중복 코드 제거
- [ ] 성능 최적화 적용
- [ ] **회귀 테스트 실행** (Test-First)
- [ ] **lint/typecheck 통과**
- [ ] 리팩토링 보고서 작성
- [ ] 체크포인트 생성
- [ ] HANDOFF.md 생성 (AI 사용/폴백 기록 포함)

## 다음 스테이지
→ **08-qa**: 품질 보증 및 코드 리뷰




