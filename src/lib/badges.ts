import { supabase } from './supabase'

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  points: number
  condition: (userData: any) => boolean
}

export const BADGES: Record<string, Badge> = {
  FIRST_EXPENSE: {
    id: 'first_expense',
    name: '첫 걸음',
    icon: '🎯',
    description: '첫 지출 기록 완료',
    points: 100,
    condition: (userData: any) => userData.expenseCount >= 1
  },
  EXPENSE_STREAK_3: {
    id: 'expense_streak_3',
    name: '꾸준함',
    icon: '🔥',
    description: '3일 연속 지출 기록',
    points: 200,
    condition: (userData: any) => userData.consecutiveDays >= 3
  },
  BUDGET_KEEPER_1: {
    id: 'budget_keeper_1',
    name: '예산 지킴이',
    icon: '🛡️',
    description: '1주 연속 예산 달성',
    points: 500,
    condition: (userData: any) => userData.budgetKeepDays >= 7
  },
  SAVER: {
    id: 'saver',
    name: '절약왕',
    icon: '👑',
    description: '월 목표 저축액 달성',
    points: 1000,
    condition: (userData: any) => userData.monthlyAchievement >= 100
  }
}

export async function checkAndAwardBadges(userId: string) {
  // 사용자 데이터 가져오기
  // 조건 체크
  // 뱃지 미보유 시 수여
  // 포인트 적립
  return []
}
