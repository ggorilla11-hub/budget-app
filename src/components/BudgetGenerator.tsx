"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BudgetPlan {
  allocation: Record<string, number>
  advice: string
}

export function BudgetGenerator() {
  const [income, setIncome] = useState('')
  const [familySize, setFamilySize] = useState('1')
  const [housingType, setHousingType] = useState('own')
  const [plan, setPlan] = useState<BudgetPlan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePlan = async () => {
    if (!income || Number(income) <= 0) {
      setError('월 소득을 입력해주세요')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/budget/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          income: Number(income),
          familySize: Number(familySize),
          housingType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPlan(data.data)
      } else {
        setError(data.error || 'AI 예산 생성 실패')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary" size={24} />
          <CardTitle>AI 예산 배분</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 입력 폼 */}
        <div className="space-y-4">
          <Input
            label="월 소득 (원)"
            type="number"
            placeholder="3000000"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                가족 수
              </label>
              <select
                value={familySize}
                onChange={(e) => setFamilySize(e.target.value)}
                className="input"
              >
                <option value="1">1명</option>
                <option value="2">2명</option>
                <option value="3">3명</option>
                <option value="4">4명</option>
                <option value="5">5명 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                주거 형태
              </label>
              <select
                value={housingType}
                onChange={(e) => setHousingType(e.target.value)}
                className="input"
              >
                <option value="own">자가</option>
                <option value="jeonse">전세</option>
                <option value="monthly">월세</option>
              </select>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={generatePlan}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI 분석 중...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI 예산 생성하기
              </>
            )}
          </Button>
        </div>

        {/* 에러 메시지 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-accent/10 text-accent rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 생성된 예산 계획 */}
        <AnimatePresence>
          {plan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* AI 조언 */}
              <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium text-primary mb-1">AI 코치의 조언</p>
                <p className="text-textPrimary">{plan.advice}</p>
              </div>

              {/* 예산 배분 */}
              <div className="space-y-3">
                <h4 className="font-semibold text-textPrimary">추천 예산 배분</h4>
                {Object.entries(plan.allocation).map(([category, amount]) => (
                  <div
                    key={category}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-textPrimary font-medium">{category}</span>
                    <span className="text-primary font-bold">
                      {amount.toLocaleString()}원
                    </span>
                  </div>
                ))}

                {/* 총합 */}
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                  <span className="text-textPrimary font-bold">총 배분액</span>
                  <span className="text-primary font-bold text-lg">
                    {Object.values(plan.allocation)
                      .reduce((sum, val) => sum + val, 0)
                      .toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">
                  예산으로 저장
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setPlan(null)}>
                  다시 생성
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
