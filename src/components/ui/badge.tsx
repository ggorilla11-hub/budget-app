"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'accent' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "badge inline-flex items-center font-medium",
          
          // Variant 스타일
          variant === 'primary' && "badge-primary",
          variant === 'success' && "badge-success",
          variant === 'warning' && "badge-warning",
          variant === 'accent' && "badge-accent",
          variant === 'secondary' && "bg-secondary/10 text-secondary",

          // Size 스타일
          size === 'sm' && "px-2 py-0.5 text-xs",
          size === 'md' && "px-3 py-1 text-sm",
          size === 'lg' && "px-4 py-1.5 text-base",

          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'
