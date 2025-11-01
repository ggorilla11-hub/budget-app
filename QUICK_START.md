# ⚡ 빠른 시작 - 5분 배포

**버짓(Budget) 즉시 배포 가이드**

---

## 🎯 목표: 5분 안에 배포 완료

---

## 1️⃣ Vercel 접속 (30초)

**URL**: https://vercel.com/new

**로그인**: GitHub 계정 사용 권장

---

## 2️⃣ 프로젝트 Import (1분)

### GitHub 저장소 있는 경우
1. "Import Git Repository" 클릭
2. budget-app 저장소 선택
3. "Import" 클릭

### GitHub 저장소 없는 경우
```bash
# 터미널에서 실행
cd budget-app
git init
git add .
git commit -m "Initial commit"
git push origin main
```

---

## 3️⃣ 환경 변수 입력 (2분)

**Environment Variables** 섹션에서 **6개 변수** 추가:

```
변수 1:
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co

변수 2:
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOi...

변수 3:
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOi...

변수 4:
Key: OPENAI_API_KEY
Value: sk-proj-...

변수 5:
Key: NEXT_PUBLIC_TOSS_CLIENT_KEY
Value: test_ck_...

변수 6:
Key: TOSS_PAYMENTS_SECRET_KEY
Value: test_sk_...
```

**Environment**: Production, Preview, Development 모두 체크 ✅

---

## 4️⃣ 배포 시작 (2분)

**"Deploy" 버튼 클릭**

빌드 진행 상황 확인:
- Building... (1분)
- Deploying... (30초)
- Success! ✅

---

## 5️⃣ 완료! 🎉

**배포 URL**: `https://budget-app-xxx.vercel.app`

**"Visit" 버튼** 클릭하여 사이트 확인

---

## ✅ 간단 테스트

1. **홈페이지 로딩** → ✅
2. **회원가입 페이지** → ✅
3. **로그인 페이지** → ✅

---

## 🆘 에러 발생 시

### Build Error
→ [DEPLOY_NOW.md](DEPLOY_NOW.md#배포-중-에러-해결) 참조

### Environment Variable Error
→ Dashboard → Settings → Environment Variables 재확인

---

## 🔄 수정 후 재배포

```bash
git add .
git commit -m "fix: xxx"
git push origin main
# → 자동 재배포 (1분)
```

---

**이제 배포하세요!** 🚀

**예상 소요 시간**: 5분  
**난이도**: ⭐⭐☆☆☆
