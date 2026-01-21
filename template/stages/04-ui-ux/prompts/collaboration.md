# AI 협업 프롬프트 - UI/UX Planning

## 협업 모드: Debate + Parallel

이 스테이지에서는 **토론 모드**로 UX 방향성을 결정하고, **병렬 모드**로 세부 설계를 진행합니다.

### 참여 모델
- **Gemini**: 창의적 UI 설계, 와이어프레임 생성
- **Claude**: 사용성 검토, 접근성 평가

### 협업 프롬프트

```
# UX 방향 토론
/collaborate --mode debate --topic "사용자 경험 방향성" --rounds 2

# 병렬 설계
/collaborate --mode parallel --models gemini,claude --task "UI 컴포넌트 설계"
```

### 토론 주제

1. **인터랙션 패턴**: 전통적 vs 혁신적
2. **정보 아키텍처**: 평면 vs 계층
3. **디자인 시스템**: 기존 사용 vs 커스텀

### 작업 분담

| AI | 담당 영역 | 출력 |
|----|----------|------|
| Gemini | 와이어프레임, 시각 설계 | wireframes.md |
| Claude | 사용자 플로우, 접근성 검토 | user_flows.md |

### 디자인 검토 체크리스트

- [ ] 사용자 시나리오 기반 설계
- [ ] 반응형 고려
- [ ] 접근성 (WCAG 2.1)
- [ ] 일관된 디자인 언어

### 출력 형식

```markdown
## AI 협업 결과

### Gemini 설계
- 와이어프레임 (ASCII/Mermaid)
- 색상/타이포그래피 제안

### Claude 검토
- 사용성 평가
- 접근성 개선점

### 통합 디자인 시스템
- [최종 컴포넌트 목록]
```
