"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AICoachProps {
  expenses: Array<{ category: string; amount: number; date: string }>
  budget: Record<string, number>
  lastWeekSpending: number
}

export function AICoach({ expenses, budget, lastWeekSpending }: AICoachProps) {
  const [coaching, setCoaching] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCoaching = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses, budget, lastWeekSpending }),
      })

      const data = await response.json()

      if (data.success) {
        setCoaching(data.message)
      } else {
        setError(data.error || 'AI 코칭을 받아올 수 없습니다')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={24} />
            <CardTitle>AI 재무 코치</CardTitle>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={fetchCoaching}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                분석 중...
              </>
            ) : (
              '코칭 받기'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-accent/10 text-accent rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {coaching && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-6 bg-white rounded-lg shadow-soft"
            >
              <p className="text-textPrimary leading-relaxed whitespace-pre-line">
                {coaching}
              </p>
            </motion.div>
          )}

          {!coaching && !isLoading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-textSecondary"
            >
              <Sparkles className="mx-auto mb-3 text-primary/30" size={48} />
              <p>AI 코치에게 이번 주 소비를 분석받아보세요!</p>
              <p className="text-sm mt-2">맞춤형 재무 조언을 제공합니다.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
