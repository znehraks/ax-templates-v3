# /checkpoint

현재 상태의 체크포인트를 생성합니다.

## 사용법
```
/checkpoint [description]
```

## 동작

1. **현재 상태 캡처**
   - 현재 스테이지 정보
   - 모든 outputs 파일
   - state/progress.json
   - 소스 코드 (해당 시)

2. **체크포인트 생성**
   - ID: `CP-[stage]-[timestamp]`
   - 위치: `state/checkpoints/[CP-ID]/`

3. **메타데이터 저장**
   ```json
   {
     "id": "CP-06-20240120-1430",
     "stage": "06-implementation",
     "description": "스프린트 1 완료",
     "created_at": "2024-01-20T14:30:00Z",
     "files": [...],
     "progress_snapshot": {...}
   }
   ```

4. **state/progress.json 업데이트**
   - checkpoints 배열에 추가

## 실행 스크립트

```bash
scripts/create-checkpoint.sh "$ARGUMENTS"
```

## 예시

```
/checkpoint 스프린트 1 완료

체크포인트 생성 중...
✓ 현재 상태 캡처 완료
✓ 파일 복사 완료 (42개 파일)
✓ 메타데이터 저장 완료

체크포인트 생성 완료!
- ID: CP-06-20240120-1430
- 위치: state/checkpoints/CP-06-20240120-1430/
- 설명: 스프린트 1 완료

복구 명령어:
scripts/restore-checkpoint.sh CP-06-20240120-1430
```

## 체크포인트 목록 보기

```
/checkpoint --list

체크포인트 목록:
| ID | 스테이지 | 설명 | 생성일 |
|----|----------|------|--------|
| CP-06-20240120-1030 | 06-impl | 프로젝트 초기화 | 2024-01-20 10:30 |
| CP-06-20240120-1430 | 06-impl | 스프린트 1 완료 | 2024-01-20 14:30 |
```

## 체크포인트 복구

```bash
scripts/restore-checkpoint.sh CP-06-20240120-1030

경고: 현재 상태가 체크포인트 CP-06-20240120-1030 시점으로 복구됩니다.
현재 변경사항이 손실될 수 있습니다.
계속하시겠습니까? [y/N] y

✓ 체크포인트 복구 완료
✓ 현재 스테이지: 06-implementation
```

## 필수 체크포인트 스테이지
- `06-implementation`: 구현 중 주요 마일스톤마다
- `07-refactoring`: 리팩토링 전/후

## 옵션
- `--list`: 체크포인트 목록 표시
- `--delete [CP-ID]`: 체크포인트 삭제
