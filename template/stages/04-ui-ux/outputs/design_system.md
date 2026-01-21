# 🎨 Snake Game - 디자인 시스템

> 생성일: 2026-01-21
> 스테이지: 04-ui-ux
> 프로젝트: snake-game
> 테마: Neon Arcade

---

## 1. 색상 팔레트 (Color Palette)

### 1.1 핵심 색상

| 역할 | 변수명 | 색상 코드 | 용도 |
|------|--------|----------|------|
| **Primary** | `--color-primary` | `#00ff88` | 뱀, 메인 버튼, 강조 텍스트 |
| **Primary Dark** | `--color-primary-dark` | `#00cc6a` | 뱀 머리, 버튼 hover |
| **Secondary** | `--color-secondary` | `#ff6b6b` | 먹이, 위험/삭제, Game Over |
| **Accent** | `--color-accent` | `#f0e130` | 최고 점수, 특별 알림 |
| **Background** | `--color-bg` | `#1a1a2e` | 페이지 배경 |
| **Surface** | `--color-surface` | `#16213e` | 카드, 모달, 캔버스 배경 |

### 1.2 텍스트 색상

| 역할 | 변수명 | 색상 코드 | 용도 |
|------|--------|----------|------|
| **Text Primary** | `--color-text` | `#ffffff` | 주요 텍스트, 점수 |
| **Text Secondary** | `--color-text-sub` | `#aeb2b8` | 보조 설명, 힌트 |
| **Text Muted** | `--color-text-muted` | `#6b7280` | 비활성 텍스트 |

### 1.3 그리드/보더 색상

| 역할 | 변수명 | 색상 코드 | 용도 |
|------|--------|----------|------|
| **Grid Line** | `--color-grid` | `rgba(255, 255, 255, 0.05)` | 게임 보드 격자 |
| **Border** | `--color-border` | `rgba(255, 255, 255, 0.1)` | 컴포넌트 테두리 |

### 1.4 CSS 변수 정의

```css
:root {
  /* Colors - Primary */
  --color-primary: #00ff88;
  --color-primary-dark: #00cc6a;
  --color-primary-glow: rgba(0, 255, 136, 0.5);

  /* Colors - Secondary */
  --color-secondary: #ff6b6b;
  --color-secondary-glow: rgba(255, 107, 107, 0.5);

  /* Colors - Accent */
  --color-accent: #f0e130;

  /* Colors - Background */
  --color-bg: #1a1a2e;
  --color-surface: #16213e;
  --color-overlay: rgba(0, 0, 0, 0.85);

  /* Colors - Text */
  --color-text: #ffffff;
  --color-text-sub: #aeb2b8;
  --color-text-muted: #6b7280;

  /* Colors - Utility */
  --color-grid: rgba(255, 255, 255, 0.05);
  --color-border: rgba(255, 255, 255, 0.1);
}
```

---

## 2. 타이포그래피 (Typography)

### 2.1 폰트 패밀리

| 용도 | 폰트 | 대체 폰트 |
|------|------|----------|
| **Primary (Pixel)** | 'Press Start 2P' | 'Courier New', monospace |
| **Secondary (Modern)** | 'Roboto Mono' | 'Consolas', monospace |
| **Fallback** | system-ui | -apple-system, sans-serif |

### 2.2 폰트 크기

| 변수명 | 크기 | 용도 |
|--------|------|------|
| `--font-xs` | 10px | 저작권, 힌트 |
| `--font-sm` | 12px | 보조 텍스트 |
| `--font-base` | 14px | 기본 텍스트 |
| `--font-lg` | 16px | 버튼, 점수 |
| `--font-xl` | 20px | 섹션 제목 |
| `--font-2xl` | 24px | 모달 제목 |
| `--font-3xl` | 32px | 큰 제목 |
| `--font-4xl` | 48px | 로고 |

### 2.3 폰트 두께

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `--font-normal` | 400 | 기본 텍스트 |
| `--font-medium` | 500 | 강조 텍스트 |
| `--font-bold` | 700 | 제목, 점수 |

### 2.4 CSS 정의

```css
:root {
  /* Font Family */
  --font-pixel: 'Press Start 2P', 'Courier New', monospace;
  --font-mono: 'Roboto Mono', 'Consolas', monospace;

  /* Font Size */
  --font-xs: 0.625rem;   /* 10px */
  --font-sm: 0.75rem;    /* 12px */
  --font-base: 0.875rem; /* 14px */
  --font-lg: 1rem;       /* 16px */
  --font-xl: 1.25rem;    /* 20px */
  --font-2xl: 1.5rem;    /* 24px */
  --font-3xl: 2rem;      /* 32px */
  --font-4xl: 3rem;      /* 48px */

  /* Font Weight */
  --font-normal: 400;
  --font-medium: 500;
  --font-bold: 700;

  /* Line Height */
  --line-tight: 1.25;
  --line-normal: 1.5;
  --line-relaxed: 1.75;
}
```

---

## 3. 스페이싱 시스템 (Spacing)

### 3.1 기본 스케일 (4px 기반)

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `--space-1` | 4px | 미세 간격 |
| `--space-2` | 8px | 요소 내 간격 |
| `--space-3` | 12px | 작은 간격 |
| `--space-4` | 16px | 기본 간격 |
| `--space-5` | 20px | 중간 간격 |
| `--space-6` | 24px | 섹션 간격 |
| `--space-8` | 32px | 큰 간격 |
| `--space-10` | 40px | 컴포넌트 간격 |
| `--space-12` | 48px | 섹션 구분 |
| `--space-16` | 64px | 페이지 여백 |

### 3.2 CSS 정의

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

---

## 4. 컴포넌트 스타일

### 4.1 버튼 (Button)

```css
/* Primary Button */
.btn-primary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-pixel);
  font-size: var(--font-base);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-primary);
  color: var(--color-bg);
  box-shadow: 0 0 20px var(--color-primary-glow);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--color-text-sub);
  border: 1px solid var(--color-border);
  padding: var(--space-2) var(--space-4);
}

.btn-secondary:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}
```

### 4.2 모달 (Modal)

```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

/* Modal Content */
.modal-content {
  background: var(--color-surface);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  max-width: 400px;
  width: 90%;
  box-shadow: 0 0 30px var(--color-primary-glow);
}

/* Modal Title */
.modal-title {
  font-family: var(--font-pixel);
  font-size: var(--font-2xl);
  color: var(--color-text);
  text-align: center;
  margin-bottom: var(--space-6);
}
```

### 4.3 카드 (Card)

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.card:hover {
  border-color: var(--color-primary);
}
```

### 4.4 점수판 (ScoreBoard)

```css
.scoreboard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.score {
  font-family: var(--font-pixel);
  font-size: var(--font-lg);
  color: var(--color-text);
}

.high-score {
  font-family: var(--font-pixel);
  font-size: var(--font-base);
  color: var(--color-accent);
}
```

---

## 5. 효과 (Effects)

### 5.1 네온 글로우

```css
/* Snake Glow */
.snake-glow {
  box-shadow: 0 0 10px var(--color-primary),
              0 0 20px var(--color-primary-glow);
}

/* Food Glow */
.food-glow {
  box-shadow: 0 0 10px var(--color-secondary),
              0 0 20px var(--color-secondary-glow);
}

/* Text Glow */
.text-glow {
  text-shadow: 0 0 10px currentColor;
}
```

### 5.2 애니메이션

```css
/* Score Pulse */
@keyframes score-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.score-pulse {
  animation: score-pulse 0.2s ease;
}

/* Modal Enter */
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-enter {
  animation: modal-enter 0.3s ease;
}

/* Blink (High Score) */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.blink {
  animation: blink 1s infinite;
}

/* Snake Pulse */
@keyframes snake-pulse {
  0%, 100% { box-shadow: 0 0 5px var(--color-primary); }
  50% { box-shadow: 0 0 15px var(--color-primary-glow); }
}
```

---

## 6. 반응형 디자인

### 6.1 브레이크포인트

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `--bp-sm` | 480px | 모바일 |
| `--bp-md` | 768px | 태블릿 |
| `--bp-lg` | 1024px | 데스크톱 |

### 6.2 미디어 쿼리

```css
/* Mobile First */
.container {
  padding: var(--space-4);
}

/* Tablet */
@media (min-width: 480px) {
  .container {
    padding: var(--space-6);
  }
}

/* Desktop */
@media (min-width: 768px) {
  .container {
    padding: var(--space-8);
    max-width: 600px;
    margin: 0 auto;
  }
}
```

---

## 7. 기타 토큰

### 7.1 Border Radius

| 변수명 | 값 |
|--------|-----|
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |
| `--radius-full` | 9999px |

### 7.2 Shadow

| 변수명 | 값 |
|--------|-----|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.4)` |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.5)` |
| `--shadow-glow` | `0 0 20px var(--color-primary-glow)` |

### 7.3 Transition

| 변수명 | 값 |
|--------|-----|
| `--transition-fast` | `0.1s ease` |
| `--transition-normal` | `0.2s ease` |
| `--transition-slow` | `0.3s ease` |

---

## 8. 컴포넌트 목록

| 컴포넌트 | 설명 | 스타일 파일 |
|---------|------|------------|
| App | 레이아웃 컨테이너 | App.module.css |
| StartScreen | 시작 화면 | StartScreen.module.css |
| GameEngine | 게임 엔진 래퍼 | GameEngine.module.css |
| CanvasLayer | Canvas 렌더링 | CanvasLayer.module.css |
| ScoreBoard | 점수판 | ScoreBoard.module.css |
| GameOverModal | 게임 오버 모달 | GameOverModal.module.css |
| MobileControls | 모바일 컨트롤 | MobileControls.module.css |

---

## ✅ 디자인 시스템 체크리스트

- [x] 색상 팔레트 정의
- [x] 타이포그래피 정의
- [x] 스페이싱 시스템
- [x] 버튼 스타일
- [x] 모달 스타일
- [x] 네온 글로우 효과
- [x] 애니메이션 정의
- [x] 반응형 브레이크포인트
- [x] CSS 변수 정의
- [x] 컴포넌트 목록
