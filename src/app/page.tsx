import { Wallet, TrendingUp, Target, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        {/* 헤더 */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full mb-6 shadow-medium">
            <Wallet size={32} />
            <h1 className="text-4xl font-bold">버짓</h1>
          </div>
          <p className="text-2xl text-textPrimary font-semibold mb-2">
            스마트한 예산관리의 시작
          </p>
          <p className="text-textSecondary text-lg">
            AI가 함께하는 재무 코칭
          </p>
          
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button variant="primary" size="lg">
                시작하기
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                로그인
              </Button>
            </Link>
          </div>
        </header>

        {/* 주요 기능 카드 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <FeatureCard
            icon={<TrendingUp className="text-primary" size={48} />}
            title="실시간 지출 추적"
            description="수입과 지출을 한눈에 파악하고 카테고리별로 관리하세요"
            badge="핵심 기능"
          />
          <FeatureCard
            icon={<Target className="text-secondary" size={48} />}
            title="목표 설정"
            description="저축 목표를 세우고 달성 과정을 시각화해보세요"
            badge="챌린지"
          />
          <FeatureCard
            icon={<Sparkles className="text-accent" size={48} />}
            title="AI 코칭"
            description="GPT-4가 분석한 맞춤형 재무 조언을 받아보세요"
            badge="프리미엄"
          />
        </div>

        {/* 디자인 시스템 프리뷰 */}
        <Card className="max-w-4xl mx-auto animate-slide-up">
          <CardHeader>
            <CardTitle>디자인 시스템 적용 완료 🎨</CardTitle>
            <CardDescription>
              Noom 스타일의 깔끔하고 직관적인 디자인
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 컬러 팔레트 */}
              <div>
                <h4 className="font-semibold mb-3 text-textPrimary">컬러 팔레트</h4>
                <div className="grid grid-cols-4 gap-3">
                  <ColorSwatch color="bg-primary" name="Primary" />
                  <ColorSwatch color="bg-secondary" name="Secondary" />
                  <ColorSwatch color="bg-accent" name="Accent" />
                  <ColorSwatch color="bg-success" name="Success" />
                  <ColorSwatch color="bg-warning" name="Warning" />
                  <ColorSwatch color="bg-background" name="Background" border />
                  <ColorSwatch color="bg-textPrimary" name="Text Primary" />
                  <ColorSwatch color="bg-textSecondary" name="Text Secondary" />
                </div>
              </div>

              {/* 버튼 */}
              <div>
                <h4 className="font-semibold mb-3 text-textPrimary">버튼</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm">Primary Small</Button>
                  <Button variant="secondary" size="md">Secondary Medium</Button>
                  <Button variant="outline" size="lg">Outline Large</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="primary" isLoading>Loading</Button>
                </div>
              </div>

              {/* 배지 */}
              <div>
                <h4 className="font-semibold mb-3 text-textPrimary">배지</h4>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="accent">Accent</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 기술 스택 */}
        <div className="mt-16 text-center">
          <p className="text-sm text-textSecondary mb-4">기술 스택</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'OpenAI', 'Zustand', 'Chart.js'].map((tech) => (
              <Badge key={tech} variant="secondary" size="sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* 상태 표시 */}
        <div className="mt-12 text-center">
          <Card className="inline-block animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <div className="text-left">
                <p className="text-textPrimary font-semibold">서버 실행 중</p>
                <p className="text-sm text-textSecondary">localhost:3000</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode
  title: string
  description: string
  badge: string
}) {
  return (
    <Card hover className="animate-slide-up">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="primary" size="sm">{badge}</Badge>
        </div>
        <CardDescription className="leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

function ColorSwatch({ 
  color, 
  name, 
  border = false 
}: { 
  color: string
  name: string
  border?: boolean
}) {
  return (
    <div className="text-center">
      <div 
        className={`w-full h-16 rounded-lg mb-2 ${color} ${border ? 'border-2 border-gray-300' : ''}`}
      />
      <p className="text-xs text-textSecondary">{name}</p>
    </div>
  )
}
