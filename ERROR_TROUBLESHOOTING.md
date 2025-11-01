# 🆘 에러 대응 가이드 - 트러블슈팅

**프로젝트**: 버짓(Budget) - AI 예산 코치  
**업데이트**: 2025-10-31

---

## 🔴 에러 #1: Supabase 연결 실패

### 증상
```
Error: supabase is not defined
Failed to fetch from Supabase
CORS error from Supabase
```

### 해결 방법

#### 1️⃣ .env.local 파일 확인
```bash
# 파일 위치: 프로젝트 루트
# 파일 이름: .env.local (정확히!)

# 내용 확인
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**주의사항**:
- ✅ `NEXT_PUBLIC_` 접두사 필수
- ✅ URL 끝에 `/` 없어야 함
- ✅ 키 전체 복사 (끝부분 누락 주의)
- ✅ 따옴표 없이 입력

#### 2️⃣ Supabase Dashboard에서 키 확인
1. https://supabase.com/dashboard
2. 프로젝트 선택
3. Settings → API
4. **Project URL** 복사
5. **anon public** 키 복사 (전체!)

#### 3️⃣ 서버 재시작
```bash
# 개발 서버 종료 (Ctrl + C)
# 다시 시작
npm run dev
```

#### 4️⃣ 브라우저 캐시 클리어
```
Chrome: Ctrl + Shift + R (하드 리로드)
Safari: Cmd + Option + R
Firefox: Ctrl + F5
```

#### 5️⃣ 브라우저 콘솔 확인
```
F12 → Console 탭
에러 메시지 전체 복사
```

### 추가 확인 사항
- [ ] Supabase 프로젝트가 **Paused** 상태가 아닌지
- [ ] RLS 정책이 너무 엄격하지 않은지
- [ ] 방화벽이나 VPN이 차단하지 않는지

---

## 🔴 에러 #2: OpenAI API 호출 실패

### 증상
```
Error: OpenAI API key not found
Status 401: Incorrect API key provided
Status 429: Rate limit exceeded
Status 500: Internal server error
```

### 해결 방법

#### 1️⃣ API 키 확인
```bash
# .env.local 파일
OPENAI_API_KEY=sk-proj-xxxxx...
```

**올바른 형식**:
- ✅ `sk-proj-` 또는 `sk-` 시작
- ✅ 접두사 `NEXT_PUBLIC_` 없음 (서버 전용)
- ✅ 전체 키 복사 (51자 이상)

#### 2️⃣ OpenAI Platform에서 키 확인
1. https://platform.openai.com/api-keys
2. "Create new secret key" 또는 기존 키 확인
3. 키 복사 (한 번만 표시됨!)
4. `.env.local`에 정확히 입력

#### 3️⃣ 사용량 & 크레딧 확인
1. https://platform.openai.com/usage
2. 크레딧 잔액 확인
3. 무료 크레딧 소진 시 결제 정보 등록

**무료 크레딧**:
- 신규 계정: $5 (3개월 유효)
- 소진 후: 결제 필요

#### 4️⃣ 모델 접근 권한 확인
```typescript
// src/lib/openai.ts
const response = await openai.chat.completions.create({
  model: 'gpt-4o',  // ← 이 모델 사용 가능한지 확인
  // ...
})
```

**gpt-4o 사용 불가 시 임시 대체**:
```typescript
model: 'gpt-3.5-turbo'  // 더 저렴한 모델
```

#### 5️⃣ Rate Limit 에러 (429)
```typescript
// 재시도 로직 추가 (예정)
async function retryWithBackoff(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
}
```

### 추가 확인 사항
- [ ] API 키가 활성화 상태인지
- [ ] Organization ID가 필요한지 (선택)
- [ ] VPN이나 프록시 차단 여부

---

## 🔴 에러 #3: 빌드 실패

### 증상
```
Type error: Property 'xxx' does not exist
Module not found: Can't resolve 'xxx'
Error: Process exited with code 1
```

### 해결 방법

#### 1️⃣ 로컬 빌드 테스트
```bash
# 프로덕션 빌드 시도
npm run build

# 에러 메시지 전체 확인
```

#### 2️⃣ TypeScript 에러 확인
```bash
# 타입 체크만
npx tsc --noEmit

# 에러 파일 위치 확인
```

**흔한 타입 에러**:
```typescript
// ❌ 잘못된 코드
const user = await supabase.auth.getUser()
console.log(user.email)  // Error: Property 'email' does not exist

// ✅ 올바른 코드
const { data: { user } } = await supabase.auth.getUser()
console.log(user?.email)
```

#### 3️⃣ 모듈 설치 확인
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install

# 또는
npm ci  # package-lock.json 기준 설치
```

#### 4️⃣ 환경 변수 누락
```bash
# 빌드 시 환경 변수 필요
# Vercel에서는 자동 주입
# 로컬에서는 .env.local 필요

# 확인
npm run build  # .env.local 읽음
```

### 추가 확인 사항
- [ ] `next.config.js` 문법 오류
- [ ] `package.json` dependencies 버전
- [ ] Node.js 버전 호환성 (≥18.17)

---

## 🔴 에러 #4: 배포 후 페이지 404

### 증상
```
404 - Page Not Found
This page could not be found
```

### 해결 방법

#### 1️⃣ 라우트 구조 확인
```
src/app/
  ├── page.tsx              → /
  ├── (dashboard)/
  │   └── page.tsx          → /
  ├── pricing/
  │   └── page.tsx          → /pricing
  └── api/
      └── payments/
          └── checkout/
              └── route.ts  → /api/payments/checkout
```

**주의사항**:
- `(dashboard)` 같은 괄호 그룹은 URL에 포함 안 됨
- `page.tsx` 파일이 있어야 페이지 라우트
- `route.ts` 파일이 있어야 API 라우트

#### 2️⃣ 파일명 대소문자 확인
```bash
# Linux/Vercel은 대소문자 구분!
❌ Page.tsx
✅ page.tsx

❌ Route.ts
✅ route.ts
```

#### 3️⃣ Vercel 배포 로그 확인
```bash
vercel logs [deployment-url]

# 또는 Vercel Dashboard
→ Deployments → 최신 배포 → Function Logs
```

#### 4️⃣ 캐시 문제
```bash
# 배포 시 캐시 무시
vercel --prod --force
```

---

## 🔴 에러 #5: 환경 변수 인식 안 됨 (Vercel)

### 증상
```
API key is undefined in production
Environment variable not found
```

### 해결 방법

#### 1️⃣ Vercel Dashboard 확인
1. vercel.com/dashboard
2. 프로젝트 선택
3. Settings → Environment Variables
4. 모든 변수 확인

**환경별 설정**:
- Production: 프로덕션 키
- Preview: 테스트 키
- Development: 로컬 개발용

#### 2️⃣ 변수명 정확히 입력
```bash
# Vercel Dashboard에서
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co

# 주의: 띄어쓰기, 오타 없이!
```

#### 3️⃣ 재배포 필수
```bash
# 환경 변수 추가/수정 후 반드시 재배포
vercel --prod

# 또는 Git Push (자동 배포)
git push origin main
```

#### 4️⃣ 클라이언트 vs 서버 변수
```typescript
// 클라이언트에서 접근 가능 (NEXT_PUBLIC_ 필수)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL

// 서버 전용 (API 라우트, 서버 컴포넌트)
const key = process.env.OPENAI_API_KEY
```

---

## 🔴 에러 #6: 결제 실패 (토스 페이먼츠)

### 증상
```
Payment failed
Order ID not found
Invalid payment key
```

### 해결 방법

#### 1️⃣ 테스트 모드 확인
```bash
# .env.local (로컬)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
TOSS_PAYMENTS_SECRET_KEY=test_sk_xxxxx

# Vercel (프로덕션은 실제 키)
```

#### 2️⃣ 토스 페이먼츠 키 확인
1. https://developers.tosspayments.com/
2. 내 개발 정보 → API 키
3. 테스트/라이브 키 확인

#### 3️⃣ 주문 ID 형식
```typescript
// 올바른 형식
const orderId = `ORDER-${Date.now()}`
// 예: ORDER-1698765432123

// 주의: 고유해야 함 (중복 불가)
```

#### 4️⃣ 금액 검증
```typescript
// 서버에서 금액 재확인
const expectedAmount = planType === 'monthly' ? 9900 : 99000
if (actualAmount !== expectedAmount) {
  throw new Error('금액 불일치')
}
```

---

## 🔴 에러 #7: 포인트/뱃지 업데이트 안 됨

### 증상
```
포인트가 적립되지 않음
뱃지가 수여되지 않음
```

### 해결 방법

#### 1️⃣ Supabase 테이블 확인
```sql
-- points 테이블 존재 확인
SELECT * FROM points WHERE user_id = 'xxx' ORDER BY created_at DESC LIMIT 10;

-- badges 테이블 존재 확인
SELECT * FROM badges WHERE user_id = 'xxx';
```

#### 2️⃣ RLS 정책 확인
```sql
-- points 테이블에 INSERT 권한 있는지
CREATE POLICY "Users can insert own points"
  ON points FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### 3️⃣ 코드 실행 확인
```typescript
// 지출 기록 후 포인트 적립
await supabase.from('expenses').insert(...)

// 반드시 포인트도 적립
await supabase.from('points').insert({
  user_id: user.id,
  amount: 10,
  reason: '지출 기록'
})

// 뱃지 체크 (비동기)
checkAndAwardBadges(user.id)
```

#### 4️⃣ 콘솔 로그 확인
```typescript
console.log('포인트 적립 시도:', { userId, amount })
console.log('포인트 적립 결과:', result)
```

---

## 🎓 개발 팁

### 단계별 테스트
```bash
# Phase 완료 후 반드시 테스트
npm run dev
# 브라우저에서 해당 기능 확인
# 에러 없이 작동하는지 검증
```

### Git 커밋 전략
```bash
# 주요 기능 완성 시마다 커밋
git add .
git commit -m "feat: Add expense form with category selection"
git push origin main

# 커밋 메시지 형식
feat: 새 기능
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷
refactor: 리팩토링
test: 테스트 추가
```

### 에러 로그 활용
```typescript
// 개발 중
console.log('변수 값:', myVariable)
console.error('에러 발생:', error)

// 프로덕션 (next.config.js에서 자동 제거)
// console.log는 자동 삭제됨
```

### 사용자 피드백
```
어피티 50명 베타 테스트
→ 즉시 수정 가능한 버그 우선
→ 개선 사항은 Phase 2에서
→ 치명적 버그는 핫픽스 배포
```

### 성능 모니터링
```typescript
// Vercel Analytics 활성화
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 📞 지원 요청 템플릿

### 에러 보고 시 포함 사항

```markdown
## 에러 정보
**Phase**: Phase X-X (예: Phase 3-1)
**파일**: src/lib/openai.ts
**라인**: 23

## 에러 메시지
```
[전체 에러 메시지 복사]
```

## 재현 단계
1. 대시보드 접속
2. AI 코칭 "자세히 보기" 클릭
3. 에러 발생

## 환경
- OS: macOS / Windows / Linux
- 브라우저: Chrome 118
- Node.js: v18.17.0
- npm: v9.6.7

## 시도한 해결 방법
- 서버 재시작 ✓
- 환경 변수 확인 ✓
- 브라우저 캐시 클리어 ✓
```

### 질문 예시

**좋은 질문**:
```
Phase 3-1에서 OpenAI API 호출 시 에러 발생:

Error: OpenAI API key not found

.env.local 파일에 OPENAI_API_KEY=sk-proj-xxxxx로 
설정했는데도 인식이 안 됩니다.

서버 재시작도 했습니다. 어떻게 해결하나요?
```

**부족한 질문**:
```
에러 나요
안 돼요
```

---

## 🔗 유용한 링크

### 공식 문서
- [Next.js 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Vercel 문서](https://vercel.com/docs)
- [토스 페이먼츠](https://developers.tosspayments.com/)

### 커뮤니티
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Supabase Discord](https://discord.supabase.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

### 디버깅 도구
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Vercel Logs](https://vercel.com/docs/concepts/observability/logs)

---

**에러 발생 시 당황하지 마세요!**  
이 가이드를 따라 차근차근 해결하세요. 🛠️

**추가 도움이 필요하면**:
- 에러 메시지 전체 복사
- Phase 번호 명시
- 재현 단계 설명
- 젠스파크 AI 개발자에게 질문

**빠른 해결을 위한 팁**:
1. 에러 메시지 끝까지 읽기
2. 브라우저 콘솔 확인
3. 환경 변수 재확인
4. 서버 재시작
5. 구글 검색 (에러 메시지 복사)
