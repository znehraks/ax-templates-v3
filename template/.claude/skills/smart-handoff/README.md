# Smart HANDOFF Skill

스마트 컨텍스트 추출 및 지능형 HANDOFF 생성 스킬

## 개요

이 스킬은 HANDOFF.md 생성 과정을 자동화하고 최적화합니다:
- 자동 컨텍스트 추출
- 의미 기반 압축
- 스테이지별 맞춤 요약
- 메모리 시스템 통합

## 트리거

- 스테이지 완료 시 자동 활성화
- `/handoff --smart` 명령어
- 컨텍스트 임계값 도달 시

## 기능

### 1. 자동 컨텍스트 추출 (extract.md)
- 완료된 태스크 수집
- 핵심 결정사항 추출
- 수정된 파일 목록화
- 대기 중인 이슈 식별
- AI 호출 기록 정리

### 2. 컨텍스트 요약 (summarize.md)
- 완료 작업 → 핵심 성과 압축
- 파일 변경 → 영향도 분석
- 결정 사항 → 이유와 대안 포함
- 다음 단계 → 즉시 실행 가능 형태

### 3. 메모리 통합
- claude-mem에 핵심 정보 저장
- 이전 세션 컨텍스트 로드
- 크로스 스테이지 학습 지원

## 설정

`config/handoff_intelligence.yaml` 참조

## 사용 예시

```bash
# 스마트 HANDOFF 생성
/handoff --smart

# 압축된 HANDOFF 생성
/handoff --smart --compact

# 복구용 상세 HANDOFF 생성
/handoff --smart --recovery
```

## 출력

- `stages/{current_stage}/HANDOFF.md`
- 메모리 저장 (claude-mem 연동 시)
