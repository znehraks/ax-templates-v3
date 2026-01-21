# Market Analysis Prompt

## 사용 모델
Claude (MCP 서버 연동)

## 프롬프트

```
당신은 시장 분석 전문가입니다.

다음 프로젝트의 시장 분석을 수행해주세요:

---
## 프로젝트 개요
{{PROJECT_OVERVIEW}}

## 타겟 시장
{{TARGET_MARKET}}
---

## 분석 항목

### 1. 시장 규모
- TAM (Total Addressable Market)
- SAM (Serviceable Addressable Market)
- SOM (Serviceable Obtainable Market)

### 2. 경쟁사 분석
최소 3개 경쟁사에 대해:

| 경쟁사 | 강점 | 약점 | 가격 | 타겟 | 차별점 |
|--------|------|------|------|------|--------|

### 3. 시장 트렌드
- 성장 트렌드
- 기술 트렌드
- 사용자 행동 변화

### 4. 진입 장벽
- 기술적 장벽
- 자본 장벽
- 네트워크 효과
- 규제 장벽

### 5. 기회와 위협 (SWOT 일부)
- Opportunities
- Threats

## MCP 활용
- firecrawl: 경쟁사 웹사이트 크롤링
- exa: 시장 리포트 및 뉴스 검색

## 출력 형식
구조화된 시장 분석 보고서
```

## 기대 출력
`outputs/market_analysis.md`
