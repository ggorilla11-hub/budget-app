import { BudgetGauge } from '@/components/BudgetGauge'
import { CircularGauge } from '@/components/CircularGauge'

export default function DemoGaugePage() {
  // 샘플 데이터
  const budgetData = [
    { category: '식비', budget: 500000, spent: 420000, color: '#00C2A8' },
    { category: '교통비', budget: 200000, spent: 180000, color: '#00A896' },
    { category: '문화생활', budget: 300000, spent: 350000, color: '#51CF66' },
    { category: '쇼핑', budget: 150000, spent: 95000, color: '#FFD93D' },
  ]

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-textPrimary mb-3">
            예산 게이지 컴포넌트
          </h1>
          <p className="text-textSecondary text-lg">
            Framer Motion 기반 애니메이션 예산 달성률 시각화
          </p>
        </div>

        {/* 수평 게이지 (BudgetGauge) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-textPrimary mb-6">
            수평 진행 바 게이지
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetData.map((data) => (
              <BudgetGauge
                key={data.category}
                category={data.category}
                budget={data.budget}
                spent={data.spent}
                color={data.color}
              />
            ))}
          </div>
        </section>

        {/* 원형 게이지 (CircularGauge) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-textPrimary mb-6">
            원형 게이지 (3가지 크기)
          </h2>
          
          {/* 큰 사이즈 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-textSecondary mb-4">Large</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {budgetData.map((data) => (
                <CircularGauge
                  key={data.category}
                  category={data.category}
                  budget={data.budget}
                  spent={data.spent}
                  color={data.color}
                  size="lg"
                />
              ))}
            </div>
          </div>

          {/* 중간 사이즈 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-textSecondary mb-4">Medium (기본값)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {budgetData.map((data) => (
                <CircularGauge
                  key={data.category}
                  category={data.category}
                  budget={data.budget}
                  spent={data.spent}
                  color={data.color}
                  size="md"
                />
              ))}
            </div>
          </div>

          {/* 작은 사이즈 */}
          <div>
            <h3 className="text-lg font-semibold text-textSecondary mb-4">Small</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {budgetData.map((data) => (
                <CircularGauge
                  key={data.category}
                  category={data.category}
                  budget={data.budget}
                  spent={data.spent}
                  color={data.color}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </section>

        {/* 특징 설명 */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-textPrimary mb-6">
            컴포넌트 특징
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">
                수평 진행 바 (BudgetGauge)
              </h3>
              <ul className="space-y-2 text-textSecondary">
                <li>✅ 직관적인 수평 진행 바</li>
                <li>✅ 예산 초과 시 색상 변경</li>
                <li>✅ 부드러운 애니메이션</li>
                <li>✅ 초과율 자동 계산</li>
                <li>✅ 호버 효과</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-3">
                원형 게이지 (CircularGauge)
              </h3>
              <ul className="space-y-2 text-textSecondary">
                <li>✅ 시각적으로 돋보이는 원형 디자인</li>
                <li>✅ 3가지 크기 옵션 (sm, md, lg)</li>
                <li>✅ 잔액 표시 (상승/하락 아이콘)</li>
                <li>✅ 예산 초과 경고 배지</li>
                <li>✅ SVG 기반 부드러운 애니메이션</li>
              </ul>
            </div>
          </div>

          {/* 사용 예제 */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-textPrimary mb-3">
              사용 예제
            </h3>
            <pre className="text-sm text-textSecondary overflow-x-auto">
{`import { BudgetGauge } from '@/components/BudgetGauge'
import { CircularGauge } from '@/components/CircularGauge'

<BudgetGauge
  category="식비"
  budget={500000}
  spent={420000}
  color="#00C2A8"
/>

<CircularGauge
  category="교통비"
  budget={200000}
  spent={180000}
  color="#00A896"
  size="lg"
/>`}
            </pre>
          </div>
        </section>
      </div>
    </main>
  )
}
