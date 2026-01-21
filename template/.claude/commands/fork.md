# /fork - Pipeline Forking Command

파이프라인을 분기하여 여러 접근법을 동시에 탐색합니다.

## 사용법

```bash
/fork [options]
```

## 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--reason` | 분기 이유 (필수) | - |
| `--name` | 분기 이름 | auto |
| `--direction` | 탐색 방향 설명 | - |
| `--compare` | 기존 분기와 비교 | false |
| `--merge` | 분기 병합 | false |
| `--list` | 활성 분기 목록 | false |

## 기본 사용

### 새 분기 생성
```bash
/fork --reason "아키텍처 대안 탐색"
```

### 분기 목록 확인
```bash
/fork --list
```

### 분기 비교
```bash
/fork --compare
```

### 분기 병합
```bash
/fork --merge --select "fork_03_alternative_a"
```

## 분기 프로세스

```
1. 현재 상태 체크포인트 생성
2. 분기 디렉토리 생성 (state/forks/)
3. 상태 복사
4. 분기용 HANDOFF 생성
5. 분기 작업 시작
```

## 분기 비교 출력

```markdown
# Fork Comparison

## Active Forks
| ID | Name | Stage | Progress | Created |
|----|------|-------|----------|---------|
| 1 | alternative_a | 06 | 60% | 2024-01-20 |
| 2 | alternative_b | 06 | 45% | 2024-01-20 |
| 3 | main | 06 | 100% | - |

## Metrics Comparison
| Metric | Main | Alt A | Alt B |
|--------|------|-------|-------|
| Code Quality | 0.85 | 0.90 | 0.82 |
| Performance | 0.80 | 0.75 | 0.88 |
| Maintainability | 0.88 | 0.85 | 0.80 |

## Recommendation
**Alt A** 권장: 더 높은 코드 품질
```

## 병합 전략

### best_performer
```bash
/fork --merge --strategy best_performer
```
- 메트릭 기반 최고 성능 분기 선택

### manual
```bash
/fork --merge --strategy manual --select "fork_01"
```
- 수동 선택

### cherry_pick
```bash
/fork --merge --strategy cherry_pick
```
- 여러 분기에서 최적 부분 선택

## 예시

```bash
# 아키텍처 대안 탐색을 위한 분기
/fork --reason "REST vs GraphQL 비교" --direction "GraphQL 방식 구현"

# 현재 분기 상태 확인
/fork --list

# 분기 비교 및 메트릭 확인
/fork --compare

# 최고 성능 분기로 병합
/fork --merge --strategy best_performer
```

## 분기 저장 위치

```
state/forks/
├── fork_03_rest_20240120/
│   ├── source_code/
│   ├── state/
│   └── FORK_HANDOFF.md
├── fork_03_graphql_20240120/
│   ├── source_code/
│   ├── state/
│   └── FORK_HANDOFF.md
└── comparison.json
```

## 설정

`config/pipeline_forking.yaml` 참조

## 제한사항

- 최대 활성 분기: 3개
- 분기 최대 실행 시간: 2시간
- 병합 전 체크포인트 자동 생성

## 관련 커맨드

- `/checkpoint` - 체크포인트 생성
- `/restore` - 체크포인트 복구
- `/status` - 파이프라인 상태
