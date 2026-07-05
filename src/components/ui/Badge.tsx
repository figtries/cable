import { cn } from '@/lib/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'gray'
  className?: string
}

const variantClass: Record<NonNullable<BadgeProps['variant']>, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-700',
  red: 'bg-red-50 text-red-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
  gray: 'bg-gray-100 text-gray-600',
}

export default function Badge({ children, variant = 'blue', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
      variantClass[variant],
      className
    )}>
      {children}
    </span>
  )
}
