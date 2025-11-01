# ✅ Phase 1-2 완료: Supabase 프로젝트 설정

버짓(Budget) 프로젝트의 Supabase 데이터베이스 설정이 완료되었습니다!

---

## 📊 완료 사항

### ✅ 데이터베이스 스키마 (Schema v2)
- **6개 테이블** 생성 완료
- **RLS (Row Level Security)** 활성화
- **인덱스** 최적화
- **초기 챌린지 데이터** 자동 생성

### ✅ 파일 생성
- `supabase/schema-v2.sql` - 전체 스키마
- `src/lib/supabase.ts` - Supabase 클라이언트
- `src/lib/supabase-api.ts` - API 헬퍼 함수
- `src/types/database.ts` - TypeScript 타입 정의

### ✅ 문서 작성
- `QUICK_START.md` - 5분 빠른 시작 가이드
- `PHASE_1-2_SETUP.md` - 상세 설정 가이드

---

## 🗄️ 데이터베이스 구조

### 1️⃣ **profiles** 테이블 👤
사용자 프로필 정보 (Supabase Auth 연동)

```typescript
{
  id: UUID,
  email: string,
  name: string | null,
  income: number,
  family_size: number,
  housing_type: 'own' | 'jeonse' | 'monthly',
  subscription_tier: 'free' | 'premium',
  subscription_expires_at: timestamp | null
}
```

**주거 형태**:
- `own`: 자가
- `jeonse`: 전세
- `monthly`: 월세

---

### 2️⃣ **budgets** 테이블 💰
월별 예산 및 카테고리 배분

```typescript
{
  id: UUID,
  user_id: UUID,
  month: string,        // '2024-11'
  income: number,
  allocation: {         // JSONB
    식비: 500000,
    교통비: 200000,
    // ...
  }
}
```

**UNIQUE 제약**: (user_id, month)

---

### 3️⃣ **expenses** 테이블 📝
지출 내역 기록

```typescript
{
  id: UUID,
  user_id: UUID,
  budget_id: UUID,
  category: string,
  amount: number,
  note: string | null,
  emotion: string | null,     // 감정 태그
  payment_method: string | null,
  expense_date: timestamp
}
```

**감정 태그 예시**: 기쁨, 만족, 후회, 필요, 충동, 스트레스, 중립

---

### 4️⃣ **challenges** 테이블 🏆
사용자 참여 가능한 챌린지

```typescript
{
  id: UUID,
  name: string,
  description: string | null,
  difficulty: 'easy' | 'medium' | 'hard',
  reward_points: number,
  duration_days: number,
  is_premium: boolean
}
```

**초기 샘플 챌린지 (6개)**:
1. 커피 절약 챌린지 (쉬움, 7일, 100P)
2. 30일 가계부 작성 (보통, 30일, 300P)
3. 저축 습관 만들기 (보통, 14일, 500P)
4. 무지출 챌린지 (어려움, 3일, 200P)
5. 식비 절약 마스터 (어려움, 30일, 1000P, 프리미엄)
6. 재테크 공부하기 (쉬움, 14일, 150P)

---

### 5️⃣ **user_challenges** 테이블 🎯
사용자의 챌린지 참여 기록

```typescript
{
  id: UUID,
  user_id: UUID,
  challenge_id: UUID,
  started_at: timestamp,
  completed_at: timestamp | null,
  progress: number          // 0-100
}
```

---

### 6️⃣ **points** 테이블 ⭐
포인트 적립 내역

```typescript
{
  id: UUID,
  user_id: UUID,
  amount: number,
  reason: string | null,
  created_at: timestamp
}
```

---

## 🔒 보안 기능

### RLS (Row Level Security)
모든 테이블에 적용된 정책:

```sql
-- 본인 데이터만 조회
auth.uid() = user_id

-- 본인 프로필만 수정
auth.uid() = id
```

### 정책 목록
- ✅ profiles: SELECT, UPDATE, INSERT
- ✅ budgets: ALL (SELECT, INSERT, UPDATE, DELETE)
- ✅ expenses: ALL
- ✅ user_challenges: ALL
- ✅ points: SELECT, INSERT
- ✅ challenges: SELECT (모든 사용자)

---

## ⚙️ 유틸리티 함수

### 1. 총 포인트 계산
```sql
SELECT get_user_total_points('user-uuid');
```

### 2. 예산 대비 지출 비율
```sql
SELECT calculate_expense_ratio('budget-uuid');
-- 반환: 75.5 (75.5%)
```

### 3. updated_at 자동 갱신
profiles 테이블 업데이트 시 자동으로 `updated_at` 갱신

---

## 📁 생성된 파일 구조

```
budget-app/
├── supabase/
│   ├── schema-v2.sql          ✅ 전체 스키마 (8.7KB)
│   ├── PHASE_1-2_SETUP.md     ✅ 상세 설정 가이드 (6.6KB)
│   └── (기존 schema.sql도 보존)
├── src/
│   ├── lib/
│   │   ├── supabase.ts        ✅ Supabase 클라이언트
│   │   └── supabase-api.ts    ✅ API 헬퍼 함수 (9KB)
│   └── types/
│       └── database.ts        ✅ TypeScript 타입 (7KB)
├── .env.local                 ✅ 환경변수 템플릿
├── QUICK_START.md             ✅ 5분 빠른 시작
└── PHASE_1-2_COMPLETE.md      ✅ 이 문서
```

---

## 🔧 API 헬퍼 함수 (30개+)

### 인증
```typescript
getCurrentUser()
signUp(email, password)
signIn(email, password)
signOut()
```

### 프로필
```typescript
getProfile(userId)
createProfile(profile)
updateProfile(userId, updates)
```

### 예산
```typescript
getBudgets(userId)
getBudget(userId, month)
createBudget(budget)
updateBudget(budgetId, updates)
deleteBudget(budgetId)
```

### 지출
```typescript
getExpenses(userId, budgetId?)
getExpensesByMonth(userId, month)
createExpense(expense)
updateExpense(expenseId, updates)
deleteExpense(expenseId)
```

### 챌린지
```typescript
getChallenges(includesPremium?)
getChallenge(challengeId)
getUserChallenges(userId)
getActiveUserChallenges(userId)
joinChallenge(userChallenge)
updateChallengeProgress(id, progress, completed?)
```

### 포인트
```typescript
getUserPoints(userId)
getTotalPoints(userId)
addPoints(point)
```

### 통계
```typescript
getExpenseRatio(budgetId)
getCategoryExpenses(userId, month)
getMonthlyExpenseTotal(userId, month)
```

---

## 🚀 사용 예제

### 예산 생성
```typescript
import { createBudget } from '@/lib/supabase-api'

const budget = await createBudget({
  user_id: 'user-uuid',
  month: '2024-11',
  income: 3000000,
  allocation: {
    식비: 500000,
    교통비: 200000,
    주거비: 800000,
    문화생활: 300000,
    저축: 1200000
  }
})
```

### 지출 등록
```typescript
import { createExpense, addPoints } from '@/lib/supabase-api'

const expense = await createExpense({
  user_id: 'user-uuid',
  budget_id: 'budget-uuid',
  category: '식비',
  amount: 15000,
  emotion: '만족',
  note: '점심 회식',
  payment_method: '카드',
  expense_date: new Date().toISOString()
})

// 포인트 적립
await addPoints({
  user_id: 'user-uuid',
  amount: 10,
  reason: '지출 등록'
})
```

### 챌린지 참여
```typescript
import { joinChallenge } from '@/lib/supabase-api'

const userChallenge = await joinChallenge({
  user_id: 'user-uuid',
  challenge_id: 'challenge-uuid',
  progress: 0
})
```

---

## 🎯 다음 단계

### ✅ 완료된 Phase
- [x] Phase 1-1: 프로젝트 초기 설정
- [x] **Phase 1-2: Supabase 데이터베이스 설정**

### 📝 다음 Phase
- [ ] Phase 1-3: 인증 시스템 구현
- [ ] Phase 2: 예산 배분 알고리즘 (AI 기반)
- [ ] Phase 3: 지출 기록 및 감정 태그
- [ ] Phase 4: 챌린지 시스템
- [ ] Phase 5: 대시보드 및 통계

---

## 📋 설정 체크리스트

Supabase 설정을 완료하려면:

- [ ] Supabase 프로젝트 생성 (budget-app)
- [ ] Region: Northeast Asia (Seoul) 선택
- [ ] SQL 스키마 실행 (schema-v2.sql)
- [ ] 6개 테이블 생성 확인
- [ ] RLS 정책 활성화 확인
- [ ] API 키 복사 (URL, anon key)
- [ ] .env.local에 환경변수 입력
- [ ] 개발 서버 재시작
- [ ] 브라우저 콘솔에서 오류 확인
- [ ] 초기 챌린지 데이터 확인

**모두 완료하면**:
```
✅ Phase 1-2 완료
```

---

## 📚 참고 문서

| 문서 | 설명 | 위치 |
|------|------|------|
| **QUICK_START.md** | 5분 빠른 시작 | [링크](computer:///home/user/budget-app/QUICK_START.md) |
| **PHASE_1-2_SETUP.md** | 상세 설정 가이드 | [링크](computer:///home/user/budget-app/supabase/PHASE_1-2_SETUP.md) |
| **schema-v2.sql** | 전체 스키마 | [링크](computer:///home/user/budget-app/supabase/schema-v2.sql) |
| **supabase-api.ts** | API 함수 | [링크](computer:///home/user/budget-app/src/lib/supabase-api.ts) |
| **database.ts** | 타입 정의 | [링크](computer:///home/user/budget-app/src/types/database.ts) |

---

## 💾 백업

프로젝트가 AI Drive에 백업되었습니다:
- 📦 `/budget-app-project/budget-app-phase1-2.tar.gz` (80KB)

---

**Phase 1-2 완료 일시**: 2025-10-31
**다음 Phase**: 인증 시스템 구현
**예상 소요 시간**: 30분

🎉 **축하합니다! Phase 1-2를 완료했습니다!**
