"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AICoachCardProps {
  expenses: any[]
  budgets: any[]
}

export function AICoachCard({ expenses, budgets }: AICoachCardProps) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generateCoachingMessage()
  }, [expenses, budgets])

  function generateCoachingMessage() {
    if (budgets.length === 0) {
      setMessage('예산을 설정하면 AI 코치가 도움을 드릴게요! 💪')
      return
    }

    const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0)
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
    const percentage = (totalSpent / totalBudget) * 100

    let msg = ''
    let emoji = ''

    if (percentage < 50) {
      emoji = '🎉'
      msg = `훌륭해요! 예산의 ${percentage.toFixed(0)}%만 사용하셨네요. 이대로 유지하시면 목표 달성할 수 있어요!`
    } else if (percentage < 80) {
      emoji = '💪'
      msg = `잘하고 계세요! 예산의 ${percentage.toFixed(0)}%를 사용 중이에요. 남은 기간 동안 계획적인 소비를 이어가보세요.`
    } else if (percentage < 100) {
      emoji = '⚠️'
      msg = `주의가 필요해요. 예산의 ${percentage.toFixed(0)}%를 사용했어요. 필수 지출만 유지해보는 건 어떨까요?`
    } else {
      emoji = '🚨'
      msg = `예산을 ${percentage.toFixed(0)}% 초과했어요. 함께 다음 달 계획을 세워볼까요?`
    }

    setMessage(`${emoji} ${msg}`)
  }

  async function getAICoaching() {
    setLoading(true)
    try {
      const response = await fetch('/api/coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weeklyExpenses: expenses.slice(0, 7).map(e => ({
            category: e.category,
            amount: e.amount,
            date: e.expense_date
          })),
          budgetLimits: budgets.reduce((acc, b) => {
            acc[b.category] = b.budget
            return acc
          }, {} as Record<string, number>)
        })
      })

      const data = await response.json()
      if (data.message) {
        setMessage(`🤖 ${data.message}`)
      }
    } catch (error) {
      console.error('AI 코칭 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-textPrimary mb-2">
            AI 코치의 한마디
          </h3>
          <p className="text-textPrimary leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={getAICoaching}
          disabled={loading}
          className="px-4 py-2 bg-white text-primary rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? '분석 중...' : '자세히 보기'}
        </button>
      </div>

      {expenses.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-textSecondary">
            최근 7일간 {expenses.slice(0, 7).length}건의 지출을 기록하셨어요.
          </p>
        </div>
      )}
    </motion.div>
  )
}
