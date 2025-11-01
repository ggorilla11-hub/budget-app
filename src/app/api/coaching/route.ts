import { NextResponse } from 'next/server'
import { generateCoaching } from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // 입력 유효성 검사
    if (!body.expenses || !body.budget) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      )
    }

    const coaching = await generateCoaching(body)
    
    return NextResponse.json({ success: true, message: coaching })
  } catch (error) {
    console.error('AI 코칭 생성 오류:', error)
    return NextResponse.json(
      { success: false, error: 'AI 코칭 생성 실패' },
      { status: 500 }
    )
  }
}
