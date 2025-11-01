# Supabase 설정 체크리스트 ✅

버짓(Budget) 프로젝트의 Supabase 데이터베이스 설정 완료를 확인하는 체크리스트입니다.

---

## 📋 설정 단계

### ✅ 1단계: Supabase 프로젝트 생성
- [ ] Supabase 계정 생성 완료
- [ ] 새 프로젝트 생성 완료
- [ ] 프로젝트 초기화 완료 (약 2분 소요)
- [ ] Database Password 안전하게 저장

**프로젝트 정보**
- 프로젝트명: ____________________
- Region: Northeast Asia (Seoul) 권장
- Project URL: ____________________

---

### ✅ 2단계: 데이터베이스 스키마 실행
- [ ] SQL Editor 열기 완료
- [ ] `supabase/schema.sql` 파일 복사
- [ ] SQL 실행 완료 (Success 메시지 확인)
- [ ] 오류 없이 모든 테이블 생성 완료

**생성된 테이블 확인** (Table Editor에서 확인)
- [ ] `users` 테이블
- [ ] `budgets` 테이블
- [ ] `expenses` 테이블
- [ ] `user_points` 테이블
- [ ] `ai_feedback` 테이블

---

### ✅ 3단계: 환경변수 설정
- [ ] Settings → API 메뉴 접속
- [ ] Project URL 복사
- [ ] anon public key 복사
- [ ] `.env.local` 파일에 값 입력

**.env.local 확인**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

- [ ] 환경변수 입력 완료
- [ ] 개발 서버 재시작 (`npm run dev`)
- [ ] 콘솔에 환경변수 경고 없음

---

### ✅ 4단계: RLS (Row Level Security) 정책 확인
- [ ] Authentication → Policies 메뉴 접속

**Users 테이블 정책**
- [ ] Users can view own profile
- [ ] Users can update own profile
- [ ] Users can insert own profile

**Budgets 테이블 정책**
- [ ] Users can view own budgets
- [ ] Users can insert own budgets
- [ ] Users can update own budgets
- [ ] Users can delete own budgets

**Expenses 테이블 정책**
- [ ] Users can view own expenses
- [ ] Users can insert own expenses
- [ ] Users can update own expenses
- [ ] Users can delete own expenses

**User_points 테이블 정책**
- [ ] Users can view own points
- [ ] Users can insert own points
- [ ] Users can update own points

**AI_feedback 테이블 정책**
- [ ] Users can view own feedback
- [ ] Users can insert own feedback

---

### ✅ 5단계: 데이터베이스 함수 확인
- [ ] Database → Functions 메뉴 접속
- [ ] `update_budget_spent()` 함수 존재 확인

---

### ✅ 6단계: 인증 설정
- [ ] Authentication → Providers 접속
- [ ] Email Provider 활성화
- [ ] Confirm email 설정 (선택)

**소셜 로그인 (선택사항)**
- [ ] Google OAuth 설정
- [ ] GitHub OAuth 설정
- [ ] 카카오 로그인 설정

---

### ✅ 7단계: 테스트

**연결 테스트**
- [ ] 개발 서버 실행 (`npm run dev`)
- [ ] 브라우저 콘솔에서 Supabase 클라이언트 초기화 확인
- [ ] 환경변수 로드 확인 (경고 없음)

**회원가입 테스트** (선택사항)
- [ ] 테스트 계정으로 회원가입
- [ ] users 테이블에 레코드 생성 확인
- [ ] user_points 자동 생성 확인

**데이터 CRUD 테스트** (선택사항)
- [ ] 지출 등록 (expenses 테이블)
- [ ] 예산 등록 (budgets 테이블)
- [ ] 데이터 조회 성공
- [ ] 데이터 수정 성공
- [ ] 데이터 삭제 성공

**RLS 테스트** (선택사항)
- [ ] 다른 사용자 데이터 접근 불가 확인
- [ ] 본인 데이터만 조회 가능 확인

---

### ✅ 8단계: 추가 설정 (선택사항)

**실시간 구독**
- [ ] Database → Replication 활성화
- [ ] 원하는 테이블 선택

**백업 설정**
- [ ] 자동 백업 활성화 확인
- [ ] 백업 주기 확인

**모니터링**
- [ ] Logs 메뉴 확인
- [ ] API 사용량 확인

---

## 🎯 최종 확인

### 필수 항목
- [ ] ✅ 모든 테이블 생성 완료
- [ ] ✅ RLS 정책 모두 활성화
- [ ] ✅ 환경변수 설정 완료
- [ ] ✅ 개발 서버 정상 실행

### 권장 항목
- [ ] ✅ 테스트 데이터 삽입 및 확인
- [ ] ✅ 인증 흐름 테스트
- [ ] ✅ CRUD 작업 테스트

---

## 🚨 문제 해결

### 자주 발생하는 오류

**1. RLS 정책 오류**
```
Error: new row violates row-level security policy
```
→ 해결: auth.uid()가 user_id와 일치하는지 확인

**2. 환경변수 인식 안됨**
```
Warning: Supabase 환경변수가 설정되지 않았습니다
```
→ 해결: 
- `.env.local` 파일 위치 확인 (프로젝트 루트)
- 개발 서버 재시작
- `NEXT_PUBLIC_` 접두사 확인

**3. UUID 함수 없음**
```
Error: function uuid_generate_v4() does not exist
```
→ 해결:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

**4. 트리거 작동 안함**
→ 해결: SQL Editor에서 함수와 트리거 재실행

---

## 📞 도움말

- [Supabase 공식 문서](https://supabase.com/docs)
- [Discord 커뮤니티](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

## ✅ 완료 확인

모든 체크리스트를 완료하셨다면 축하합니다! 🎉

이제 버짓 애플리케이션에서 Supabase 데이터베이스를 사용할 준비가 되었습니다.

**완료 날짜**: ____________________
**담당자**: ____________________
