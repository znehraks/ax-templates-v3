# AI 협업 프롬프트 - Research

## 협업 모드: Parallel + Sequential

이 스테이지에서는 **병렬 리서치** 후 **순차적 통합**을 진행합니다.

### 참여 모델
- **Claude**: 심층 분석, 기술 문서 합성
- **Gemini**: 시장 트렌드, 경쟁사 분석

### 협업 프롬프트

```
# 병렬 리서치
/collaborate --mode parallel --models claude,gemini --task "기술 및 시장 리서치"

# 순차적 통합 (Claude가 Gemini 결과 검토)
/collaborate --mode sequential --chain "gemini:market_research -> claude:synthesis"
```

### 작업 분담

| AI | 담당 영역 | 출력 |
|----|----------|------|
| Gemini | 시장 분석, 경쟁사 조사 | market_analysis.md |
| Claude | 기술 스택 분석, 실현 가능성 | tech_research.md, feasibility_report.md |

### MCP 서버 활용

- **firecrawl**: 웹 크롤링 (Gemini 활용)
- **exa**: AI 검색 (Claude 활용)
- **context7**: 문서 검색 (Claude 활용)

### 출력 형식

```markdown
## AI 협업 결과

### Gemini 리서치 (시장)
- 경쟁사 분석
- 시장 트렌드
...

### Claude 리서치 (기술)
- 기술 스택 비교
- 실현 가능성 평가
...

### 통합 인사이트
- [핵심 발견]
```
