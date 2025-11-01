# 💰 버짓(Budget) - AI 예산 코치

**예산이 인생을 바꾼다**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-blue)](https://openai.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

Noom 스타일 예산관리 웹 애플리케이션 - AI 코칭, 게이미피케이션, 토스 페이먼츠 연동

---

## 🎯 프로젝트 개요

**버짓**은 단순한 예산관리 앱을 넘어, 사용자의 재무 습관을 근본적으로 개선하는 AI 코치입니다.

### 핵심 철학
- **공감**: Noom 스타일의 따뜻한 AI 코칭
- **실용성**: 50/30/20 규칙 기반 예산 배분
- **동기부여**: 포인트, 뱃지, 레벨 시스템
- **접근성**: PWA로 모바일 앱처럼 사용

---

## ✨ 주요 기능

### 1. 🤖 AI 예산 코칭 (OpenAI GPT-4o)
- 월 소득/가족수 기반 자동 예산 배분
- 주간 지출 분석 및 개인화 피드백
- 감정 기반 소비 패턴 분석
- Noom 스타일 공감적 톤

### 2. 📊 실시간 예산 추적
- 카테고리별 예산 게이지 (Framer Motion)
- 초과 시 빨간색 경고
- 최근 지출 내역 (최대 10건)
- 자동 갱신

### 3. 🎮 게이미피케이션
- 포인트 시스템 (1000P당 레벨업)
- 10가지 뱃지 (첫 걸음, 꾸준함, 예산 지킴이 등)
- 진행바 & 레벨 표시
- 뱃지 획득 시 보너스 포인트

### 4. 💳 프리미엄 구독 (토스 페이먼츠)
- 월간: ₩9,900/월
- 연간: ₩99,000/년 (17% 할인)
- 재무설계사 상담 (연 4회)
- 오프라인 강의 30% 할인

### 5. 📱 PWA (Progressive Web App)
- 홈 화면 추가 (앱처럼 설치)
- Standalone 모드
- 오프라인 지원 (예정)
- 빠른 로딩

---

## 🛠️ 기술 스택

### Frontend
- **Next.js 14** - App Router, Server Components
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 퍼스트 CSS
- **Framer Motion** - 애니메이션

### Backend
- **Supabase** - PostgreSQL, Auth, RLS
- **OpenAI GPT-4o** - AI 코칭
- **토스 페이먼츠** - 결제

### Deployment
- **Vercel** - Edge Functions, CDN
- **PWA** - Service Worker, Manifest

---

## 🚀 빠른 시작

### 필수 조건
- Node.js ≥ 18.17
- npm ≥ 9.0
- Supabase 계정
- OpenAI API 키

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/budget-app.git
cd budget-app
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
# .env.local 파일 생성
cp .env.example .env.local

# 환경 변수 입력
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-your-openai-api-key
```

### 4. 개발 서버 실행
```bash
npm run dev
```

http://localhost:3000 접속

---

## 📖 문서

### 주요 가이드
- [배포 가이드](DEPLOYMENT_GUIDE.md) - Vercel 배포 방법
- [최종 체크리스트](FINAL_CHECKLIST.md) - 배포 전 확인 사항
- [에러 대응 가이드](ERROR_TROUBLESHOOTING.md) - 트러블슈팅

### Phase 별 완료 문서
- [Phase 1-2](PHASE_1-2_COMPLETE.md) - Supabase 스키마
- [Phase 2-2](PHASE_2-2_COMPLETE.md) - 예산 게이지
- [Phase 3-1](PHASE_3-1_COMPLETE.md) - OpenAI 통합
- [Phase 4-1](PHASE_4-1_COMPLETE.md) - 지출 입력 폼
- [Phase 5-1](PHASE_5-1_COMPLETE.md) - 메인 대시보드
- [Phase 6-1](PHASE_6-1_COMPLETE.md) - 포인트 & 뱃지
- [Phase 7-1](PHASE_7-1_COMPLETE.md) - 결제 시스템
- [Phase 8-1](PHASE_8-1_COMPLETE.md) - Vercel 배포

---

## 📁 프로젝트 구조

```
budget-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/        # 대시보드 그룹
│   │   ├── api/                # API 라우트
│   │   ├── demo-ai/            # AI 데모
│   │   ├── demo-gauge/         # 게이지 데모
│   │   ├── globals.css         # 글로벌 스타일
│   │   └── layout.tsx          # 루트 레이아웃
│   ├── components/             # React 컴포넌트
│   │   ├── AICoach.tsx         # AI 코칭 UI
│   │   ├── AICoachCard.tsx     # 대시보드 AI 카드
│   │   ├── BudgetGauge.tsx     # 예산 게이지
│   │   ├── BudgetGenerator.tsx # 예산 생성 폼
│   │   ├── CircularGauge.tsx   # 원형 게이지
│   │   ├── ExpenseForm.tsx     # 지출 입력 폼
│   │   ├── PointsDisplay.tsx   # 포인트 & 레벨
│   │   └── PricingCard.tsx     # 가격 카드
│   ├── lib/                    # 라이브러리
│   │   ├── badges.ts           # 뱃지 시스��
│   │   ├── openai.ts           # OpenAI 통합
│   │   ├── supabase.ts         # Supabase 클라이언트
│   │   └── utils.ts            # 유틸리티
│   └── types/                  # TypeScript 타입
│       └── ai.ts               # AI 타입 정의
├── public/                     # 정적 파일
│   └── manifest.json           # PWA 설정
├── .env.example                # 환경 변수 템플릿
├── next.config.js              # Next.js 설정
├── tailwind.config.ts          # Tailwind 설정
├── tsconfig.json               # TypeScript 설정
├── DEPLOYMENT_GUIDE.md         # 배포 가이드
├── FINAL_CHECKLIST.md          # 최종 체크리스트
└── ERROR_TROUBLESHOOTING.md    # 에러 대응 가이드
```

---

## 🗄️ 데이터베이스 스키마

### Supabase Tables
```sql
-- users (Supabase Auth 자동 생성)
-- profiles
-- budgets
-- expenses
-- points
-- badges
```

상세 스키마는 [PHASE_1-2_COMPLETE.md](PHASE_1-2_COMPLETE.md) 참조

---

## 🎨 디자인 시스템

### 컬러 팔레트
```css
--primary: #00C2A8      /* 청록 */
--secondary: #4ECDC4    /* 밝은 청록 */
--accent: #F38181       /* 코랄 */
--textPrimary: #2D3748  /* 다크 그레이 */
--textSecondary: #718096/* 미디엄 그레이 */
--background: #F8F9FA   /* 라이트 그레이 */
```

### 타이포그래피
- **폰트**: Pretendard (한글), Inter (영문)
- **헤더**: 24-36px, font-bold
- **본문**: 16px, font-normal

---

## 🧪 테스트

### 로컬 테스트
```bash
# 프로덕션 빌드 테스트
npm run build
npm run start

# TypeScript 타입 체크
npx tsc --noEmit

# Lint 검사
npm run lint
```

### E2E 테스트 (예정)
```bash
npm run test:e2e
```

---

## 🚀 배포

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 연결
vercel link

# 배포
vercel --prod
```

상세 가이드: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 📊 성능

### Lighthouse 점수 (목표)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Core Web Vitals
- LCP: < 2.5초
- FID: < 100ms
- CLS: < 0.1

---

## 🤝 기여

이 프로젝트는 현재 비공개 개발 중입니다.

### 개발 워크플로우
1. Feature 브랜치 생성
2. 코드 작성
3. Phase 완료 문서 작성
4. PR 생성
5. 리뷰 & 머지

---

## 📜 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 참조

---

## 👨‍💻 개발자

**프로젝트**: 버짓(Budget)  
**개발**: AI Assistant + 오원트밸런스  
**기간**: 2025-10-31  
**버전**: 1.0.0

---

## 🔗 링크

- **배포 URL**: https://budget-app.vercel.app (예정)
- **디자인**: Figma (비공개)
- **API 문서**: [AI_COACHING_GUIDE.md](AI_COACHING_GUIDE.md)

---

## 📞 지원

### 문의
- 이메일: support@owntbalance.com
- Discord: (예정)
- 이슈: GitHub Issues

### FAQ
Q: 무료 버전과 프리미엄의 차이는?  
A: 무료는 기본 예산 추적, 프리미엄은 AI 코칭 + 전문가 상담

Q: 데이터는 안전한가요?  
A: Supabase RLS로 보호, HTTPS 암호화

Q: 오프라인에서도 작동하나요?  
A: PWA로 설치 후 일부 기능 오프라인 지원 (Phase 8-2)

---

## 🎉 감사합니다!

**버짓**을 사용해주셔서 감사합니다.  
예산이 여러분의 인생을 바꾸길 바랍니다! 💰✨

---

**Made with ❤️ by Owntbalance**
