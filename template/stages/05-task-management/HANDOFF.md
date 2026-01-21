# HANDOFF: 05-task-management → 06-implementation

> 생성일: 2026-01-21
> 프로젝트: snake-game
> 현재 스테이지: 05-task-management (완료)
> 다음 스테이지: 06-implementation

---

## ✅ 완료된 작업

- [x] 25개 태스크 분해 (6개 에픽)
- [x] 4개 스프린트 계획
- [x] 4개 마일스톤 정의
- [x] 의존성 그래프 작성
- [x] 우선순위 지정 (MoSCoW)

---

## 📁 생성된 산출물

| 파일 | 설명 |
|------|------|
| `outputs/tasks.md` | 25개 태스크 상세 목록 |
| `outputs/sprint_plan.md` | 4개 스프린트 계획 |
| `outputs/milestones.md` | 4개 마일스톤 정의 |
| `HANDOFF.md` | 이 문서 |

---

## 🚀 06-implementation 즉시 실행 태스크

### Sprint 1 태스크 (순서대로)

| 순서 | ID | 태스크 | 예상 시간 |
|------|-----|--------|----------|
| 1 | TASK-001 | Vite + React + TS 프로젝트 초기화 | 10분 |
| 2 | TASK-002 | 타입 정의 (types/index.ts) | 15분 |
| 3 | TASK-003 | 상수 정의 (constants/config.ts) | 10분 |
| 4 | TASK-004 | 글로벌 스타일 (styles/index.css) | 15분 |
| 5 | TASK-005 | useGameLoop 훅 | 20분 |
| 6 | TASK-007 | collision.ts | 15분 |
| 7 | TASK-009 | random.ts | 10분 |
| 8 | TASK-008 | renderer.ts | 25분 |
| 9 | TASK-006 | gameReducer | 30분 |
| 10 | TASK-016 | useKeyboard 훅 | 20분 |

---

## 📐 프로젝트 구조 (목표)

```
snake-game/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CanvasLayer.tsx
│   │   ├── CanvasLayer.module.css
│   │   ├── ScoreBoard.tsx
│   │   ├── ScoreBoard.module.css
│   │   ├── StartScreen.tsx
│   │   ├── GameOverModal.tsx
│   │   └── MobileControls.tsx
│   │
│   ├── hooks/
│   │   ├── useGameLoop.ts
│   │   ├── useKeyboard.ts
│   │   ├── useSwipe.ts
│   │   └── useHighScore.ts
│   │
│   ├── engine/
│   │   ├── gameReducer.ts
│   │   ├── collision.ts
│   │   └── renderer.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── constants/
│   │   └── config.ts
│   │
│   ├── utils/
│   │   └── random.ts
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   ├── App.tsx
│   ├── GameEngine.tsx
│   └── main.tsx
│
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🎯 핵심 구현 사항

### 1. 타입 정의 (TASK-002)

```typescript
// 필수 타입
export interface Point { x: number; y: number; }
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
export interface GameState { ... }
export type GameAction = { type: '...' } | ...;
```

### 2. 게임 설정 (TASK-003)

```typescript
export const GAME_CONFIG = {
  boardSize: 20,
  cellSize: 20,
  initialSpeed: 150,
  speedDecrement: 10,
  minSpeed: 50,
  pointsPerFood: 10,
  pointsForLevelUp: 50,
};
```

### 3. 디자인 토큰 (TASK-004)

```css
:root {
  --color-primary: #00ff88;
  --color-secondary: #ff6b6b;
  --color-bg: #1a1a2e;
  --color-surface: #16213e;
}
```

---

## ⚠️ 주의사항

1. **순서 준수**: 의존성 순서대로 구현
2. **타입 우선**: 모든 코드에 타입 적용
3. **함수형 컴포넌트**: Class 컴포넌트 금지
4. **CSS Modules**: 스타일 스코프 격리
5. **외부 엔진 금지**: 순수 React + Canvas

---

## 📊 예상 시간

| 항목 | 시간 |
|------|------|
| Sprint 1 (MVP 기반) | ~2시간 50분 |
| Sprint 2 (MVP 완성) | ~2시간 25분 |
| **06-implementation 총계** | ~5시간 15분 |

---

## 🔗 참조 문서

| 문서 | 경로 |
|------|------|
| 아키텍처 | `stages/03-planning/outputs/architecture.md` |
| 기술 스택 | `stages/03-planning/outputs/tech_stack.md` |
| 구현 규칙 | `stages/03-planning/outputs/implementation.yaml` |
| 와이어프레임 | `stages/04-ui-ux/outputs/wireframes.md` |
| 디자인 시스템 | `stages/04-ui-ux/outputs/design_system.md` |

---

## 🚀 다음 단계

```bash
# 다음 스테이지 실행
/run-stage 06-implementation

# 또는
/implement
```

---

**생성자**: ClaudeCode
**검토자**: -
**승인**: 대기
