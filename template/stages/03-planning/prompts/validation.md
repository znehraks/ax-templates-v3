# 산출물 검증 프롬프트 - Planning

## 검증 대상

| 산출물 | 필수 조건 | 검증 방법 |
|--------|----------|----------|
| `architecture.md` | 다이어그램 4종 | 구조 확인 |
| `tech_stack.md` | 버전/의존성 명시 | 항목 확인 |
| `project_plan.md` | 마일스톤 3개+ | 수량 확인 |
| `implementation.yaml` | 구현 규칙 정의 | 스키마 검증 |
| `HANDOFF.md` | 다음 단계 지침 | 항목 확인 |

## 검증 명령

```bash
/validate --stage 03-planning
```

## 품질 기준

### architecture.md
- [ ] 시스템 컨텍스트 다이어그램
- [ ] 컨테이너 다이어그램
- [ ] 컴포넌트 다이어그램
- [ ] 시퀀스 다이어그램 (핵심 플로우)
- [ ] 데이터 흐름 설명

### tech_stack.md
- [ ] 프론트엔드 스택 명시
- [ ] 백엔드 스택 명시
- [ ] 데이터베이스 선택
- [ ] 버전 및 의존성 정의
- [ ] 선택 근거 문서화

### project_plan.md
- [ ] 마일스톤 3개 이상
- [ ] 각 마일스톤별 산출물
- [ ] 스프린트 계획
- [ ] 리소스 할당

### implementation.yaml
- [ ] 컴포넌트 타입 정의
- [ ] 스타일링 방식 정의
- [ ] 상태 관리 패턴 정의
- [ ] 네이밍 규칙 정의
- [ ] 폴더 구조 정의

## 자동 검증 스크립트

```bash
# 다이어그램 수 확인 (mermaid 블록)
grep -c "```mermaid" outputs/architecture.md

# implementation.yaml 유효성
yq eval '.' outputs/implementation.yaml

# 마일스톤 수 확인
grep -c "^## Milestone" outputs/project_plan.md
```
