# HANDOFF: 02-research → 03-planning

> 생성일: 2026-01-21
> 프로젝트: snake-game
> 현재 스테이지: 02-research (완료)
> 다음 스테이지: 03-planning

---

## ✅ 완료된 작업

- [x] Canvas 게임 루프 구현 방법 조사
- [x] React + Canvas 통합 패턴 분석
- [x] 모바일 터치 이벤트 처리 조사
- [x] 충돌 감지 알고리즘 정리
- [x] localStorage 하이스코어 구현 방법
- [x] 성능 최적화 기법 조사
- [x] 오픈소스 프로젝트 사례 수집
- [x] 실현 가능성 보고서 작성

---

## 📋 핵심 기술 결정사항

### 1. 렌더링 방식
- **선택**: Canvas API
- **이유**: 게임 성능, 60fps 유지, 복잡한 애니메이션 지원
- **대안 기각**: CSS Grid (대량 요소 시 성능 저하)

### 2. 게임 루프
- **선택**: requestAnimationFrame
- **이유**: 브라우저 최적화, 탭 비활성화 시 자동 일시정지
- **대안 기각**: setInterval (정확도 낮음)

### 3. 상태 관리
- **선택**: useReducer + useRef 조합
- **이유**: 복잡한 게임 상태, 리렌더링 최소화
- **패턴**: 게임 로직은 useRef, UI 표시용만 useState

### 4. 모바일 조작
- **선택**: Custom useSwipe 훅 + 방향 버튼
- **이유**: 검증된 패턴, 두 가지 입력 방식 모두 지원

---

## 📁 생성된 산출물

| 파일 | 설명 |
|------|------|
| `outputs/tech_research.md` | 기술 리서치 상세 결과 |
| `outputs/feasibility_report.md` | 실현 가능성 보고서 |
| `HANDOFF.md` | 이 문서 |

---

## 🔧 권장 기술 스택

```yaml
# 프로젝트 구조
framework: React 18+
language: TypeScript 5+
build: Vite 5+
rendering: Canvas API
state: useReducer + useRef
styling: CSS Modules 또는 Tailwind CSS
testing: Vitest + React Testing Library
```

---

## 📊 핵심 코드 패턴 요약

### 게임 루프 훅
```typescript
const useGameLoop = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  // ... requestAnimationFrame 기반 루프
};
```

### 스와이프 감지 훅
```typescript
const useSwipe = (handlers: { left, right, up, down }) => {
  // touchstart/touchend 기반 방향 감지
};
```

### 타입 정의
```typescript
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';
interface Position { x: number; y: number; }
interface GameState { snake, food, direction, score, status }
```

---

## 🔜 다음 스테이지 작업

### 03-planning에서 결정할 사항

1. **상세 아키텍처**
   - 컴포넌트 구조도
   - 데이터 흐름 다이어그램
   - 훅 의존성 관계

2. **파일 구조**
   - src/ 디렉토리 구조
   - 컴포넌트/훅/유틸/타입 분리

3. **게임 설정 상수**
   - 보드 크기, 셀 크기
   - 초기 속도, 속도 증가량
   - 레벨업 조건

4. **API 설계**
   - 게임 상태 인터페이스
   - 액션 타입 정의
   - 리듀서 로직

---

## ⚠️ 주의사항

1. **외부 게임 엔진 미사용**: Phaser, PixiJS 등 금지
2. **순수 React 구현**: jQuery 미사용
3. **리렌더링 최소화**: Canvas는 직접 업데이트
4. **성능 우선**: 60fps 목표

---

## 📊 AI 호출 기록

| AI | 시간 | 도구 | 결과 | 상태 |
|----|------|------|------|------|
| Claude | 12:10 | Exa MCP | Canvas 게임 루프 패턴 수집 | ✅ |
| Claude | 12:12 | Exa MCP | 모바일 터치 조작 패턴 수집 | ✅ |
| Claude | 12:15 | - | tech_research.md 작성 | ✅ |
| Claude | 12:16 | - | feasibility_report.md 작성 | ✅ |

---

## 🚀 다음 단계

```bash
# 다음 스테이지 실행
/run-stage 03-planning

# 또는
/planning
```

---

**생성자**: ClaudeCode
**검토자**: -
**승인**: 대기
