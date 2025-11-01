# 🤖 AI 예산 코칭 시스템 가이드

OpenAI GPT-4 기반의 맞춤형 재무 조언 시스템입니다.

---

## 🎯 주요 기능

### 1️⃣ AI 예산 배분 생성
소득, 가족 수, 주거 형태를 고려한 최적의 예산 배분을 자동으로 제안합니다.

### 2️⃣ 주간 소비 코칭
이번 주 지출을 분석하고 구체적이고 실행 가능한 조언을 제공합니다.

### 3️⃣ 감정 기반 소비 분석
감정 태그를 활용해 충동 구매 패턴을 파악합니다.

### 4️⃣ 월간 재무 리포트
한 달 간의 소비를 분석하고 다음 달 목표를 제시합니다.

---

## 📦 설치 및 설정

### 1. OpenAI API 키 발급

1. https://platform.openai.com 접속
2. 계정 생성 및 로그인
3. API Keys 메뉴에서 새 키 생성
4. 결제 정보 등록 (GPT-4는 유료)

### 2. 환경변수 설정

`.env.local` 파일에 추가:
```env
OPENAI_API_KEY=sk-proj-your_api_key_here
```

### 3. 패키지 확인

`openai` 패키지가 이미 설치되어 있습니다:
```bash
npm list openai
```

---

## 🔧 API 엔드포인트

### 1. 예산 배분 생성

**Endpoint**: `POST /api/budget/generate`

**Request Body**:
```json
{
  "income": 3000000,
  "familySize": 2,
  "housingType": "jeonse"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "allocation": {
      "생활비": 1000000,
      "저축투자": 750000,
      "노후연금": 450000,
      "보장성보험": 300000,
      "주거비": 300000,
      "여유자금": 200000
    },
    "advice": "저축률 25%로 안정적인 재무 구조예요! 👍"
  }
}
```

**사용 예제**:
```typescript
const response = await fetch('/api/budget/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    income: 3000000,
    familySize: 2,
    housingType: 'jeonse'
  })
})

const { data } = await response.json()
console.log(data.allocation) // 예산 배분
console.log(data.advice)     // AI 조언
```

---

### 2. 주간 소비 코칭

**Endpoint**: `POST /api/coaching`

**Request Body**:
```json
{
  "expenses": [
    { "category": "식비", "amount": 85000, "date": "2024-11-25" },
    { "category": "쇼핑", "amount": 120000, "date": "2024-11-27" }
  ],
  "budget": {
    "식비": 400000,
    "쇼핑": 200000
  },
  "lastWeekSpending": 310000
}
```

**Response**:
```json
{
  "success": true,
  "message": "이번 주 식비가 예산의 78%예요. 👍 평균보다 잘하고 계세요! 주말에 외식 대신 집밥 도전하면 목표 저축액 달성 가능해요. 💪"
}
```

---

### 3. 감정 기반 소비 분석

**Endpoint**: `POST /api/analysis/emotion`

**Request Body**:
```json
{
  "recentExpenses": [
    { 
      "category": "쇼핑", 
      "amount": 150000, 
      "emotion": "스트레스", 
      "date": "2024-11-20" 
    },
    { 
      "category": "식비", 
      "amount": 50000, 
      "emotion": "기쁨", 
      "date": "2024-11-22" 
    }
  ],
  "monthlyIncome": 3000000
}
```

**Response**:
```json
{
  "success": true,
  "message": "스트레스 소비가 이번 달 지출의 35%를 차지하고 있어요. 😰 감정 소비를 줄이기 위해 대안 활동(산책, 운동)을 추천드려요. 지출 전 '정말 필요한가?' 5초만 생각해보세요! 💡"
}
```

---

### 4. 월간 재무 리포트

**Endpoint**: `POST /api/report/monthly`

**Request Body**:
```json
{
  "totalIncome": 3000000,
  "totalExpense": 2400000,
  "categoryBreakdown": {
    "식비": 800000,
    "주거비": 600000,
    "교통비": 300000
  },
  "savingsRate": 20,
  "comparedToLastMonth": -5
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": "이번 달 저축률 20%를 달성했어요! 🎉",
    "highlights": [
      "지난달 대비 지출 5% 감소",
      "식비를 효과적으로 관리했어요"
    ],
    "improvements": [
      "교통비를 10% 줄여보세요",
      "정기 구독 서비스를 점검해보세요"
    ],
    "nextMonthGoal": "저축률 25% 달성에 도전해보세요!"
  }
}
```

---

## 🎨 컴포넌트

### BudgetGenerator

AI 예산 배분을 생성하는 폼 컴포넌트입니다.

**사용 예제**:
```tsx
import { BudgetGenerator } from '@/components/BudgetGenerator'

<BudgetGenerator />
```

**특징**:
- ✅ 소득, 가족 수, 주거 형태 입력
- ✅ AI 예산 배분 자동 생성
- ✅ 로딩 상태 표시
- ✅ 에러 핸들링
- ✅ 애니메이션 효과

---

### AICoach

주간 소비를 분석하고 코칭을 제공하는 컴포넌트입니다.

**Props**:
```typescript
interface AICoachProps {
  expenses: Array<{ 
    category: string
    amount: number
    date: string 
  }>
  budget: Record<string, number>
  lastWeekSpending: number
}
```

**사용 예제**:
```tsx
import { AICoach } from '@/components/AICoach'

<AICoach
  expenses={[
    { category: '식비', amount: 85000, date: '2024-11-25' },
  ]}
  budget={{ 식비: 400000 }}
  lastWeekSpending={310000}
/>
```

---

## 💡 GPT-4 프롬프트 전략

### 1. 시스템 프롬프트
```
당신은 친근하고 전문적인 AI 재정 코치입니다. 
Noom 스타일의 따뜻한 톤으로 조언합니다.
```

**특징**:
- 친근하고 긍정적인 톤
- 구체적이고 실행 가능한 조언
- 이모지 적절히 사용
- 2-3문장으로 간결하게

### 2. JSON 응답 강제
```typescript
response_format: { type: 'json_object' }
```

구조화된 데이터를 안정적으로 받을 수 있습니다.

### 3. Temperature 설정
```typescript
temperature: 0.7
```

창의성과 일관성의 균형을 맞춥니다.

---

## 📊 비용 최적화

### GPT-4 요금
- **GPT-4-turbo**: $10 / 1M tokens (input), $30 / 1M tokens (output)
- **GPT-4o**: $2.50 / 1M tokens (input), $10 / 1M tokens (output)

### 비용 절감 팁
1. **캐싱 활용**: 동일한 요청은 캐시에서 반환
2. **토큰 수 제한**: `max_tokens` 설정
3. **배치 처리**: 여러 요청을 하나로 통합
4. **GPT-4o 사용**: GPT-4-turbo보다 저렴

### 예상 비용 (GPT-4o 기준)
- 예산 배분 생성: ~500 tokens → $0.005
- 주간 코칭: ~300 tokens → $0.003
- 감정 분석: ~350 tokens → $0.0035
- 월간 리포트: ~600 tokens → $0.006

**월 1000명 사용 시**: 약 $17 (~25,000원)

---

## 🔒 보안 고려사항

### 1. API 키 보호
```typescript
// ✅ 올바른 방법 (서버 사이드)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // 환경변수 사용
})

// ❌ 잘못된 방법 (클라이언트 노출)
const apiKey = 'sk-proj-...' // 하드코딩 금지!
```

### 2. Rate Limiting
API 남용 방지를 위한 요청 제한:
```typescript
// 사용자당 1시간에 10회 제한
const rateLimit = 10
const timeWindow = 3600000 // 1시간
```

### 3. 입력 검증
```typescript
if (!body.income || body.income <= 0) {
  return NextResponse.json(
    { error: '유효하지 않은 입력' },
    { status: 400 }
  )
}
```

---

## 🧪 테스트

### 데모 페이지 접속
```bash
npm run dev
```
http://localhost:3000/demo-ai

### API 테스트 (curl)
```bash
# 예산 생성
curl -X POST http://localhost:3000/api/budget/generate \
  -H "Content-Type: application/json" \
  -d '{"income":3000000,"familySize":2,"housingType":"jeonse"}'

# 코칭
curl -X POST http://localhost:3000/api/coaching \
  -H "Content-Type: application/json" \
  -d '{"expenses":[{"category":"식비","amount":85000,"date":"2024-11-25"}],"budget":{"식비":400000},"lastWeekSpending":310000}'
```

---

## 🐛 트러블슈팅

### 문제 1: API 키 오류
```
Error: The api_key client option must be set
```
**해결**: `.env.local`에 `OPENAI_API_KEY` 설정 확인

### 문제 2: Rate Limit 초과
```
Error: Rate limit exceeded
```
**해결**: OpenAI 대시보드에서 요금제 업그레이드

### 문제 3: JSON 파싱 오류
```
Error: Unexpected token in JSON
```
**해결**: `response_format: { type: 'json_object' }` 확인

### 문제 4: Timeout
```
Error: Request timed out
```
**해결**: 네트워크 확인 또는 재시도 로직 추가

---

## 📚 참고 자료

- [OpenAI API 문서](https://platform.openai.com/docs)
- [GPT-4 가이드](https://platform.openai.com/docs/guides/gpt)
- [프롬프트 엔지니어링](https://platform.openai.com/docs/guides/prompt-engineering)
- [요금 정보](https://openai.com/pricing)

---

## ✅ 체크리스트

AI 코칭 시스템 사용 전 확인:

- [ ] OpenAI API 키 발급 완료
- [ ] `.env.local`에 API 키 설정
- [ ] 결제 정보 등록 (GPT-4 사용)
- [ ] API 엔드포인트 테스트
- [ ] 에러 핸들링 확인
- [ ] 비용 모니터링 설정

---

**시스템 버전**: 1.0.0  
**마지막 업데이트**: 2025-10-31  
**Phase**: 3-1 완료
