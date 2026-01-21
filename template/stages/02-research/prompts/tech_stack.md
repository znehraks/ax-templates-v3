# Tech Stack Research Prompt

## 사용 모델
Claude (MCP 서버 연동)

## 프롬프트

```
당신은 시니어 솔루션 아키텍트입니다.

다음 요구사항을 바탕으로 최적의 기술 스택을 조사해주세요:

---
## 요구사항
{{REQUIREMENTS}}

## MVP 기능
{{MVP_FEATURES}}
---

## 조사 항목

### 1. 프론트엔드
각 옵션에 대해:
- 프레임워크/라이브러리 이름
- 장점 / 단점
- 학습 곡선
- 커뮤니티/생태계
- 성능 특성
- 권장 사용 사례

비교 대상: React, Vue, Svelte, Next.js, Nuxt 등

### 2. 백엔드
비교 대상: Node.js, Python, Go, Rust 등
각각의 프레임워크 포함 (Express, FastAPI, Gin 등)

### 3. 데이터베이스
- 관계형: PostgreSQL, MySQL
- NoSQL: MongoDB, Redis
- NewSQL: CockroachDB, PlanetScale

### 4. 인프라
- 클라우드: AWS, GCP, Azure, Vercel, Railway
- 컨테이너: Docker, Kubernetes
- 서버리스: Lambda, Cloud Functions

### 5. 개발 도구
- 버전 관리, CI/CD, 모니터링, 로깅

## MCP 활용
- context7로 각 기술의 공식 문서 확인
- exa로 최신 비교 분석 기사 검색

## 출력 형식
기술 스택 비교표와 최종 권장안을 마크다운으로 작성
```

## 기대 출력
`outputs/tech_research.md`
