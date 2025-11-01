import { NextResponse } from 'next/server'
import { generateMonthlyReport } from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (!body.totalIncome || !body.totalExpense || !body.categoryBreakdown) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      )
    }

    const report = await generateMonthlyReport(body)
    
    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error('월간 리포트 생성 오류:', error)
    return NextResponse.json(
      { success: false, error: '월간 리포트 생성 실패' },
      { status: 500 }
    )
  }
}
