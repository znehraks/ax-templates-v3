# 🎯 Snake Game - 마일스톤 정의

> 생성일: 2026-01-21
> 스테이지: 05-task-management
> 프로젝트: snake-game

---

## 마일스톤 개요

| ID | 마일스톤 | 목표 | 완료 스테이지 |
|----|---------|------|-------------|
| M1 | MVP 기반 | 게임 코어 로직 완성 | 06-implementation (전반) |
| M2 | MVP 완성 | 플레이 가능한 게임 | 06-implementation (완료) |
| M3 | 품질 개선 | 모바일 지원 + 버그 수정 | 08-qa |
| M4 | 배포 | 프로덕션 배포 | 10-deployment |

---

## M1: MVP 기반 (Foundation)

### 목표
게임의 핵심 로직과 인프라를 구축합니다.

### 포함 태스크
- TASK-001 ~ TASK-009, TASK-016

### 산출물

| 산출물 | 위치 | 설명 |
|--------|------|------|
| 프로젝트 구조 | `snake-game/` | Vite + React + TS |
| 타입 정의 | `src/types/index.ts` | 모든 게임 타입 |
| 상수 | `src/constants/config.ts` | 게임 설정값 |
| 게임 루프 훅 | `src/hooks/useGameLoop.ts` | rAF 기반 |
| 키보드 훅 | `src/hooks/useKeyboard.ts` | 방향키 처리 |
| 충돌 감지 | `src/engine/collision.ts` | 벽/몸통/먹이 |
| 렌더러 | `src/engine/renderer.ts` | Canvas 렌더링 |
| 리듀서 | `src/engine/gameReducer.ts` | 상태 관리 |
| 유틸리티 | `src/utils/random.ts` | 랜덤 위치 |

### 성공 기준

```
[ ] TypeScript 컴파일 성공 (tsc --noEmit)
[ ] ESLint 경고 0개
[ ] 콘솔에서 게임 루프 틱 확인
[ ] 빈 Canvas에 그리드 렌더링
[ ] 키보드 입력 감지 (콘솔 로그)
```

### 검증 방법

```bash
# 타입 체크
npm run typecheck

# 린트
npm run lint

# 개발 서버 실행 후 콘솔 확인
npm run dev
```

---

## M2: MVP 완성 (Playable)

### 목표
사용자가 실제로 플레이할 수 있는 게임을 완성합니다.

### 포함 태스크
- TASK-010 ~ TASK-014, TASK-018 ~ TASK-021

### 산출물

| 산출물 | 위치 | 설명 |
|--------|------|------|
| GameEngine | `src/GameEngine.tsx` | 게임 통합 컴포넌트 |
| CanvasLayer | `src/components/CanvasLayer.tsx` | Canvas 래퍼 |
| ScoreBoard | `src/components/ScoreBoard.tsx` | 점수판 |
| GameOverModal | `src/components/GameOverModal.tsx` | 게임 오버 |
| useHighScore | `src/hooks/useHighScore.ts` | 최고 점수 |
| 스타일 | `src/styles/` | CSS Modules |

### 성공 기준

```
[ ] 방향키로 뱀 조작 가능
[ ] 먹이 먹으면 뱀 성장 + 점수 증가
[ ] 벽/몸통 충돌 시 게임 오버
[ ] 게임 오버 모달에서 재시작 가능
[ ] 최고 점수 localStorage 저장/불러오기
[ ] 레벨업 시 속도 증가
[ ] 일시정지/재개 동작
```

### 검증 방법

```bash
# 개발 서버에서 직접 플레이
npm run dev

# 체크리스트
# 1. 방향키로 이동
# 2. 먹이 먹기
# 3. 벽에 부딪히기
# 4. 재시작
# 5. 최고 점수 확인
```

---

## M3: 품질 개선 (Quality)

### 목표
모바일 지원, 코드 품질, 버그 수정을 완료합니다.

### 포함 태스크
- TASK-015, TASK-017, TASK-013
- 07-refactoring, 08-qa 태스크

### 산출물

| 산출물 | 위치 | 설명 |
|--------|------|------|
| useSwipe | `src/hooks/useSwipe.ts` | 터치 스와이프 |
| MobileControls | `src/components/MobileControls.tsx` | D-Pad |
| StartScreen | `src/components/StartScreen.tsx` | 시작 화면 |
| 리팩토링 결과 | - | 코드 개선 |
| 버그 수정 | - | 이슈 해결 |

### 성공 기준

```
[ ] 모바일에서 스와이프로 조작 가능
[ ] 모바일에서 D-Pad로 조작 가능
[ ] 시작 화면 표시
[ ] 코드 중복 제거
[ ] 60fps 유지 (Chrome DevTools)
[ ] 알려진 버그 0개
[ ] 반응형 레이아웃 동작
```

### 검증 방법

```bash
# 모바일 에뮬레이션
# Chrome DevTools > Device Toolbar

# 성능 확인
# Chrome DevTools > Performance Tab

# 버그 체크리스트
# - 빠른 방향 전환
# - 경계 조건 (벽 바로 앞에서 방향 전환)
# - 긴 플레이 시 메모리 누수
```

---

## M4: 배포 (Deployment)

### 목표
프로덕션 환경에 배포하고 테스트를 완료합니다.

### 포함 태스크
- TASK-022 ~ TASK-025

### 산출물

| 산출물 | 위치 | 설명 |
|--------|------|------|
| 단위 테스트 | `src/__tests__/` | Vitest |
| E2E 테스트 | `e2e/` | Playwright |
| 빌드 | `dist/` | 프로덕션 빌드 |
| 배포 URL | - | 공개 URL |

### 성공 기준

```
[ ] 단위 테스트 커버리지 80%+
[ ] E2E 테스트 통과 (선택)
[ ] 빌드 성공
[ ] 번들 크기 < 200KB
[ ] 배포 URL 접근 가능
[ ] 프로덕션에서 게임 플레이 가능
[ ] 모바일 브라우저에서 동작
```

### 검증 방법

```bash
# 테스트
npm run test
npm run test:coverage

# 빌드
npm run build

# 빌드 크기 확인
ls -la dist/

# 프리뷰
npm run preview

# 배포 후 URL 테스트
```

---

## 마일스톤 타임라인

```
M1: MVP 기반          M2: MVP 완성
[======|======]      [======|======]
    Sprint 1             Sprint 2

M3: 품질 개선         M4: 배포
[======|======]      [======|====]
    Sprint 3             Sprint 4

────────────────────────────────────────
      06-impl       07-ref   09-test
                    08-qa    10-deploy
```

---

## 체크포인트 정책

| 마일스톤 | 체크포인트 | 설명 |
|---------|-----------|------|
| M1 완료 | checkpoint_m1 | 코어 로직 완성 시점 |
| M2 완료 | checkpoint_m2 | MVP 완성 시점 (중요) |
| M3 완료 | checkpoint_m3 | 품질 개선 완료 |
| M4 완료 | checkpoint_final | 최종 배포 |

```bash
# 체크포인트 생성 예시
/checkpoint --name "m2_mvp_complete" --description "MVP 게임 완성"
```

---

## ✅ 마일스톤 체크리스트

- [x] 4개 마일스톤 정의
- [x] 각 마일스톤 산출물 명시
- [x] 성공 기준 정의
- [x] 검증 방법 제공
- [x] 타임라인 작성
- [x] 체크포인트 정책 수립
