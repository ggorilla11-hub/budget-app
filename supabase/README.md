# Supabase 데이터베이스 설정

버짓(Budget) 애플리케이션의 데이터베이스 관련 파일들입니다.

## 📁 파일 구조

```
supabase/
├── schema.sql          # 데이터베이스 스키마 (테이블, RLS, 함수)
├── SETUP_GUIDE.md      # 상세 설정 가이드
└── README.md           # 이 파일
```

## 🚀 빠른 시작

### 1. Supabase 프로젝트 생성
https://app.supabase.com 에서 새 프로젝트를 생성하세요.

### 2. 스키마 실행
1. Supabase Dashboard → SQL Editor
2. `schema.sql` 파일 내용을 복사하여 붙여넣기
3. Run 버튼 클릭

### 3. 환경변수 설정
`.env.local` 파일에 다음을 추가:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 📊 데이터베이스 구조

### 테이블

| 테이블 | 설명 | 주요 기능 |
|--------|------|----------|
| **users** | 사용자 정보 | 프로필, 월수입, 프리미엄 여부 |
| **budgets** | 예산 관리 | 카테고리별 월 예산 및 지출액 |
| **expenses** | 지출 내역 | 지출 기록, 감정 태그, 메모 |
| **user_points** | 게임화 | 포인트, 레벨, 배지, 연속일 |
| **ai_feedback** | AI 피드백 | GPT-4 조언 및 경고 메시지 |

### 주요 기능

#### 1. RLS (Row Level Security)
- 모든 테이블에 RLS 적용
- 사용자는 본인 데이터만 접근 가능
- `auth.uid()`를 통한 사용자 인증

#### 2. 자동 업데이트 트리거
- 지출 등록 시 예산의 `spent_amount` 자동 계산
- 실시간 예산 진행률 추적

#### 3. 인덱스 최적화
- 자주 조회되는 컬럼에 인덱스 설정
- 성능 최적화

## 🔧 헬퍼 함수 사용법

`src/lib/supabase-helpers.ts`에 정의된 함수들:

```typescript
// 지출 추가
await createExpense(userId, {
  amount: 15000,
  category: '식비',
  emotion: '만족',
  note: '점심 회식',
})

// 예산 조회
const budgets = await getBudgets(userId, '2024-11')

// 포인트 적립
await addPoints(userId, 10)
```

## 📚 카테고리 및 태그

### 지출 카테고리
식비, 교통비, 주거비, 문화생활, 쇼핑, 의료비, 교육비, 기타

### 감정 태그
기쁨, 만족, 후회, 필요, 충동, 스트레스, 중립

### AI 피드백 타입
- `advice`: 조언
- `warning`: 경고
- `praise`: 칭찬
- `tip`: 팁

## 🔄 타입 자동 생성

Supabase CLI로 타입 자동 생성:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

## 📖 상세 가이드

더 자세한 내용은 [`SETUP_GUIDE.md`](./SETUP_GUIDE.md)를 참고하세요.

## 🔗 참고 링크

- [Supabase 문서](https://supabase.com/docs)
- [PostgreSQL 함수](https://www.postgresql.org/docs/current/functions.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
