# AI 협업 프롬프트 - Refactoring

## 협업 모드: Sequential Review Chain

이 스테이지에서는 **순차적 리뷰 체인**을 사용하여 리팩토링 품질을 보장합니다.

### 참여 모델
- **Codex**: 코드 분석, 최적화
- **ClaudeCode**: 복잡한 리팩토링, 검증

### 협업 프롬프트

```
# 리뷰 체인: Codex 분석 → Claude 검증
/collaborate --mode sequential --chain "codex:analyze -> claude:review -> codex:refactor"
```

### AI 벤치마킹

성능 최적화 비교:
```
/benchmark --task "performance_optimization" --models "codex,claude"
```

### 작업 흐름

1. **분석**: 정적 분석, 복잡도 측정
2. **계획**: 리팩토링 우선순위 결정
3. **실행**: 작은 단위로 리팩토링
4. **검증**: 테스트 통과 확인

### 체크포인트 필수

```bash
# 리팩토링 전 체크포인트
/checkpoint --reason "리팩토링 시작 전 상태"

# 주요 리팩토링 후
/checkpoint --reason "함수 X 리팩토링 완료"
```

### 롤백 준비

```bash
# 롤백 가능 상태 확인
/restore --list

# 필요시 부분 롤백
/restore checkpoint_id --partial --files "src/utils/*"
```

### 출력 형식

```markdown
## AI 협업 결과

### Codex 분석
- 복잡도 높은 함수 목록
- 중복 코드 위치
- 성능 병목

### Claude 검증
- 리팩토링 영향 범위
- 테스트 필요 영역
- 위험 요소

### 리팩토링 계획
1. [우선순위 1 항목]
2. [우선순위 2 항목]
...
```
