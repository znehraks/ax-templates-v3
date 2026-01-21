# AI 협업 프롬프트 - Implementation

## 협업 모드: Sequential Handoff

이 스테이지에서는 **순차적 전달** 모드를 사용하여 구현 → 리뷰 → 개선 사이클을 진행합니다.

### 참여 모델
- **ClaudeCode**: 코드 생성, 구현

### 협업 프롬프트

```
# 구현 → 셀프 리뷰 → 개선
/collaborate --mode sequential --chain "claudecode:implement -> claudecode:review -> claudecode:improve"
```

### AI 벤치마킹 (선택적)

복잡한 알고리즘 구현 시:
```
/benchmark --task "sorting_algorithm" --models "claude,codex"
```

### 작업 흐름

1. **스캐폴딩**: 프로젝트 초기화
2. **공통 컴포넌트**: 디자인 시스템 기반
3. **기능 구현**: 스프린트 태스크 순차 구현
4. **통합**: API/DB 연동

### 체크포인트 트리거

- 스프린트 완료 시
- 주요 기능 완료 시
- 100줄 이상 변경 시

```
/checkpoint --reason "스프린트 1 완료"
```

### implementation.yaml 준수

구현 전 반드시 확인:
```yaml
# 예시 규칙
component_type: functional
styling: tailwind
state_management: zustand
naming: camelCase
```

### 출력 형식

```markdown
## 구현 로그

### [날짜] - [태스크]
- 구현 내용
- 변경된 파일
- 테스트 결과

### 체크포인트
- checkpoint_YYYYMMDD_HHMMSS
```
