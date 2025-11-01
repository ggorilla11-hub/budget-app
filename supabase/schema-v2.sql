-- =====================================================
-- 버짓(Budget) - Supabase 데이터베이스 스키마 v2
-- =====================================================

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

-- 프로필 인덱스
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);

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

-- 예산 인덱스
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_month ON budgets(month);

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

-- 지출 인덱스
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_budget_id ON expenses(budget_id);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category);

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

-- 챌린지 인덱스
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX idx_challenges_is_premium ON challenges(is_premium);

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

-- 사용자 챌린지 인덱스
CREATE INDEX idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX idx_user_challenges_completed_at ON user_challenges(completed_at);

-- 포인트 테이블
CREATE TABLE points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포인트 인덱스
CREATE INDEX idx_points_user_id ON points(user_id);
CREATE INDEX idx_points_created_at ON points(created_at);

-- =====================================================
-- Row Level Security 활성화
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE points ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS 정책 생성 (본인 데이터만 접근)
-- =====================================================

-- Profiles 정책
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Budgets 정책
CREATE POLICY "Users can view own budgets" 
  ON budgets FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets" 
  ON budgets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets" 
  ON budgets FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets" 
  ON budgets FOR DELETE 
  USING (auth.uid() = user_id);

-- Expenses 정책
CREATE POLICY "Users can view own expenses" 
  ON expenses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" 
  ON expenses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" 
  ON expenses FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" 
  ON expenses FOR DELETE 
  USING (auth.uid() = user_id);

-- User Challenges 정책
CREATE POLICY "Users can view own challenges" 
  ON user_challenges FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges" 
  ON user_challenges FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges" 
  ON user_challenges FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges" 
  ON user_challenges FOR DELETE 
  USING (auth.uid() = user_id);

-- Points 정책
CREATE POLICY "Users can view own points" 
  ON points FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own points" 
  ON points FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Challenges는 모든 사용자가 읽기 가능 (공개 챌린지 목록)
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view challenges" 
  ON challenges FOR SELECT 
  USING (true);

-- =====================================================
-- 유틸리티 함수
-- =====================================================

-- 사용자 총 포인트 계산 함수
CREATE OR REPLACE FUNCTION get_user_total_points(user_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(amount), 0)::INTEGER
  FROM points
  WHERE user_id = user_uuid;
$$ LANGUAGE SQL STABLE;

-- 예산 대비 지출 비율 계산 함수
CREATE OR REPLACE FUNCTION calculate_expense_ratio(budget_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_expense INTEGER;
  budget_income INTEGER;
BEGIN
  SELECT income INTO budget_income
  FROM budgets
  WHERE id = budget_uuid;

  SELECT COALESCE(SUM(amount), 0) INTO total_expense
  FROM expenses
  WHERE budget_id = budget_uuid;

  IF budget_income > 0 THEN
    RETURN ROUND((total_expense::NUMERIC / budget_income::NUMERIC) * 100, 2);
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- 사용자 프로필 업데이트 시 updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 초기 샘플 챌린지 데이터
-- =====================================================

INSERT INTO challenges (name, description, difficulty, reward_points, duration_days, is_premium) VALUES
  ('커피 절약 챌린지', '1주일 동안 카페 커피 구매하지 않기', 'easy', 100, 7, false),
  ('30일 가계부 작성', '한 달 동안 매일 지출 기록하기', 'medium', 300, 30, false),
  ('저축 습관 만들기', '2주 동안 매일 1만원씩 저축하기', 'medium', 500, 14, false),
  ('무지출 챌린지', '3일 연속 필수 지출 외 소비하지 않기', 'hard', 200, 3, false),
  ('식비 절약 마스터', '한 달 동안 식비 50% 절감하기', 'hard', 1000, 30, true),
  ('재테크 공부하기', '2주 동안 재테크 관련 콘텐츠 매일 학습', 'easy', 150, 14, false);

-- =====================================================
-- 코멘트 (테이블/컬럼 설명)
-- =====================================================

COMMENT ON TABLE profiles IS '사용자 프로필 정보 (Supabase Auth 연동)';
COMMENT ON TABLE budgets IS '월별 예산 및 카테고리별 배분';
COMMENT ON TABLE expenses IS '지출 내역 기록';
COMMENT ON TABLE challenges IS '사용자 참여 가능한 챌린지 목록';
COMMENT ON TABLE user_challenges IS '사용자의 챌린지 참여 기록';
COMMENT ON TABLE points IS '사용자 포인트 적립 내역';

COMMENT ON COLUMN profiles.housing_type IS '주거 형태: own(자가), jeonse(전세), monthly(월세)';
COMMENT ON COLUMN profiles.subscription_tier IS '구독 등급: free(무료), premium(프리미엄)';
COMMENT ON COLUMN budgets.allocation IS 'JSON 형식의 카테고리별 예산 배분 {식비: 500000, 교통비: 200000, ...}';
COMMENT ON COLUMN expenses.emotion IS '지출 시 감정: 기쁨, 만족, 후회, 필요, 충동, 스트레스, 중립';
COMMENT ON COLUMN expenses.payment_method IS '결제 수단: 카드, 현금, 계좌이체 등';
COMMENT ON COLUMN challenges.difficulty IS '난이도: easy(쉬움), medium(보통), hard(어려움)';
COMMENT ON COLUMN user_challenges.progress IS '챌린지 진행률 (0-100%)';
