# /deploy

10-deployment 스테이지를 바로 시작합니다.

## 사용법
```
/deploy [environment]
```

## 스테이지 정보

| 항목 | 값 |
|------|-----|
| 스테이지 | 10-deployment |
| AI 모델 | ClaudeCode |
| 실행 모드 | Headless |
| 체크포인트 | 선택 |

## 동작

1. **전제 조건 확인**
   - 09-testing 완료 여부
   - test-results.md 존재
   - 모든 테스트 통과

2. **배포 실행**
   - CI/CD 파이프라인 설정
   - 환경별 배포
   - 모니터링 설정

3. **산출물 생성**
   - CI/CD 설정 파일
   - deployment-log.md

## 실행

```bash
scripts/run-stage.sh 10-deployment "$ARGUMENTS"
```

## 입력 파일

- `stages/09-testing/outputs/test-results.md`
- `stages/06-implementation/outputs/src/`
- 모든 이전 스테이지 outputs

## 출력 파일

- `.github/workflows/ci.yaml`
- `.github/workflows/cd.yaml`
- `stages/10-deployment/outputs/deployment-log.md`

## 배포 환경

| 환경 | 설명 |
|------|------|
| dev | 개발 환경 |
| staging | 스테이징 |
| prod | 프로덕션 |

## CI/CD 워크플로우

```
Push
  ↓
CI (Build + Test)
  ↓
Quality Gate
  ↓
CD (Deploy)
  ↓
Health Check
```

## 관련 명령어

- `/run-stage 10` - 전제조건 확인 후 시작
- `/test` - 이전 스테이지
- `/status` - 파이프라인 상태

## 배포 체크리스트

- [ ] 환경 변수 설정
- [ ] 시크릿 설정 (GitHub Secrets)
- [ ] 도메인/DNS 설정
- [ ] SSL 인증서
- [ ] 모니터링 설정
- [ ] 롤백 계획

## 완료 시

🎉 **파이프라인 완료!**

모든 10개 스테이지가 완료되었습니다.
- `/status`로 최종 상태 확인
- `state/handoffs/`에서 전체 문서 검토

## Tips

- prod 배포 전 staging 검증
- 롤백 스크립트 준비
- 배포 후 스모크 테스트
