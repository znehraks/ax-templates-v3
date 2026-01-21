# /planning

03-planning 스테이지를 바로 시작합니다.

## 사용법
```
/planning
```

## 스테이지 정보

| 항목 | 값 |
|------|-----|
| 스테이지 | 03-planning |
| AI 모델 | Gemini |
| 실행 모드 | Plan Mode |
| 체크포인트 | 선택 |

## 동작

1. **전제 조건 확인**
   - 02-research 완료 여부
   - research.md, tech-stack.md 존재

2. **기획 실행**
   - PRD (Product Requirements Document) 작성
   - 아키텍처 설계
   - 기술 명세

3. **산출물 생성**
   - PRD.md - 제품 요구사항 문서
   - architecture.md - 아키텍처 설계

## 실행

```bash
scripts/run-stage.sh 03-planning "$ARGUMENTS"
```

## 입력 파일

- `stages/02-research/outputs/research.md`
- `stages/02-research/outputs/tech-stack.md`

## 출력 파일

- `stages/03-planning/outputs/PRD.md`
- `stages/03-planning/outputs/architecture.md`

## 관련 명령어

- `/run-stage 03` - 전제조건 확인 후 시작
- `/next` - 다음 스테이지 (04-ui-ux)
- `/research` - 이전 스테이지
- `/gemini` - Gemini CLI 직접 호출

## PRD 구조

```markdown
# PRD: [프로젝트명]

## 개요
## 목표
## 기능 요구사항
## 비기능 요구사항
## 기술 스택
## 일정
## 위험 요소
```
