# AI 협업 프롬프트 - Brainstorming

## 협업 모드: Parallel Execution

이 스테이지에서는 **병렬 실행** 모드를 사용하여 여러 AI 모델이 동시에 아이디어를 생성합니다.

### 참여 모델
- **Gemini**: 창의적 아이디어 발산, 웹 리서치
- **Claude**: 구조화, 실현 가능성 검토

### 협업 프롬프트

```
/collaborate --mode parallel --models gemini,claude --task "아이디어 브레인스토밍"
```

### 병합 전략

1. **Gemini 결과**: 창의적 아이디어, 다양한 관점
2. **Claude 결과**: 구조화된 분석, 실현 가능성 평가
3. **병합**: Best-of-N 선택 후 통합

### 토론 모드 (선택적)

복잡한 아이디어 평가 시 토론 모드 활용:
```
/collaborate --mode debate --topic "최적의 MVP 범위 결정" --rounds 2
```

### 출력 형식

```markdown
## AI 협업 결과

### Gemini 아이디어
- [아이디어 1]
- [아이디어 2]
...

### Claude 분석
- [구조화된 평가]
...

### 통합 결과
- [최종 아이디어 목록]
```
