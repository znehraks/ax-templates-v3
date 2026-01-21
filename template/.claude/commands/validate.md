# /validate - Output Validation Command

현재 스테이지의 산출물을 검증합니다.

## 사용법

```bash
/validate [options]
```

## 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--stage` | 검증할 스테이지 ID | 현재 스테이지 |
| `--verbose` | 상세 출력 | false |
| `--fix` | 자동 수정 제안 | false |
| `--skip-commands` | 명령어 검증 건너뛰기 | false |
| `--force` | 실패해도 통과 처리 | false |

## 검증 항목

### 1. 필수 파일 존재
```bash
/validate
# → ideas.md ✅, requirements_analysis.md ❌ (누락)
```

### 2. 파일 내용 검증
```bash
/validate --verbose
# → ideas.md: 8개 아이디어 (최소 5개) ✅
# → 필수 섹션: 기능 요구사항 ✅, 비기능 요구사항 ❌
```

### 3. 명령어 검증
```bash
/validate
# → npm run lint ✅
# → npm run typecheck ✅
# → npm run test ❌ (3개 실패)
```

### 4. 품질 점수
```bash
/validate
# → 종합 점수: 0.85/1.0
```

## 출력 형식

### 간단 출력
```
✅ 검증 통과: 06-implementation (점수: 0.95)
```

### 실패 시
```
❌ 검증 실패: 06-implementation

실패 항목:
1. 테스트 실패 (3개)
2. 커버리지 미달 (75% < 80%)

수정 필요:
- [ ] tests/auth.test.ts:45 수정
- [ ] 테스트 커버리지 5% 향상
```

### 상세 출력 (--verbose)
```markdown
# 산출물 검증 리포트

## 스테이지: 06-implementation
## 상태: ⚠️ 부분 통과
## 점수: 0.85

### 파일 검증
| 파일 | 상태 | 상세 |
|------|------|------|
| source_code/ | ✅ | 디렉토리 존재 |
| implementation_log.md | ✅ | 필수 형식 충족 |

### 명령어 검증
| 명령 | 결과 | 시간 |
|------|------|------|
| lint | ✅ | 2.3s |
| typecheck | ✅ | 4.1s |
| test | ❌ | 15.2s |

### 품질 메트릭
| 메트릭 | 현재 | 목표 | 상태 |
|--------|------|------|------|
| Lint | 0.95 | 0.90 | ✅ |
| Coverage | 0.75 | 0.80 | ❌ |
```

## 자동 수정 제안

```bash
/validate --fix
```

```markdown
## 자동 수정 제안

### 1. 누락된 섹션 추가
**파일**: requirements_analysis.md
**제안**: "비기능 요구사항" 섹션 추가

### 2. 테스트 수정
**파일**: tests/auth.test.ts:45
**원인**: 반환 타입 불일치
**수정안**:
```typescript
expect(result).toHaveProperty('token');
// 변경 →
expect(result.data).toHaveProperty('token');
```

자동 수정을 적용하시겠습니까? (y/n)
```

## 강제 통과

```bash
/validate --force
```

```
⚠️ 검증 실패 항목이 있습니다.
강제로 통과 처리하시겠습니까?

이유를 입력하세요:
> 테스트 환경 문제로 일시적 실패, 로컬에서 통과 확인됨

✅ 강제 통과 처리됨 (이유 기록됨)
```

## 예시

```bash
# 현재 스테이지 검증
/validate

# 특정 스테이지 상세 검증
/validate --stage 06 --verbose

# 자동 수정 제안 포함
/validate --fix

# 빠른 검증 (명령어 건너뛰기)
/validate --skip-commands
```

## 검증 결과 저장

- 결과: `state/validations/{stage}_{timestamp}.json`
- 리포트: `state/validations/{stage}_{timestamp}.md`

## 설정

`config/output_validation.yaml` 참조

## 스테이지 전환 시 자동 실행

`/next` 명령어 실행 시 자동으로 검증이 수행됩니다.
검증 실패 시 스테이지 전환이 차단됩니다.

## 관련 커맨드

- `/next` - 다음 스테이지 전환
- `/status` - 파이프라인 상태
- `/stages` - 스테이지 목록
