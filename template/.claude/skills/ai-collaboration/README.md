# AI Collaboration Skill

Multi-AI 협업 및 오케스트레이션 스킬

## 개요

여러 AI 모델(Claude, Gemini, Codex)을 협업시켜 더 나은 결과물을 생성합니다:
- 병렬 실행으로 다양한 관점 확보
- 순차 핸드오프로 점진적 개선
- 토론 모드로 최적 결론 도출

## 트리거

- `/collaborate` 명령어
- 복잡한 태스크 감지 시 자동 제안
- 낮은 확신도 감지 시

## 협업 모드

### 1. Parallel Execution (병렬 실행)
동일 작업을 여러 AI가 동시 수행 → 최적 결과 선택

```bash
/collaborate --mode parallel --task "아이디어 생성" --models "gemini,claude"
```

### 2. Sequential Handoff (순차 핸드오프)
AI 간 릴레이로 결과물 점진적 개선

```bash
/collaborate --mode sequential --chain "code_review"
```

### 3. Debate Mode (토론 모드)
AI 간 토론으로 다양한 관점에서 최적 결론 도출

```bash
/collaborate --mode debate --topic "아키텍처 선택" --rounds 3
```

## 파일 구조

```
ai-collaboration/
├── README.md          # 이 파일
├── parallel.md        # 병렬 실행 가이드
├── debate.md          # 토론 모드 가이드
└── prompts/
    └── CLAUDE.md      # AI 지침
```

## 설정

`config/ai_collaboration.yaml` 참조

## 출력

- 각 AI 결과물
- 비교 분석 리포트
- 최종 선택/병합 결과
- `state/collaborations/` 저장
