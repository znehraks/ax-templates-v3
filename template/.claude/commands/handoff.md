# /handoff

현재 스테이지의 HANDOFF.md 문서를 생성합니다.

## 사용법
```
/handoff
```

## 동작

1. **현재 스테이지 확인**
   - `state/progress.json`에서 현재 스테이지 조회

2. **완료 조건 검증**
   - 스테이지 config.yaml의 completion.checklist 확인
   - 필수 출력 파일 존재 확인

3. **HANDOFF.md 생성**
   - `HANDOFF.md.template` 기반으로 생성
   - 변수 치환 (타임스탬프, 산출물 등)
   - 사용자 입력 받기 (핵심 결정사항 등)

4. **상태 업데이트**
   - `state/progress.json` 핸드오프 완료 표시
   - `state/handoffs/` 디렉토리에 복사본 저장

5. **다음 스테이지 안내**
   - 다음 스테이지 정보 표시
   - `/run-stage [next]` 명령어 안내

## 실행 스크립트

```bash
scripts/create-handoff.sh
```

## 예시

```
/handoff

현재 스테이지: 01-brainstorm

완료 조건 검증:
✓ 최소 10개 아이디어 생성
✓ 3개 이상 사용자 페르소나 정의
✓ 요구사항 분석 문서 완성

핵심 결정사항을 입력해주세요:
> MVP는 인증, 핵심기능 A, 핵심기능 B로 한정

HANDOFF.md 생성 완료!
- 위치: stages/01-brainstorm/HANDOFF.md
- 백업: state/handoffs/01-brainstorm-20240120-1030.md

다음 단계:
/run-stage 02-research
```

## 완료 조건 미충족 시

```
/handoff

현재 스테이지: 01-brainstorm

완료 조건 검증:
✓ 최소 10개 아이디어 생성
✗ 3개 이상 사용자 페르소나 정의 (현재: 2개)
✓ 요구사항 분석 문서 완성

완료 조건을 충족해주세요.
또는 --force 옵션으로 강제 생성:
/handoff --force
```

## 옵션
- `--force`: 완료 조건 미충족 시에도 강제 생성
- `--draft`: 초안으로 생성 (다음 스테이지 진행 불가)
