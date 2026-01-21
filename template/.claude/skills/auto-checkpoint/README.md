# Auto-Checkpoint Skill

자동 체크포인트 생성 및 스마트 롤백 스킬

## 개요

작업 안전망을 위한 자동 체크포인트 시스템:
- 조건 기반 자동 체크포인트 생성
- 스마트 롤백 제안 및 실행
- 파이프라인 분기 지원

## 트리거

### 자동 트리거
- 5개 태스크 완료마다
- 100줄 이상 파일 변경 시
- 파괴적 작업 감지 시
- 30분 간격 (변경 있을 때)
- 스테이지 완료 시

### 수동 트리거
- `/checkpoint` 명령어

## 기능

### 1. 자동 체크포인트 (trigger.md)
- 조건 감지 및 체크포인트 생성
- 메타데이터 기록
- Git 태그 연동

### 2. 스마트 롤백 (rollback.md)
- 에러 분석 및 관련 체크포인트 찾기
- 부분 롤백 지원 (파일/함수/스테이지)
- 롤백 미리보기

### 3. 파이프라인 분기
- 여러 접근법 동시 탐색
- 분기 비교 및 병합

## 파일 구조

```
auto-checkpoint/
├── README.md          # 이 파일
├── trigger.md         # 체크포인트 트리거 가이드
├── rollback.md        # 롤백 가이드
└── prompts/
    └── CLAUDE.md      # AI 지침
```

## 설정

- `config/auto_checkpoint.yaml` - 자동 체크포인트
- `config/smart_rollback.yaml` - 스마트 롤백
- `config/pipeline_forking.yaml` - 파이프라인 분기

## 사용 예시

```bash
# 수동 체크포인트 생성
/checkpoint --name "feature-complete"

# 롤백 제안 보기
/restore --suggest

# 특정 체크포인트로 롤백
/restore --checkpoint "stage_06_complete_20240120"

# 파이프라인 분기
/fork --reason "아키텍처 대안 탐색"
```

## 저장 위치

- 체크포인트: `state/checkpoints/`
- 분기: `state/forks/`
- 롤백 히스토리: `state/rollback_history/`
