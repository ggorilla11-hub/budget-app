import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId, planType } = await req.json()
    
    // 토스 페이먼츠 결제 요청
    const orderId = `ORDER-${Date.now()}`
    const amount = planType === 'monthly' ? 9900 : 99000
    
    return NextResponse.json({
      success: true,
      data: {
        orderId,
        amount,
        orderName: planType === 'monthly' ? '버짓 프리미엄 (월간)' : '버짓 프리미엄 (연간)',
        customerName: '사용자'
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
