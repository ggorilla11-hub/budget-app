-- =====================================================
-- 버짓(Budget) - Supabase 데이터베이스 스키마
-- =====================================================

-- UUID 확장 활성화 (Supabase는 기본적으로 활성화되어 있음)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS 테이블
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  age INT,
  family_members INT DEFAULT 1,
  monthly_income DECIMAL(12,2),
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- users 테이블 인덱스
CREATE INDEX idx_users_email ON users(email);

-- =====================================================
-- 2. BUDGETS 테이블
-- =====================================================
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  category VARCHAR(50) NOT NULL,
  allocated_amount DECIMAL(12,2) NOT NULL,
  spent_amount DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, month, category)
);

-- budgets 테이블 인덱스
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_month ON budgets(month);

-- =====================================================
-- 3. EXPENSES 테이블
-- =====================================================
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  emotion VARCHAR(20),
  note TEXT,
  transaction_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- expenses 테이블 인덱스
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_transaction_date ON expenses(transaction_date);
CREATE INDEX idx_expenses_category ON expenses(category);

-- =====================================================
-- 4. GAMIFICATION 테이블 (포인트 시스템)
-- =====================================================
CREATE TABLE user_points (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points INT DEFAULT 0,
  level INT DEFAULT 1,
  badges JSONB DEFAULT '[]'::jsonb,
  streak_days INT DEFAULT 0,
  last_check_in DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. AI FEEDBACK 테이블
-- =====================================================
CREATE TABLE ai_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'advice',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ai_feedback 테이블 인덱스
CREATE INDEX idx_ai_feedback_user_id ON ai_feedback(user_id);
CREATE INDEX idx_ai_feedback_created_at ON ai_feedback(created_at);

-- =====================================================
-- RLS (Row Level Security) 활성화
-- =====================================================

-- USERS 테이블 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- BUDGETS 테이블 RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

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

-- EXPENSES 테이블 RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

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

-- USER_POINTS 테이블 RLS
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own points"
  ON user_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own points"
  ON user_points FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own points"
  ON user_points FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- AI_FEEDBACK 테이블 RLS
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback"
  ON ai_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
  ON ai_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 유틸리티 함수
-- =====================================================

-- 지출 추가 시 예산의 spent_amount 자동 업데이트
CREATE OR REPLACE FUNCTION update_budget_spent()
RETURNS TRIGGER AS $$
BEGIN
  -- 해당 카테고리의 이번 달 예산 업데이트
  UPDATE budgets
  SET spent_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM expenses
    WHERE user_id = NEW.user_id
      AND category = NEW.category
      AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', NEW.transaction_date)
  )
  WHERE user_id = NEW.user_id
    AND category = NEW.category
    AND DATE_TRUNC('month', month) = DATE_TRUNC('month', NEW.transaction_date);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 지출 추가/수정/삭제 시 트리거
CREATE TRIGGER trigger_update_budget_spent
AFTER INSERT OR UPDATE OR DELETE ON expenses
FOR EACH ROW
EXECUTE FUNCTION update_budget_spent();

-- =====================================================
-- 초기 데이터 (선택사항)
-- =====================================================

-- 예산 카테고리 샘플
COMMENT ON COLUMN budgets.category IS 'Categories: 식비, 교통비, 주거비, 문화생활, 쇼핑, 의료비, 교육비, 기타';
COMMENT ON COLUMN expenses.category IS 'Categories: 식비, 교통비, 주거비, 문화생활, 쇼핑, 의료비, 교육비, 기타';

-- 감정 태그 샘플
COMMENT ON COLUMN expenses.emotion IS 'Emotions: 기쁨, 만족, 후회, 필요, 충동, 스트레스, 중립';

-- AI 피드백 타입
COMMENT ON COLUMN ai_feedback.type IS 'Types: advice, warning, praise, tip';
