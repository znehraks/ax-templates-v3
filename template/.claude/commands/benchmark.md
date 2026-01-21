# /benchmark - AI Model Benchmarking Command

AI 모델 성능을 비교하고 최적 모델을 선택합니다.

## 사용법

```bash
/benchmark [options]
```

## 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--task` | 벤치마크할 태스크 유형 | code_generation |
| `--models` | 비교할 모델 (쉼표 구분) | claude,codex |
| `--samples` | 샘플 태스크 수 | 3 |
| `--metrics` | 측정 메트릭 | correctness,performance |
| `--verbose` | 상세 출력 | false |

## 벤치마크 태스크 유형

### code_generation
```bash
/benchmark --task code_generation --models "claude,codex"
```
- 메트릭: correctness, performance, style_compliance, readability

### refactoring
```bash
/benchmark --task refactoring --models "codex,claude"
```
- 메트릭: complexity_reduction, test_coverage, maintainability

### test_generation
```bash
/benchmark --task test_generation --models "codex,claude"
```
- 메트릭: coverage, edge_cases, quality

## 출력 형식

```markdown
# AI Benchmark Results

## Task: code_generation
## Models: claude, codex

### Score Summary
| Model | Score | Rank |
|-------|-------|------|
| Claude | 0.88 | 1 |
| Codex | 0.82 | 2 |

### Metric Breakdown
| Metric | Weight | Claude | Codex |
|--------|--------|--------|-------|
| Correctness | 0.4 | 0.95 | 0.85 |
| Performance | 0.2 | 0.80 | 0.90 |
| Style | 0.2 | 0.90 | 0.80 |
| Readability | 0.2 | 0.85 | 0.75 |

### Recommendation
현재 태스크에 **Claude** 사용 권장
```

## 예시

```bash
# 코드 생성 벤치마크
/benchmark --task code_generation

# 상세 결과 출력
/benchmark --task refactoring --verbose

# 특정 모델만 비교
/benchmark --task test_generation --models "codex"
```

## 결과 저장

- 결과: `state/ai_benchmarks/`
- 리포트: `state/ai_benchmarks/reports/`

## 히스토리 조회

```bash
# 최근 벤치마크 결과 확인
cat state/ai_benchmarks/latest.json

# 주간 트렌드 확인
scripts/ai-benchmark.sh --history weekly
```

## 설정

`config/ai_benchmarking.yaml` 참조

## 관련 커맨드

- `/collaborate` - AI 협업
- `/gemini` - Gemini 직접 호출
- `/codex` - Codex 직접 호출
