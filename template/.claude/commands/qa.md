# /qa

08-qa 스테이지를 바로 시작합니다.

## 사용법
```
/qa [focus-area]
```

## 스테이지 정보

| 항목 | 값 |
|------|-----|
| 스테이지 | 08-qa |
| AI 모델 | ClaudeCode |
| 실행 모드 | Plan Mode + Sandbox |
| 체크포인트 | 선택 |

## 동작

1. **전제 조건 확인**
   - 07-refactoring 완료 여부
   - src/, tests/ 존재

2. **QA 실행**
   - 코드 품질 검사
   - 보안 취약점 스캔
   - 성능 분석

3. **산출물 생성**
   - qa-report.md - QA 보고서
   - issues.json - 발견된 이슈

## 실행

```bash
scripts/run-stage.sh 08-qa "$ARGUMENTS"
```

## 입력 파일

- `stages/06-implementation/outputs/src/`
- `stages/07-refactoring/outputs/refactoring-report.md`

## 출력 파일

- `stages/08-qa/outputs/qa-report.md`
- `stages/08-qa/outputs/issues.json`
- `stages/08-qa/outputs/security-audit.md`

## QA 체크리스트

### 코드 품질
- [ ] 린트 규칙 통과
- [ ] 타입 체크 통과
- [ ] 코드 복잡도 검사
- [ ] 테스트 커버리지 확인

### 보안
- [ ] 의존성 취약점 스캔
- [ ] 하드코딩된 시크릿 검사
- [ ] OWASP Top 10 검토

### 성능
- [ ] 번들 크기 분석
- [ ] 렌더링 성능
- [ ] 메모리 사용량

## 관련 명령어

- `/run-stage 08` - 전제조건 확인 후 시작
- `/next` - 다음 스테이지 (09-testing)
- `/refactor` - 이전 스테이지
- `/test` - 테스팅 바로 시작

## QA 도구

- ESLint/Prettier - 코드 스타일
- TypeScript - 타입 검사
- npm audit - 보안 스캔
- Coverage - 테스트 커버리지
