# Stage Transition Skill

스테이지 완료 감지 및 전환을 자동화하는 스킬입니다.

## 트리거 조건

이 스킬은 다음 조건에서 자동 활성화됩니다:

1. **완료 표현 감지**
   - "끝났어", "완료", "done", "finished" 등
   - 스테이지 관련 작업 종료 시

2. **완료 조건 충족**
   - outputs 파일 모두 생성됨
   - config.yaml의 completion_criteria 충족

3. **명시적 호출**
   - `/handoff` 명령 후
   - `/next` 명령 전

## 기능

### 1. 완료 조건 검증 (validate.md)
- 현재 스테이지의 필수 outputs 확인
- 체크포인트 필수 여부 확인
- 완료 체크리스트 자동 검증

### 2. HANDOFF.md 생성 (handoff-gen.md)
- 완료된 작업 요약
- 핵심 결정사항 추출
- 다음 단계 안내 생성

### 3. 전환 안내 (prompts/transition.md)
- 다음 스테이지 정보 제공
- 입력 파일 위치 안내
- 단축 명령어 제안

## 스킬 파일 구조

```
stage-transition/
├── README.md           # 이 파일
├── validate.md         # 완료 조건 검증 로직
├── handoff-gen.md      # 핸드오프 자동 생성
└── prompts/
    └── transition.md   # 전환 프롬프트
```

## 사용 예시

### 자동 트리거

```
사용자: "브레인스토밍 끝났어"

[stage-transition 스킬 활성화]
→ 01-brainstorm 완료 조건 검증
→ HANDOFF.md 생성 제안
→ 다음 단계 안내
```

### 검증 결과 예시

```
✅ 스테이지 완료 조건 확인

현재: 04-ui-ux

[필수 outputs]
✓ wireframes/ 존재
✓ component-spec.md 생성됨
✓ design-system.md 생성됨

[HANDOFF.md]
⚠️ 아직 생성되지 않음

제안: /handoff 실행 후 /next로 전환하세요.
```

## 관련 명령어

- `/handoff` - HANDOFF.md 생성
- `/next` - 다음 스테이지 전환
- `/status` - 현재 상태 확인
