# /ui-ux

04-ui-ux 스테이지를 바로 시작합니다.

## 사용법
```
/ui-ux
```

## 스테이지 정보

| 항목 | 값 |
|------|-----|
| 스테이지 | 04-ui-ux |
| AI 모델 | Gemini |
| 실행 모드 | Plan Mode |
| 체크포인트 | 선택 |

## 동작

1. **전제 조건 확인**
   - 03-planning 완료 여부
   - PRD.md 존재

2. **UI/UX 설계**
   - 와이어프레임 설계
   - 컴포넌트 명세
   - 디자인 시스템

3. **산출물 생성**
   - wireframes/ - 와이어프레임 파일
   - component-spec.md - 컴포넌트 명세
   - design-system.md - 디자인 시스템

## 실행

```bash
scripts/run-stage.sh 04-ui-ux "$ARGUMENTS"
```

## 입력 파일

- `stages/03-planning/outputs/PRD.md`
- `stages/03-planning/outputs/architecture.md`

## 출력 파일

- `stages/04-ui-ux/outputs/wireframes/`
- `stages/04-ui-ux/outputs/component-spec.md`
- `stages/04-ui-ux/outputs/design-system.md`

## 관련 명령어

- `/run-stage 04` - 전제조건 확인 후 시작
- `/next` - 다음 스테이지 (05-task-management)
- `/planning` - 이전 스테이지

## 도구 활용

- Figma MCP - 디자인 컨텍스트 (설정 시)
- 21st Magic - UI 컴포넌트 영감
