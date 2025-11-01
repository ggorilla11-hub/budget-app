"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...')
  const [details, setDetails] = useState<any>({})

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    try {
      // 환경변수 확인
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      setDetails({
        url: url || 'MISSING',
        keyPrefix: key ? key.substring(0, 20) + '...' : 'MISSING',
        hasUrl: !!url,
        hasKey: !!key
      })

      // Supabase 연결 테스트
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setStatus('❌ Error: ' + error.message)
      } else {
        setStatus('✅ Supabase Connected!')
      }
    } catch (err: any) {
      setStatus('❌ Exception: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-lg">Status:</h2>
            <p className="text-xl">{status}</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg">Environment Variables:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="font-semibold text-lg">Test Signup:</h2>
            <button
              onClick={async () => {
                const testEmail = 'test' + Date.now() + '@example.com'
                const { data, error } = await supabase.auth.signUp({
                  email: testEmail,
                  password: 'test123456'
                })
                if (error) {
                  alert('❌ Signup Error: ' + error.message)
                } else {
                  alert('✅ Signup Success!')
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
