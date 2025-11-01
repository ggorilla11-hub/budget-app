# 🎨 버짓(Budget) 디자인 시스템

Noom 스타일의 깔끔하고 직관적인 디자인 시스템입니다.

---

## 🎨 컬러 팔레트

### Primary Colors

| 컬러 | Hex Code | 용도 |
|------|----------|------|
| **Primary** | `#00C2A8` | 주요 액션, CTA 버튼, 링크 |
| **Secondary** | `#00A896` | 보조 액션, 강조 |
| **Accent** | `#FF6B6B` | 경고, 삭제, 중요 알림 |

### Semantic Colors

| 컬러 | Hex Code | 용도 |
|------|----------|------|
| **Success** | `#51CF66` | 성공 메시지, 완료 상태 |
| **Warning** | `#FFD93D` | 주의 메시지, 경고 |

### Neutral Colors

| 컬러 | Hex Code | 용도 |
|------|----------|------|
| **Background** | `#F8F9FA` | 페이지 배경 |
| **Text Primary** | `#212529` | 주요 텍스트 |
| **Text Secondary** | `#868E96` | 보조 텍스트, 설명 |

---

## 🔤 타이포그래피

### 폰트 패밀리
- **Primary**: Pretendard
- **Fallback**: system-ui, sans-serif

### 폰트 크기

| 클래스 | 크기 | 용도 |
|--------|------|------|
| `text-4xl` | 2.25rem (36px) | H1 - 페이지 제목 |
| `text-3xl` | 1.875rem (30px) | H2 - 섹션 제목 |
| `text-2xl` | 1.5rem (24px) | H3 - 카드 제목 |
| `text-xl` | 1.25rem (20px) | H4 - 소제목 |
| `text-lg` | 1.125rem (18px) | 큰 본문 |
| `text-base` | 1rem (16px) | 기본 본문 |
| `text-sm` | 0.875rem (14px) | 작은 텍스트 |
| `text-xs` | 0.75rem (12px) | 캡션, 라벨 |

### 폰트 웨이트
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

---

## 📦 컴포넌트

### 1. Button

**Variants**:
- `primary`: 주요 액션 (민트 그린 배경)
- `secondary`: 보조 액션 (에메랄드 배경)
- `outline`: 아웃라인 버튼
- `ghost`: 배경 없는 버튼

**Sizes**:
- `sm`: 작은 버튼 (px-4 py-2)
- `md`: 중간 버튼 (px-6 py-3) - 기본값
- `lg`: 큰 버튼 (px-8 py-4)

**사용 예제**:
```tsx
import { Button } from '@/components/ui/button'

<Button variant="primary" size="lg">
  시작하기
</Button>

<Button variant="outline" isLoading>
  저장 중...
</Button>
```

---

### 2. Card

**Props**:
- `hover`: 호버 효과 추가

**하위 컴포넌트**:
- `CardHeader`: 카드 헤더
- `CardTitle`: 카드 제목
- `CardDescription`: 카드 설명
- `CardContent`: 카드 본문
- `CardFooter`: 카드 푸터

**사용 예제**:
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

<Card hover>
  <CardHeader>
    <CardTitle>예산 현황</CardTitle>
    <CardDescription>이번 달 지출 내역</CardDescription>
  </CardHeader>
  <CardContent>
    <p>내용...</p>
  </CardContent>
</Card>
```

---

### 3. Input

**Props**:
- `label`: 라벨 텍스트
- `error`: 에러 메시지

**사용 예제**:
```tsx
import { Input } from '@/components/ui/input'

<Input 
  label="이메일"
  type="email"
  placeholder="example@email.com"
  error="올바른 이메일을 입력하세요"
/>
```

---

### 4. Badge

**Variants**:
- `primary`: 민트 그린
- `success`: 딥 그린
- `warning`: 옐로우
- `accent`: 코랄
- `secondary`: 에메랄드

**Sizes**:
- `sm`: 작은 배지
- `md`: 중간 배지 - 기본값
- `lg`: 큰 배지

**사용 예제**:
```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="success">완료</Badge>
<Badge variant="warning" size="sm">대기중</Badge>
```

---

## 🎭 그림자 (Shadow)

| 클래스 | 값 | 용도 |
|--------|-----|------|
| `shadow-soft` | 0 2px 8px rgba(0,0,0,0.08) | 기본 카드 |
| `shadow-medium` | 0 4px 16px rgba(0,0,0,0.12) | 호버 상태 |
| `shadow-strong` | 0 8px 24px rgba(0,0,0,0.16) | 모달, 드롭다운 |

---

## 📐 Border Radius

| 클래스 | 값 | 용도 |
|--------|-----|------|
| `rounded-sm` | 0.375rem (6px) | 작은 요소 |
| `rounded-md` | 0.5rem (8px) | 버튼, 입력 필드 |
| `rounded-lg` | 0.75rem (12px) | 카드 - 기본값 |
| `rounded-full` | 9999px | 원형 요소 |

---

## 🎬 애니메이션

### 제공되는 애니메이션

| 클래스 | 효과 | 사용처 |
|--------|------|--------|
| `animate-fade-in` | 페이드 인 | 페이지 로드 |
| `animate-slide-up` | 아래에서 위로 슬라이드 | 섹션 등장 |
| `animate-scale-in` | 확대 애니메이션 | 모달, 알림 |

**사용 예제**:
```tsx
<div className="animate-fade-in">
  콘텐츠
</div>
```

---

## 🧩 유틸리티 클래스

### Card 스타일
```tsx
className="card"           // 기본 카드
className="card-hover"     // 호버 효과 있는 카드
```

### Input 스타일
```tsx
className="input"          // 기본 입력 필드
```

### Badge 스타일
```tsx
className="badge badge-primary"    // Primary 배지
className="badge badge-success"    // Success 배지
```

---

## 📱 반응형 디자인

Tailwind CSS의 반응형 브레이크포인트를 사용합니다:

| 접두사 | 최소 너비 | 용도 |
|--------|-----------|------|
| `sm:` | 640px | 모바일 (큰 화면) |
| `md:` | 768px | 태블릿 |
| `lg:` | 1024px | 데스크톱 |
| `xl:` | 1280px | 큰 데스크톱 |
| `2xl:` | 1536px | 와이드 모니터 |

**사용 예제**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 */}
</div>
```

---

## 🎯 디자인 원칙

### 1. **명확성 (Clarity)**
- 직관적인 UI 구성
- 명확한 시각적 계층 구조
- 충분한 여백

### 2. **일관성 (Consistency)**
- 통일된 컬러 팔레트
- 일관된 컴포넌트 스타일
- 예측 가능한 인터랙션

### 3. **접근성 (Accessibility)**
- 충분한 색상 대비
- 키보드 내비게이션 지원
- 스크린 리더 호환

### 4. **반응성 (Responsiveness)**
- 모바일 우선 디자인
- 유연한 레이아웃
- 터치 친화적 인터페이스

---

## 🔧 커스터마이징

### Tailwind Config 확장

`tailwind.config.ts`에서 컬러, 폰트 등을 커스터마이징할 수 있습니다:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#00C2A8',
      // 추가 컬러...
    },
    fontFamily: {
      sans: ['Pretendard', 'system-ui', 'sans-serif'],
    },
  },
}
```

---

## 📚 참고 자료

- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Pretendard 폰트](https://github.com/orioncactus/pretendard)
- [Lucide Icons](https://lucide.dev)

---

## 📝 체크리스트

디자인 시스템 적용 시 확인사항:

- [ ] Pretendard 폰트 로드 확인
- [ ] 컬러 팔레트 적용
- [ ] 버튼 컴포넌트 동작 확인
- [ ] 카드 컴포넌트 스타일 확인
- [ ] 입력 필드 포커스 상태 확인
- [ ] 배지 variant 확인
- [ ] 반응형 레이아웃 테스트
- [ ] 애니메이션 동작 확인

---

**디자인 시스템 버전**: 1.0.0  
**마지막 업데이트**: 2025-10-31  
**Phase**: 2-1 완료
