/**
 * Supabase 데이터베이스 타입 정의
 * 
 * 참고: Supabase CLI를 사용하면 자동 생성 가능
 * npx supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
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
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          age: number | null
          family_members: number
          monthly_income: number | null
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          age?: number | null
          family_members?: number
          monthly_income?: number | null
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          age?: number | null
          family_members?: number
          monthly_income?: number | null
          is_premium?: boolean
          created_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          month: string
          category: string
          allocated_amount: number
          spent_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          category: string
          allocated_amount: number
          spent_amount?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          category?: string
          allocated_amount?: number
          spent_amount?: number
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          emotion: string | null
          note: string | null
          transaction_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          emotion?: string | null
          note?: string | null
          transaction_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          emotion?: string | null
          note?: string | null
          transaction_date?: string
          created_at?: string
        }
      }
      user_points: {
        Row: {
          user_id: string
          total_points: number
          level: number
          badges: Json
          streak_days: number
          last_check_in: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          total_points?: number
          level?: number
          badges?: Json
          streak_days?: number
          last_check_in?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_points?: number
          level?: number
          badges?: Json
          streak_days?: number
          last_check_in?: string | null
          updated_at?: string
        }
      }
      ai_feedback: {
        Row: {
          id: string
          user_id: string
          message: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          type?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          type?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 헬퍼 타입
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// 테이블별 타입 익스포트
export type User = Tables<'users'>
export type Budget = Tables<'budgets'>
export type Expense = Tables<'expenses'>
export type UserPoints = Tables<'user_points'>
export type AIFeedback = Tables<'ai_feedback'>

// 카테고리 타입
export type ExpenseCategory = 
  | '식비'
  | '교통비'
  | '주거비'
  | '문화생활'
  | '쇼핑'
  | '의료비'
  | '교육비'
  | '기타'

// 감정 타입
export type EmotionType =
  | '기쁨'
  | '만족'
  | '후회'
  | '필요'
  | '충동'
  | '스트레스'
  | '중립'

// AI 피드백 타입
export type FeedbackType = 'advice' | 'warning' | 'praise' | 'tip'
