import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00C2A8',      // 민트 그린
        secondary: '#00A896',    // 에메랄드
        accent: '#FF6B6B',       // 코랄
        success: '#51CF66',      // 딥 그린
        warning: '#FFD93D',      // 옐로우
        background: '#F8F9FA',   // 소프트 화이트
        textPrimary: '#212529',  // 차콜
        textSecondary: '#868E96', // 그레이
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
        medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
        strong: '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}

export default config
