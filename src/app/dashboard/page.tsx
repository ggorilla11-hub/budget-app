"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { BudgetGauge } from '@/components/BudgetGauge'
import { ExpenseForm } from '@/components/ExpenseForm'
import { AICoachCard } from '@/components/AICoachCard'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const router = useRouter()
  const [budgets, setBudgets] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
    fetchData()
  }

  async function fetchData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 이번 달 예산 가져오기
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
      const { data: budgetData } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .single()

      if (budgetData) {
        // 지출 합계 계산
        const { data: expensesData } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .eq('budget_id', budgetData.id)

        // 카테고리별 지출 합산
        const allocation = budgetData.allocation
        const spentByCategory: Record<string, number> = {}
        
        expensesData?.forEach(expense => {
          spentByCategory[expense.category] = 
            (spentByCategory[expense.category] || 0) + expense.amount
        })

        // 게이지용 데이터 변환
        const gauges = Object.entries(allocation).map(([category, budget]) => ({
          category,
          budget: budget as number,
          spent: spentByCategory[category] || 0,
          color: getCategoryColor(category)
        }))

        setBudgets(gauges)
        setExpenses(expensesData || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function getCategoryColor(category: string) {
    const colors: Record<string, string> = {
      '생활비': '#FF6B6B',
      '저축투자': '#00C2A8',
      '노후연금': '#4ECDC4',
      '보장성보험': '#95E1D3',
      '주거비': '#F38181'
    }
    return colors[category] || '#A8D8EA'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-textSecondary">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* 헤더 */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">대시보드</h1>
          <p className="text-textSecondary mt-1">
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </p>
          {user && (
            <p className="text-sm text-textSecondary mt-1">
              {user.email}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
          >
            로그아웃
          </Button>
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="p-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all"
          >
            <span className="text-2xl">+</span>
          </button>
        </div>
      </header>

      {/* AI 코치 카드 */}
      <AICoachCard expenses={expenses} budgets={budgets} />

      {/* 지출 입력 폼 (토글) */}
      {showExpenseForm && (
        <ExpenseForm onSuccess={() => {
          setShowExpenseForm(false)
          fetchData()
        }} />
      )}

      {/* 예산 게이지 */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-textPrimary">
          예산 현황
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(gauge => (
            <BudgetGauge key={gauge.category} {...gauge} />
          ))}
        </div>
      </section>

      {/* 최근 지출 */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-textPrimary">
          최근 지출
        </h2>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {expenses.length === 0 ? (
            <p className="text-center text-textSecondary py-8">
              아직 지출 기록이 없어요. 첫 기록을 시작해보세요! 💪
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {expenses.slice(0, 10).map(expense => (
                <li key={expense.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-textPrimary">{expense.category}</p>
                    {expense.note && (
                      <p className="text-sm text-textSecondary">{expense.note}</p>
                    )}
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {expense.amount.toLocaleString()}원
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
