# 🏗️ Snake Game 시스템 아키텍처 설계서

> 생성일: 2026-01-21
> 스테이지: 03-planning
> 프로젝트: snake-game
> AI 도구: Gemini CLI

---

## 1. 컴포넌트 구조

이 프로젝트는 단일 캔버스 렌더링 방식과 React UI 오버레이를 결합한 **하이브리드 구조**를 채택합니다.

### 1.1 컴포넌트 역할

| 컴포넌트 | 타입 | 역할 |
|---------|------|------|
| **App** | Container | 전체 레이아웃, 최상위 상태(테마 등) 관리 |
| **GameEngine** | Smart | 핵심 비즈니스 로직 연결, Canvas/UI 조율 |
| **CanvasLayer** | Presentation | Canvas 접근, 게임 렌더링 수행 |
| **UIOverlay** | Presentation | HTML/CSS 기반 UI (점수, 모달 등) |
| **ScoreBoard** | UI | 현재 점수와 최고 점수 표시 |
| **GameOverModal** | UI | 게임 종료 시 재시작 버튼과 결과 |
| **StartScreen** | UI | 게임 시작 전 타이틀 화면 |
| **MobileControls** | UI | 모바일 방향 버튼 |

### 1.2 계층 구조 다이어그램

```
+-------------------------------------------------------+
|                       App                             |
|-------------------------------------------------------|
|  +-------------------------------------------------+  |
|  |                  GameEngine                     |  |
|  | (Holds Game State, Refs, and Event Listeners)   |  |
|  |-------------------------------------------------|  |
|  |  +-------------------+   +-------------------+  |  |
|  |  |    CanvasLayer    |   |     UIOverlay     |  |  |
|  |  | (Rendering Target)|   | (React Components)|  |  |
|  |  |                   |   |                   |  |  |
|  |  |  [Snake] [Food]   |   |  [ScoreBoard]     |  |  |
|  |  |  [Grid]  [Fx]     |   |  [GameOverModal]  |  |  |
|  |  |                   |   |  [MobileControls] |  |  |
|  |  +-------------------+   +-------------------+  |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
```

### 1.3 컴포넌트 의존성 그래프

```
                    App
                     │
              GameEngine
                     │
        ┌────────────┼────────────┐
        │            │            │
   CanvasLayer   UIOverlay    Hooks
        │            │            │
        │      ┌─────┴─────┐     │
        │      │     │     │     │
        │  Score  Modal  Mobile │
        │  Board  Over  Controls│
        │                        │
        └────────────────────────┘
              Canvas Context
```

---

## 2. 데이터 흐름

React의 선언적 상태 관리와 Canvas의 명령형 렌더링을 조화시키는 것이 핵심입니다.

### 2.1 게임 상태 흐름

```
┌─────────────────────────────────────────────────────────┐
│                      State Flow                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   useReducer ──────────────────────────────────────┐   │
│       │                                            │   │
│       ▼                                            │   │
│   gameState ────────────────────────────────────►  │   │
│   (snake, food, direction, score, status)          │   │
│       │                                            │   │
│       │  requestAnimationFrame                     │   │
│       ▼         │                                  │   │
│   gameLoop ◄────┘                                  │   │
│       │                                            │   │
│       ├──► dispatch({ type: 'TICK' })              │   │
│       │                                            │   │
│       ▼                                            │   │
│   Canvas.draw() ◄──────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 이벤트 처리 흐름

```
┌─────────────────────────────────────────────────────────┐
│                    Event Flow                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   User Input                                           │
│       │                                                │
│       ├──► Keyboard (useKeyboard) ──┐                  │
│       │                              │                  │
│       └──► Touch (useSwipe) ────────┤                  │
│                                      │                  │
│                                      ▼                  │
│                              Direction Normalized       │
│                              (UP/DOWN/LEFT/RIGHT)      │
│                                      │                  │
│                                      ▼                  │
│            dispatch({ type: 'CHANGE_DIRECTION' })      │
│                                      │                  │
│                                      ▼                  │
│                              Collision Check           │
│                                      │                  │
│                     ┌────────────────┼────────────┐    │
│                     │                │            │    │
│                     ▼                ▼            ▼    │
│                  Wall Hit       Self Hit      Eat Food │
│                     │                │            │    │
│                     ▼                ▼            ▼    │
│                GAME_OVER        GAME_OVER    Grow +10  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.3 상태 vs 참조 분리

| 데이터 | 관리 방식 | 이유 |
|--------|----------|------|
| snake, food, score | `useReducer` | UI 리렌더링 필요 |
| direction (버퍼) | `useRef` | 빠른 입력 처리, 리렌더링 방지 |
| canvasRef | `useRef` | DOM 참조 |
| animationFrameId | `useRef` | 루프 관리 |

---

## 3. 커스텀 훅 설계

### 3.1 useGameLoop

```typescript
/**
 * requestAnimationFrame 기반 게임 루프 관리
 * @param callback 매 프레임 실행될 함수
 * @param isRunning 루프 실행 여부
 */
const useGameLoop = (
  callback: (deltaTime: number) => void,
  isRunning: boolean
) => void;
```

**특징**:
- 컴포넌트 언마운트 시 자동 정리
- deltaTime 계산하여 프레임 독립적 애니메이션
- isRunning으로 일시정지/재개 제어

### 3.2 useKeyboard

```typescript
/**
 * 키보드 입력 감지 및 방향 변환
 * @param onDirectionChange 방향 변경 시 콜백
 * @param onPause 일시정지 토글 콜백
 * @param onRestart 재시작 콜백
 */
const useKeyboard = (
  onDirectionChange: (direction: Direction) => void,
  onPause?: () => void,
  onRestart?: () => void
) => void;
```

**지원 키**:
- Arrow Keys: 방향 이동
- WASD: 방향 이동 (대안)
- P / Escape: 일시정지
- R / Space: 재시작

### 3.3 useSwipe

```typescript
/**
 * 터치 스와이프 제스처 감지
 * @param handlers 각 방향별 핸들러
 */
const useSwipe = (handlers: {
  left?: () => void;
  right?: () => void;
  up?: () => void;
  down?: () => void;
}) => void;
```

**특징**:
- 최소 스와이프 거리 (threshold): 50px
- 최대 스와이프 시간: 500ms
- passive 리스너로 성능 최적화

### 3.4 useHighScore

```typescript
/**
 * localStorage 기반 최고 점수 관리
 */
const useHighScore = () => {
  highScore: number;
  updateHighScore: (score: number) => boolean;  // 갱신 여부 반환
  resetHighScore: () => void;
};
```

---

## 4. 파일/폴더 구조

```
snake-game/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/              # 정적 자산
│   │   └── sounds/          # 효과음 (선택)
│   │
│   ├── components/          # React UI 컴포넌트
│   │   ├── CanvasLayer.tsx  # Canvas 래퍼
│   │   ├── GameOverlay.tsx  # UI 오버레이 컨테이너
│   │   ├── ScoreBoard.tsx   # 점수판
│   │   ├── StartScreen.tsx  # 시작 화면
│   │   ├── GameOverModal.tsx # 게임 오버 모달
│   │   └── MobileControls.tsx # 모바일 버튼
│   │
│   ├── hooks/               # 커스텀 훅
│   │   ├── useGameLoop.ts
│   │   ├── useKeyboard.ts
│   │   ├── useSwipe.ts
│   │   └── useHighScore.ts
│   │
│   ├── engine/              # 게임 핵심 로직
│   │   ├── gameReducer.ts   # 상태 관리 리듀서
│   │   ├── collision.ts     # 충돌 감지
│   │   └── renderer.ts      # Canvas 렌더링
│   │
│   ├── types/               # TypeScript 타입
│   │   └── index.ts
│   │
│   ├── utils/               # 유틸리티 함수
│   │   └── random.ts        # 랜덤 좌표 생성
│   │
│   ├── constants/           # 상수 정의
│   │   └── config.ts
│   │
│   ├── styles/              # 스타일
│   │   └── index.css
│   │
│   ├── App.tsx              # 루트 컴포넌트
│   ├── GameEngine.tsx       # 게임 엔진 컴포넌트
│   └── main.tsx             # 진입점
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 5. 타입 정의

```typescript
// types/index.ts

/** 좌표 타입 */
export interface Point {
  x: number;
  y: number;
}

/** 이동 방향 */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/** 게임 진행 상태 */
export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

/** 전체 게임 상태 (Reducer State) */
export interface GameState {
  status: GameStatus;
  snake: Point[];           // 뱀 몸통 (0번이 머리)
  food: Point;              // 먹이 위치
  direction: Direction;     // 현재 방향
  nextDirection: Direction; // 입력 버퍼 (다음 틱에 적용)
  score: number;
  level: number;
  speed: number;            // 현재 속도 (ms)
}

/** Reducer Actions */
export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'TICK' }
  | { type: 'CHANGE_DIRECTION'; payload: Direction }
  | { type: 'EAT_FOOD' }
  | { type: 'RESTART' };

/** 게임 설정 */
export interface GameConfig {
  boardSize: number;        // 그리드 크기 (20x20)
  cellSize: number;         // 셀 픽셀 크기
  initialSpeed: number;     // 초기 속도 (ms)
  speedDecrement: number;   // 레벨업 시 속도 감소량
  minSpeed: number;         // 최소 속도 (최대 난이도)
  pointsPerFood: number;    // 먹이당 점수
  pointsForLevelUp: number; // 레벨업 필요 점수
}

/** 키보드 핸들러 */
export interface KeyboardHandlers {
  onDirectionChange: (direction: Direction) => void;
  onPause?: () => void;
  onRestart?: () => void;
}

/** 스와이프 핸들러 */
export interface SwipeHandlers {
  left?: () => void;
  right?: () => void;
  up?: () => void;
  down?: () => void;
}
```

---

## 6. 게임 설정 상수

```typescript
// constants/config.ts

export const GAME_CONFIG: GameConfig = {
  boardSize: 20,           // 20x20 그리드
  cellSize: 20,            // 각 셀 20px
  initialSpeed: 150,       // 150ms (초기)
  speedDecrement: 10,      // 레벨업 시 10ms 감소
  minSpeed: 50,            // 최소 50ms (최고 난이도)
  pointsPerFood: 10,       // 먹이당 10점
  pointsForLevelUp: 50,    // 50점마다 레벨업
};

export const COLORS = {
  background: '#1a1a2e',
  grid: '#16213e',
  snake: '#00ff88',
  snakeHead: '#00cc6a',
  food: '#ff6b6b',
  text: '#ffffff',
};

export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },  // 머리
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export const DIRECTION_VECTORS: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};
```

---

## ✅ 아키텍처 체크리스트

- [x] 컴포넌트 구조 정의
- [x] 데이터 흐름 설계
- [x] 커스텀 훅 설계
- [x] 파일/폴더 구조 정의
- [x] 타입 정의
- [x] 게임 설정 상수 정의
