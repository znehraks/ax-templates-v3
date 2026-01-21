# 🔧 Snake Game - 기술 스택 결정

> 생성일: 2026-01-21
> 스테이지: 03-planning
> 프로젝트: snake-game

---

## 📋 최종 기술 스택

### 핵심 스택

| 카테고리 | 선택 | 버전 | 근거 |
|---------|------|------|------|
| **프레임워크** | React | ^18.2.0 | 컴포넌트 기반, 훅 시스템 |
| **언어** | TypeScript | ^5.3.0 | 타입 안전성, IDE 지원 |
| **빌드** | Vite | ^5.0.0 | 빠른 HMR, 최적화된 빌드 |
| **렌더링** | Canvas API | 네이티브 | 게임 성능, 60fps |
| **상태관리** | useReducer + useRef | React 내장 | 외부 의존성 최소화 |

### 개발 도구

| 카테고리 | 선택 | 버전 | 용도 |
|---------|------|------|------|
| **린터** | ESLint | ^8.55.0 | 코드 품질 |
| **포맷터** | Prettier | ^3.1.0 | 코드 일관성 |
| **테스트** | Vitest | ^1.1.0 | 단위/통합 테스트 |
| **E2E** | Playwright | ^1.40.0 | E2E 테스트 |

### 스타일링

| 카테고리 | 선택 | 근거 |
|---------|------|------|
| **CSS** | CSS Modules | 스코프 격리, 번들 최적화 |
| **대안** | Tailwind CSS | 빠른 프로토타이핑 (선택) |

---

## 📦 package.json 의존성

```json
{
  "name": "snake-game",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "@vitest/coverage-v8": "^1.1.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.6",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "jsdom": "^23.0.1",
    "prettier": "^3.1.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vitest": "^1.1.0"
  }
}
```

---

## ⚖️ 기술 결정 근거

### 1. React vs Vue vs Svelte

| 항목 | React | Vue | Svelte |
|------|-------|-----|--------|
| 생태계 | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| 학습 곡선 | 중간 | 낮음 | 낮음 |
| 게임 개발 자료 | 많음 | 보통 | 적음 |
| 커뮤니티 | 최대 | 큼 | 성장 중 |

**선택: React** - 풍부한 게임 개발 자료, 훅 시스템 활용

### 2. Canvas vs CSS Grid vs SVG

| 항목 | Canvas | CSS Grid | SVG |
|------|--------|----------|-----|
| 성능 (대량 요소) | ⭐⭐⭐ | ⭐ | ⭐⭐ |
| 구현 복잡도 | 중간 | 낮음 | 높음 |
| 애니메이션 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| 반응형 | 코드 필요 | 자동 | 자동 |

**선택: Canvas** - 게임에 최적화, 60fps 보장

### 3. 상태 관리: useReducer vs Redux vs Zustand

| 항목 | useReducer | Redux | Zustand |
|------|-----------|-------|---------|
| 번들 크기 | 0KB | ~43KB | ~3KB |
| 복잡도 | 낮음 | 높음 | 낮음 |
| 게임 적합성 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

**선택: useReducer** - 외부 의존성 없음, 게임 규모에 적합

### 4. Vite vs CRA vs Next.js

| 항목 | Vite | CRA | Next.js |
|------|------|-----|---------|
| 빌드 속도 | ⭐⭐⭐ | ⭐ | ⭐⭐ |
| 설정 복잡도 | 낮음 | 낮음 | 중간 |
| 정적 빌드 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

**선택: Vite** - 빠른 개발 경험, 최적화된 빌드

---

## 🚫 미사용 기술

| 기술 | 미사용 이유 |
|------|-----------|
| Phaser.js | 게임 엔진 금지 (순수 React) |
| PixiJS | 게임 엔진 금지 |
| jQuery | 레거시, React와 충돌 |
| MobX | 과도한 복잡성 |
| Next.js | SSR 불필요 (정적 게임) |
| Sass/SCSS | CSS Modules로 충분 |

---

## 📁 프로젝트 생성 명령

```bash
# Vite로 React + TypeScript 프로젝트 생성
npm create vite@latest snake-game -- --template react-ts

# 디렉토리 이동
cd snake-game

# 의존성 설치
npm install

# 개발 도구 설치
npm install -D @vitest/coverage-v8 @testing-library/react \
  @testing-library/jest-dom jsdom @playwright/test

# 개발 서버 시작
npm run dev
```

---

## ✅ 기술 스택 체크리스트

- [x] 핵심 프레임워크 선택 (React 18)
- [x] 언어 선택 (TypeScript 5)
- [x] 빌드 도구 선택 (Vite 5)
- [x] 렌더링 방식 선택 (Canvas API)
- [x] 상태 관리 방식 선택 (useReducer + useRef)
- [x] 스타일링 방식 선택 (CSS Modules)
- [x] 테스트 도구 선택 (Vitest + Playwright)
- [x] 의존성 목록 작성
