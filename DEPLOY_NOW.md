# 🚀 배포 승인 완료 - 즉시 배포 가이드

**상태**: ✅ 배포 승인됨  
**날짜**: 2025-10-31  
**프로젝트**: 버짓(Budget) - AI 예산 코치

---

## ⚡ 빠른 배포 (5분 완료)

### 방법 A: Vercel Dashboard 배포 (추천 🌟)

#### 1단계: GitHub 업로드 (선택)
```bash
# 이미 GitHub 저장소가 있다면 Skip

# 새 저장소 생성 시
cd budget-app
git init
git add .
git commit -m "feat: Complete budget app v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/budget-app.git
git push -u origin main
```

#### 2단계: Vercel 연동
1. **접속**: https://vercel.com/new
2. **로그인**: GitHub 계정으로 로그인
3. **Import**: "Import Git Repository" 클릭
4. **선택**: budget-app 저장소 선택
5. **확인**: Framework Preset이 "Next.js" 자동 감지됨 ✅

#### 3단계: 환경 변수 입력 (중요!)
**Environment Variables** 섹션에서 다음 변수 추가:

```env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL
값: https://xxxxx.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
값: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...

SUPABASE_SERVICE_ROLE_KEY
값: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...

# OpenAI (필수)
OPENAI_API_KEY
값: sk-proj-xxxxx...

# Toss Payments (필수)
NEXT_PUBLIC_TOSS_CLIENT_KEY
값: test_ck_xxxxx

TOSS_PAYMENTS_SECRET_KEY
값: test_sk_xxxxx
```

**환경 설정**: Production, Preview, Development 모두 체크 ✅

#### 4단계: Deploy 클릭
- "Deploy" 버튼 클릭
- 빌드 시작 (2-3분 소요)
- 로그 확인 가능

#### 5단계: 배포 완료 🎉
- 자동으로 URL 생성: `https://budget-app-xxx.vercel.app`
- "Visit" 버튼으로 사이트 확인
- 도메인 커스터마이징 가능 (Settings → Domains)

---

### 방법 B: Vercel CLI 배포

#### 1단계: CLI 설치
```bash
npm i -g vercel
```

#### 2단계: 로그인
```bash
vercel login
# 브라우저에서 인증
```

#### 3단계: 배포
```bash
cd budget-app
vercel --prod
```

**프롬프트 응답 예시**:
```
? Set up and deploy? [Y/n] y
? Which scope? Your Name
? Link to existing project? [y/N] n
? What's your project's name? budget-app
? In which directory is your code located? ./
```

#### 4단계: 환경 변수 입력
CLI에서는 Dashboard에서 입력하는 것이 더 편합니다:
1. https://vercel.com/dashboard
2. 프로젝트 선택 → Settings → Environment Variables
3. 위의 6개 변수 입력
4. 재배포: `vercel --prod`

---

## 🔍 환경 변수 가져오는 방법

### Supabase
1. https://supabase.com/dashboard
2. 프로젝트 선택
3. Settings → API
4. 복사:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY` (Show 클릭)

### OpenAI
1. https://platform.openai.com/api-keys
2. "Create new secret key" 또는 기존 키 확인
3. 복사 → `OPENAI_API_KEY`
4. ⚠️ 크레딧 잔액 확인: https://platform.openai.com/usage

### Toss Payments
1. https://developers.tosspayments.com/
2. 내 개발 정보 → API 키
3. 테스트 키 복사:
   - 클라이언트 키 → `NEXT_PUBLIC_TOSS_CLIENT_KEY`
   - 시크릿 키 → `TOSS_PAYMENTS_SECRET_KEY`

---

## ✅ 배포 성공 확인

### 1. 배포 URL 접속
```
https://budget-app-xxx.vercel.app
```

### 2. 기능 테스트
- [ ] 홈페이지 로딩
- [ ] 회원가입 페이지 이동
- [ ] 로그인 페이지 이동
- [ ] 대시보드 접근 (로그인 필요)

### 3. 환경 변수 확인
브라우저 콘솔(F12)에서:
```javascript
// Supabase 연결 확인
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
// → 출력되면 정상
```

---

## 🐛 배포 중 에러 해결

### 에러 1: Build Failed
**증상**: "Build failed" 메시지

**해결**:
```bash
# 로컬에서 빌드 테스트
cd budget-app
npm install
npm run build

# 에러 메시지 확인 후 수정
```

**흔한 원인**:
- TypeScript 타입 에러
- 모듈 import 오류
- 환경 변수 참조 오류

### 에러 2: Environment Variable Not Found
**증상**: "API key is undefined"

**해결**:
1. Vercel Dashboard → 프로젝트 → Settings → Environment Variables
2. 모든 변수 재확인
3. 값 끝에 공백 없는지 확인
4. Redeploy 클릭

### 에러 3: Supabase Connection Error
**증상**: "Failed to fetch from Supabase"

**해결**:
1. Supabase URL 형식 확인: `https://xxxxx.supabase.co` (끝에 `/` 없음)
2. Anon Key 전체 복사 (끝부분 누락 주의)
3. Supabase 프로젝트가 **Paused** 상태가 아닌지 확인

---

## 🔄 배포 후 수정 방법

### GitHub 연동 시 (자동 재배포)
```bash
# 코드 수정
# 예: src/components/ExpenseForm.tsx

# 커밋 & 푸시
git add .
git commit -m "fix: Update expense form"
git push origin main

# → Vercel이 자동으로 감지하고 재배포 (1-2분)
```

### 수동 재배포
```bash
vercel --prod
```

### Dashboard에서 재배포
1. https://vercel.com/dashboard
2. 프로젝트 선택
3. Deployments → 최신 배포 → "Redeploy"

---

## 📊 배포 후 모니터링

### Vercel Analytics
1. Dashboard → 프로젝트 → Analytics
2. 페이지 뷰, 성능 지표 자동 수집
3. Real-time 데이터 확인

### 로그 확인
```bash
vercel logs https://budget-app-xxx.vercel.app
```

또는 Dashboard → Deployments → Function Logs

---

## 🎯 배포 체크리스트

### 배포 전 ✅
- [x] 모든 코드 파일 생성 완료
- [x] 환경 변수 템플릿 준비
- [x] 배포 가이드 작성
- [x] 에러 대응 가이드 작성
- [x] 프로젝트 백업 완료

### 배포 중 ⏳
- [ ] Vercel 계정 로그인
- [ ] GitHub 저장소 연동 (또는 CLI)
- [ ] 환경 변수 6개 입력
- [ ] Deploy 버튼 클릭
- [ ] 빌드 성공 확인

### 배포 후 ✅
- [ ] 배포 URL 접속
- [ ] 홈페이지 로딩 확인
- [ ] 회원가입/로그인 테스트
- [ ] 대시보드 접근
- [ ] AI 코칭 요청 테스트
- [ ] 모바일 반응형 확인
- [ ] PWA 설치 테스트

---

## 🆘 도움이 필요하면

### 에러 발생 시 제공할 정보
```markdown
**에러 타입**: Build Error / Runtime Error / API Error
**에러 메시지**: [전체 메시지 복사]
**발생 위치**: Vercel 빌드 로그 / 브라우저 콘솔
**재현 단계**: 
1. xxx 페이지 접속
2. xxx 버튼 클릭
3. 에러 발생
```

### 빠른 디버깅
1. **Vercel 빌드 로그**: Dashboard → Deployments → Build Logs
2. **브라우저 콘솔**: F12 → Console 탭
3. **네트워크 탭**: F12 → Network (API 호출 확인)

---

## 🎉 배포 완료 후

### 공유하기
```
🎉 버짓(Budget) - AI 예산 코치 배포 완료!

🔗 https://budget-app.vercel.app

✨ 주요 기능:
- AI 예산 자동 생성
- 실시간 지출 추적
- 포인트 & 뱃지 시스템
- 토스 페이먼츠 결제

#Next.js #Supabase #OpenAI #버짓
```

### 다음 단계
1. **사용자 피드백 수집**
2. **버그 수정** (즉시 재배포 가능)
3. **기능 개선** (Phase 9)
4. **마케팅 시작**

---

## 📞 배포 지원

**이 문서를 따라하다가 막히면:**
1. 에러 메시지 전체 복사
2. 스크린샷 첨부
3. 어느 단계에서 막혔는지 설명
4. 저에게 질문하기

**제가 즉시 도와드리겠습니다!** 🚀

---

**배포 시작하세요!**  
**예상 소요 시간**: 5-10분  
**난이도**: ⭐⭐☆☆☆ (쉬움)

---

**생성일**: 2025-10-31  
**상태**: ✅ 배포 승인 완료  
**다음**: Vercel Dashboard에서 배포 진행
