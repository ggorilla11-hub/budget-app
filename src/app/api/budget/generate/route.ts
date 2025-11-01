import { NextResponse } from 'next/server'
import { generateBudgetPlan } from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // 입력 유효성 검사
    if (!body.income || !body.familySize || !body.housingType) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      )
    }

    const plan = await generateBudgetPlan(body)
    
    return NextResponse.json({ success: true, data: plan })
  } catch (error) {
    console.error('AI 예산 생성 오류:', error)
    return NextResponse.json(
      { success: false, error: 'AI 예산 생성 실패' },
      { status: 500 }
    )
  }
}
