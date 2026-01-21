# /research

02-research 스테이지를 바로 시작합니다.

## 사용법
```
/research [focus-area]
```

## 스테이지 정보

| 항목 | 값 |
|------|-----|
| 스테이지 | 02-research |
| AI 모델 | Claude + MCP |
| 실행 모드 | Plan Mode |
| 체크포인트 | 선택 |

## 동작

1. **전제 조건 확인**
   - 01-brainstorm 완료 여부
   - ideas.md 파일 존재

2. **리서치 실행**
   - MCP 도구 활용 (웹 검색, API)
   - 기술 스택 조사
   - 경쟁 제품 분석

3. **산출물 생성**
   - research.md - 리서치 결과
   - tech-stack.md - 기술 스택 권장사항

## 실행

```bash
scripts/run-stage.sh 02-research "$ARGUMENTS"
```

## 입력 파일

- `stages/01-brainstorm/outputs/ideas.md`
- `stages/01-brainstorm/outputs/decisions.md`

## 출력 파일

- `stages/02-research/outputs/research.md`
- `stages/02-research/outputs/tech-stack.md`

## 관련 명령어

- `/run-stage 02` - 전제조건 확인 후 시작
- `/next` - 다음 스테이지 (03-planning)
- `/brainstorm` - 이전 스테이지

## MCP 도구 활용

- Context7 - 라이브러리 문서
- WebFetch - 웹 페이지 분석
- WebSearch - 검색 결과 수집
