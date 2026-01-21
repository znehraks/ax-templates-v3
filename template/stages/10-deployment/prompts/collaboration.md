# AI 협업 프롬프트 - CI/CD & Deployment

## 협업 모드: Deployment Chain

이 스테이지에서는 **배포 체인**을 사용하여 안전한 배포를 수행합니다.

### 참여 모델
- **ClaudeCode**: CI/CD 설정, 배포 자동화

### 협업 프롬프트

```
# 배포 체인
/collaborate --mode sequential --chain "claudecode:ci_setup -> claudecode:cd_setup -> claudecode:deploy"
```

### 배포 단계

| 단계 | 작업 | 검증 |
|------|------|------|
| CI 설정 | 빌드/테스트 파이프라인 | 테스트 통과 |
| CD 설정 | 스테이징/프로덕션 파이프라인 | 환경 분리 |
| 배포 | 실제 배포 실행 | 헬스 체크 |

### CI/CD 파이프라인 구성

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
```

### 배포 플랫폼 선택

| 플랫폼 | 장점 | 권장 사용 |
|--------|------|----------|
| Vercel | Next.js 최적화 | 프론트엔드 |
| Railway | 풀스택 지원 | 풀스택 앱 |
| AWS | 확장성 | 엔터프라이즈 |
| Cloudflare | Edge 배포 | 정적/Edge |

### 롤백 전략

```bash
# 롤백 준비
/checkpoint --reason "배포 전 상태"

# 롤백 실행 (필요시)
/restore checkpoint_id
```

### 출력 형식

```markdown
## 배포 결과

### CI 파이프라인
- 빌드: 성공/실패
- 테스트: 통과/실패
- Lint: 통과/실패

### CD 파이프라인
- 스테이징: [URL]
- 프로덕션: [URL]

### 모니터링
- 에러 트래킹: [설정 여부]
- 성능 모니터링: [설정 여부]
```
