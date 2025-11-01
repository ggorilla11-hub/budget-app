/**
 * 애플리케이션 타입 정의
 * Supabase 타입을 기반으로 확장된 타입들
 */

import { 
  User as SupabaseUser, 
  Budget as SupabaseBudget, 
  Expense as SupabaseExpense,
  UserPoints as SupabaseUserPoints,
  AIFeedback as SupabaseAIFeedback,
  ExpenseCategory,
  EmotionType,
  FeedbackType
} from './supabase'

// Supabase 타입 재 export
export type User = SupabaseUser
export type Budget = SupabaseBudget
export type Expense = SupabaseExpense
export type UserPoints = SupabaseUserPoints
export type AIFeedback = SupabaseAIFeedback

// 카테고리 및 감정 타입 재 export
export type { ExpenseCategory, EmotionType, FeedbackType }

// 기존 Transaction 타입은 Expense로 통합
export type Transaction = Expense & {
  type?: 'income' | 'expense'
}

// 기존 Goal 타입 (향후 테이블 추가 예정)
export interface Goal {
  id: string
  user_id: string
  title: string
  target_amount: number
  current_amount: number
  deadline: string
  created_at: string
}

// 확장된 사용자 프로필 (통계 포함)
export interface UserProfile extends User {
  total_expenses?: number
  total_budget?: number
  points?: UserPoints
}

// 예산 통계
export interface BudgetSummary {
  category: string
  allocated: number
  spent: number
  percentage: number
  status: 'safe' | 'warning' | 'exceeded'
}

// 지출 분석
export interface ExpenseAnalysis {
  total: number
  byCategory: Record<string, number>
  byEmotion: Record<string, number>
  trend: 'increasing' | 'decreasing' | 'stable'
}

// 대시보드 데이터
export interface DashboardData {
  user: UserProfile
  monthlyBudget: Budget[]
  recentExpenses: Expense[]
  budgetSummary: BudgetSummary[]
  expenseAnalysis: ExpenseAnalysis
  aiRecommendations: AIFeedback[]
}

// 폼 데이터 타입
export interface ExpenseFormData {
  amount: number
  category: ExpenseCategory
  emotion?: EmotionType
  note?: string
  transaction_date?: string
}

export interface BudgetFormData {
  month: string
  category: ExpenseCategory
  allocated_amount: number
}

// API 응답 타입
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// 페이지네이션
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 차트 데이터
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
  }[]
}
