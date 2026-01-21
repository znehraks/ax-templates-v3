# Output Validator Skill

스테이지별 산출물 검증 스킬

## 개요

각 스테이지의 산출물이 요구사항을 충족하는지 자동으로 검증합니다:
- 필수 파일 존재 확인
- 파일 내용 검증
- 검증 명령어 실행 (lint, test 등)
- 품질 점수 계산

## 트리거

- 스테이지 완료 시 자동 실행
- `/validate` 명령어
- `/next` 명령어 전 자동 체크

## 기능

### 1. 파일 존재 확인
```yaml
required_outputs:
  ideas.md:
    exists: true
    min_size_bytes: 500
```

### 2. 내용 검증
```yaml
content_checks:
  min_ideas: 5
  has_sections: ["기능", "비기능"]
```

### 3. 명령어 검증
```yaml
validation_commands:
  - name: "lint"
    command: "npm run lint"
    required: true
```

### 4. 품질 점수
```yaml
quality_metrics:
  lint_score: 0.9
  test_coverage: 0.8
```

## 파일 구조

```
output-validator/
├── README.md          # 이 파일
├── validate.md        # 검증 프로세스 가이드
└── prompts/
    └── CLAUDE.md      # AI 지침
```

## 설정

`config/output_validation.yaml` 참조

## 사용 예시

```bash
# 현재 스테이지 검증
/validate

# 특정 스테이지 검증
/validate --stage 06

# 상세 리포트
/validate --verbose

# 자동 수정 제안
/validate --fix
```

## 출력

- 검증 결과 리포트
- 품질 점수
- 수정 제안 (실패 시)
- `state/validations/` 저장
