# 산출물 검증 프롬프트 - CI/CD & Deployment

## 검증 대상

| 산출물 | 필수 조건 | 검증 방법 |
|--------|----------|----------|
| `.github/workflows/` | CI 파이프라인 | 구조 확인 |
| `deployment_config/` | 환경 설정 | 구조 확인 |
| `deployment_log.md` | 배포 기록 | 항목 확인 |
| `HANDOFF.md` | 최종 상태 | 항목 확인 |

## 검증 명령

```bash
/validate --stage 10-deployment
```

## 품질 기준

### .github/workflows/
- [ ] CI 워크플로우 존재 (ci.yml)
- [ ] CD 워크플로우 존재 (cd.yml)
- [ ] 빌드 단계 포함
- [ ] 테스트 단계 포함
- [ ] 배포 단계 포함

### deployment_config/
- [ ] 환경 변수 관리
- [ ] 시크릿 설정 가이드
- [ ] 도메인/SSL 설정

### deployment_log.md
- [ ] 스테이징 배포 기록
- [ ] 프로덕션 배포 기록
- [ ] 배포 URL

### HANDOFF.md (최종)
- [ ] 프로젝트 완료 체크리스트
- [ ] 운영 가이드 링크
- [ ] 모니터링 설정 확인

## 자동 검증 스크립트

```bash
# GitHub Actions 워크플로우 확인
ls -la outputs/.github/workflows/

# 워크플로우 유효성 검사 (yamllint)
yamllint outputs/.github/workflows/*.yml

# 배포 설정 확인
ls -la outputs/deployment_config/
```

## CI/CD 검증

| 항목 | 기준 | 확인 |
|------|------|------|
| CI 워크플로우 | 존재 | - |
| CD 워크플로우 | 존재 | - |
| 스테이징 배포 | 성공 | - |
| 프로덕션 배포 | 성공 | - |
| 헬스 체크 | 통과 | - |

## 모니터링 체크리스트

- [ ] 에러 트래킹 설정 (Sentry 등)
- [ ] 성능 모니터링 설정
- [ ] 로그 수집 설정
- [ ] 알림 설정

## 문서 체크리스트

- [ ] 배포 가이드
- [ ] 운영 매뉴얼
- [ ] 트러블슈팅 가이드
- [ ] 롤백 절차

## 파이프라인 완료 확인

```bash
# 모든 스테이지 완료 확인
/status

# 최종 검증
/validate --all
```

## 실패 시 조치

1. CI 실패 → 워크플로우 수정
2. 배포 실패 → 설정 확인 및 재시도
3. 헬스 체크 실패 → 로그 분석 및 수정
