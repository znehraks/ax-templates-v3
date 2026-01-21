# Stage 01: Brainstorming

발산적 아이디어 생성 및 요구사항 탐색

## 개요

이 스테이지는 프로젝트의 시작점으로, 창의적 아이디어 발산과 초기 요구사항 분석을 수행합니다.

## 실행 모델

| 역할 | 모델 | 목적 |
|------|------|------|
| Primary | Gemini | 창의적 아이디어 생성, 웹 리서치 |
| Secondary | ClaudeCode | 구조화, 실현 가능성 검토 |

## 시작하기

### 1. 입력 파일 준비

```bash
# 프로젝트 브리프 작성
cp templates/project_brief.md inputs/project_brief.md
# 편집 후 내용 채우기
```

### 2. 스테이지 실행

```bash
# 방법 1: 슬래시 커맨드
/run-stage 01-brainstorm

# 방법 2: 스크립트 직접 실행
../../scripts/run-stage.sh 01-brainstorm
```

### 3. 수동 워크플로우

```bash
# Step 1: Gemini로 아이디어 발산
/gemini "$(cat prompts/ideation.md)"

# Step 2: 결과를 outputs/ideas.md에 저장

# Step 3: 요구사항 분석
# ClaudeCode가 자동 수행

# Step 4: HANDOFF.md 생성
/handoff
```

## 디렉토리 구조

```
01-brainstorm/
├── README.md           # 이 파일
├── CLAUDE.md           # AI 지침
├── config.yaml         # 스테이지 설정
├── prompts/
│   ├── ideation.md     # 아이디어 발산 프롬프트
│   ├── persona.md      # 페르소나 생성 프롬프트
│   └── requirements.md # 요구사항 분석 프롬프트
├── templates/
│   ├── ideas.md        # 아이디어 출력 템플릿
│   └── requirements_analysis.md  # 요구사항 출력 템플릿
├── inputs/             # 입력 파일
├── outputs/            # 출력 파일
├── HANDOFF.md.template # 핸드오프 템플릿
└── HANDOFF.md          # 생성된 핸드오프 (완료 시)
```

## 완료 조건

- [ ] 최소 10개 아이디어 생성
- [ ] 3개 이상 사용자 페르소나 정의
- [ ] 요구사항 분석 문서 완성
- [ ] MVP 범위 정의
- [ ] HANDOFF.md 생성

## 출력물

| 파일 | 설명 |
|------|------|
| `outputs/ideas.md` | 브레인스토밍 아이디어 목록 |
| `outputs/requirements_analysis.md` | 요구사항 분석 결과 |
| `outputs/personas.md` | 사용자 페르소나 (선택) |
| `HANDOFF.md` | 다음 스테이지 인계 문서 |

## 다음 스테이지

**→ 02-research**: 기술 리서치 및 시장 분석

## 팁

1. **발산적 사고**: 이 단계에서는 아이디어 제한 없이 자유롭게
2. **모든 것을 기록**: 나중에 재검토할 수 있도록
3. **Gemini 활용**: 웹 검색이 필요한 경쟁사 분석에 활용
4. **구조화는 나중에**: ClaudeCode가 구조화 담당
