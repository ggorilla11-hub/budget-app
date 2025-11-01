"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md',
    isLoading = false,
    className, 
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // 기본 스타일
          "inline-flex items-center justify-center font-semibold transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          
          // Variant 스타일
          variant === 'primary' && [
            "bg-primary text-white hover:bg-primary/90",
            "focus:ring-primary",
            "active:scale-95",
          ],
          variant === 'secondary' && [
            "bg-secondary text-white hover:bg-secondary/90",
            "focus:ring-secondary",
            "active:scale-95",
          ],
          variant === 'outline' && [
            "border-2 border-primary text-primary",
            "hover:bg-primary/10",
            "focus:ring-primary",
          ],
          variant === 'ghost' && [
            "text-textPrimary hover:bg-gray-100",
            "focus:ring-gray-300",
          ],

          // Size 스타일
          size === 'sm' && "px-4 py-2 text-sm rounded-md",
          size === 'md' && "px-6 py-3 text-base rounded-lg",
          size === 'lg' && "px-8 py-4 text-lg rounded-lg",

          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            로딩 중...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
