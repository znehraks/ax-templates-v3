# AI 협업 프롬프트 - Testing & E2E

## 협업 모드: Test Generation Chain

이 스테이지에서는 **테스트 생성 체인**을 사용하여 포괄적인 테스트를 작성합니다.

### 참여 모델
- **Codex**: 테스트 코드 생성
- **ClaudeCode**: E2E 테스트, Playwright 통합

### 협업 프롬프트

```
# 테스트 생성 체인
/collaborate --mode sequential --chain "codex:unit_tests -> codex:integration_tests -> claude:e2e_tests"
```

### 테스트 계층

| 계층 | 담당 AI | 도구 |
|------|---------|------|
| 단위 테스트 | Codex | Vitest/Jest |
| 통합 테스트 | Codex | Testing Library |
| E2E 테스트 | Claude | Playwright |

### Codex 활용

```bash
# 단위 테스트 생성
/codex "다음 함수에 대한 단위 테스트 작성:
[함수 코드]
테스트 프레임워크: Vitest
커버리지 목표: 80%"

# E2E 테스트 생성
/codex "다음 사용자 플로우에 대한 Playwright 테스트:
1. 로그인
2. 핵심 기능
3. 에러 시나리오"
```

### MCP 서버: Playwright

```javascript
// E2E 테스트 예시
test('로그인 플로우', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### 출력 형식

```markdown
## AI 협업 결과

### Codex 단위 테스트
- [파일]: [테스트 케이스 수]
...

### Codex 통합 테스트
- [시나리오]: [커버리지]
...

### Claude E2E 테스트
- [플로우]: [테스트 케이스]
...

### 커버리지 요약
- Statements: X%
- Branches: X%
- Functions: X%
- Lines: X%
```
