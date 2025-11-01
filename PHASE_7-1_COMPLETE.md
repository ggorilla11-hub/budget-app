# ✅ Phase 7-1 완료: 토스 페이먼츠 연동

**완료 날짜**: 2025-10-31  
**단계**: Phase 7-1 - 결제 시스템 구축  
**상태**: ✅ 완료

---

## 📋 구현 완료 항목

### 1. 결제 API (`src/app/api/payments/checkout/route.ts`)
- ✅ POST /api/payments/checkout 엔드포인트
- ✅ 주문 ID 자동 생성 (`ORDER-{timestamp}`)
- ✅ 플랜별 금액 설정 (월간 9,900원, 연간 99,000원)
- ✅ 주문 정보 반환 (orderId, amount, orderName, customerName)

### 2. 가격 카드 컴포넌트 (`src/components/PricingCard.tsx`)
- ✅ 2단 그리드 레이아웃 (월간/연간 플랜)
- ✅ 월간 플랜: 9,900원/월
- ✅ 연간 플랜: 99,000원/년 (월 8,250원, 17% 할인)
- ✅ 기능 목록 표시 (체크마크 포함)
- ✅ 결제 버튼 (handleCheckout 트리거)
- ✅ 할인 뱃지 (연간 플랜)

---

## 💳 결제 시스템

### 결제 플랜

#### 월간 플랜 (₩9,900/월)
**포함 기능**:
- ✓ AI 일일 맞춤 코칭
- ✓ 동년배 소비 비교
- ✓ 무제한 리포트

**특징**:
- 부담 없는 시작
- 언제든 해지 가능
- 첫 달 무료 체험 (예정)

#### 연간 플랜 (₩99,000/년)
**포함 기능**:
- ✓ 월간 플랜 모든 기능
- ✓ 재무설계사 상담 (연 4회)
- ✓ 오프라인 강의 30% 할인

**특징**:
- **17% 할인** (월 8,250원)
- 연간 20,000원 절약
- 전문가 상담 포함

---

## 🎨 PricingCard UI

### 레이아웃
```
┌──────────────┬──────────────┐
│  월간 플랜   │  연간 플랜   │
│              │  [17% 할인]  │
│  ₩9,900/월   │  ₩99,000/년  │
│              │  (월 ₩8,250) │
│  ✓ 기능1     │  ✓ 기능1     │
│  ✓ 기능2     │  ✓ 기능2     │
│  ✓ 기능3     │  ✓ 기능3     │
│  [시작하기]  │[지금 절약]   │
└──────────────┴──────────────┘
```

### 디자인 특징

#### 월간 플랜 (왼쪽)
```tsx
<div className="p-8 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
  {/* 흰색 배경, 회색 테두리 */}
  <button className="bg-primary text-white">시작하기</button>
</div>
```

#### 연간 플랜 (오른쪽) - 추천 강조
```tsx
<div className="p-8 bg-gradient-to-br from-primary to-secondary text-white">
  {/* 그라데이션 배경 */}
  <div className="absolute -top-3 -right-3 bg-accent">
    17% 할인
  </div>
  <button className="bg-white text-primary">지금 절약하기</button>
</div>
```

---

## 🔧 기술적 구현

### 1. 결제 요청 API (`route.ts`)
```typescript
export async function POST(req: Request) {
  const { userId, planType } = await req.json()
  
  // 주문 ID 생성 (타임스탬프 기반)
  const orderId = `ORDER-${Date.now()}`
  
  // 플랜별 금액 설정
  const amount = planType === 'monthly' ? 9900 : 99000
  
  // 주문명 생성
  const orderName = planType === 'monthly' 
    ? '버짓 프리미엄 (월간)' 
    : '버짓 프리미엄 (연간)'
  
  return NextResponse.json({
    success: true,
    data: {
      orderId,        // ORDER-1698765432123
      amount,         // 9900 or 99000
      orderName,      // 버짓 프리미엄 (월간/연간)
      customerName    // 사용자 (실제로는 user.name)
    }
  })
}
```

### 2. 결제 버튼 핸들러 (`PricingCard.tsx`)
```typescript
const handleCheckout = async (planType: 'monthly' | 'yearly') => {
  // 1. 결제 정보 생성 요청
  const response = await fetch('/api/payments/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planType })
  })
  
  const { data } = await response.json()
  
  // 2. 토스 페이먼츠 결제창으로 리다이렉트 (예정)
  // window.location.href = `https://toss.me/...?orderId=${data.orderId}`
}
```

---

## 💰 가격 정책

### 월간 플랜
- **가격**: ₩9,900/월
- **연환산**: ₩118,800/년
- **타겟**: 단기 체험 사용자

### 연간 플랜
- **가격**: ₩99,000/년
- **월환산**: ₩8,250/월
- **할인율**: 17% (₩19,800 절약)
- **타겟**: 장기 사용자

### 가격 비교
| 항목 | 월간 플랜 (12개월) | 연간 플랜 | 절약액 |
|------|-------------------|-----------|--------|
| 총액 | ₩118,800 | ₩99,000 | ₩19,800 |
| 월평균 | ₩9,900 | ₩8,250 | ₩1,650 |
| 할인 | - | 17% | - |

---

## 🔄 결제 흐름 (Phase 7-2에서 완성 예정)

### 현재 구현 (Phase 7-1)
```
사용자 "시작하기" 클릭
    ↓
handleCheckout(planType)
    ↓
POST /api/payments/checkout
    ↓
주문 정보 생성 및 반환
    ↓
(리다이렉트 예정)
```

### 완전한 흐름 (Phase 7-2 목표)
```
사용자 "시작하기" 클릭
    ↓
handleCheckout(planType)
    ↓
POST /api/payments/checkout
    ↓
주문 정보 생성
    ↓
토스 페이먼츠 SDK 호출
    ↓
결제창 표시
    ↓
사용자 결제 진행
    ↓
결제 성공/실패
    ↓
웹훅으로 결제 확인
    ↓
Supabase subscriptions 테이블 업데이트
    ↓
프리미엄 기능 활성화
```

---

## 🎯 사용 시나리오

### 시나리오 1: 월간 플랜 가입
1. 사용자가 `/pricing` 페이지 접속
2. "월간 플랜" 카드에서 "시작하기" 클릭
3. `/api/payments/checkout` 호출 (planType: 'monthly')
4. 주문 정보 생성 (₩9,900)
5. 토스 페이먼츠 결제창으로 리다이렉트 (Phase 7-2)
6. 결제 완료 후 프리미엄 활성화

### 시나리오 2: 연간 플랜 가입 (할인)
1. 사용자가 "17% 할인" 뱃지 확인
2. "연간 플랜" 카드에서 "지금 절약하기" 클릭
3. `/api/payments/checkout` 호출 (planType: 'yearly')
4. 주문 정보 생성 (₩99,000)
5. 할인 금액 표시 (₩19,800 절약)
6. 결제 완료 후 재무설계사 상담권 발급

---

## 📱 반응형 디자인

### 데스크톱 (≥768px)
```css
.grid {
  grid-cols: 2;  /* 2단 나란히 배치 */
  gap: 6;        /* 간격 1.5rem */
}
```

### 모바일 (<768px)
```css
.grid {
  grid-cols: 1;  /* 1단 세로 배치 */
  gap: 6;
}
```

---

## 🚀 다음 단계 권장 (Phase 7-2)

Phase 7-1 완료 후 필수 작업:

### 1. 토스 페이먼츠 SDK 통합
```tsx
// lib/tossPayments.ts
import { loadTossPayments } from '@tosspayments/payment-sdk'

export async function requestPayment(orderData: any) {
  const tossPayments = await loadTossPayments(clientKey)
  
  await tossPayments.requestPayment('카드', {
    amount: orderData.amount,
    orderId: orderData.orderId,
    orderName: orderData.orderName,
    customerName: orderData.customerName,
    successUrl: `${window.location.origin}/payments/success`,
    failUrl: `${window.location.origin}/payments/fail`
  })
}
```

### 2. 결제 성공/실패 페이지
```tsx
// app/payments/success/page.tsx
- 결제 완료 메시지
- 영수증 표시
- 프리미엄 기능 안내

// app/payments/fail/page.tsx
- 결제 실패 이유
- 재시도 버튼
- 고객센터 연락처
```

### 3. 웹훅 엔드포인트
```tsx
// app/api/payments/webhook/route.ts
- 토스 페이먼츠 웹훅 수신
- 결제 검증
- Supabase subscriptions 업데이트
- 사용자 구독 상태 활성화
```

### 4. 구독 관리 페이지
```tsx
// app/subscription/page.tsx
- 현재 플랜 표시
- 결제 내역
- 플랜 변경/해지
- 영수증 다운로드
```

---

## 🔐 보안 고려사항 (Phase 7-2)

### 1. 결제 검증
- 서버 측 금액 검증 (프론트엔드 조작 방지)
- 주문 ID 중복 체크
- 사용자 인증 확인

### 2. 토스 페이먼츠 시크릿 키
```env
# .env.local
TOSS_PAYMENTS_CLIENT_KEY=test_ck_...
TOSS_PAYMENTS_SECRET_KEY=test_sk_...  # 서버 전용
```

### 3. 웹훅 서명 검증
```typescript
// 토스 페이먼츠 웹훅 요청 검증
const signature = req.headers.get('toss-signature')
const isValid = verifySignature(signature, requestBody, secretKey)
```

---

## 🗄️ 데이터베이스 스키마 (Phase 7-2 필요)

### subscriptions 테이블
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  plan_type TEXT NOT NULL,  -- 'monthly' | 'yearly'
  status TEXT NOT NULL,     -- 'active' | 'canceled' | 'expired'
  amount INT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  toss_order_id TEXT UNIQUE,
  toss_payment_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### payment_logs 테이블
```sql
CREATE TABLE payment_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  order_id TEXT NOT NULL,
  payment_key TEXT,
  amount INT NOT NULL,
  status TEXT NOT NULL,  -- 'pending' | 'success' | 'failed'
  method TEXT,           -- '카드' | '계좌이체' | '가상계좌'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🧪 테스트 체크리스트

- [x] `/api/payments/checkout` 엔드포인트 생성
- [x] PricingCard 컴포넌트 생성
- [x] 월간 플랜 UI (₩9,900)
- [x] 연간 플랜 UI (₩99,000, 17% 할인)
- [x] handleCheckout 함수
- [x] 주문 ID 생성 로직
- [x] 플랜별 금액 설정
- [x] 반응형 그리드 레이아웃
- [x] 할인 뱃지 표시
- [ ] 토스 페이먼츠 SDK 연동 (Phase 7-2)
- [ ] 결제 성공/실패 처리 (Phase 7-2)
- [ ] 웹훅 구현 (Phase 7-2)
- [ ] 구독 상태 관리 (Phase 7-2)

---

## 📁 파일 구조

```
budget-app/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── payments/
│   │           └── checkout/
│   │               └── route.ts        ✅ 결제 API (644 bytes)
│   └── components/
│       └── PricingCard.tsx             ✅ 가격 카드 (3.0 KB)
└── PHASE_7-1_COMPLETE.md               ✅ 완료 문서 (이 파일)
```

---

## 🎉 완료 요약

Phase 7-1에서 **토스 페이먼츠 기반 결제 시스템**의 기초를 성공적으로 구축했습니다.

**핵심 성과**:
- ✅ 결제 요청 API 엔드포인트
- ✅ 2단 가격 플랜 UI (월간/연간)
- ✅ 할인 강조 디자인 (17% 할인 뱃지)
- ✅ 결제 흐름 기반 구조
- ✅ 반응형 레이아웃

**가격 정책**:
- 월간: ₩9,900/월
- 연간: ₩99,000/년 (17% 할인, 월 ₩8,250)

**다음 작업**: Phase 7-2 (토스 SDK 연동, 웹훅, 구독 관리)

---

**생성일**: 2025-10-31  
**작성자**: AI Assistant  
**프로젝트**: 버짓(Budget) - Next.js 14 예산관리 웹앱  
**결제 파트너**: 토스 페이먼츠 (오원트밸런스 법인)
