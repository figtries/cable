'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

const variantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'bg-[#2D98E9] text-white hover:bg-[#1E8AD6] shadow-sm',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm',
  ghost:     'bg-transparent text-[#2D98E9] hover:bg-blue-50',
  danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  dark:      'bg-gray-900 text-white hover:bg-gray-800 shadow-sm',
}

const sizeClass: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs px-3 py-2 rounded-xl gap-1.5',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
  lg: 'text-sm px-5 py-3 rounded-xl gap-2',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-150 ease-out',
        'active:scale-[0.96]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        variantClass[variant],
        sizeClass[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)

Button.displayName = 'Button'
export default Button
