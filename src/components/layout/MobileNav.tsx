'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calculator, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/cn'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-[64px] items-center justify-around border-t border-gray-200 bg-white/95 backdrop-blur-md lg:hidden">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-1.5 text-[10px] font-semibold transition-colors',
              isActive ? 'text-[#2D98E9]' : 'text-gray-400'
            )}
          >
            <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
