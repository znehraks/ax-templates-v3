# HANDOFF: 04-ui-ux → 05-task-management

> 생성일: 2026-01-21
> 프로젝트: snake-game
> 현재 스테이지: 04-ui-ux (완료)
> 다음 스테이지: 05-task-management

---

## ✅ 완료된 작업

- [x] 와이어프레임 설계 (5개 화면)
- [x] 사용자 플로우 다이어그램
- [x] 디자인 시스템 정의 (Neon Arcade 테마)
- [x] 컴포넌트 스타일 가이드
- [x] 반응형 브레이크포인트 정의
- [x] 애니메이션 명세

---

## 📁 생성된 산출물

| 파일 | 설명 |
|------|------|
| `outputs/wireframes.md` | 5개 화면 ASCII 와이어프레임 |
| `outputs/user_flows.md` | 사용자 플로우 다이어그램 |
| `outputs/design_system.md` | 디자인 시스템 토큰 |
| `HANDOFF.md` | 이 문서 |

---

## 🎨 핵심 디자인 결정사항

### 1. 테마: Neon Arcade

| 요소 | 스타일 |
|------|--------|
| 배경 | 다크 네이비 (#1a1a2e) |
| 강조 | 네온 그린 (#00ff88) + Glow |
| 위험 | 네온 레드 (#ff6b6b) + Glow |
| 하이라이트 | 골드 (#f0e130) |

### 2. 컴포넌트 구조

```
App
├── StartScreen
│   ├── Logo (Neon Glow)
│   ├── HighScore
│   └── StartButton
│
├── GameEngine
│   ├── ScoreBoard
│   │   ├── CurrentScore
│   │   └── BestScore
│   │
│   ├── CanvasLayer (400x400)
│   │   ├── Grid (20x20)
│   │   ├── Snake (Glow)
│   │   └── Food (Glow)
│   │
│   └── MobileControls (D-Pad)
│
├── PauseOverlay
│   ├── ResumeButton
│   └── QuitButton
│
└── GameOverModal
    ├── FinalScore
    ├── NewHighScore (조건부)
    ├── PlayAgainButton
    └── MainMenuLink
```

### 3. 반응형 브레이크포인트

| 너비 | 대상 | 변경사항 |
|------|------|----------|
| < 480px | 모바일 | MobileControls 활성화, 캔버스 축소 |
| 480px - 768px | 태블릿 | 터치 컨트롤 선택적 |
| > 768px | 데스크톱 | 키보드 전용, 풀 캔버스 |

---

## 📐 CSS 변수 요약

### 색상
```css
--color-primary: #00ff88
--color-secondary: #ff6b6b
--color-accent: #f0e130
--color-bg: #1a1a2e
--color-surface: #16213e
```

### 타이포그래피
```css
--font-pixel: 'Press Start 2P', monospace
--font-base: 0.875rem (14px)
--font-lg: 1rem (16px)
--font-2xl: 1.5rem (24px)
```

### 스페이싱
```css
--space-4: 1rem (16px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
```

---

## 🔜 05-task-management 스테이지 작업

### 필수 산출물

1. **tasks.md**
   - 구현 태스크 분해
   - 우선순위 지정 (P0, P1, P2)
   - 의존성 정의

2. **sprint-plan.md**
   - 스프린트 계획
   - 마일스톤 기반 배치

3. **HANDOFF.md**

### 태스크 분해 기준

| 카테고리 | 예시 태스크 |
|---------|-----------|
| 설정 | 프로젝트 초기화, 타입 정의, 상수 정의 |
| 훅 | useGameLoop, useKeyboard, useSwipe, useHighScore |
| 엔진 | gameReducer, collision.ts, renderer.ts |
| UI | CanvasLayer, ScoreBoard, GameOverModal, MobileControls |
| 통합 | GameEngine, App |

---

## 📊 AI 호출 기록

| AI | 시간 | 도구 | 결과 | 상태 |
|----|------|------|------|------|
| Gemini | 12:45 | tmux wrapper | UI/UX 설계 | ✅ |
| ClaudeCode | 12:50 | - | wireframes.md 작성 | ✅ |
| ClaudeCode | 12:52 | - | user_flows.md 작성 | ✅ |
| ClaudeCode | 12:55 | - | design_system.md 작성 | ✅ |

---

## 🚀 다음 단계

```bash
# 다음 스테이지 실행
/run-stage 05-task-management

# 또는
/tasks
```

---

**생성자**: ClaudeCode + Gemini
**검토자**: -
**승인**: 대기
