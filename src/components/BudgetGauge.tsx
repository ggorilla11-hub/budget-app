"use client"

import { motion } from 'framer-motion'

interface BudgetGaugeProps {
  category: string
  budget: number
  spent: number
  color: string
}

export function BudgetGauge({ category, budget, spent, color }: BudgetGaugeProps) {
  const percentage = Math.min((spent / budget) * 100, 100)
  const isOver = spent > budget
  const displayColor = isOver ? '#FF5A5F' : color

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-textPrimary">{category}</h3>
        <span className={`text-2xl font-bold ${isOver ? 'text-accent' : 'text-primary'}`}>
          {percentage.toFixed(0)}%
        </span>
      </div>
      
      {/* 진행 바 */}
      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
        <motion.div
          className="absolute h-full rounded-full"
          style={{ backgroundColor: displayColor }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      
      {/* 금액 정보 */}
      <div className="flex justify-between text-sm">
        <span className="text-textSecondary">
          사용: {spent.toLocaleString()}원
        </span>
        <span className="text-textSecondary">
          예산: {budget.toLocaleString()}원
        </span>
      </div>
      
      {isOver && (
        <motion.p 
          className="mt-3 text-sm text-accent font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ⚠️ 예산을 {((spent - budget) / budget * 100).toFixed(0)}% 초과했어요
        </motion.p>
      )}
    </div>
  )
}
