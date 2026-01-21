# Smart HANDOFF - Context Extraction

## 자동 컨텍스트 추출 프로세스

### 1. 완료된 태스크 수집

```markdown
## 추출 대상
- TodoWrite 완료 항목
- 커밋된 변경사항
- 생성된 산출물

## 형식
- [ ] 완료된 태스크 (timestamp)
```

### 2. 핵심 결정사항 추출

대화에서 다음 패턴 감지:
- "결정했습니다", "선택했습니다", "채택했습니다"
- "A 대신 B를 사용", "이유는..."
- 아키텍처/기술 스택 선택

```markdown
## 결정 형식
**결정**: [결정 내용]
**이유**: [선택 이유]
**대안**: [고려한 대안]
```

### 3. 수정된 파일 목록화

```bash
# Git 기반 변경 파일 추출
git diff --name-only HEAD~10
```

```markdown
## 파일 형식
| 파일 | 변경 유형 | 주요 변경 |
|------|----------|----------|
```

### 4. 대기 중인 이슈 식별

감지 패턴:
- "TODO:", "FIXME:", "HACK:"
- "나중에", "다음에", "추후"
- 미해결 에러/경고

```markdown
## 이슈 형식
- [ ] 이슈 설명 (우선순위: 높음/중간/낮음)
```

### 5. AI 호출 기록 정리

```markdown
## AI 호출 기록
| AI | 시간 | 목적 | 결과 요약 |
|----|------|------|----------|
```

## 추출 우선순위

1. **Critical (100)**: 차단 이슈
2. **Key Decisions (90)**: 핵심 결정사항
3. **Pending Issues (80)**: 대기 이슈
4. **File Changes (70)**: 파일 변경
5. **Completed Tasks (60)**: 완료 태스크
6. **AI History (50)**: AI 호출 기록

## 구현

스크립트: `scripts/smart-handoff.sh`
설정: `config/handoff_intelligence.yaml`
