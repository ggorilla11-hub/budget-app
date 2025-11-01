"use client"
export function PricingCard() {
  const handleCheckout = async (planType: 'monthly' | 'yearly') => {
    // 토스 페이먼츠 SDK 호출
    const response = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planType })
    })
    
    const { data } = await response.json()
    // 결제 페이지로 리다이렉트
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* 월간 플랜 */}
      <div className="p-8 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
        <h3 className="text-2xl font-bold mb-2">월간 플랜</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold text-primary">₩9,900</span>
          <span className="text-textSecondary">/월</span>
        </div>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            <span>AI 일일 맞춤 코칭</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            <span>동년배 소비 비교</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            <span>무제한 리포트</span>
          </li>
        </ul>
        <button
          onClick={() => handleCheckout('monthly')}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
        >
          시작하기
        </button>
      </div>

      {/* 연간 플랜 */}
      <div className="p-8 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl shadow-xl relative">
        <div className="absolute -top-3 -right-3 bg-accent px-4 py-1 rounded-full text-sm font-bold">
          17% 할인
        </div>
        <h3 className="text-2xl font-bold mb-2">연간 플랜</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold">₩99,000</span>
          <span className="opacity-90">/년</span>
          <p className="text-sm mt-1 opacity-90">월 ₩8,250</p>
        </div>
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>월간 플랜 모든 기능</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>재무설계사 상담 (연 4회)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>오프라인 강의 30% 할인</span>
          </li>
        </ul>
        <button
          onClick={() => handleCheckout('yearly')}
          className="w-full py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100"
        >
          지금 절약하기
        </button>
      </div>
    </div>
  )
}
