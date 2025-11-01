import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateBudgetPlan(userData: {
  income: number
  familySize: number
  housingType: string
  existingExpenses?: Record<string, number>
}) {
  const prompt = `
당신은 "버짓(Budget)"의 AI 재정 코치입니다. 
사용자의 정보를 바탕으로 최적의 예산 배분을 제안하세요.

[사용자 정보]
- 월 소득: ${userData.income.toLocaleString()}원
- 가족 수: ${userData.familySize}명
- 주거 형태: ${userData.housingType}

[예산 배분 기준]
- 생활비: 소득의 30-40% (가족 수에 비례)
- 저축/투자: 소득의 20-30%
- 노후 연금: 소득의 10-15%
- 보장성 보험: 소득의 5-10%
- 주거비: 전세/월세는 30% 이하, 자가는 10% 이하

[출력 형식]
JSON 형태로 다음 구조를 반환하세요:
{
  "allocation": {
    "생활비": 금액(숫자),
    "저축투자": 금액(숫자),
    "노후연금": 금액(숫자),
    "보장성보험": 금액(숫자),
    "주거비": 금액(숫자),
    "여유자금": 금액(숫자)
  },
  "advice": "한 줄 조언 (따뜻하고 격려하는 톤)"
}
  `

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: '당신은 친근하고 전문적인 AI 재정 코치입니다. Noom 스타일의 따뜻한 톤으로 조언합니다.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

export async function generateCoaching(userData: {
  expenses: Array<{ category: string; amount: number; date: string }>
  budget: Record<string, number>
  lastWeekSpending: number
}) {
  const prompt = `
당신은 "버짓"의 AI 코치입니다. 사용자의 이번 주 소비를 분석하고 피드백하세요.

[이번 주 지출]
${userData.expenses.map(e => `- ${e.category}: ${e.amount.toLocaleString()}원`).join('\n')}

[예산]
${Object.entries(userData.budget).map(([k, v]) => `- ${k}: ${v.toLocaleString()}원`).join('\n')}

[피드백 요구사항]
1. 2-3문장으로 간결하게
2. 구체적인 카테고리/금액 언급
3. 실행 가능한 조언 1가지
4. 긍정적이고 격려하는 톤
5. 이모지 적절히 사용

예시: "이번 주 식비가 예산의 78%예요. 👍 평균보다 잘하고 계세요! 주말에 외식 대신 집밥 도전하면 목표 저축액 달성 가능해요. 💪"
  `

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Noom 스타일 AI 코치' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 200
  })

  return response.choices[0].message.content
}

export async function analyzeDailyCycle(userData: {
  recentExpenses: Array<{ category: string; amount: number; emotion: string; date: string }>
  monthlyIncome: number
}) {
  const emotionExpenses = userData.recentExpenses.filter(e => e.emotion)
  const emotionStats = emotionExpenses.reduce((acc, e) => {
    acc[e.emotion] = (acc[e.emotion] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  const prompt = `
당신은 감정 기반 소비 패턴을 분석하는 AI 코치입니다.

[최근 감정별 지출]
${Object.entries(emotionStats).map(([emotion, amount]) => 
  `- ${emotion}: ${amount.toLocaleString()}원`
).join('\n')}

[월 소득]
${userData.monthlyIncome.toLocaleString()}원

[분석 요구사항]
1. 감정 소비 패턴 파악
2. 위험 신호가 있다면 언급
3. 구체적인 대안 제시
4. 3-4문장, 이모지 사용

예시: "스트레스 소비가 이번 달 지출의 35%를 차지하고 있어요. 😰 감정 소비를 줄이기 위해 대안 활동(산책, 운동)을 추천드려요. 지출 전 '정말 필요한가?' 5초만 생각해보세요! 💡"
  `

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Noom 스타일 감정 코치' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 250
  })

  return response.choices[0].message.content
}

export async function generateMonthlyReport(userData: {
  totalIncome: number
  totalExpense: number
  categoryBreakdown: Record<string, number>
  savingsRate: number
  comparedToLastMonth: number
}) {
  const prompt = `
당신은 월간 재무 리포트를 작성하는 AI 코치입니다.

[이번 달 요약]
- 총 수입: ${userData.totalIncome.toLocaleString()}원
- 총 지출: ${userData.totalExpense.toLocaleString()}원
- 저축률: ${userData.savingsRate.toFixed(1)}%
- 지난달 대비: ${userData.comparedToLastMonth > 0 ? '+' : ''}${userData.comparedToLastMonth.toFixed(1)}%

[카테고리별 지출]
${Object.entries(userData.categoryBreakdown)
  .sort((a, b) => b[1] - a[1])
  .map(([cat, amt]) => `- ${cat}: ${amt.toLocaleString()}원`)
  .join('\n')}

[리포트 요구사항]
JSON 형태로 반환:
{
  "summary": "한 줄 총평 (긍정적인 톤)",
  "highlights": ["잘한 점 1", "잘한 점 2"],
  "improvements": ["개선 제안 1", "개선 제안 2"],
  "nextMonthGoal": "다음 달 목표 제안"
}
  `

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Noom 스타일 재무 분석가' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}
