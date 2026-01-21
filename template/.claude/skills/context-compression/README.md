# Context Compression Skill

토큰 사용량을 모니터링하고 컨텍스트를 압축하는 스킬입니다.

## 트리거 조건

이 스킬은 다음 조건에서 자동 활성화됩니다:

1. **토큰 임계값 도달**
   - 50,000 토큰 (warning_threshold): 경고
   - 80,000 토큰 (limit_threshold): 압축 필수

2. **스테이지 전환 시**
   - 이전 스테이지 컨텍스트 정리
   - 필수 정보만 유지

3. **명시적 호출**
   - `/context --compress` 명령

## 기능

### 1. 컨텍스트 분석 (analyze.md)
- 현재 토큰 사용량 추정
- 카테고리별 분류
- 압축 가능 영역 식별

### 2. 압축 실행 (compress.md)
- 중요도 기반 필터링
- 요약 생성
- state.md 저장

### 3. 복구 지원 (prompts/compression.md)
- 저장된 컨텍스트 로드
- 작업 상태 복원

## 스킬 파일 구조

```
context-compression/
├── README.md           # 이 파일
├── analyze.md          # 컨텍스트 분석 로직
├── compress.md         # 압축 로직
└── prompts/
    └── compression.md  # 압축 프롬프트
```

## 압축 전략

### 유지 (Keep)
- ✅ 결정사항 및 이유
- ✅ 요구사항 명세
- ✅ 아키텍처 선택
- ✅ 현재 작업 상태
- ✅ 에러 해결책 (최종)

### 요약 (Summarize)
- 📝 긴 토론 과정
- 📝 탐색/조사 과정
- 📝 여러 대안 비교

### 제거 (Remove)
- ❌ 오류 시행착오 과정
- ❌ 중복된 시도
- ❌ 임시 출력/로그
- ❌ 이미 적용된 코드 diff

## 사용 예시

### 자동 경고

```
⚠️ 토큰 사용량 경고

현재: ~52,000 토큰 (50,000 초과)

권장 조치:
1. /context --compress 실행
2. 또는 /clear 후 state.md 복구

계속 진행하면 80,000에서 자동 저장됩니다.
```

### 수동 압축

```
/context --compress

컨텍스트 압축 중...

[분석]
- 총 토큰: ~65,000
- 결정사항: ~5,000 (유지)
- 토론 내용: ~40,000 (요약 → 8,000)
- 오류 로그: ~20,000 (제거)

[결과]
- 압축 후: ~13,000 토큰
- 절감: 80%

state/context/state.md에 저장됨
```

## 관련 명령어

- `/context` - 컨텍스트 상태 확인
- `/context --compress` - 압축 실행
- `/context --save` - 스냅샷 저장

## 설정

settings.json에서 임계값 조정:

```json
{
  "context": {
    "warning_threshold": 50000,
    "limit_threshold": 80000,
    "auto_save": true
  }
}
```
