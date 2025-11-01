# ✅ Supabase 데이터베이스 설정 완료

버짓(Budget) 프로젝트의 Supabase 데이터베이스 스키마 설정이 완료되었습니다!

---

## 📊 생성된 데이터베이스 구조

### 1️⃣ **USERS 테이블** 👤
사용자 프로필 정보를 저장합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 사용자 고유 ID (Primary Key) |
| email | VARCHAR(255) | 이메일 (Unique) |
| name | VARCHAR(100) | 이름 |
| age | INT | 나이 |
| family_members | INT | 가족 구성원 수 (기본값: 1) |
| monthly_income | DECIMAL(12,2) | 월 수입 |
| is_premium | BOOLEAN | 프리미엄 회원 여부 |
| created_at | TIMESTAMP | 생성일시 |

---

### 2️⃣ **BUDGETS 테이블** 💰
카테고리별 월 예산을 관리합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 예산 고유 ID |
| user_id | UUID | 사용자 ID (FK) |
| month | DATE | 예산 월 |
| category | VARCHAR(50) | 카테고리 |
| allocated_amount | DECIMAL(12,2) | 배정 금액 |
| spent_amount | DECIMAL(12,2) | 지출 금액 (자동 업데이트) |
| created_at | TIMESTAMP | 생성일시 |

**UNIQUE 제약**: (user_id, month, category)

---

### 3️⃣ **EXPENSES 테이블** 📝
지출 내역을 기록합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 지출 고유 ID |
| user_id | UUID | 사용자 ID (FK) |
| amount | DECIMAL(12,2) | 지출 금액 |
| category | VARCHAR(50) | 카테고리 |
| emotion | VARCHAR(20) | 감정 태그 |
| note | TEXT | 메모 |
| transaction_date | TIMESTAMP | 거래 일시 |
| created_at | TIMESTAMP | 생성일시 |

**카테고리**: 식비, 교통비, 주거비, 문화생활, 쇼핑, 의료비, 교육비, 기타
**감정 태그**: 기쁨, 만족, 후회, 필요, 충동, 스트레스, 중립

---

### 4️⃣ **USER_POINTS 테이블** 🏆
게임화 요소 (포인트, 레벨, 배지)를 관리합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| user_id | UUID | 사용자 ID (Primary Key, FK) |
| total_points | INT | 총 포인트 |
| level | INT | 레벨 (1000포인트당 1레벨) |
| badges | JSONB | 획득한 배지 목록 |
| streak_days | INT | 연속 체크인 일수 |
| last_check_in | DATE | 마지막 체크인 날짜 |
| updated_at | TIMESTAMP | 업데이트 일시 |

**포인트 적립**:
- 지출 등록: 10포인트
- 연속 체크인: 일수 × 10포인트

---

### 5️⃣ **AI_FEEDBACK 테이블** 🤖
GPT-4 AI 피드백을 저장합니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 피드백 고유 ID |
| user_id | UUID | 사용자 ID (FK) |
| message | TEXT | 피드백 메시지 |
| type | VARCHAR(20) | 피드백 유형 |
| created_at | TIMESTAMP | 생성일시 |

**피드백 유형**:
- `advice`: 조언
- `warning`: 경고
- `praise`: 칭찬
- `tip`: 팁

---

## 🔒 RLS (Row Level Security) 정책

모든 테이블에 RLS가 활성화되어 있습니다:

### ✅ 적용된 정책
- **SELECT**: 본인 데이터만 조회 가능 (`auth.uid() = user_id`)
- **INSERT**: 본인 데이터만 생성 가능
- **UPDATE**: 본인 데이터만 수정 가능
- **DELETE**: 본인 데이터만 삭제 가능 (budgets, expenses)

### 🔐 보안 기능
- 다른 사용자의 데이터 접근 차단
- SQL Injection 방어
- 자동 사용자 인증 검증

---

## ⚙️ 자동화 기능

### 1️⃣ 예산 자동 업데이트
**트리거**: `trigger_update_budget_spent`
**함수**: `update_budget_spent()`

지출이 등록/수정/삭제될 때 자동으로:
- 해당 카테고리의 예산 `spent_amount` 업데이트
- 실시간 예산 진행률 추적

```sql
-- 예제: 식비 15,000원 지출 등록
INSERT INTO expenses (user_id, amount, category) 
VALUES ('user-id', 15000, '식비');

-- 결과: budgets 테이블의 식비 spent_amount가 자동으로 15,000원 증가
```

---

## 📁 생성된 파일 목록

### 데이터베이스 관련
- ✅ [`supabase/schema.sql`](computer:///home/user/budget-app/supabase/schema.sql) - 전체 스키마 SQL
- ✅ [`supabase/SETUP_GUIDE.md`](computer:///home/user/budget-app/supabase/SETUP_GUIDE.md) - 상세 설정 가이드
- ✅ [`supabase/CHECKLIST.md`](computer:///home/user/budget-app/supabase/CHECKLIST.md) - 설정 체크리스트
- ✅ [`supabase/README.md`](computer:///home/user/budget-app/supabase/README.md) - 데이터베이스 문서

### 타입 정의
- ✅ [`src/types/supabase.ts`](computer:///home/user/budget-app/src/types/supabase.ts) - Supabase DB 타입
- ✅ [`src/types/index.ts`](computer:///home/user/budget-app/src/types/index.ts) - 애플리케이션 타입

### 헬퍼 함수
- ✅ [`src/lib/supabase.ts`](computer:///home/user/budget-app/src/lib/supabase.ts) - Supabase 클라이언트
- ✅ [`src/lib/supabase-helpers.ts`](computer:///home/user/budget-app/src/lib/supabase-helpers.ts) - DB CRUD 헬퍼 함수

### 예제 컴포넌트
- ✅ [`src/components/ExpenseForm.tsx`](computer:///home/user/budget-app/src/components/ExpenseForm.tsx) - 지출 등록 폼

---

## 🚀 다음 단계: Supabase 설정하기

### 1️⃣ Supabase 프로젝트 생성
1. https://app.supabase.com 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `budget-app`
   - Region: **Northeast Asia (Seoul)** 선택
4. Database Password 저장 (중요!)

### 2️⃣ SQL 스키마 실행
1. 좌측 메뉴 → **SQL Editor** 클릭
2. **New query** 클릭
3. [`schema.sql`](computer:///home/user/budget-app/supabase/schema.sql) 파일 내용 복사
4. SQL Editor에 붙여넣기
5. **Run** 버튼 클릭 (Ctrl+Enter)
6. "Success" 메시지 확인 ✅

### 3️⃣ API 키 복사
1. 좌측 메뉴 → **Settings** → **API** 클릭
2. 다음 정보 복사:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4️⃣ 환경변수 설정
`.env.local` 파일에 입력:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5️⃣ 개발 서버 재시작
```bash
npm run dev
```

브라우저 콘솔에서 Supabase 연결 확인!

---

## 📚 헬퍼 함수 사용 예제

### 지출 등록
```typescript
import { createExpense, addPoints } from '@/lib/supabase-helpers'

// 지출 등록
const expense = await createExpense(userId, {
  amount: 15000,
  category: '식비',
  emotion: '만족',
  note: '점심 회식',
})

// 포인트 적립
await addPoints(userId, 10)
```

### 예산 조회
```typescript
import { getBudgets } from '@/lib/supabase-helpers'

// 이번 달 예산 조회
const budgets = await getBudgets(userId, '2024-11')
```

### 통계 조회
```typescript
import { getExpensesByCategory } from '@/lib/supabase-helpers'

// 카테고리별 지출 통계
const stats = await getExpensesByCategory(userId, '2024-11')
// { '식비': 500000, '교통비': 200000, ... }
```

---

## 🔍 테이블 구조 확인 방법

Supabase Dashboard에서:
1. 좌측 메뉴 → **Table Editor** 클릭
2. 생성된 테이블 확인:
   - ✅ users
   - ✅ budgets
   - ✅ expenses
   - ✅ user_points
   - ✅ ai_feedback

---

## 🎯 주요 기능 요약

| 기능 | 설명 | 파일 |
|------|------|------|
| 🔐 **RLS** | 본인 데이터만 접근 | schema.sql |
| 🔄 **자동 업데이트** | 지출 등록 시 예산 자동 계산 | update_budget_spent() |
| 🏆 **게임화** | 포인트, 레벨, 배지, 연속일 | user_points 테이블 |
| 🤖 **AI 피드백** | GPT-4 조언 저장 | ai_feedback 테이블 |
| 📊 **통계** | 카테고리별 지출 분석 | supabase-helpers.ts |

---

## 📖 상세 가이드

더 자세한 설정 방법은 다음 문서를 참고하세요:
- [`SETUP_GUIDE.md`](computer:///home/user/budget-app/supabase/SETUP_GUIDE.md) - 단계별 설정 가이드
- [`CHECKLIST.md`](computer:///home/user/budget-app/supabase/CHECKLIST.md) - 체크리스트
- [`README.md`](computer:///home/user/budget-app/supabase/README.md) - 데이터베이스 개요

---

## ✅ 완료 상태

- ✅ 데이터베이스 스키마 설계
- ✅ RLS 정책 정의
- ✅ 자동화 트리거 구현
- ✅ TypeScript 타입 정의
- ✅ 헬퍼 함수 작성
- ✅ 예제 컴포넌트 생성
- ✅ 상세 문서 작성

---

**설정 준비 완료!** 🎉

이제 Supabase Dashboard에서 SQL을 실행하고 환경변수만 설정하면 바로 사용할 수 있습니다!
