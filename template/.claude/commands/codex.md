# /codex

tmux 세션을 통해 OpenAI Codex CLI를 호출합니다.

## 사용법
```
/codex [prompt]
```

## 동작

1. **tmux 세션 확인/생성**
   - 세션명: `ax-codex`
   - 없으면 새로 생성

2. **Codex CLI 실행**
   - 프롬프트 전송
   - 응답 대기 (wait-for 방식)

3. **결과 캡처 및 반환**
   - 출력 파일에서 결과 읽기
   - 사용자에게 표시

## 실행 스크립트

```bash
scripts/codex-wrapper.sh "$ARGUMENTS"
```

## 예시

```
/codex 다음 함수를 리팩토링해주세요. 가독성과 성능을 개선하고,
타입 안전성을 높여주세요:

function processData(data) {
  // 긴 함수 코드
}

Codex 호출 중...
세션: ax-codex
타임아웃: 300초

[응답]
리팩토링된 코드:

\`\`\`typescript
interface DataItem {
  id: string;
  value: number;
}

function processData(data: DataItem[]): ProcessedResult {
  // 깔끔하게 리팩토링된 코드
}
\`\`\`

변경 사항:
1. TypeScript 타입 추가
2. 함수를 3개의 작은 함수로 분리
3. 불필요한 루프 제거로 O(n²) → O(n) 최적화
```

## 활용 시나리오

### 1. 코드 리팩토링 (07-refactoring)
```
/codex 다음 코드의 중복을 제거하고 DRY 원칙을 적용해주세요:
[코드]
```

### 2. 테스트 코드 생성 (09-testing)
```
/codex 다음 함수에 대한 Jest 테스트 코드를 작성해주세요.
엣지 케이스를 포함해주세요:
[함수 코드]
```

### 3. 성능 최적화
```
/codex 다음 코드의 성능 병목을 분석하고 최적화해주세요:
[코드]
```

### 4. 코드 분석
```
/codex 다음 코드의 복잡도를 분석하고 개선점을 제안해주세요:
[코드]
```

## 타임아웃

기본 타임아웃: 300초 (5분)

변경:
```
/codex --timeout 600 [긴 작업 프롬프트]
```

## 제한사항
- Codex CLI가 설치되어 있어야 함
- tmux가 설치되어 있어야 함
- 대화형 프롬프트는 지원하지 않음 (단발성 질의만)

## 관련
- `/gemini`: Gemini CLI 호출
- `scripts/codex-wrapper.sh`: 래퍼 스크립트
