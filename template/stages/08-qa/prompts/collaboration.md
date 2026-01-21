# AI 협업 프롬프트 - QA

## 협업 모드: Comprehensive Review

이 스테이지에서는 **포괄적 리뷰** 모드를 사용하여 품질을 보장합니다.

### 참여 모델
- **ClaudeCode**: 코드 리뷰, 버그 수정, 보안 검사

### 협업 프롬프트

```
# 다각도 검토
/collaborate --mode sequential --chain "claudecode:code_review -> claudecode:security_audit -> claudecode:fix"
```

### 리뷰 영역

| 영역 | 검토 항목 |
|------|----------|
| 코드 품질 | 가독성, 유지보수성, 베스트 프랙티스 |
| 보안 | OWASP Top 10, 입력 검증, 인증/인가 |
| 성능 | 응답 시간, 메모리, 리렌더링 |
| 기능 | 요구사항 충족, 엣지 케이스 |

### 보안 검사 체크리스트

- [ ] SQL Injection
- [ ] XSS (Cross-Site Scripting)
- [ ] CSRF (Cross-Site Request Forgery)
- [ ] 인증/인가 우회
- [ ] 민감 정보 노출
- [ ] 의존성 취약점

```bash
# 의존성 취약점 검사
npm audit
```

### 버그 우선순위

| 등급 | 기준 | 조치 |
|------|------|------|
| Critical | 보안, 데이터 손실 | 즉시 수정 |
| High | 주요 기능 장애 | 이번 스테이지 수정 |
| Medium | 부가 기능 이슈 | 다음 스프린트 |
| Low | UI/UX 개선 | 백로그 |

### 출력 형식

```markdown
## QA 결과

### 코드 리뷰
- [파일]: [이슈] - [심각도]
...

### 보안 검사
- [취약점]: [위치] - [조치]
...

### 버그 수정
- [BUG-001]: [설명] - [해결 방법]
...
```
