# Supabase 데이터베이스 설정 가이드

버짓(Budget) 애플리케이션의 Supabase 데이터베이스를 설정하는 단계별 가이드입니다.

---

## 📋 사전 준비

- [Supabase](https://supabase.com) 계정 생성
- 새 프로젝트 생성

---

## 🔧 1단계: Supabase 프로젝트 생성

1. **Supabase 대시보드 접속**: https://app.supabase.com
2. **"New Project" 클릭**
3. 프로젝트 정보 입력:
   - **Name**: budget-app (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 생성 (저장 필수!)
   - **Region**: Northeast Asia (Seoul) 선택 권장
4. **"Create new project"** 클릭
5. 프로젝트 초기화 완료까지 약 2분 대기

---

## 🗄️ 2단계: 데이터베이스 스키마 실행

### 방법 1: SQL Editor 사용 (권장)

1. 좌측 메뉴에서 **"SQL Editor"** 클릭
2. **"New query"** 클릭
3. `supabase/schema.sql` 파일의 전체 내용을 복사
4. SQL Editor에 붙여넣기
5. **"Run"** 버튼 클릭 (또는 Ctrl+Enter)
6. 하단에 "Success" 메시지 확인

### 방법 2: Supabase CLI 사용

```bash
# Supabase CLI 설치 (처음 한 번만)
npm install -g supabase

# 프로젝트와 연결
supabase link --project-ref <YOUR_PROJECT_REF>

# 스키마 적용
supabase db push
```

---

## 🔐 3단계: API 키 확인 및 환경변수 설정

1. 좌측 메뉴에서 **"Settings"** > **"API"** 클릭
2. 다음 정보를 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. `.env.local` 파일에 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔒 4단계: RLS (Row Level Security) 확인

스키마 실행 시 자동으로 RLS 정책이 활성화됩니다. 확인 방법:

1. 좌측 메뉴에서 **"Authentication"** > **"Policies"** 클릭
2. 각 테이블별로 다음 정책들이 있는지 확인:

### Users 테이블
- ✅ Users can view own profile
- ✅ Users can update own profile
- ✅ Users can insert own profile

### Budgets 테이블
- ✅ Users can view own budgets
- ✅ Users can insert own budgets
- ✅ Users can update own budgets
- ✅ Users can delete own budgets

### Expenses 테이블
- ✅ Users can view own expenses
- ✅ Users can insert own expenses
- ✅ Users can update own expenses
- ✅ Users can delete own expenses

### User_points 테이블
- ✅ Users can view own points
- ✅ Users can insert own points
- ✅ Users can update own points

### AI_feedback 테이블
- ✅ Users can view own feedback
- ✅ Users can insert own feedback

---

## 📊 5단계: 테이블 구조 확인

좌측 메뉴에서 **"Table Editor"** 클릭하여 다음 테이블들이 생성되었는지 확인:

| 테이블명 | 설명 | 주요 컬럼 |
|---------|------|----------|
| `users` | 사용자 정보 | email, name, age, monthly_income |
| `budgets` | 월별 예산 | user_id, month, category, allocated_amount |
| `expenses` | 지출 내역 | user_id, amount, category, emotion |
| `user_points` | 게임화 포인트 | user_id, total_points, level, badges |
| `ai_feedback` | AI 피드백 | user_id, message, type |

---

## 🔍 6단계: 데이터베이스 함수 확인

좌측 메뉴에서 **"Database"** > **"Functions"** 클릭하여 다음 함수 확인:

- ✅ `update_budget_spent()` - 지출 추가 시 예산 자동 업데이트

---

## 🧪 7단계: 테스트 데이터 삽입 (선택사항)

SQL Editor에서 다음 쿼리를 실행하여 테스트 데이터 삽입:

```sql
-- 테스트 사용자 생성 (auth.users에 먼저 생성 필요)
-- Supabase Auth를 통해 회원가입하면 자동 생성됨

-- 예산 샘플 데이터
INSERT INTO budgets (user_id, month, category, allocated_amount) VALUES
  ('USER_ID_HERE', '2024-11-01', '식비', 500000),
  ('USER_ID_HERE', '2024-11-01', '교통비', 200000),
  ('USER_ID_HERE', '2024-11-01', '문화생활', 150000);

-- 지출 샘플 데이터
INSERT INTO expenses (user_id, amount, category, emotion, note) VALUES
  ('USER_ID_HERE', 15000, '식비', '만족', '점심 회식'),
  ('USER_ID_HERE', 3500, '교통비', '필요', '지하철 교통카드 충전'),
  ('USER_ID_HERE', 45000, '문화생활', '기쁨', '영화관람');
```

---

## 📱 8단계: 인증 설정

### Email 인증 설정

1. 좌측 메뉤에서 **"Authentication"** > **"Providers"** 클릭
2. **"Email"** 토글 활성화
3. 설정:
   - ✅ Enable Email provider
   - ✅ Confirm email (이메일 확인 필수 여부)
   - ✅ Secure email change

### 소셜 로그인 설정 (선택사항)

- **Google**: Client ID, Secret 입력
- **GitHub**: OAuth App 생성 후 설정
- **카카오**: REST API Key 입력

---

## 🔄 9단계: 실시간 구독 설정 (선택사항)

실시간 데이터 업데이트가 필요한 경우:

1. 좌측 메뉴에서 **"Database"** > **"Replication"** 클릭
2. 원하는 테이블 선택 후 **"Enable"** 클릭

---

## ✅ 10단계: 연결 테스트

프로젝트 디렉토리에서:

```bash
# 개발 서버 실행
npm run dev

# 브라우저 콘솔에서 연결 확인
# supabase 클라이언트가 정상적으로 초기화되었는지 확인
```

---

## 🚨 트러블슈팅

### 문제: RLS 정책 오류
```
Error: new row violates row-level security policy
```
**해결**: 
- Supabase Auth를 통해 로그인한 사용자만 데이터 접근 가능
- 테스트 시 `auth.uid()`가 현재 로그인 사용자 ID와 일치하는지 확인

### 문제: 환경변수 인식 안됨
```
Warning: Supabase 환경변수가 설정되지 않았습니다
```
**해결**:
- `.env.local` 파일 위치 확인 (프로젝트 루트)
- 개발 서버 재시작 (`npm run dev`)
- 환경변수명 확인 (`NEXT_PUBLIC_` 접두사 필수)

### 문제: UUID 함수 없음
```
Error: function uuid_generate_v4() does not exist
```
**해결**:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 📚 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase Auth 가이드](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

## 🔗 유용한 명령어

```bash
# Supabase 타입 자동 생성
npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/supabase.ts

# 로컬 Supabase 실행 (Docker 필요)
supabase start

# 데이터베이스 마이그레이션
supabase db push

# 데이터베이스 리셋
supabase db reset
```

---

**설정 완료!** 🎉

이제 버짓 애플리케이션에서 Supabase 데이터베이스를 사용할 수 있습니다.
