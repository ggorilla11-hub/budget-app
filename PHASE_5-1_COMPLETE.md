# ✅ Phase 5-1 완료: 메인 대시보드 (Main Dashboard)

**완료 날짜**: 2025-10-31  
**단계**: Phase 5-1 - 대시보드 통합  
**상태**: ✅ 완료

---

## 📋 구현 완료 항목

### 1. 메인 대시보드 페이지 (`src/app/(dashboard)/page.tsx`)
- ✅ 예산 현황 실시간 조회 (Supabase 연동)
- ✅ 카테고리별 지출 합산 로직
- ✅ 예산 게이지 그리드 레이아웃
- ✅ 최근 지출 내역 (최대 10건)
- ✅ 지출 입력 폼 토글 (플로팅 버튼)
- ✅ AI 코치 카드 통합
- ✅ 로딩 상태 처리
- ✅ 반응형 디자인

### 2. AI 코치 카드 컴포넌트 (`src/components/AICoachCard.tsx`)
- ✅ 예산 사용률 기반 자동 메시지 생성
- ✅ 4단계 코칭 메시지 (0-50%, 50-80%, 80-100%, 100%+)
- ✅ OpenAI API 연동 ("자세히 보기" 버튼)
- ✅ Framer Motion 애니메이션
- ✅ 최근 7일 지출 통계 표시

---

## 🎨 대시보드 레이아웃

### 전체 구조
```
┌─────────────────────────────────────────────────────────┐
│  대시보드                           [+] (플로팅 버튼)     │
│  2025년 10월                                             │
├─────────────────────────────────────────────────────────┤
│  🤖 AI 코치의 한마디                     [자세히 보기]   │
│  훌륭해요! 예산의 45%만 사용하셨네요...                  │
│  최근 7일간 5건의 지출을 기록하셨어요.                   │
├─────────────────────────────────────────────────────────┤
│  [지출 입력 폼 - 토글 시 표시]                          │
├─────────────────────────────────────────────────────────┤
│  예산 현황                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                │
│  │ 생활비  │  │ 저축투자│  │ 노후연금│                │
│  │  75%    │  │  45%    │  │  30%    │                │
│  └─────────┘  └─────────┘  └─────────┘                │
├─────────────────────────────────────────────────────────┤
│  최근 지출                                               │
│  식비        점심 외식                        15,000원  │
│  교통        버스 카드 충전                   50,000원  │
│  쇼핑        운동화                          120,000원  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 기술적 구현

### 1. 데이터 로딩 (`fetchData`)
```typescript
async function fetchData() {
  // 1. 현재 로그인 사용자 확인
  const { data: { user } } = await supabase.auth.getUser()
  
  // 2. 이번 달 예산 조회
  const currentMonth = new Date().toISOString().slice(0, 7) // "2025-10"
  const { data: budgetData } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)
    .eq('month', currentMonth)
    .single()
  
  // 3. 지출 내역 조회
  const { data: expensesData } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .eq('budget_id', budgetData.id)
  
  // 4. 카테고리별 지출 합산
  const spentByCategory: Record<string, number> = {}
  expensesData?.forEach(expense => {
    spentByCategory[expense.category] = 
      (spentByCategory[expense.category] || 0) + expense.amount
  })
  
  // 5. 게이지 데이터 변환
  const gauges = Object.entries(allocation).map(([category, budget]) => ({
    category,
    budget: budget as number,
    spent: spentByCategory[category] || 0,
    color: getCategoryColor(category)
  }))
}
```

### 2. 카테고리 색상 매핑
```typescript
function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    '생활비': '#FF6B6B',      // 빨강
    '저축투자': '#00C2A8',    // 청록
    '노후연금': '#4ECDC4',    // 밝은 청록
    '보장성보험': '#95E1D3',  // 연두
    '주거비': '#F38181'       // 분홍
  }
  return colors[category] || '#A8D8EA'  // 기본값
}
```

### 3. AI 코치 메시지 생성 (자동)
```typescript
function generateCoachingMessage() {
  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const percentage = (totalSpent / totalBudget) * 100

  if (percentage < 50) {
    return '🎉 훌륭해요! 예산의 45%만 사용...'
  } else if (percentage < 80) {
    return '💪 잘하고 계세요! 예산의 67%를 사용 중...'
  } else if (percentage < 100) {
    return '⚠️ 주의가 필요해요. 예산의 89%를 사용...'
  } else {
    return '🚨 예산을 105% 초과했어요...'
  }
}
```

### 4. OpenAI 코칭 요청 (선택)
```typescript
async function getAICoaching() {
  const response = await fetch('/api/coaching', {
    method: 'POST',
    body: JSON.stringify({
      weeklyExpenses: expenses.slice(0, 7).map(e => ({
        category: e.category,
        amount: e.amount,
        date: e.expense_date
      })),
      budgetLimits: budgets.reduce((acc, b) => {
        acc[b.category] = b.budget
        return acc
      }, {})
    })
  })
  
  const data = await response.json()
  setMessage(`🤖 ${data.message}`)
}
```

---

## 🎨 UI 컴포넌트

### 1. 헤더 (Header)
```tsx
<header className="flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold">대시보드</h1>
    <p className="text-textSecondary">2025년 10월</p>
  </div>
  <button
    onClick={() => setShowExpenseForm(!showExpenseForm)}
    className="p-4 bg-primary text-white rounded-full shadow-lg"
  >
    <span className="text-2xl">+</span>
  </button>
</header>
```

**플로팅 버튼**:
- 원형 (rounded-full)
- Primary 색상 배경
- "+" 아이콘
- 탭 시 지출 입력 폼 토글

### 2. AI 코치 카드 (AICoachCard)
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6"
>
  <h3>AI 코치의 한마디</h3>
  <p>{message}</p>
  <button onClick={getAICoaching}>자세히 보기</button>
</motion.div>
```

**특징**:
- 그라데이션 배경
- 페이드인 애니메이션 (Framer Motion)
- 실시간 메시지 업데이트
- OpenAI 연동 버튼

### 3. 예산 게이지 그리드
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {budgets.map(gauge => (
    <BudgetGauge key={gauge.category} {...gauge} />
  ))}
</div>
```

**반응형**:
- 모바일: 1열
- 태블릿: 2열
- 데스크톱: 3열

### 4. 최근 지출 목록
```tsx
<ul className="divide-y divide-gray-100">
  {expenses.slice(0, 10).map(expense => (
    <li key={expense.id} className="py-4 flex justify-between">
      <div>
        <p className="font-semibold">{expense.category}</p>
        <p className="text-sm text-textSecondary">{expense.note}</p>
      </div>
      <p className="text-lg font-bold">
        {expense.amount.toLocaleString()}원
      </p>
    </li>
  ))}
</ul>
```

**빈 상태**:
```tsx
{expenses.length === 0 && (
  <p className="text-center py-8">
    아직 지출 기록이 없어요. 첫 기록을 시작해보세요! 💪
  </p>
)}
```

---

## 🔄 사용 흐름

### 초기 로딩
1. 페이지 마운트 → `fetchData()` 실행
2. Supabase에서 이번 달 예산 조회
3. 지출 내역 조회 및 합산
4. 게이지 데이터 생성
5. AI 코치 메시지 자동 생성
6. 화면 렌더링

### 지출 추가
1. 우측 상단 "+" 버튼 탭
2. `ExpenseForm` 토글 표시
3. 사용자가 지출 기록
4. `onSuccess` 콜백 실행:
   - 폼 닫기 (`setShowExpenseForm(false)`)
   - 데이터 재조회 (`fetchData()`)
5. 대시보드 자동 업데이트

### AI 코칭 요청
1. "자세히 보기" 버튼 탭
2. 로딩 상태 표시 ("분석 중...")
3. `/api/coaching` POST 요청
4. OpenAI 응답 받아서 메시지 업데이트
5. "🤖 [AI 메시지]" 표시

---

## 📊 데이터 흐름

```
Supabase
  ↓
budgets 테이블 (이번 달)
  ↓
expenses 테이블 (예산 ID 매칭)
  ↓
카테고리별 지출 합산
  ↓
게이지 데이터 변환
  ↓
BudgetGauge 컴포넌트
```

```
expenses 배열
  ↓
AICoachCard 컴포넌트
  ↓
자동 메시지 생성 (사용률 기반)
  ↓
"자세히 보기" 클릭 시
  ↓
OpenAI API 호출
  ↓
상세 코칭 메시지 표시
```

---

## 🎯 주요 기능

### 1. 실시간 예산 현황
- 카테고리별 예산 vs 지출
- 사용률 게이지 (0-100%+)
- 초과 시 빨간색 경고

### 2. AI 코치 자동 분석
| 사용률 | 메시지 | 이모지 |
|--------|--------|--------|
| 0-50% | "훌륭해요! 예산의 X%만 사용..." | 🎉 |
| 50-80% | "잘하고 계세요! 예산의 X%를 사용 중..." | 💪 |
| 80-100% | "주의가 필요해요. 예산의 X%를 사용..." | ⚠️ |
| 100%+ | "예산을 X% 초과했어요..." | 🚨 |

### 3. 빠른 지출 입력
- 플로팅 버튼 (우측 상단 "+")
- 토글 방식 (클릭 → 폼 표시/숨김)
- 저장 완료 → 자동 닫기 + 데이터 갱신

### 4. 최근 지출 내역
- 최대 10건 표시
- 카테고리 + 메모 + 금액
- 빈 상태 메시지

---

## 📱 반응형 디자인

### 모바일 (< 768px)
- 예산 게이지: 1열 (세로 스크롤)
- 지출 목록: 전체 너비
- 플로팅 버튼: 우측 하단 고정

### 태블릿 (768px - 1024px)
- 예산 게이지: 2열
- AI 코치 카드: 전체 너비

### 데스크톱 (> 1024px)
- 예산 게이지: 3열
- 최대 너비: 1280px (max-w-7xl)

---

## 🚀 다음 단계 권장 (Phase 5-2)

Phase 5-1 완료 후 추천 작업:

### Option 1: 상세 통계 페이지
```tsx
// app/stats/page.tsx
- 월간 지출 추이 그래프
- 카테고리별 원형 차트
- 주간/월간/연간 필터
```

### Option 2: 알림 시스템
```tsx
// components/NotificationBanner.tsx
- 예산 80% 경고 알림
- 저축 목표 달성 축하
- AI 코치 주간 리포트 알림
```

### Option 3: 목표 설정 기능
```tsx
// app/goals/page.tsx
- 저축 목표 설정
- 진행률 트래커
- 마일스톤 달성 배지
```

---

## 🧪 테스트 체크리스트

- [ ] 초기 로딩 → 스피너 표시
- [ ] 예산 데이터 없을 시 → 빈 상태 메시지
- [ ] 게이지 그리드 → 반응형 레이아웃
- [ ] 플로팅 버튼 → 폼 토글
- [ ] 지출 저장 → 자동 갱신
- [ ] AI 코치 → 자동 메시지 생성
- [ ] "자세히 보기" → OpenAI 요청
- [ ] 최근 지출 → 최대 10건 표시
- [ ] 빈 지출 목록 → 안내 메시지

---

## 📁 파일 구조

```
budget-app/
├── src/
│   ├── app/
│   │   └── (dashboard)/
│   │       └── page.tsx                 ✅ 메인 대시보드 (5.0 KB)
│   └── components/
│       ├── AICoachCard.tsx              ✅ AI 코치 카드 (2.8 KB)
│       ├── BudgetGauge.tsx              ⚪ 기존 (Phase 2-2)
│       └── ExpenseForm.tsx              ⚪ 기존 (Phase 4-1)
└── PHASE_5-1_COMPLETE.md                ✅ 완료 문서 (이 파일)
```

---

## 🎉 완료 요약

Phase 5-1에서 **통합 메인 대시보드**를 성공적으로 구현했습니다.

**핵심 성과**:
- ✅ 예산 현황 실시간 조회 (Supabase 연동)
- ✅ AI 코치 자동 분석 (4단계 메시지)
- ✅ 빠른 지출 입력 (플로팅 버튼 + 토글)
- ✅ 최근 지출 내역 (최대 10건)
- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)
- ✅ Framer Motion 애니메이션

**통합 컴포넌트**:
- BudgetGauge (Phase 2-2)
- ExpenseForm (Phase 4-1)
- AICoachCard (신규)

**다음 작업**: Phase 5-2 (상세 통계/알림/목표) 또는 전체 테스트

---

**생성일**: 2025-10-31  
**작성자**: AI Assistant  
**프로젝트**: 버짓(Budget) - Next.js 14 예산관리 웹앱
