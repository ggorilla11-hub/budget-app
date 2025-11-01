import { NextResponse } from 'next/server'
import { analyzeDailyCycle } from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (!body.recentExpenses || !body.monthlyIncome) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      )
    }

    const analysis = await analyzeDailyCycle(body)
    
    return NextResponse.json({ success: true, message: analysis })
  } catch (error) {
    console.error('감정 분석 오류:', error)
    return NextResponse.json(
      { success: false, error: '감정 분석 실패' },
      { status: 500 }
    )
  }
}
