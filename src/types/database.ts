/**
 * Supabase 데이터베이스 타입 정의 (Schema v2)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          income: number
          family_size: number
          housing_type: 'own' | 'jeonse' | 'monthly' | null
          subscription_tier: 'free' | 'premium'
          subscription_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          income: number
          family_size?: number
          housing_type?: 'own' | 'jeonse' | 'monthly' | null
          subscription_tier?: 'free' | 'premium'
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          income?: number
          family_size?: number
          housing_type?: 'own' | 'jeonse' | 'monthly' | null
          subscription_tier?: 'free' | 'premium'
          subscription_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          month: string
          income: number
          allocation: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          income: number
          allocation: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          income?: number
          allocation?: Json
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          budget_id: string
          category: string
          amount: number
          note: string | null
          emotion: string | null
          payment_method: string | null
          expense_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          budget_id: string
          category: string
          amount: number
          note?: string | null
          emotion?: string | null
          payment_method?: string | null
          expense_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          budget_id?: string
          category?: string
          amount?: number
          note?: string | null
          emotion?: string | null
          payment_method?: string | null
          expense_date?: string
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          name: string
          description: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          reward_points: number
          duration_days: number
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          difficulty: 'easy' | 'medium' | 'hard'
          reward_points?: number
          duration_days: number
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          difficulty?: 'easy' | 'medium' | 'hard'
          reward_points?: number
          duration_days?: number
          is_premium?: boolean
          created_at?: string
        }
      }
      user_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          started_at: string
          completed_at: string | null
          progress: number
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          started_at?: string
          completed_at?: string | null
          progress?: number
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          started_at?: string
          completed_at?: string | null
          progress?: number
        }
      }
      points: {
        Row: {
          id: string
          user_id: string
          amount: number
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          reason?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_total_points: {
        Args: { user_uuid: string }
        Returns: number
      }
      calculate_expense_ratio: {
        Args: { budget_uuid: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 헬퍼 타입
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']

// 테이블별 타입 익스포트
export type Profile = Tables<'profiles'>
export type Budget = Tables<'budgets'>
export type Expense = Tables<'expenses'>
export type Challenge = Tables<'challenges'>
export type UserChallenge = Tables<'user_challenges'>
export type Point = Tables<'points'>

// Insert 타입
export type ProfileInsert = InsertTables<'profiles'>
export type BudgetInsert = InsertTables<'budgets'>
export type ExpenseInsert = InsertTables<'expenses'>
export type UserChallengeInsert = InsertTables<'user_challenges'>
export type PointInsert = InsertTables<'points'>

// Update 타입
export type ProfileUpdate = UpdateTables<'profiles'>
export type BudgetUpdate = UpdateTables<'budgets'>
export type ExpenseUpdate = UpdateTables<'expenses'>
export type UserChallengeUpdate = UpdateTables<'user_challenges'>

// Enum 타입
export type HousingType = 'own' | 'jeonse' | 'monthly'
export type SubscriptionTier = 'free' | 'premium'
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard'

// 예산 배분 타입 (allocation JSONB)
export interface BudgetAllocation {
  [category: string]: number
}

// 확장 타입
export interface ProfileWithStats extends Profile {
  total_points: number
  active_challenges: number
}

export interface BudgetWithExpenses extends Budget {
  expenses: Expense[]
  total_expense: number
  expense_ratio: number
}

export interface ChallengeWithProgress extends Challenge {
  user_progress?: UserChallenge
}
