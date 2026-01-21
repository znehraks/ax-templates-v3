# 산출물 검증 프롬프트 - Brainstorming

## 검증 대상

| 산출물 | 필수 조건 | 검증 방법 |
|--------|----------|----------|
| `ideas.md` | 최소 10개 아이디어 | 수량 확인 |
| `requirements_analysis.md` | 기능/비기능 섹션 포함 | 구조 확인 |
| `HANDOFF.md` | 완료 체크리스트 | 항목 확인 |

## 검증 명령

```bash
/validate --stage 01-brainstorm
```

## 품질 기준

### ideas.md
- [ ] 최소 10개 아이디어 존재
- [ ] 각 아이디어에 장단점 분석
- [ ] 우선순위 또는 카테고리 분류
- [ ] 실현 가능성 초기 평가

### requirements_analysis.md
- [ ] 기능적 요구사항 섹션
- [ ] 비기능적 요구사항 섹션
- [ ] 제약조건 식별
- [ ] MVP 범위 제안

### HANDOFF.md
- [ ] 완료된 작업 체크리스트
- [ ] 핵심 결정사항
- [ ] 다음 스테이지 준비 항목

## 자동 검증 스크립트

```bash
# ideas.md 아이디어 수 확인
grep -c "^## " outputs/ideas.md

# requirements_analysis.md 섹션 확인
grep -E "^## (기능|비기능)" outputs/requirements_analysis.md
```

## 실패 시 조치

1. 부족한 항목 식별
2. 추가 아이디어 생성 또는 분석 보완
3. 재검증 실행
