# 산출물 검증 프롬프트 - UI/UX Planning

## 검증 대상

| 산출물 | 필수 조건 | 검증 방법 |
|--------|----------|----------|
| `wireframes.md` | 주요 화면 5개+ | 수량 확인 |
| `user_flows.md` | 핵심 플로우 3개+ | 수량 확인 |
| `design_system.md` | 색상/타이포/스페이싱 | 구조 확인 |
| `HANDOFF.md` | 컴포넌트 목록 | 항목 확인 |

## 검증 명령

```bash
/validate --stage 04-ui-ux
```

## 품질 기준

### wireframes.md
- [ ] 주요 화면 5개 이상
- [ ] 각 화면 설명
- [ ] 반응형 breakpoint 고려
- [ ] 상호작용 설명

### user_flows.md
- [ ] 핵심 사용자 플로우 3개 이상
- [ ] 각 플로우 다이어그램
- [ ] 엣지 케이스 처리
- [ ] 에러 상태 정의

### design_system.md
- [ ] 색상 팔레트 (Primary, Secondary, Neutral)
- [ ] 타이포그래피 스케일
- [ ] 스페이싱 시스템
- [ ] 컴포넌트 목록 및 변형

### HANDOFF.md
- [ ] 구현할 컴포넌트 목록
- [ ] 우선순위 지정
- [ ] 기술적 고려사항

## 자동 검증 스크립트

```bash
# 와이어프레임 수 확인
grep -c "^### " outputs/wireframes.md

# 사용자 플로우 수 확인
grep -c "^## Flow" outputs/user_flows.md

# 디자인 시스템 섹션 확인
grep -E "^## (색상|Color|타이포|Typography|스페이싱|Spacing)" outputs/design_system.md
```
