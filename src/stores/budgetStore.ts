import { create } from 'zustand'
import { Transaction, Budget, Goal } from '@/types'

interface BudgetState {
  transactions: Transaction[]
  budgets: Budget[]
  goals: Goal[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  setBudgets: (budgets: Budget[]) => void
  setGoals: (goals: Goal[]) => void
}

export const useBudgetStore = create<BudgetState>((set) => ({
  transactions: [],
  budgets: [],
  goals: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
  setBudgets: (budgets) => set({ budgets }),
  setGoals: (goals) => set({ goals }),
}))
