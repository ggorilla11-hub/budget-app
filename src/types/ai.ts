/**
 * AI 관련 타입 정의
 */

export interface BudgetAllocation {
  생활비: number
  저축투자: number
  노후연금: number
  보장성보험: number
  주거비: number
  여유자금: number
  [key: string]: number
}

export interface BudgetPlan {
  allocation: BudgetAllocation
  advice: string
}

export interface CoachingRequest {
  expenses: Array<{
    category: string
    amount: number
    date: string
  }>
  budget: Record<string, number>
  lastWeekSpending: number
}

export interface EmotionAnalysisRequest {
  recentExpenses: Array<{
    category: string
    amount: number
    emotion: string
    date: string
  }>
  monthlyIncome: number
}

export interface MonthlyReportRequest {
  totalIncome: number
  totalExpense: number
  categoryBreakdown: Record<string, number>
  savingsRate: number
  comparedToLastMonth: number
}

export interface MonthlyReport {
  summary: string
  highlights: string[]
  improvements: string[]
  nextMonthGoal: string
}

export interface AIResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
