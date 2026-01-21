# AI Collaboration - Parallel Execution

## 병렬 실행 모드

동일한 작업을 여러 AI 모델이 동시에 수행하여 다양한 결과물 중 최적을 선택합니다.

## 사용 시나리오

1. **아이디어 생성**: 다양한 관점의 아이디어 수집
2. **코드 구현**: 여러 접근법 비교
3. **문서 작성**: 스타일 비교

## 실행 프로세스

### 1. 작업 정의
```yaml
task:
  description: "사용자 인증 시스템 설계"
  type: "design"
  constraints:
    - "JWT 기반"
    - "OAuth 지원"
```

### 2. 모델 선택
```yaml
models:
  - gemini:
      focus: "창의적 접근"
  - claude:
      focus: "실용적 구현"
```

### 3. 병렬 실행
```bash
# tmux 세션을 통한 동시 실행
scripts/gemini-wrapper.sh "prompts/task.md" &
# Claude는 현재 세션에서 실행
```

### 4. 결과 수집
각 AI의 출력을 `state/collaborations/{task_id}/` 에 저장

### 5. 평가 및 선택
```yaml
evaluation:
  metrics:
    - completeness: 0.3
    - creativity: 0.3
    - feasibility: 0.4
```

## 병합 전략

### Best-of-N
- 점수가 가장 높은 결과 선택
- 임계값 이상(0.85)이면 자동 선택

### Synthesis
- 각 결과의 장점만 추출
- 새로운 통합 결과물 생성

## 출력 형식

```markdown
# Parallel Execution Results

## Task
[작업 설명]

## Results

### Gemini Result
[결과 내용]
**Score**: 0.82

### Claude Result
[결과 내용]
**Score**: 0.88

## Analysis
| Metric | Gemini | Claude |
|--------|--------|--------|
| Completeness | 0.80 | 0.90 |
| Creativity | 0.90 | 0.85 |
| Feasibility | 0.75 | 0.90 |

## Selected: Claude Result
**Reason**: 높은 실현 가능성과 완성도
```

## 리소스 관리

- 최대 동시 실행: 2개 모델
- 토큰 예산: 협업당 50,000
- 타임아웃: 모델당 5분
