# HANDOFF: 01-brainstorm → 02-research

> 생성일: 2026-01-21
> 프로젝트: snake-game
> 현재 스테이지: 01-brainstorm (완료)
> 다음 스테이지: 02-research

---

## ✅ 완료된 작업

- [x] 프로젝트 브리프 작성 (`inputs/project_brief.md`)
- [x] 핵심 기능 아이디어 12개 브레인스토밍
- [x] 사용자 페르소나 3개 정의
- [x] 유사 프로젝트 사례 조사
- [x] 장단점 분석 완료
- [x] MVP 범위 제안

---

## 📋 핵심 결정사항

### 1. 기술 스택 방향
- **렌더링**: Canvas (성능 우선, 모바일 지원)
- **상태관리**: useReducer + Custom Hook
- **게임 루프**: requestAnimationFrame

### 2. MVP 기능 범위
| 우선순위 | 기능 |
|---------|------|
| 🔴 필수 | 기본 조작, 먹이 시스템, 충돌 감지, 점수, 재시작 |
| 🟡 중요 | 레벨 시스템, 하이스코어 저장, 일시정지, 모바일 터치 |
| 🟢 선택 | Combo System, Portal Edges, Different Food |

### 3. 타겟 사용자 (우선순위)
1. **Persona A**: 캐주얼 게이머 (모바일, 5-10분 플레이)
2. **Persona B**: 경쟁적 게이머 (데스크톱, 하이스코어 추구)
3. **Persona C**: 레트로 팬 (클래식 스타일 선호)

---

## 📁 생성된 산출물

| 파일 | 설명 |
|------|------|
| `inputs/project_brief.md` | 프로젝트 개요 및 요구사항 |
| `outputs/ideas.md` | 브레인스토밍 아이디어 (12개) |
| `outputs/requirements_analysis.md` | 요구사항 분석 |
| `HANDOFF.md` | 이 문서 |

---

## 🔜 다음 스테이지 즉시 실행 작업

### 02-research에서 조사할 항목

1. **Canvas 게임 루프 구현 방법**
   - requestAnimationFrame vs setInterval
   - 최적화 기법 (더블 버퍼링)

2. **React + Canvas 통합 패턴**
   - useRef로 Canvas 접근
   - Canvas 리렌더링 최소화

3. **모바일 터치 이벤트 처리**
   - touchstart/touchmove/touchend
   - 스와이프 방향 감지 로직

4. **localStorage 하이스코어 저장**
   - 데이터 구조 설계
   - 보안 고려사항

5. **충돌 감지 알고리즘**
   - O(n) 자기 몸 충돌
   - 최적화 방안

---

## ⚠️ 주의사항

1. **외부 게임 엔진 미사용**: Phaser, PixiJS 등 금지
2. **순수 React 구현**: jQuery 미사용
3. **정적 배포 가능**: 백엔드 서버 없음

---

## 📊 AI 호출 기록

| AI | 시간 | 프롬프트 | 결과 | 상태 |
|----|------|---------|------|------|
| Gemini | 11:58 | Snake Game 브레인스토밍 | 12개 아이디어, 3 페르소나 | ✅ |
| ClaudeCode | 11:57 | 결과 구조화 | ideas.md, HANDOFF.md | ✅ |

---

## 🚀 다음 단계

```bash
# 다음 스테이지 실행
/run-stage 02-research

# 또는
/research
```

---

**생성자**: ClaudeCode
**검토자**: -
**승인**: 대기
