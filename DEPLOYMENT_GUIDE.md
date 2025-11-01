# 🚀 버짓(Budget) 배포 가이드

**프로젝트**: 버짓 - AI 예산 코치  
**프레임워크**: Next.js 14  
**배포 플랫폼**: Vercel

---

## 📋 배포 전 체크리스트

### 1. 필수 환경 변수
- [ ] Supabase URL 및 키
- [ ] OpenAI API 키
- [ ] Toss Payments 키 (테스트/프로덕션)

### 2. 데이터베이스 (Supabase)
- [ ] 6개 테이블 생성 완료
- [ ] RLS 정책 설정 완료
- [ ] 인덱스 최적화

### 3. 코드 검증
- [ ] TypeScript 에러 없음
- [ ] 빌드 테스트 성공 (`npm run build`)
- [ ] 환경 변수 참조 확인

---

## 🔧 Vercel 배포 단계

### Step 1: Vercel CLI 설치
```bash
npm i -g vercel
```

### Step 2: 프로젝트 연결
```bash
cd /path/to/budget-app
vercel login
vercel link
```

**프롬프트 응답 예시**:
```
? Set up and deploy "~/budget-app"? [Y/n] y
? Which scope do you want to deploy to? Your Name
? Link to existing project? [y/N] n
? What's your project's name? budget-app
? In which directory is your code located? ./
```

### Step 3: 환경 변수 설정

#### 방법 1: Vercel Dashboard (권장)
1. https://vercel.com/dashboard
2. 프로젝트 선택 → Settings → Environment Variables
3. 다음 변수 추가:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxx

# Toss Payments (테스트 환경)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
TOSS_PAYMENTS_SECRET_KEY=test_sk_xxxxx
```

**환경별 설정**:
- Production: 프로덕션용 키 사용
- Preview: 테스트 키 사용
- Development: 로컬 개발용

#### 방법 2: Vercel CLI
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add OPENAI_API_KEY
# ... (나머지 변수)
```

### Step 4: 배포 실행

#### 프리뷰 배포 (테스트)
```bash
vercel
```
- 임시 URL 생성 (예: `budget-app-xxx.vercel.app`)
- 프로덕션 전 테스트 가능

#### 프로덕션 배포
```bash
vercel --prod
```
- 메인 도메인에 배포
- 자동 HTTPS 적용
- 글로벌 CDN 배포

### Step 5: 배포 확인
```bash
# 배포 상태 확인
vercel ls

# 로그 확인
vercel logs [deployment-url]
```

---

## 🌐 도메인 설정

### 커스텀 도메인 연결
1. Vercel Dashboard → 프로젝트 → Settings → Domains
2. 도메인 입력 (예: `budget.owntbalance.com`)
3. DNS 레코드 추가:
   ```
   Type: CNAME
   Name: budget (또는 @)
   Value: cname.vercel-dns.com
   ```
4. SSL 인증서 자동 발급 (Let's Encrypt)

---

## 📱 PWA 설정 완료

### manifest.json
- ✅ 위치: `public/manifest.json`
- ✅ 앱 이름: "버짓 - AI 예산 코치"
- ✅ 테마 색상: #00C2A8
- ✅ 아이콘: 192x192, 512x512

### 메타 태그 (layout.tsx)
- ✅ `manifest` 링크
- ✅ `themeColor` 설정
- ✅ Apple PWA 지원
- ✅ Viewport 최적화

### PWA 테스트
1. Chrome DevTools → Lighthouse
2. "Install app" 버튼 확인 (모바일)
3. 홈 화면 추가 테스트

---

## ⚡ 성능 최적화 (next.config.js)

### 이미지 최적화
```javascript
images: {
  domains: ['cdn1.genspark.ai'],
  formats: ['image/avif', 'image/webp']
}
```
- AVIF/WebP 자동 변환
- 레이지 로딩
- 반응형 크기 조정

### 프로덕션 최적화
```javascript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production'
}
```
- `console.log` 자동 제거
- 번들 크기 감소

---

## 🔐 보안 설정

### 1. 환경 변수 보안
- ✅ `.env.local`은 `.gitignore`에 포함
- ✅ 클라이언트 노출 변수는 `NEXT_PUBLIC_` 접두사
- ✅ 서버 전용 키는 Vercel 환경 변수로만 관리

### 2. Supabase RLS (Row Level Security)
```sql
-- 예시: users 테이블
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### 3. API 보호
- OpenAI API: 서버 사이드만 호출 (API 라우트)
- Toss Payments: 시크릿 키는 서버 전용
- Rate limiting 적용 (Vercel Edge Functions)

---

## 📊 모니터링 & 분석

### Vercel Analytics
1. Dashboard → 프로젝트 → Analytics
2. 페이지 뷰, 성능 지표 자동 수집
3. Web Vitals 모니터링 (LCP, FID, CLS)

### Vercel Speed Insights (선택)
```bash
npm install @vercel/speed-insights
```

```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

## 🐛 트러블슈팅

### 빌드 실패
```bash
# 로컬 빌드 테스트
npm run build

# 타입 에러 확인
npm run type-check  # 또는 tsc --noEmit
```

**흔한 원인**:
- 환경 변수 누락
- TypeScript 타입 에러
- 모듈 import 오류

### 환경 변수 인식 안 됨
```bash
# Vercel에서 재배포
vercel --prod --force

# 또는 캐시 클리어
vercel deploy --prod --no-cache
```

### Supabase 연결 실패
1. Supabase Dashboard → Settings → API
2. URL 및 키 재확인
3. RLS 정책 확인 (너무 엄격한 경우)

---

## 🔄 CI/CD 자동 배포

### GitHub 연동 (권장)
1. Vercel Dashboard → Import Project
2. GitHub 저장소 선택
3. 브랜치별 자동 배포:
   - `main` → 프로덕션
   - `develop` → 프리뷰
   - PR → 자동 프리뷰 URL

### 배포 트리거
```bash
git push origin main
# → Vercel이 자동으로 감지하고 배포
```

---

## 📈 배포 후 체크리스트

### 기능 테스트
- [ ] 회원가입/로그인
- [ ] 예산 설정
- [ ] 지출 기록
- [ ] AI 코칭 요청
- [ ] 결제 플로우 (테스트 모드)
- [ ] 포인트/뱃지 획득
- [ ] PWA 설치 (모바일)

### 성능 검증
- [ ] Lighthouse 점수 (90+ 목표)
- [ ] 페이지 로드 속도 (< 2초)
- [ ] Core Web Vitals 통과
- [ ] 모바일 반응형 확인

### SEO & 메타
- [ ] `robots.txt` 설정
- [ ] `sitemap.xml` 생성
- [ ] Open Graph 이미지
- [ ] 소셜 미디어 공유 테스트

---

## 🎯 프로덕션 체크리스트

### 코드 품질
- [ ] 모든 `console.log` 제거 (또는 자동 제거 설정)
- [ ] 에러 바운더리 설정
- [ ] 404/500 에러 페이지 커스텀
- [ ] 로딩 상태 스켈레톤 UI

### 보안
- [ ] CORS 설정 (API 라우트)
- [ ] CSP (Content Security Policy) 헤더
- [ ] 민감 정보 로깅 제거
- [ ] API Rate Limiting

### UX
- [ ] 오프라인 지원 (Service Worker)
- [ ] 다크 모드 (선택)
- [ ] 접근성 (a11y) 점검
- [ ] 다국어 지원 준비 (i18n)

---

## 📚 추가 리소스

### Vercel 문서
- [Next.js 배포](https://vercel.com/docs/frameworks/nextjs)
- [환경 변수](https://vercel.com/docs/concepts/projects/environment-variables)
- [도메인 설정](https://vercel.com/docs/concepts/projects/domains)

### Next.js 최적화
- [Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Font Optimization](https://nextjs.org/docs/basic-features/font-optimization)
- [Script Optimization](https://nextjs.org/docs/basic-features/script)

---

## 🚀 배포 완료!

배포 성공 후 URL:
```
https://budget-app.vercel.app
```

**다음 단계**:
1. 사용자 피드백 수집
2. 애널리틱스 데이터 분석
3. A/B 테스트 설정
4. 마케팅 캠페인 시작

---

**배포일**: 2025-10-31  
**프로젝트**: 버짓(Budget) - AI 예산 코치  
**개발**: Next.js 14 + Supabase + OpenAI  
**플랫폼**: Vercel
