# ✅ Phase 6-1 완료: 포인트 & 뱃지 시스템

**완료 날짜**: 2025-10-31  
**단계**: Phase 6-1 - 게이미피케이션 시스템  
**상태**: ✅ 완료

---

## 📋 구현 완료 항목

### 1. PointsDisplay 컴포넌트 (`src/components/PointsDisplay.tsx`)
- ✅ 누적 포인트 실시간 조회
- ✅ 레벨 시스템 (1000P당 레벨업)
- ✅ 다음 레벨까지 진행바
- ✅ 그라데이션 디자인 (primary → secondary)
- ✅ Supabase points 테이블 연동

### 2. 뱃지 시스템 (`src/lib/badges.ts`)
- ✅ 10가지 뱃지 정의
- ✅ 조건 기반 자동 수여 로직
- ✅ 포인트 보상 시스템
- ✅ 사용자 데이터 수집 및 분석
- ✅ 뱃지 획득 히스토리

---

## 🎮 포인트 시스템

### 포인트 적립 규칙
| 활동 | 포인트 | 설명 |
|------|--------|------|
| 지출 기록 | +10P | 매 지출 기록마다 |
| AI 코칭 이용 | +20P | AI 조언 요청 시 |
| 뱃지 획득 | +100~5000P | 뱃지 종류별 차등 |
| 예산 달성 | +50P | 일간 예산 준수 시 |
| 저축 목표 달성 | +100P | 월간 저축 목표 달성 |

### 레벨 시스템
```typescript
레벨 계산: Math.floor(totalPoints / 1000) + 1

레벨 1: 0 ~ 999P
레벨 2: 1,000 ~ 1,999P
레벨 3: 2,000 ~ 2,999P
레벨 4: 3,000 ~ 3,999P
레벨 5: 4,000 ~ 4,999P
...
```

**레벨업 혜택** (예정):
- 레벨 5: AI 코칭 우선 응답
- 레벨 10: 프리미엄 리포트 무료
- 레벨 20: 전문가 상담 무료 쿠폰

---

## 🏆 뱃지 시스템

### 10가지 뱃지

#### 1. 🎯 첫 걸음
- **조건**: 첫 지출 기록 완료
- **포인트**: +100P
- **설명**: 예산 관리 여정의 시작

#### 2. 🔥 꾸준함
- **조건**: 3일 연속 지출 기록
- **포인트**: +200P
- **설명**: 기록의 힘을 깨닫다

#### 3. 🛡️ 예산 지킴이
- **조건**: 1주 연속 예산 달성
- **포인트**: +500P
- **설명**: 일주일의 완벽한 예산 관리

#### 4. 💎 예산 마스터
- **조건**: 1개월 연속 예산 달성
- **포인트**: +2000P
- **설명**: 한 달 동안의 완벽한 예산 통제

#### 5. 👑 절약왕
- **조건**: 월 목표 저축액 달성
- **포인트**: +1000P
- **설명**: 저축 목표 100% 달성

#### 6. 🏆 저축 전문가
- **조건**: 3개월 연속 저축 목표 달성
- **포인트**: +3000P
- **설명**: 꾸준한 저축의 달인

#### 7. 🤖 AI 친구
- **조건**: AI 코칭 10회 이용
- **포인트**: +300P
- **설명**: AI 코치와 함께하는 재무 관리

#### 8. 💰 포인트 수집가
- **조건**: 누적 포인트 5,000P 달성
- **포인트**: +500P
- **설명**: 포인트 마니아

#### 9. ⭐ 레벨 달인
- **조건**: 레벨 5 달성
- **포인트**: +1000P
- **설명**: 높은 레벨에 도달한 마스터

#### 10. 🌟 완벽한 한 달
- **조건**: 모든 카테고리 예산 달성
- **포인트**: +5000P
- **설명**: 완벽한 예산 관리의 정점

---

## 🎨 PointsDisplay UI

### 레이아웃
```
┌─────────────────────────────────────┐
│  내 포인트              레벨         │
│  2,450P                Lv.3         │
├─────────────────────────────────────┤
│  다음 레벨까지          550P 남음   │
│  [████████░░░░░░░░]  45%           │
└─────────────────────────────────────┘
```

### 디자인 특징
```tsx
<div className="bg-gradient-to-r from-primary to-secondary 
     p-6 rounded-2xl text-white">
  {/* 포인트 & 레벨 */}
  <div className="flex justify-between">
    <div>
      <p className="text-sm opacity-90">내 포인트</p>
      <p className="text-3xl font-bold">2,450P</p>
    </div>
    <div className="text-right">
      <p className="text-sm opacity-90">레벨</p>
      <p className="text-3xl font-bold">Lv.3</p>
    </div>
  </div>
  
  {/* 진행바 */}
  <div className="h-2 bg-white/30 rounded-full">
    <div className="h-full bg-white rounded-full" 
         style={{ width: '45%' }} />
  </div>
</div>
```

**색상**:
- 배경: primary → secondary 그라데이션
- 텍스트: 흰색
- 진행바 배경: white/30 (반투명)
- 진행바 전경: white (불투명)

---

## 🔧 기술적 구현

### 1. 포인트 조회 (`PointsDisplay.tsx`)
```typescript
async function fetchPoints() {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data } = await supabase
    .from('points')
    .select('amount')
    .eq('user_id', user.id)

  const total = data?.reduce((sum, p) => sum + p.amount, 0) || 0
  setTotalPoints(total)
  setLevel(Math.floor(total / 1000) + 1)
}
```

### 2. 뱃지 정의 (`badges.ts`)
```typescript
export const BADGES: Record<string, Badge> = {
  FIRST_EXPENSE: {
    id: 'first_expense',
    name: '첫 걸음',
    icon: '🎯',
    description: '첫 지출 기록 완료',
    points: 100,
    condition: (userData) => userData.expenseCount >= 1
  },
  // ... 9개 더
}
```

### 3. 뱃지 수여 로직
```typescript
export async function checkAndAwardBadges(userId: string) {
  // 1. 사용자 데이터 수집
  const userData = await collectUserData(userId)
  
  // 2. 이미 획득한 뱃지 조회
  const { data: earnedBadges } = await supabase
    .from('badges')
    .select('badge_id')
    .eq('user_id', userId)
  
  // 3. 조건 충족하는 미획득 뱃지 찾기
  for (const badge of Object.values(BADGES)) {
    if (!earnedBadgeIds.has(badge.id) && badge.condition(userData)) {
      await awardBadge(userId, badge)
    }
  }
}
```

### 4. 사용자 데이터 수집
```typescript
async function collectUserData(userId: string): Promise<UserData> {
  return {
    expenseCount: 지출 기록 수,
    consecutiveDays: 연속 기록 일수,
    budgetKeepDays: 예산 준수 일수,
    monthlyAchievement: 월간 달성률(%),
    savingStreak: 저축 연속 달성 월수,
    aiCoachCount: AI 코칭 이용 횟수,
    totalPoints: 누적 포인트,
    level: 현재 레벨,
    perfectCategories: 완벽한 예산 달성 여부
  }
}
```

### 5. 뱃지 수여 및 포인트 적립
```typescript
async function awardBadge(userId: string, badge: Badge) {
  // 1. 뱃지 테이블에 기록
  await supabase.from('badges').insert({
    user_id: userId,
    badge_id: badge.id,
    earned_at: new Date().toISOString()
  })
  
  // 2. 포인트 적립
  await supabase.from('points').insert({
    user_id: userId,
    amount: badge.points,
    reason: `뱃지 획득: ${badge.name}`
  })
}
```

---

## 📊 데이터베이스 스키마 (필요)

### points 테이블 (기존)
```sql
CREATE TABLE points (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### badges 테이블 (신규 필요)
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_badges_user ON badges(user_id);
```

---

## 🔄 사용 흐름

### 포인트 적립
```
사용자 활동 (지출 기록, AI 코칭 등)
    ↓
points 테이블 INSERT
    ↓
checkAndAwardBadges(userId) 호출
    ↓
사용자 데이터 수집 및 분석
    ↓
조건 충족 뱃지 발견 시
    ↓
badges 테이블 INSERT + 포인트 추가 적립
    ↓
PointsDisplay 자동 갱신
```

### 뱃지 획득 알림 (예정)
```
뱃지 수여 완료
    ↓
알림 팝업 표시
  "🎉 새로운 뱃지 획득!"
  "🎯 첫 걸음 (+100P)"
    ↓
뱃지 상세 페이지로 이동 가능
```

---

## 🎯 사용 예시

### 대시보드에 포인트 표시
```tsx
// app/(dashboard)/page.tsx
import { PointsDisplay } from '@/components/PointsDisplay'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 포인트 카드 */}
      <PointsDisplay />
      
      {/* 나머지 대시보드 내용 */}
      <AICoachCard />
      <BudgetGauge />
    </div>
  )
}
```

### 지출 기록 후 뱃지 체크
```tsx
// components/ExpenseForm.tsx
import { checkAndAwardBadges } from '@/lib/badges'

async function handleSubmit() {
  // 지출 저장
  await supabase.from('expenses').insert(...)
  
  // 포인트 적립
  await supabase.from('points').insert({
    user_id: user.id,
    amount: 10,
    reason: '지출 기록'
  })
  
  // 뱃지 체크 (비동기)
  checkAndAwardBadges(user.id)
  
  onSuccess()
}
```

---

## 🚀 다음 단계 권장 (Phase 6-2)

Phase 6-1 완료 후 추천 작업:

### Option 1: 뱃지 갤러리 페이지
```tsx
// app/badges/page.tsx
- 획득한 뱃지 표시 (잠금 해제)
- 미획득 뱃지 표시 (잠금)
- 진행률 표시 (예: 3일 중 2일 달성)
- 뱃지 상세 정보 모달
```

### Option 2: 리더보드
```tsx
// app/leaderboard/page.tsx
- 포인트 순위 (주간/월간/전체)
- 레벨 순위
- 뱃지 수집 순위
- 친구 비교 기능
```

### Option 3: 알림 시스템
```tsx
// components/BadgeNotification.tsx
- 뱃지 획득 시 팝업
- 레벨업 축하 애니메이션
- 포인트 적립 토스트
```

---

## 🧪 테스트 체크리스트

- [x] PointsDisplay 컴포넌트 생성
- [x] badges.ts 라이브러리 생성
- [x] 10가지 뱃지 정의
- [x] 포인트 조회 로직
- [x] 레벨 계산 로직
- [x] 진행바 UI
- [x] 뱃지 조건 함수
- [x] 사용자 데이터 수집
- [ ] badges 테이블 생성 (Supabase)
- [ ] 뱃지 수여 테스트
- [ ] 포인트 적립 검증
- [ ] 레벨업 확인

---

## 📁 파일 구조

```
budget-app/
├── src/
│   ├── components/
│   │   └── PointsDisplay.tsx           ✅ 포인트 & 레벨 카드
│   └── lib/
│       └── badges.ts                   ✅ 뱃지 시스템 로직
└── PHASE_6-1_COMPLETE.md               ✅ 완료 문서 (이 파일)
```

---

## 🎉 완료 요약

Phase 6-1에서 **게이미피케이션 시스템**을 성공적으로 구현했습니다.

**핵심 성과**:
- ✅ 포인트 시스템 (실시간 조회, 레벨 계산)
- ✅ 10가지 뱃지 정의 (조건 기반 자동 수여)
- ✅ 진행바 UI (다음 레벨까지)
- ✅ 그라데이션 디자인 (Noom 스타일)
- ✅ Supabase 연동 (points 테이블)

**사용자 동기부여 메커니즘**:
- 포인트: 즉각적인 보상
- 레벨: 장기적인 목표
- 뱃지: 성취감 및 수집 욕구
- 진행바: 명확한 진행 상황

**다음 작업**: Phase 6-2 (뱃지 갤러리/리더보드/알림)

---

**생성일**: 2025-10-31  
**작성자**: AI Assistant  
**프로젝트**: 버짓(Budget) - Next.js 14 예산관리 웹앱
