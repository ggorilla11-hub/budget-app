/**
 * Supabase API 헬퍼 함수들 (Schema v2)
 */

import { supabase } from './supabase'
import type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Budget,
  BudgetInsert,
  BudgetUpdate,
  Expense,
  ExpenseInsert,
  ExpenseUpdate,
  Challenge,
  UserChallenge,
  UserChallengeInsert,
  Point,
  PointInsert,
} from '@/types/database'

// =====================================================
// 인증 관련
// =====================================================

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// =====================================================
// 프로필 관련
// =====================================================

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as Profile
}

export async function createProfile(profile: ProfileInsert) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}

// =====================================================
// 예산 관련
// =====================================================

export async function getBudgets(userId: string) {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('month', { ascending: false })

  if (error) throw error
  return data as Budget[]
}

export async function getBudget(userId: string, month: string) {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data as Budget
}

export async function createBudget(budget: BudgetInsert) {
  const { data, error } = await supabase
    .from('budgets')
    .insert(budget)
    .select()
    .single()

  if (error) throw error
  return data as Budget
}

export async function updateBudget(budgetId: string, updates: BudgetUpdate) {
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

export async function getExpenses(userId: string, budgetId?: string) {
  let query = supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('expense_date', { ascending: false })

  if (budgetId) {
    query = query.eq('budget_id', budgetId)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Expense[]
}

export async function getExpensesByMonth(userId: string, month: string) {
  const startDate = `${month}-01`
  const endDate = new Date(
    new Date(month).getFullYear(),
    new Date(month).getMonth() + 1,
    0
  ).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .gte('expense_date', startDate)
    .lte('expense_date', `${endDate}T23:59:59`)
    .order('expense_date', { ascending: false })

  if (error) throw error
  return data as Expense[]
}

export async function createExpense(expense: ExpenseInsert) {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single()

  if (error) throw error
  return data as Expense
}

export async function updateExpense(expenseId: string, updates: ExpenseUpdate) {
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
// 챌린지 관련
// =====================================================

export async function getChallenges(includesPremium = false) {
  let query = supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false })

  if (!includesPremium) {
    query = query.eq('is_premium', false)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Challenge[]
}

export async function getChallenge(challengeId: string) {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', challengeId)
    .single()

  if (error) throw error
  return data as Challenge
}

// =====================================================
// 사용자 챌린지 관련
// =====================================================

export async function getUserChallenges(userId: string) {
  const { data, error } = await supabase
    .from('user_challenges')
    .select(`
      *,
      challenges (*)
    `)
    .eq('user_id', userId)
    .order('started_at', { ascending: false })

  if (error) throw error
  return data as (UserChallenge & { challenges: Challenge })[]
}

export async function getActiveUserChallenges(userId: string) {
  const { data, error } = await supabase
    .from('user_challenges')
    .select(`
      *,
      challenges (*)
    `)
    .eq('user_id', userId)
    .is('completed_at', null)
    .order('started_at', { ascending: false })

  if (error) throw error
  return data as (UserChallenge & { challenges: Challenge })[]
}

export async function joinChallenge(userChallenge: UserChallengeInsert) {
  const { data, error } = await supabase
    .from('user_challenges')
    .insert(userChallenge)
    .select()
    .single()

  if (error) throw error
  return data as UserChallenge
}

export async function updateChallengeProgress(
  userChallengeId: string,
  progress: number,
  completed?: boolean
) {
  const updates: any = { progress }
  if (completed) {
    updates.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('user_challenges')
    .update(updates)
    .eq('id', userChallengeId)
    .select()
    .single()

  if (error) throw error
  return data as UserChallenge
}

// =====================================================
// 포인트 관련
// =====================================================

export async function getUserPoints(userId: string) {
  const { data, error } = await supabase
    .from('points')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Point[]
}

export async function getTotalPoints(userId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_user_total_points', { user_uuid: userId })

  if (error) throw error
  return data as number
}

export async function addPoints(point: PointInsert) {
  const { data, error } = await supabase
    .from('points')
    .insert(point)
    .select()
    .single()

  if (error) throw error
  return data as Point
}

// =====================================================
// 통계 및 분석
// =====================================================

export async function getExpenseRatio(budgetId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('calculate_expense_ratio', { budget_uuid: budgetId })

  if (error) throw error
  return data as number
}

export async function getCategoryExpenses(userId: string, month: string) {
  const expenses = await getExpensesByMonth(userId, month)

  const categoryTotals: Record<string, number> = {}
  expenses.forEach((expense) => {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) + expense.amount
  })

  return categoryTotals
}

export async function getMonthlyExpenseTotal(userId: string, month: string) {
  const expenses = await getExpensesByMonth(userId, month)
  return expenses.reduce((sum, expense) => sum + expense.amount, 0)
}
