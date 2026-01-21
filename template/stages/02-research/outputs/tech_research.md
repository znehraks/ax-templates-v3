# 🔬 Snake Game - 기술 리서치

> 생성일: 2026-01-21
> 스테이지: 02-research
> 프로젝트: snake-game
> AI 도구: Claude + Exa MCP

---

## 📋 조사 항목 요약

| 항목 | 권장 기술 | 근거 |
|------|----------|------|
| 렌더링 | Canvas API | 게임 성능, 60fps 유지 |
| 게임 루프 | requestAnimationFrame | 브라우저 최적화, 탭 비활성화 처리 |
| 상태 관리 | useReducer + useRef | 복잡한 게임 상태, 리렌더링 최소화 |
| 모바일 조작 | Custom useSwipe Hook | 터치 이벤트 직접 처리 |
| 하이스코어 | localStorage | 백엔드 불필요, 간단한 구현 |

---

## 1. Canvas 게임 루프 구현

### 1.1 requestAnimationFrame 기반 게임 루프

**핵심 패턴** (Exa 조사 결과):

```typescript
// useGameLoop.ts
const useGameLoop = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
};
```

### 1.2 setInterval vs requestAnimationFrame 비교

| 특성 | setInterval | requestAnimationFrame |
|------|-------------|----------------------|
| **정확도** | 낮음 (지연 발생) | 높음 (브라우저 최적화) |
| **탭 비활성화** | 계속 실행 (리소스 낭비) | 자동 일시정지 |
| **프레임레이트** | 고정 (부정확) | 디스플레이 동기화 (60fps) |
| **성능** | 보통 | 최적화됨 |

**결론**: requestAnimationFrame 사용 권장

### 1.3 하이브리드 게임 루프 (고정 타임스텝)

```typescript
// 물리 시뮬레이션과 렌더링 분리
const TICK_RATE = 1000 / 60; // 60 TPS
let accumulator = 0;

const gameLoop = (currentTime: number) => {
  const deltaTime = currentTime - lastTime;
  accumulator += Math.min(deltaTime, 100); // 프레임 스킵 제한

  while (accumulator >= TICK_RATE) {
    updateGameState(); // 고정 타임스텝 업데이트
    accumulator -= TICK_RATE;
  }

  render(); // 가변 렌더링
  requestAnimationFrame(gameLoop);
};
```

---

## 2. React + Canvas 통합 패턴

### 2.1 useRef로 Canvas 접근

```typescript
const GameBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 게임 렌더링 로직
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ... 렌더링
    };

    draw();
  }, [gameState]);

  return <canvas ref={canvasRef} width={400} height={400} />;
};
```

### 2.2 리렌더링 최소화 전략

**문제**: React setState가 너무 자주 호출되면 성능 저하

**해결책**:
1. **useRef로 게임 상태 관리** - 리렌더링 없이 상태 업데이트
2. **Canvas 직접 업데이트** - React DOM 업데이트 우회
3. **requestAnimationFrame 내에서 렌더링** - 효율적인 드로잉

```typescript
// 게임 상태는 useRef로 관리
const gameStateRef = useRef<GameState>({
  snake: [{x: 10, y: 10}],
  food: {x: 5, y: 5},
  direction: 'RIGHT',
  score: 0
});

// UI에 표시할 점수만 useState로 관리
const [displayScore, setDisplayScore] = useState(0);
```

---

## 3. 모바일 터치 조작 구현

### 3.1 useSwipe 커스텀 훅

**Exa 조사 결과 기반 구현**:

```typescript
interface SwipeHandlers {
  left?: () => void;
  right?: () => void;
  up?: () => void;
  down?: () => void;
}

const useSwipe = (handlers: SwipeHandlers) => {
  const touchCoordsRef = useRef({
    touchStart: { x: 0, y: 0, time: Date.now() }
  });

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchCoordsRef.current.touchStart = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
        time: Date.now()
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const threshold = 50; // 최소 스와이프 거리
      const maxTime = 500; // 최대 스와이프 시간 (ms)

      const { touchStart } = touchCoordsRef.current;
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };

      const elapsed = Date.now() - touchStart.time;
      if (elapsed > maxTime) return;

      const xDiff = touchStart.x - touchEnd.x;
      const yDiff = touchStart.y - touchEnd.y;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        // 수평 스와이프
        if (Math.abs(xDiff) > threshold) {
          xDiff > 0 ? handlers.left?.() : handlers.right?.();
        }
      } else {
        // 수직 스와이프
        if (Math.abs(yDiff) > threshold) {
          yDiff > 0 ? handlers.up?.() : handlers.down?.();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers]);
};
```

### 3.2 모바일 방향 버튼 (대안)

```typescript
const MobileControls: React.FC<{ onDirection: (dir: Direction) => void }> = ({ onDirection }) => (
  <div className="mobile-controls">
    <button onTouchStart={() => onDirection('UP')}>↑</button>
    <div>
      <button onTouchStart={() => onDirection('LEFT')}>←</button>
      <button onTouchStart={() => onDirection('RIGHT')}>→</button>
    </div>
    <button onTouchStart={() => onDirection('DOWN')}>↓</button>
  </div>
);
```

---

## 4. 충돌 감지 알고리즘

### 4.1 벽 충돌 (O(1))

```typescript
const checkWallCollision = (head: Position, boardSize: number): boolean => {
  return head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize;
};
```

### 4.2 자기 몸 충돌 (O(n))

```typescript
const checkSelfCollision = (head: Position, body: Position[]): boolean => {
  // body[0]은 머리이므로 1부터 시작
  return body.slice(1).some(segment =>
    segment.x === head.x && segment.y === head.y
  );
};
```

### 4.3 먹이 충돌 (O(1))

```typescript
const checkFoodCollision = (head: Position, food: Position): boolean => {
  return head.x === food.x && head.y === food.y;
};
```

---

## 5. 상태 관리 구조

### 5.1 게임 상태 타입 정의

```typescript
// types/game.ts
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction; // 입력 버퍼
  score: number;
  level: number;
  status: GameStatus;
}

interface GameConfig {
  boardSize: number;
  cellSize: number;
  initialSpeed: number;
  speedIncrement: number;
}
```

### 5.2 useReducer 기반 상태 관리

```typescript
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'SET_DIRECTION'; payload: Direction }
  | { type: 'MOVE_SNAKE' }
  | { type: 'EAT_FOOD' }
  | { type: 'RESET_GAME' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, status: 'playing' };
    case 'SET_DIRECTION':
      // 반대 방향 이동 방지
      if (!isOppositeDirection(state.direction, action.payload)) {
        return { ...state, nextDirection: action.payload };
      }
      return state;
    case 'MOVE_SNAKE':
      // 뱀 이동 로직
      return moveSnake(state);
    // ... 기타 액션
  }
};
```

---

## 6. localStorage 하이스코어

### 6.1 저장 및 로드

```typescript
const HIGH_SCORE_KEY = 'snake_game_high_score';

const saveHighScore = (score: number): void => {
  const currentHigh = getHighScore();
  if (score > currentHigh) {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  }
};

const getHighScore = (): number => {
  const stored = localStorage.getItem(HIGH_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
};
```

### 6.2 커스텀 훅

```typescript
const useHighScore = () => {
  const [highScore, setHighScore] = useState(() => getHighScore());

  const updateHighScore = useCallback((score: number) => {
    if (score > highScore) {
      setHighScore(score);
      saveHighScore(score);
    }
  }, [highScore]);

  return { highScore, updateHighScore };
};
```

---

## 7. 성능 최적화 팁

### 7.1 Canvas 최적화

1. **오프스크린 캔버스**: 복잡한 요소 미리 렌더링
2. **부분 리드로잉**: 변경된 부분만 다시 그리기
3. **이미지 스프라이트**: 여러 이미지 하나로 합치기

### 7.2 React 최적화

1. **useCallback/useMemo**: 불필요한 재생성 방지
2. **React.memo**: 순수 컴포넌트 메모이제이션
3. **게임 로직 분리**: Canvas 업데이트는 React 외부에서

---

## 📚 참고 자료

### GitHub 오픈소스 프로젝트
- [gimnathperera/snake-loop](https://github.com/gimnathperera/snake-loop) - React + RTK Query
- [markkaylor/react-snake-ts](https://github.com/markkaylor/react-snake-ts) - TypeScript 구현
- [v662-coder/SnakeGame](https://github.com/v662-coder/SnakeGame) - Canvas 기반

### 기술 문서
- [30-seconds-of-code: useRequestAnimationFrame](https://github.com/Chalarangelo/30-seconds-of-code)
- [react-use: useRafLoop](https://github.com/streamich/react-use)
- [beautiful-react-hooks: useRequestAnimationFrame](https://github.com/antonioru/beautiful-react-hooks)

### 튜토리얼
- [Learn Advance React Hooks by Building Snake Game](https://javascript.plainenglish.io/learn-advance-react-hooks-by-building-snake-game)
- [Build Your First Snake Game with TypeScript React](https://javascript.plainenglish.io/build-your-first-snake-game-with-typescript-react)
- [Create Dead-Simple Canvas Animations in React](https://spin.atomicobject.com/animations-react)

---

## ✅ 리서치 완료 체크리스트

- [x] Canvas 게임 루프 구현 방법 조사
- [x] React + Canvas 통합 패턴 분석
- [x] 모바일 터치 이벤트 처리 조사
- [x] 충돌 감지 알고리즘 정리
- [x] localStorage 하이스코어 구현 방법
- [x] 성능 최적화 기법 조사
- [x] 오픈소스 프로젝트 사례 수집
