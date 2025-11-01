"use client"

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CircularGaugeProps {
  category: string
  budget: number
  spent: number
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CircularGauge({ 
  category, 
  budget, 
  spent, 
  color = '#00C2A8',
  size = 'md'
}: CircularGaugeProps) {
  const percentage = Math.min((spent / budget) * 100, 100)
  const isOver = spent > budget
  const displayColor = isOver ? '#FF5A5F' : color
  const remaining = budget - spent

  // 크기 설정
  const sizeConfig = {
    sm: { radius: 40, strokeWidth: 8, fontSize: 'text-sm' },
    md: { radius: 60, strokeWidth: 10, fontSize: 'text-base' },
    lg: { radius: 80, strokeWidth: 12, fontSize: 'text-lg' },
  }

  const config = sizeConfig[size]
  const circumference = 2 * Math.PI * config.radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* 원형 게이지 */}
      <div className="relative" style={{ width: config.radius * 2 + 40, height: config.radius * 2 + 40 }}>
        <svg
          width={config.radius * 2 + 40}
          height={config.radius * 2 + 40}
          className="transform -rotate-90"
        >
          {/* 배경 원 */}
          <circle
            cx={(config.radius * 2 + 40) / 2}
            cy={(config.radius * 2 + 40) / 2}
            r={config.radius}
            fill="none"
            stroke="#F1F3F5"
            strokeWidth={config.strokeWidth}
          />
          
          {/* 진행 원 */}
          <motion.circle
            cx={(config.radius * 2 + 40) / 2}
            cy={(config.radius * 2 + 40) / 2}
            r={config.radius}
            fill="none"
            stroke={displayColor}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>

        {/* 중앙 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={`font-bold ${isOver ? 'text-accent' : 'text-primary'}`}
            style={{ fontSize: config.radius / 2.5 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {percentage.toFixed(0)}%
          </motion.span>
          <span className="text-xs text-textSecondary mt-1">달성률</span>
        </div>
      </div>

      {/* 카테고리 정보 */}
      <div className="mt-4 text-center w-full">
        <h3 className={`font-semibold text-textPrimary mb-2 ${config.fontSize}`}>
          {category}
        </h3>

        {/* 금액 정보 */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="text-textSecondary">예산</span>
            <span className="font-medium text-textPrimary">
              {budget.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-textSecondary">사용</span>
            <span className={`font-medium ${isOver ? 'text-accent' : 'text-textPrimary'}`}>
              {spent.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
            <span className="text-textSecondary">잔액</span>
            <span className={`font-semibold flex items-center gap-1 ${
              remaining >= 0 ? 'text-success' : 'text-accent'
            }`}>
              {remaining >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {Math.abs(remaining).toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 초과 경고 */}
        {isOver && (
          <motion.div 
            className="mt-3 px-3 py-2 bg-accent/10 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-accent font-medium">
              ⚠️ 예산 초과: {((spent - budget) / budget * 100).toFixed(0)}%
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
