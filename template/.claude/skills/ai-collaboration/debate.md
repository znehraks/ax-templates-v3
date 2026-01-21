# AI Collaboration - Debate Mode

## 토론 모드

여러 AI 모델이 다양한 관점에서 토론하여 최적의 결론을 도출합니다.

## 사용 시나리오

1. **아키텍처 결정**: 여러 설계 대안 비교
2. **기술 선택**: 프레임워크/라이브러리 선택
3. **트레이드오프 분석**: 성능 vs 유지보수성 등

## 토론 구조

### 참가자 역할

```yaml
participants:
  advocate:
    model: "claude"
    perspective: "기술적 실현 가능성"
    stance: "안정적이고 검증된 접근법"

  challenger:
    model: "gemini"
    perspective: "혁신적 접근법"
    stance: "새로운 기술과 방법론"
```

### 토론 라운드

```
Round 1: 초기 입장 제시
  - Advocate: [입장 + 근거]
  - Challenger: [반대 입장 + 근거]

Round 2: 반박 및 보완
  - Advocate: [반박 + 추가 근거]
  - Challenger: [반박 + 추가 근거]

Round 3: 수렴 및 결론
  - 공통점 도출
  - 합의점 정리
  - 최종 권장사항
```

## 토론 규칙

```yaml
rules:
  rounds: 3
  max_tokens_per_turn: 2000
  require_evidence: true
  convergence_check: true
```

### 증거 요구사항
- 주장에는 반드시 근거 제시
- 가능한 경우 수치/데이터 포함
- 사례 인용 권장

## 실행 방법

### 1. 토론 주제 설정
```bash
/collaborate --mode debate --topic "모놀리식 vs 마이크로서비스"
```

### 2. 관점 할당
```yaml
debate_setup:
  topic: "모놀리식 vs 마이크로서비스"
  advocate:
    model: "claude"
    position: "모놀리식 (초기 단계)"
  challenger:
    model: "gemini"
    position: "마이크로서비스 (확장성)"
```

### 3. 토론 진행
각 라운드별로 순차적으로 응답 수집

### 4. 결론 도출
```yaml
conclusion:
  method: "consensus"  # or "vote", "weighted"
  include_dissenting: true
```

## 출력 형식

```markdown
# Debate Results

## Topic
[토론 주제]

## Round 1: Initial Positions

### Advocate (Claude)
**Position**: [입장]
**Arguments**:
1. [근거 1]
2. [근거 2]

### Challenger (Gemini)
**Position**: [입장]
**Arguments**:
1. [근거 1]
2. [근거 2]

## Round 2: Rebuttals
[반박 내용]

## Round 3: Convergence
[수렴 과정]

## Conclusion

### Consensus Points
- [합의점 1]
- [합의점 2]

### Remaining Differences
- [의견 차이]

### Recommendation
[최종 권장사항]

### Dissenting Opinion
[소수 의견 - 선택적]
```

## 결론 도출 방법

### Consensus (합의)
- 공통점 추출
- 차이점 명시
- 절충안 제시

### Vote (투표)
- 각 AI의 최종 선택
- 다수결

### Weighted (가중치)
- 전문성에 따른 가중치
- 가중 평균으로 결정
