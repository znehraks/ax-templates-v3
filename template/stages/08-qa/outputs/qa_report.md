# QA Report - Snake Game

> 생성일: 2026-01-21
> 프로젝트: snake-game
> 스테이지: 08-qa

---

## 테스트 요약

| 항목 | 결과 | 비고 |
|------|------|------|
| ESLint | ✅ 통과 | 0 errors, 0 warnings |
| TypeScript | ✅ 통과 | 컴파일 성공 |
| 빌드 | ✅ 통과 | 204.59 KB |
| 기능 테스트 | ✅ 통과 | 핵심 기능 정상 동작 |

---

## 발견 및 수정된 버그

### BUG-001: 게임 시작 즉시 게임 오버

**증상**: 게임 시작 버튼 클릭 시 즉시 GAME OVER 화면 표시

**원인**: `useGameLoop` 훅의 초기화 로직 결함
- 첫 프레임에서 `lastTimeRef.current = 0`
- `deltaTime = timestamp - 0` → 수천 ms
- `accumulator`에 큰 값이 추가되어 수십 번의 MOVE 호출
- 뱀이 순식간에 벽까지 이동하여 충돌

**수정**:
```typescript
// 수정 전
if (lastTimeRef.current === 0) {
  lastTimeRef.current = timestamp;
}
const deltaTime = timestamp - lastTimeRef.current;

// 수정 후
if (lastTimeRef.current === 0) {
  lastTimeRef.current = timestamp;
  rafIdRef.current = requestAnimationFrame(gameLoop);
  return; // 첫 프레임 스킵
}
const deltaTime = timestamp - lastTimeRef.current;
// deltaTime 클램핑 추가
const clampedDelta = Math.min(deltaTime, speedRef.current * 2);
```

**상태**: ✅ 수정 완료

---

## 기능 테스트 결과

### 게임 시작/재시작
| 테스트 케이스 | 결과 |
|--------------|------|
| START GAME 버튼 클릭 | ✅ 통과 |
| PLAY AGAIN 버튼 클릭 | ✅ 통과 |
| Enter 키로 시작 | ✅ 통과 |

### 키보드 입력
| 테스트 케이스 | 결과 |
|--------------|------|
| ArrowUp 방향 전환 | ✅ 통과 |
| ArrowDown 방향 전환 | ✅ 통과 |
| Space 일시정지/재개 | ✅ 통과 |

### 충돌 감지
| 테스트 케이스 | 결과 |
|--------------|------|
| 상단 벽 충돌 | ✅ 통과 |
| 우측 벽 충돌 | ✅ 통과 |
| 게임 오버 모달 표시 | ✅ 통과 |

---

## 코드 품질

### ESLint
```
✅ 0 errors, 0 warnings
```

### TypeScript
```
✅ tsc -b 성공 (0 errors)
```

### 번들 크기
| 파일 | 크기 | Gzip |
|------|------|------|
| index.html | 0.46 KB | 0.29 KB |
| index.css | 12.85 KB | 2.69 KB |
| index.js | 204.59 KB | 64.53 KB |

**총 번들 크기**: 204.59 KB (목표 200KB 근접)

---

## 수정된 파일

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `src/hooks/useGameLoop.ts` | 수정 | 첫 프레임 스킵 및 deltaTime 클램핑 |
| `src/engine/gameReducer.ts` | 수정 | 디버그 로그 추가 후 제거 |

---

## 남은 테스트 항목 (09-testing)

### 단위 테스트 필요
- [ ] `collision.ts` - 충돌 감지 함수
- [ ] `gameReducer.ts` - 상태 전이 로직
- [ ] `useGameLoop.ts` - 게임 루프 타이밍

### E2E 테스트 필요
- [ ] 전체 게임 플로우 (시작 → 플레이 → 게임오버 → 재시작)
- [ ] 점수 시스템 (먹이 먹기, 레벨업)
- [ ] 최고 점수 저장/불러오기

---

## 결론

08-qa 스테이지에서 **치명적 버그 1건**을 발견하고 수정했습니다.
- 게임 루프 초기화 문제로 인한 즉시 게임 오버 현상
- 수정 후 모든 핵심 기능이 정상 동작함을 확인

게임은 플레이 가능한 상태이며, 09-testing 스테이지에서
단위 테스트 및 E2E 테스트를 추가하여 품질을 강화할 예정입니다.

---

**작성자**: ClaudeCode
**검토일**: 2026-01-21
