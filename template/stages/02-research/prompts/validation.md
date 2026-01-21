# 산출물 검증 프롬프트 - Research

## 검증 대상

| 산출물 | 필수 조건 | 검증 방법 |
|--------|----------|----------|
| `tech_research.md` | 기술 스택 비교표 | 구조 확인 |
| `market_analysis.md` | 경쟁사 3개+ 분석 | 수량 확인 |
| `feasibility_report.md` | 리스크 섹션 포함 | 구조 확인 |
| `HANDOFF.md` | 핵심 결정사항 | 항목 확인 |

## 검증 명령

```bash
/validate --stage 02-research
```

## 품질 기준

### tech_research.md
- [ ] 기술 스택 비교표 포함
- [ ] 각 기술의 장단점 분석
- [ ] 학습 곡선 평가
- [ ] 커뮤니티/생태계 평가

### market_analysis.md
- [ ] 경쟁사 3개 이상 분석
- [ ] 시장 규모 및 트렌드
- [ ] 진입 장벽 분석
- [ ] 차별화 포인트

### feasibility_report.md
- [ ] 기술적 실현 가능성
- [ ] 시간/리소스 요구사항
- [ ] 리스크 평가 및 대응 방안
- [ ] Go/No-Go 권고

### HANDOFF.md
- [ ] 완료된 리서치 체크리스트
- [ ] 핵심 발견 사항
- [ ] 권장 기술 스택

## 자동 검증 스크립트

```bash
# 경쟁사 분석 수 확인
grep -c "^### " outputs/market_analysis.md

# 리스크 섹션 확인
grep -E "^## 리스크|Risk" outputs/feasibility_report.md
```
