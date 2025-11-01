import { AICoach } from '@/components/AICoach'
import { BudgetGenerator } from '@/components/BudgetGenerator'

export default function DemoAIPage() {
  // 샘플 데이터
  const sampleExpenses = [
    { category: '식비', amount: 85000, date: '2024-11-25' },
    { category: '교통비', amount: 45000, date: '2024-11-26' },
    { category: '쇼핑', amount: 120000, date: '2024-11-27' },
    { category: '문화생활', amount: 60000, date: '2024-11-28' },
  ]

  const sampleBudget = {
    식비: 400000,
    교통비: 150000,
    쇼핑: 200000,
    문화생활: 150000,
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-textPrimary mb-3">
            AI 예산 코칭 시스템 🤖
          </h1>
          <p className="text-textSecondary text-lg">
            OpenAI GPT-4 기반 맞춤형 재무 조언
          </p>
        </div>

        {/* 컨텐츠 */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI 예산 생성기 */}
          <div>
            <BudgetGenerator />
          </div>

          {/* AI 코치 */}
          <div>
            <AICoach
              expenses={sampleExpenses}
              budget={sampleBudget}
              lastWeekSpending={310000}
            />
          </div>
        </div>

        {/* 기능 설명 */}
        <section className="mt-16 grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="🎯 맞춤형 예산 배분"
            description="소득, 가족 수, 주거 형태를 고려한 최적의 예산 배분을 AI가 자동으로 제안합니다."
          />
          <FeatureCard
            title="💬 주간 소비 코칭"
            description="이번 주 지출을 분석하고 구체적이고 실행 가능한 조언을 Noom 스타일로 제공합니다."
          />
          <FeatureCard
            title="📊 감정 기반 분석"
            description="감정 태그를 활용해 충동 구매 패턴을 파악하고 건강한 소비 습관을 만듭니다."
          />
        </section>

        {/* API 엔드포인트 */}
        <section className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-textPrimary mb-6">
            API 엔드포인트
          </h2>
          <div className="space-y-4">
            <APIEndpoint
              method="POST"
              path="/api/budget/generate"
              description="AI 예산 배분 생성"
            />
            <APIEndpoint
              method="POST"
              path="/api/coaching"
              description="주간 소비 코칭"
            />
            <APIEndpoint
              method="POST"
              path="/api/analysis/emotion"
              description="감정 기반 소비 분석"
            />
            <APIEndpoint
              method="POST"
              path="/api/report/monthly"
              description="월간 재무 리포트"
            />
          </div>
        </section>

        {/* 주의사항 */}
        <section className="mt-8 p-6 bg-warning/10 rounded-lg border border-warning/30">
          <h3 className="text-lg font-semibold text-textPrimary mb-2">
            ⚠️ 주의사항
          </h3>
          <ul className="space-y-2 text-textSecondary">
            <li>• OpenAI API 키가 .env.local에 설정되어 있어야 합니다</li>
            <li>• GPT-4 API는 유료이며, 사용량에 따라 과금됩니다</li>
            <li>• 데모 페이지는 샘플 데이터를 사용합니다</li>
            <li>• 실제 서비스에서는 사용자 인증이 필요합니다</li>
          </ul>
        </section>
      </div>
    </main>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-textPrimary mb-3">{title}</h3>
      <p className="text-textSecondary leading-relaxed">{description}</p>
    </div>
  )
}

function APIEndpoint({ method, path, description }: { 
  method: string
  path: string
  description: string 
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <span className="px-3 py-1 bg-primary text-white text-sm font-bold rounded">
        {method}
      </span>
      <div className="flex-1">
        <code className="text-sm text-textPrimary font-mono">{path}</code>
        <p className="text-xs text-textSecondary mt-1">{description}</p>
      </div>
    </div>
  )
}
