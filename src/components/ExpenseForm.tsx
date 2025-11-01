"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

const categories = [
  { name: '식비', icon: '🍱', color: '#FF6B6B' },
  { name: '교통', icon: '🚗', color: '#4ECDC4' },
  { name: '쇼핑', icon: '🛍️', color: '#95E1D3' },
  { name: '구독', icon: '🎧', color: '#F38181' },
  { name: '저축', icon: '💰', color: '#00C2A8' },
  { name: '대출', icon: '💳', color: '#AA96DA' },
  { name: '보험', icon: '🛡️', color: '#FCBAD3' },
  { name: '기타', icon: '🏖️', color: '#A8D8EA' }
]

export function ExpenseForm({ onSuccess }: { onSuccess: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory || !amount) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('로그인 필요')

      const { error } = await supabase.from('expenses').insert({
        user_id: user.id,
        category: selectedCategory,
        amount: parseInt(amount),
        note,
        expense_date: new Date().toISOString()
      })

      if (error) throw error

      // 성공
      setAmount('')
      setNote('')
      setSelectedCategory('')
      onSuccess()
      
      // 포인트 적립
      await supabase.from('points').insert({
        user_id: user.id,
        amount: 10,
        reason: '지출 기록'
      })

      alert('✅ 저장 완료! +10 포인트')
    } catch (error) {
      alert('❌ 저장 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-2xl shadow-sm">
      {/* 카테고리 선택 */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-textPrimary">
          카테고리
        </label>
        <div className="grid grid-cols-4 gap-3">
          {categories.map(cat => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedCategory === cat.name
                  ? 'ring-2 ring-primary bg-primary/10 scale-105'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="text-3xl mb-1">{cat.icon}</div>
              <div className="text-xs font-medium text-textPrimary">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 금액 입력 */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-textPrimary">
          금액
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 pr-12 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-textSecondary">
            원
          </span>
        </div>
      </div>

      {/* 메모 */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-textPrimary">
          메모 (선택)
        </label>
        <textarea
          placeholder="예: 점심 외식"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
          rows={2}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={!selectedCategory || !amount || loading}
        className="w-full py-4 text-lg"
      >
        {loading ? '저장 중...' : '예산에서 차감하기'}
      </Button>
    </form>
  )
}
