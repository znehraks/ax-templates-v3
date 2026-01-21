# /gemini

tmux 세션을 통해 Gemini CLI를 호출합니다.

## 사용법
```
/gemini [prompt]
```

## 동작

1. **tmux 세션 확인/생성**
   - 세션명: `ax-gemini`
   - 없으면 새로 생성

2. **Gemini CLI 실행**
   - 프롬프트 전송
   - 응답 대기 (wait-for 방식)

3. **결과 캡처 및 반환**
   - 출력 파일에서 결과 읽기
   - 사용자에게 표시

## 실행 스크립트

```bash
scripts/gemini-wrapper.sh "$ARGUMENTS"
```

## 예시

```
/gemini Reddit의 r/programming에서 Claude Code 관련 최신 게시물을 요약해주세요

Gemini 호출 중...
세션: ax-gemini
타임아웃: 300초

[응답]
Reddit r/programming에서 Claude Code 관련 최신 게시물:

1. "Claude Code로 전체 프로젝트 리팩토링한 경험" (3일 전)
   - 200줄 이상의 함수를 깔끔하게 분리
   - 테스트 커버리지 30% → 85%로 향상
   - 장점: 컨텍스트 이해력, 단점: 큰 파일 처리 속도

2. ...
```

## 활용 시나리오

### 1. 브레인스토밍 (01-brainstorm)
```
/gemini 다음 프로젝트에 대해 창의적인 아이디어 10개를 발산해주세요:
[프로젝트 설명]
```

### 2. 웹 리서치 (02-research)
```
/gemini 최신 React 서버 컴포넌트 베스트 프랙티스를 웹에서 검색해주세요
```

### 3. 경쟁사 분석
```
/gemini [경쟁사 URL]의 기능과 UI를 분석해주세요
```

## 타임아웃

기본 타임아웃: 300초 (5분)

변경:
```
/gemini --timeout 600 [긴 작업 프롬프트]
```

## 제한사항
- Gemini CLI가 설치되어 있어야 함
- tmux가 설치되어 있어야 함
- 대화형 프롬프트는 지원하지 않음 (단발성 질의만)

## 관련
- `/codex`: Codex CLI 호출
- `scripts/gemini-wrapper.sh`: 래퍼 스크립트
