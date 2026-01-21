# AI 협업 프롬프트 - Planning

## 협업 모드: Debate

이 스테이지에서는 **토론 모드**를 사용하여 최적의 아키텍처와 기술 스택을 결정합니다.

### 참여 모델
- **Gemini**: 아키텍처 설계, 다이어그램 생성
- **Claude**: 기술적 검증, 실현 가능성 평가

### 협업 프롬프트

```
/collaborate --mode debate --topic "시스템 아키텍처 결정" --rounds 3
```

### 토론 주제

1. **아키텍처 패턴**: Monolith vs Microservices vs Modular Monolith
2. **기술 스택**: 프레임워크 및 라이브러리 선택
3. **데이터베이스**: SQL vs NoSQL vs Hybrid

### 토론 형식

| 라운드 | Gemini | Claude |
|--------|--------|--------|
| 1 | 제안 | 반론/대안 |
| 2 | 보완 | 검증/평가 |
| 3 | 최종안 | 합의/확인 |

### 파이프라인 분기 트리거

아키텍처 대안이 2개 이상 유효할 경우:
```
/fork create --reason "아키텍처 대안 탐색" --direction "monolith"
/fork create --reason "아키텍처 대안 탐색" --direction "microservices"
```

### 출력 형식

```markdown
## AI 토론 결과

### 주제: [아키텍처 결정]

### 라운드 1
- **Gemini**: [제안]
- **Claude**: [반론/대안]

### 라운드 2
- **Gemini**: [보완]
- **Claude**: [검증]

### 최종 결론
- [합의된 아키텍처]
- [근거]
```
