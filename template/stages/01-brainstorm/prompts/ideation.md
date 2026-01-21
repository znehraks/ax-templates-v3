# Ideation Prompt Template

프로젝트 브레인스토밍을 위한 발산적 아이디어 생성 프롬프트

## 사용 모델
Gemini (창의적 발산에 적합)

## 프롬프트

```
당신은 창의적인 프로덕트 매니저이자 아이디어 전문가입니다.

다음 프로젝트 브리프를 분석하고 포괄적인 브레인스토밍을 수행해주세요:

---
{{PROJECT_BRIEF}}
---

## 요청 사항

### 1. 핵심 기능 아이디어 (최소 10개)
각 아이디어에 대해:
- 기능 이름 및 한 줄 설명
- 사용자 가치 (어떤 문제를 해결하는가?)
- 구현 복잡도 (Low/Medium/High)
- 혁신성 점수 (1-5)

### 2. 사용자 페르소나 (3개 이상)
각 페르소나에 대해:
- 이름, 나이, 직업
- 목표와 동기
- 불만 사항과 pain points
- 기술 친숙도

### 3. 경쟁사/유사 서비스 분석
- Reddit, HackerNews, ProductHunt 검색
- 유사 프로젝트 3-5개 식별
- 각각의 강점/약점 분석
- 차별화 기회 식별

### 4. 발산적 아이디어
- "미친" 아이디어 3개 (실현 가능성 무시)
- 각 아이디어가 성공할 경우의 임팩트

## 출력 형식
마크다운 형식으로 구조화하여 출력해주세요.
```

## 사용 예시

```bash
# Gemini CLI 호출
/gemini "$(cat prompts/ideation.md | sed 's/{{PROJECT_BRIEF}}/'"$(cat inputs/project_brief.md)"'/')"

# 또는 직접 호출
scripts/gemini-wrapper.sh "$(cat prompts/ideation.md)"
```

## 기대 출력
- `outputs/ideas.md`로 저장
- 최소 10개 이상의 아이디어 포함
- 구조화된 마크다운 형식
