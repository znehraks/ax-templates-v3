# HANDOFF.md 자동 생성

스테이지 완료 시 HANDOFF.md를 자동 생성합니다.

## 생성 로직

### 1. 컨텍스트 수집

```
수집 항목:
- 현재 스테이지 정보
- 생성된 outputs 목록
- 대화에서 추출한 결정사항
- 다음 스테이지 요구사항
```

### 2. HANDOFF.md 구조

```markdown
# Handoff: [현재 스테이지] → [다음 스테이지]

생성일: {{TIMESTAMP}}

## 완료된 작업

- [x] 작업 1
- [x] 작업 2
- [x] 작업 3

## 핵심 결정사항

### 결정 1: [제목]
- **선택**: [선택한 옵션]
- **이유**: [선택 이유]
- **영향**: [다음 단계에 미치는 영향]

## 산출물

| 파일 | 설명 |
|------|------|
| file1.md | 설명 |
| file2.json | 설명 |

## 시도했으나 실패한 접근법

(해당 시)
- 접근법 1: [실패 이유]

## 다음 단계

### 즉시 실행 작업
1. [작업 1]
2. [작업 2]

### 참고 파일
- stages/[current]/outputs/[file]

## 체크포인트

(해당 시)
- ID: CP-XX-YYYYMMDD-HHMM
- 설명: [설명]
```

### 3. 결정사항 추출

대화에서 결정사항을 추출하는 패턴:

```
키워드:
- "결정", "선택", "~로 하자", "~가 좋겠다"
- "A 대신 B", "A보다 B"
- "최종적으로", "확정"

구조화:
- 결정 제목
- 선택한 옵션
- 선택 이유
- 대안 (있는 경우)
```

### 4. 산출물 자동 탐지

```bash
# outputs 디렉토리 스캔
find stages/$CURRENT_STAGE/outputs -type f \
    -name "*.md" -o -name "*.json" -o -name "*.yaml" |
while read file; do
    echo "| $(basename $file) | $(head -1 $file | sed 's/^#\s*//') |"
done
```

## 생성 예시

### 입력 (대화 컨텍스트)

```
사용자: React와 Vue 중에 React를 선택했어
AI: React 기반으로 컴포넌트 명세를 작성했습니다.
사용자: Tailwind CSS도 추가하자
AI: design-system.md에 Tailwind 설정을 추가했습니다.
```

### 출력 (HANDOFF.md)

```markdown
# Handoff: 04-ui-ux → 05-task-management

생성일: 2024-01-20 15:30

## 완료된 작업

- [x] 와이어프레임 설계
- [x] 컴포넌트 명세 작성
- [x] 디자인 시스템 정의

## 핵심 결정사항

### 결정 1: 프론트엔드 프레임워크
- **선택**: React
- **이유**: 팀 경험, 생태계 성숙도
- **영향**: 컴포넌트 기반 아키텍처 적용

### 결정 2: CSS 프레임워크
- **선택**: Tailwind CSS
- **이유**: 빠른 프로토타이핑, 일관된 디자인
- **영향**: utility-first 스타일링

## 산출물

| 파일 | 설명 |
|------|------|
| wireframes/home.md | 홈 화면 와이어프레임 |
| component-spec.md | React 컴포넌트 명세 |
| design-system.md | Tailwind 기반 디자인 시스템 |

## 다음 단계

### 즉시 실행 작업
1. tasks.json에 컴포넌트별 태스크 생성
2. 스프린트 계획 수립

### 참고 파일
- stages/04-ui-ux/outputs/component-spec.md
- stages/04-ui-ux/outputs/design-system.md
```

## 사용자 확인

생성 후 사용자에게 확인 요청:

```
HANDOFF.md가 생성되었습니다.

[미리보기]
...

수정이 필요하면 말씀해 주세요.
확인되면 /next로 다음 스테이지로 전환합니다.
```
