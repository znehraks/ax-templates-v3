# /collaborate - Multi-AI Collaboration Command

여러 AI 모델을 협업시켜 더 나은 결과물을 생성합니다.

## 사용법

```bash
/collaborate [options]
```

## 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--mode` | 협업 모드 (parallel, sequential, debate) | parallel |
| `--task` | 수행할 작업 설명 | - |
| `--models` | 참여 AI 모델 (쉼표 구분) | gemini,claude |
| `--chain` | 순차 체인 이름 (sequential 모드) | - |
| `--rounds` | 토론 라운드 수 (debate 모드) | 3 |
| `--topic` | 토론 주제 (debate 모드) | - |

## 협업 모드

### 1. Parallel (병렬 실행)
```bash
/collaborate --mode parallel --task "아이디어 생성" --models "gemini,claude"
```
- 동일 작업을 여러 AI가 동시 수행
- 결과 비교 후 최적 선택

### 2. Sequential (순차 핸드오프)
```bash
/collaborate --mode sequential --chain "code_review"
```
- AI 간 릴레이로 점진적 개선
- 체인: `code_review`, `planning_review`

### 3. Debate (토론)
```bash
/collaborate --mode debate --topic "아키텍처 선택" --rounds 3
```
- AI 간 토론으로 최적 결론 도출
- 다양한 관점 비교

## 사전 체인 정의

### code_review
1. Claude: 초안 작성
2. Gemini: 창의적 개선
3. Codex: 기술 검증

### planning_review
1. Gemini: 아이디어 발산
2. Claude: 실현 가능성 분석
3. Claude: 최종 계획 수립

## 출력

- 각 AI 결과물
- 비교 분석 리포트
- 최종 선택/병합 결과
- 저장: `state/collaborations/{task_id}/`

## 예시

```bash
# 기본 병렬 협업
/collaborate --task "사용자 인증 설계"

# 코드 리뷰 체인
/collaborate --mode sequential --chain code_review

# 아키텍처 토론
/collaborate --mode debate --topic "마이크로서비스 vs 모놀리식"
```

## 설정

`config/ai_collaboration.yaml` 참조

## 관련 커맨드

- `/benchmark` - AI 모델 벤치마킹
- `/gemini` - Gemini 직접 호출
- `/codex` - Codex 직접 호출
