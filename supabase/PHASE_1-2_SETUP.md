# Phase 1-2: Supabase 프로젝트 설정 가이드

버짓(Budget) 애플리케이션의 Supabase 데이터베이스를 설정하는 단계별 가이드입니다.

---

## 📋 체크리스트

- [ ] 1단계: Supabase 프로젝트 생성
- [ ] 2단계: SQL 스키마 실행
- [ ] 3단계: API 키 복사
- [ ] 4단계: 환경변수 설정
- [ ] 5단계: 연결 테스트

---

## 1️⃣ Supabase 프로젝트 생성

### 1.1 Supabase 접속
1. https://supabase.com 접속
2. 로그인 또는 회원가입

### 1.2 새 프로젝트 생성
1. **"New Project"** 버튼 클릭
2. 프로젝트 정보 입력:
   - **Name**: `budget-app`
   - **Database Password**: 강력한 비밀번호 생성 (저장 필수! 🔐)
   - **Region**: **Northeast Asia (Seoul)** 선택
   - **Pricing Plan**: Free (개발용) 또는 Pro
3. **"Create new project"** 클릭
4. 프로젝트 초기화 완료까지 약 **2분** 대기

> **중요**: Database Password는 반드시 안전한 곳에 저장하세요!

---

## 2️⃣ SQL 스키마 실행

### 2.1 SQL Editor 열기
1. 좌측 메뉴에서 **"SQL Editor"** 클릭
2. **"New query"** 버튼 클릭

### 2.2 스키마 SQL 복사
`supabase/schema-v2.sql` 파일의 전체 내용을 복사하세요.

**또는** 아래 SQL을 직접 복사:

```sql
-- 사용자 프로필 (Supabase Auth 연동)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  income INTEGER NOT NULL,
  family_size INTEGER DEFAULT 1,
  housing_type TEXT CHECK (housing_type IN ('own', 'jeonse', 'monthly')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 예산 테이블
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  income INTEGER NOT NULL,
  allocation JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- 지출 테이블
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount INTEGER NOT NULL,
  note TEXT,
  emotion TEXT,
  payment_method TEXT,
  expense_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 챌린지 테이블
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  reward_points INTEGER DEFAULT 0,
  duration_days INTEGER NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자 챌린지 참여
CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, challenge_id, started_at)
);

-- 포인트 테이블
CREATE TABLE points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE points ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성 (본인 데이터만 접근)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own challenges" ON user_challenges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own points" ON points FOR ALL USING (auth.uid() = user_id);
```

### 2.3 SQL 실행
1. SQL을 SQL Editor에 붙여넣기
2. **"Run"** 버튼 클릭 (또는 `Ctrl + Enter`)
3. 하단에 **"Success. No rows returned"** 메시지 확인 ✅

> **중요**: 오류 발생 시 전체 SQL을 다시 실행하세요.

---

## 3️⃣ API 키 확인 및 복사

### 3.1 API 설정 페이지 열기
1. 좌측 메뉴에서 **"Settings"** (⚙️) 클릭
2. **"API"** 메뉴 클릭

### 3.2 API 정보 복사
다음 두 가지 정보를 복사하세요:

1. **Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

2. **anon public key** (긴 문자열)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

> **주의**: `service_role` key는 **절대** 프론트엔드에서 사용하지 마세요! 서버 전용입니다.

---

## 4️⃣ 환경변수 설정

### 4.1 .env.local 파일 열기
프로젝트 루트의 `.env.local` 파일을 엽니다.

### 4.2 API 키 입력
복사한 정보를 입력하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (나중에 설정)
OPENAI_API_KEY=

# Toss Payments (나중에 설정)
NEXT_PUBLIC_TOSS_CLIENT_KEY=
```

### 4.3 파일 저장
**Ctrl + S** (또는 **Cmd + S**)로 저장

---

## 5️⃣ 연결 테스트

### 5.1 개발 서버 재시작
```bash
# 기존 서버 종료 (Ctrl + C)
# 새로 시작
npm run dev
```

### 5.2 브라우저 접속
http://localhost:3000 접속

### 5.3 콘솔 확인
1. 브라우저에서 **F12** (개발자 도구) 열기
2. **Console** 탭 확인
3. Supabase 연결 오류가 없는지 확인

✅ **정상**: 오류 없음
❌ **오류 발생 시**: 환경변수를 다시 확인하고 서버 재시작

---

## 6️⃣ 테이블 확인

### 6.1 Table Editor 열기
Supabase Dashboard에서:
1. 좌측 메뉴 **"Table Editor"** 클릭

### 6.2 생성된 테이블 확인
다음 6개 테이블이 생성되어야 합니다:

| 테이블명 | 설명 |
|----------|------|
| ✅ `profiles` | 사용자 프로필 |
| ✅ `budgets` | 월별 예산 |
| ✅ `expenses` | 지출 내역 |
| ✅ `challenges` | 챌린지 목록 |
| ✅ `user_challenges` | 사용자 챌린지 참여 |
| ✅ `points` | 포인트 내역 |

### 6.3 RLS 정책 확인
1. 좌측 메뉴 **"Authentication"** → **"Policies"** 클릭
2. 각 테이블별로 정책이 활성화되어 있는지 확인

---

## 7️⃣ 초기 챌린지 데이터 확인

### 7.1 Challenges 테이블 확인
1. **Table Editor** → **challenges** 테이블 클릭
2. 6개의 샘플 챌린지가 자동으로 생성되어 있어야 합니다:
   - 커피 절약 챌린지
   - 30일 가계부 작성
   - 저축 습관 만들기
   - 무지출 챌린지
   - 식비 절약 마스터 (프리미엄)
   - 재테크 공부하기

---

## 🎉 완료!

모든 단계를 완료했다면:

```
✅ Phase 1-2 완료
```

---

## 🚨 트러블슈팅

### 문제 1: SQL 실행 오류
```
Error: relation "auth.users" does not exist
```
**해결**: Supabase는 기본적으로 `auth.users` 테이블을 제공합니다. 프로젝트가 완전히 초기화될 때까지 기다리세요.

### 문제 2: RLS 정책 오류
```
Error: new row violates row-level security policy
```
**해결**: `auth.uid()`가 올바르게 설정되어 있는지 확인하세요. 로그인한 사용자만 데이터를 추가할 수 있습니다.

### 문제 3: 환경변수 인식 안됨
```
Warning: Supabase 환경변수가 설정되지 않았습니다
```
**해결**:
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- `NEXT_PUBLIC_` 접두사가 있는지 확인
- 개발 서버 재시작

### 문제 4: gen_random_uuid() 오류
```
Error: function gen_random_uuid() does not exist
```
**해결**: Supabase는 PostgreSQL 13+를 사용하므로 기본 제공됩니다. 오래된 프로젝트라면:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

---

## 📚 다음 단계

Phase 1-2 완료 후:
- **Phase 1-3**: 인증 시스템 구현
- **Phase 2**: 예산 배분 알고리즘 (AI 기반)
- **Phase 3**: 지출 기록 및 감정 태그
- **Phase 4**: 챌린지 시스템
- **Phase 5**: 대시보드 및 통계

---

**설정 완료 시간**: 약 5-10분
**난이도**: ⭐⭐ (중급)
