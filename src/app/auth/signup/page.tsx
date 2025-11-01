"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 비밀번호 확인
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      if (data.user) {
        setSuccess(true)
        // 이메일 확인이 필요한 경우
        if (data.user.identities && data.user.identities.length === 0) {
          setError('이미 가입된 이메일입니다.')
          setSuccess(false)
        } else {
          // 자동 로그인되는 경우 (이메일 확인 불필요)
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      }
    } catch (error: any) {
      setError(error.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-textPrimary mb-2">
              회원가입 완료!
            </h2>
            <p className="text-textSecondary mb-6">
              대시보드로 이동합니다...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mx-auto" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="inline-flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-full mb-4 mx-auto">
            <Wallet size={24} />
            <h1 className="text-2xl font-bold">버짓</h1>
          </div>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>
            지금 바로 스마트한 예산관리를 시작하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-textPrimary mb-1">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-textPrimary mb-1">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="최소 6자 이상"
                required
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-textPrimary mb-1">
                비밀번호 확인
              </label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="비밀번호 재입력"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
            >
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-textSecondary">
              이미 계정이 있으신가요?{' '}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
