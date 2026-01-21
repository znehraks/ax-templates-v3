# HANDOFF: 03-planning → 04-ui-ux

> 생성일: 2026-01-21
> 프로젝트: snake-game
> 현재 스테이지: 03-planning (완료)
> 다음 스테이지: 04-ui-ux

---

## ✅ 완료된 작업

- [x] 시스템 아키텍처 설계 (컴포넌트 구조, 데이터 흐름)
- [x] 기술 스택 최종 결정 (React 18 + TypeScript 5 + Vite 5 + Canvas API)
- [x] 커스텀 훅 설계 (useGameLoop, useKeyboard, useSwipe, useHighScore)
- [x] 타입 정의 (Point, Direction, GameStatus, GameState, GameAction)
- [x] 게임 설정 상수 정의 (GAME_CONFIG, COLORS, DIRECTION_VECTORS)
- [x] 프로젝트 계획 수립 (마일스톤, 스프린트 계획)
- [x] 구현 규칙 정의 (implementation.yaml)

---

## 📋 핵심 아키텍처 결정사항

### 1. 컴포넌트 구조 (하이브리드)

```
App
 └── GameEngine (상태 관리, 이벤트 처리)
      ├── CanvasLayer (Canvas 렌더링)
      └── UIOverlay (React UI)
           ├── ScoreBoard
           ├── GameOverModal
           ├── StartScreen
           └── MobileControls
```

### 2. 데이터 흐름

- **useReducer**: UI 리렌더링 필요한 상태 (score, status)
- **useRef**: 빠른 업데이트 (direction buffer, animationFrameId)
- **Canvas 직접 조작**: 게임 렌더링 (리렌더링 최소화)

### 3. 게임 루프

```typescript
requestAnimationFrame 기반
├── deltaTime 계산
├── dispatch({ type: 'TICK' })
└── Canvas.draw()
```

---

## 📁 생성된 산출물

| 파일 | 설명 |
|------|------|
| `outputs/architecture.md` | 시스템 아키텍처 상세 설계 |
| `outputs/tech_stack.md` | 기술 스택 결정 및 근거 |
| `outputs/project_plan.md` | 프로젝트 계획 및 마일스톤 |
| `outputs/implementation.yaml` | 구현 규칙 설정 |
| `HANDOFF.md` | 이 문서 |

---

## 🎨 UI/UX 스테이지 입력 정보

### 화면 구성 요소

| 화면 | 구성 요소 |
|------|----------|
| **시작 화면** | 타이틀, 시작 버튼, 최고 점수 |
| **게임 화면** | Canvas(뱀/먹이/그리드), 점수판 |
| **일시정지** | 오버레이, 재개/재시작 버튼 |
| **게임 오버** | 모달, 최종 점수, 최고 점수, 재시작 버튼 |
| **모바일** | 방향 버튼 (상하좌우) |

### 색상 시스템 (확정)

```yaml
background: "#1a1a2e"  # 다크 배경
grid: "#16213e"        # 그리드 라인
snake: "#00ff88"       # 뱀 몸통 (네온 그린)
snake_head: "#00cc6a"  # 뱀 머리 (진한 그린)
food: "#ff6b6b"        # 먹이 (레드)
text: "#ffffff"        # 텍스트 (화이트)
```

### 반응형 기준

| 브레이크포인트 | 대상 |
|--------------|------|
| < 480px | 모바일 (터치 컨트롤 활성화) |
| 480px - 768px | 태블릿 |
| > 768px | 데스크톱 |

### 게임 보드 크기

```yaml
boardSize: 20        # 20x20 그리드
cellSize: 20px       # 각 셀 20px
totalSize: 400x400px # 게임 보드 총 크기
```

---

## 🔜 04-ui-ux 스테이지 작업

### 필수 산출물

1. **wireframes.md**
   - 시작 화면 와이어프레임
   - 게임 화면 와이어프레임 (데스크톱/모바일)
   - 게임 오버 모달 와이어프레임

2. **design-tokens.md**
   - 색상 토큰
   - 타이포그래피
   - 간격 시스템
   - 애니메이션 토큰

3. **HANDOFF.md**

### 고려 사항

- 레트로 게임 느낌 (네온 색상, 픽셀 폰트 고려)
- 미니멀한 UI (게임에 집중)
- 모바일 터치 영역 충분히 확보 (44x44px 최소)
- 접근성 (키보드 네비게이션, 색상 대비)

---

## ⚠️ 제약 사항

1. **순수 React + Canvas**: 외부 게임 엔진 미사용
2. **함수형 컴포넌트**: Class 컴포넌트 미사용
3. **CSS Modules**: 스타일 스코프 격리
4. **60fps 목표**: Canvas 렌더링 최적화

---

## 📊 AI 호출 기록

| AI | 시간 | 도구 | 결과 | 상태 |
|----|------|------|------|------|
| Gemini | 12:25 | tmux wrapper | 아키텍처 설계 | ✅ |
| ClaudeCode | 12:30 | - | architecture.md 작성 | ✅ |
| ClaudeCode | 12:32 | - | tech_stack.md 작성 | ✅ |
| ClaudeCode | 12:35 | - | project_plan.md 작성 | ✅ |
| ClaudeCode | 12:36 | - | implementation.yaml 작성 | ✅ |

---

## 🚀 다음 단계

```bash
# 다음 스테이지 실행
/run-stage 04-ui-ux

# 또는
/ui-ux
```

---

**생성자**: ClaudeCode + Gemini
**검토자**: -
**승인**: 대기
