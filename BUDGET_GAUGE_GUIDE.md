# 📊 예산 게이지 컴포넌트 가이드

Framer Motion 기반의 애니메이션 예산 달성률 시각화 컴포넌트입니다.

---

## 🎯 컴포넌트 개요

2가지 스타일의 예산 게이지를 제공합니다:
1. **BudgetGauge** - 수평 진행 바 스타일
2. **CircularGauge** - 원형 게이지 스타일

---

## 📦 1. BudgetGauge (수평 진행 바)

### Props

| Prop | Type | Required | Default | 설명 |
|------|------|----------|---------|------|
| `category` | string | ✅ | - | 예산 카테고리 이름 |
| `budget` | number | ✅ | - | 예산 금액 |
| `spent` | number | ✅ | - | 지출 금액 |
| `color` | string | ✅ | - | 진행 바 색상 (Hex) |

### 사용 예제

```tsx
import { BudgetGauge } from '@/components/BudgetGauge'

<BudgetGauge
  category="식비"
  budget={500000}
  spent={420000}
  color="#00C2A8"
/>
```

### 특징

- ✅ **진행 바 애니메이션**: 0%에서 목표 퍼센트까지 0.8초 동안 부드럽게 애니메이션
- ✅ **예산 초과 감지**: 지출이 예산을 초과하면 자동으로 빨간색(#FF5A5F)으로 변경
- ✅ **초과율 표시**: 예산 초과 시 초과 비율을 백분율로 표시
- ✅ **호버 효과**: 마우스 호버 시 그림자 강화
- ✅ **반응형 디자인**: 모든 화면 크기에서 완벽하게 작동

### 스타일

- 배경: 흰색 (`bg-white`)
- 테두리: 회색 테두리 (`border-gray-100`)
- 그림자: 부드러운 그림자 (`shadow-sm`)
- 둥근 모서리: `rounded-2xl`

---

## 🎯 2. CircularGauge (원형 게이지)

### Props

| Prop | Type | Required | Default | 설명 |
|------|------|----------|---------|------|
| `category` | string | ✅ | - | 예산 카테고리 이름 |
| `budget` | number | ✅ | - | 예산 금액 |
| `spent` | number | ✅ | - | 지출 금액 |
| `color` | string | ❌ | `#00C2A8` | 게이지 색상 (Hex) |
| `size` | 'sm' \| 'md' \| 'lg' | ❌ | `md` | 게이지 크기 |

### 사용 예제

```tsx
import { CircularGauge } from '@/components/CircularGauge'

// 기본 크기
<CircularGauge
  category="교통비"
  budget={200000}
  spent={180000}
  color="#00A896"
/>

// 큰 크기
<CircularGauge
  category="문화생활"
  budget={300000}
  spent={250000}
  color="#51CF66"
  size="lg"
/>
```

### 크기 옵션

| Size | Radius | Stroke Width | 용도 |
|------|--------|--------------|------|
| `sm` | 40px | 8px | 작은 카드, 사이드바 |
| `md` | 60px | 10px | 기본 대시보드 |
| `lg` | 80px | 12px | 메인 섹션, 강조 |

### 특징

- ✅ **SVG 기반 원형 게이지**: 부드럽고 정확한 애니메이션
- ✅ **중앙 퍼센트 표시**: 달성률을 원 중앙에 크게 표시
- ✅ **잔액 계산**: 예산 잔액을 자동 계산하여 표시
- ✅ **상승/하락 아이콘**: Lucide React의 TrendingUp/Down 아이콘 사용
- ✅ **예산 초과 경고**: 초과 시 경고 배지 표시
- ✅ **3단계 애니메이션**:
  - 원형 게이지: 1초
  - 중앙 텍스트: 0.3초 (0.5초 지연)
  - 경고 배지: 0.3초 (0.5초 지연)

### 스타일

- 배경: 흰색 (`bg-white`)
- 테두리: 회색 테두리 (`border-gray-100`)
- 원형 배경: 연한 회색 (`#F1F3F5`)
- 진행 원: 사용자 지정 색상 또는 빨간색 (초과 시)

---

## 🎨 색상 가이드

### 권장 색상

```tsx
// Primary 카테고리
color="#00C2A8"  // 민트 그린

// Secondary 카테고리
color="#00A896"  // 에메랄드

// Success 카테고리
color="#51CF66"  // 딥 그린

// Warning 카테고리
color="#FFD93D"  // 옐로우
```

### 예산 초과 시 자동 색상

```tsx
// 자동으로 변경됨
color="#FF5A5F"  // 코랄 (Accent)
```

---

## 📐 레이아웃 예제

### 그리드 레이아웃

```tsx
// 2열 그리드 (모바일: 1열)
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <BudgetGauge ... />
  <BudgetGauge ... />
</div>

// 4열 그리드 (태블릿: 2열, 모바일: 1열)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <CircularGauge size="lg" ... />
  <CircularGauge size="lg" ... />
  <CircularGauge size="lg" ... />
  <CircularGauge size="lg" ... />
</div>
```

### 플렉스 레이아웃

```tsx
<div className="flex flex-wrap gap-4">
  <CircularGauge size="sm" ... />
  <CircularGauge size="sm" ... />
  <CircularGauge size="sm" ... />
</div>
```

---

## 🎬 애니메이션 타이밍

### BudgetGauge

- **진행 바**: 0.8초 (easeOut)
- **경고 메시지**: 0.3초 (0.3초 지연)

### CircularGauge

- **원형 게이지**: 1초 (easeOut)
- **중앙 퍼센트**: 0.3초 (0.5초 지연)
- **경고 배지**: 0.3초 (0.5초 지연)

---

## 💡 사용 팁

### 1. 카테고리별 색상 일관성

```tsx
const categoryColors = {
  식비: '#00C2A8',
  교통비: '#00A896',
  주거비: '#51CF66',
  문화생활: '#FFD93D',
  쇼핑: '#FF6B6B',
}

<BudgetGauge
  category="식비"
  color={categoryColors['식비']}
  ...
/>
```

### 2. 동적 데이터 매핑

```tsx
const budgetData = [
  { category: '식비', budget: 500000, spent: 420000 },
  { category: '교통비', budget: 200000, spent: 180000 },
]

{budgetData.map((data) => (
  <BudgetGauge
    key={data.category}
    category={data.category}
    budget={data.budget}
    spent={data.spent}
    color={categoryColors[data.category]}
  />
))}
```

### 3. 크기별 사용 시나리오

```tsx
// 대시보드 메인: lg
<CircularGauge size="lg" ... />

// 사이드바 위젯: md (기본값)
<CircularGauge ... />

// 모바일 리스트: sm
<CircularGauge size="sm" ... />
```

---

## 🔧 커스터마이징

### 색상 변경

```tsx
// tailwind.config.ts에 커스텀 색상 추가
colors: {
  customPrimary: '#1E88E5',
}

// 컴포넌트에서 사용
<BudgetGauge color="#1E88E5" ... />
```

### 크기 조정 (CircularGauge)

`CircularGauge.tsx` 파일에서 `sizeConfig` 수정:

```tsx
const sizeConfig = {
  xs: { radius: 30, strokeWidth: 6, fontSize: 'text-xs' },  // 추가
  sm: { radius: 40, strokeWidth: 8, fontSize: 'text-sm' },
  md: { radius: 60, strokeWidth: 10, fontSize: 'text-base' },
  lg: { radius: 80, strokeWidth: 12, fontSize: 'text-lg' },
  xl: { radius: 100, strokeWidth: 14, fontSize: 'text-xl' }, // 추가
}
```

---

## 📊 데모 페이지

실제 동작을 확인하려면:

```bash
npm run dev
```

그리고 http://localhost:3000/demo-gauge 접속

---

## 🐛 트러블슈팅

### 1. Framer Motion 오류
```bash
npm install framer-motion
```

### 2. 애니메이션이 작동하지 않음
- "use client" 지시어가 컴포넌트 최상단에 있는지 확인
- Framer Motion이 설치되어 있는지 확인

### 3. 색상이 표시되지 않음
- Hex 코드 형식 확인 (#RRGGBB)
- Tailwind CSS 클래스가 아닌 인라인 스타일로 색상 적용

---

## 📚 관련 문서

- [Framer Motion 문서](https://www.framer.com/motion/)
- [Lucide React 아이콘](https://lucide.dev)
- [디자인 시스템 가이드](./DESIGN_SYSTEM.md)

---

## ✅ 체크리스트

컴포넌트 사용 전:

- [ ] Framer Motion 설치 확인
- [ ] "use client" 지시어 확인
- [ ] Props 타입 확인
- [ ] 색상 값 Hex 형식 확인
- [ ] 예산/지출 값이 숫자인지 확인
- [ ] 반응형 레이아웃 테스트

---

**컴포넌트 버전**: 1.0.0  
**마지막 업데이트**: 2025-10-31  
**Phase**: 2-2 완료
