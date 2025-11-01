/**
 * Supabase 데이터베이스 헬퍼 함수들
 */

import { supabase } from './supabase'
import type { 
  User, 
  Budget, 
  Expense, 
  UserPoints, 
  AIFeedback,
  ExpenseFormData,
  BudgetFormData 
} from '@/types'

// =====================================================
// 사용자 관련
// =====================================================

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as User
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as User
}

// =====================================================
// 예산 관련
// =====================================================

export async function getBudgets(userId: string, month?: string) {
  let query = supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('category', { ascending: true })

  if (month) {
    query = query.eq('month', month)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Budget[]
}

export async function createBudget(userId: string, budgetData: BudgetFormData) {
  const { data, error } = await supabase
    .from('budgets')
    .insert({
      user_id: userId,
      ...budgetData,
    })
    .select()
    .single()

  if (error) throw error
  return data as Budget
}

export async function updateBudget(budgetId: string, updates: Partial<Budget>) {
  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', budgetId)
    .select()
    .single()

  if (error) throw error
  return data as Budget
}

export async function deleteBudget(budgetId: string) {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', budgetId)

  if (error) throw error
}

// =====================================================
// 지출 관련
// =====================================================

export async function getExpenses(
  userId: string,
  options?: {
    startDate?: string
    endDate?: string
    category?: string
    limit?: number
  }
) {
  let query = supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('transaction_date', { ascending: false })

  if (options?.startDate) {
    query = query.gte('transaction_date', options.startDate)
  }
  if (options?.endDate) {
    query = query.lte('transaction_date', options.endDate)
  }
  if (options?.category) {
    query = query.eq('category', options.category)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Expense[]
}

export async function createExpense(userId: string, expenseData: ExpenseFormData) {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      user_id: userId,
      ...expenseData,
    })
    .select()
    .single()

  if (error) throw error
  return data as Expense
}

export async function updateExpense(expenseId: string, updates: Partial<Expense>) {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', expenseId)
    .select()
    .single()

  if (error) throw error
  return data as Expense
}

export async function deleteExpense(expenseId: string) {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)

  if (error) throw error
}

// =====================================================
// 포인트 및 게임화
// =====================================================

export async function getUserPoints(userId: string) {
  const { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    // 포인트 레코드가 없으면 생성
    if (error.code === 'PGRST116') {
      return await createUserPoints(userId)
    }
    throw error
  }
  return data as UserPoints
}

export async function createUserPoints(userId: string) {
  const { data, error } = await supabase
    .from('user_points')
    .insert({
      user_id: userId,
      total_points: 0,
      level: 1,
      streak_days: 0,
    })
    .select()
    .single()

  if (error) throw error
  return data as UserPoints
}

export async function addPoints(userId: string, points: number) {
  const currentPoints = await getUserPoints(userId)
  const newTotal = currentPoints.total_points + points
  const newLevel = Math.floor(newTotal / 1000) + 1 // 1000포인트당 레벨업

  const { data, error } = await supabase
    .from('user_points')
    .update({
      total_points: newTotal,
      level: newLevel,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data as UserPoints
}

export async function updateStreak(userId: string) {
  const points = await getUserPoints(userId)
  const today = new Date().toISOString().split('T')[0]
  const lastCheckIn = points.last_check_in

  let newStreak = 1
  if (lastCheckIn) {
    const lastDate = new Date(lastCheckIn)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      newStreak = points.streak_days + 1
    } else if (diffDays > 1) {
      newStreak = 1
    } else {
      return points // 이미 오늘 체크인함
    }
  }

  const { data, error } = await supabase
    .from('user_points')
    .update({
      streak_days: newStreak,
      last_check_in: today,
      total_points: points.total_points + (newStreak * 10), // 연속일수에 따라 보너스
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data as UserPoints
}

// =====================================================
// AI 피드백
// =====================================================

export async function getAIFeedback(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('ai_feedback')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as AIFeedback[]
}

export async function createAIFeedback(
  userId: string,
  message: string,
  type: 'advice' | 'warning' | 'praise' | 'tip' = 'advice'
) {
  const { data, error } = await supabase
    .from('ai_feedback')
    .insert({
      user_id: userId,
      message,
      type,
    })
    .select()
    .single()

  if (error) throw error
  return data as AIFeedback
}

// =====================================================
// 통계 및 분석
// =====================================================

export async function getMonthlyExpenseTotal(userId: string, month: string) {
  const startDate = `${month}-01`
  const endDate = new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 0)
    .toISOString()
    .split('T')[0]

  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)

  if (error) throw error

  const total = data.reduce((sum, expense) => sum + Number(expense.amount), 0)
  return total
}

export async function getExpensesByCategory(userId: string, month: string) {
  const startDate = `${month}-01`
  const endDate = new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 0)
    .toISOString()
    .split('T')[0]

  const { data, error } = await supabase
    .from('expenses')
    .select('category, amount')
    .eq('user_id', userId)
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate)

  if (error) throw error

  const byCategory: Record<string, number> = {}
  data.forEach(expense => {
    byCategory[expense.category] = (byCategory[expense.category] || 0) + Number(expense.amount)
  })

  return byCategory
}
