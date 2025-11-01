"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function PointsDisplay() {
  const [totalPoints, setTotalPoints] = useState(0)
  const [level, setLevel] = useState(1)

  useEffect(() => {
    fetchPoints()
  }, [])

  async function fetchPoints() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('points')
      .select('amount')
      .eq('user_id', user.id)

    const total = data?.reduce((sum, p) => sum + p.amount, 0) || 0
    setTotalPoints(total)
    setLevel(Math.floor(total / 1000) + 1)
  }

  return (
    <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl text-white">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90">내 포인트</p>
          <p className="text-3xl font-bold">{totalPoints.toLocaleString()}P</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">레벨</p>
          <p className="text-3xl font-bold">Lv.{level}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span>다음 레벨까지</span>
          <span>{1000 - (totalPoints % 1000)}P 남음</span>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all"
            style={{ width: \`\${(totalPoints % 1000) / 10}%\` }}
          />
        </div>
      </div>
    </div>
  )
}
