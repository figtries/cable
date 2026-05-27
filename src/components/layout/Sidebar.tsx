'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calculator, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/cn'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/projects', label: 'Project', icon: FolderOpen },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col bg-white">
      <nav className="flex-1 pb-4 pl-[42px] pr-[22px] pt-[34px]">
        <p className="mb-7 text-[14px] font-bold uppercase leading-none tracking-[0.34em] text-[#8B919B]">
          General
        </p>

        <div className="flex flex-col gap-3">
          {navItems.map(({ href, label, icon: Icon }, i) => {
            const isActive = pathname === href

            return (
              <Link
                key={href}
                href={href}
                style={{ animationDelay: `${i * 50 + 60}ms` }}
                className={cn(
                  `
                    group flex h-[50px] w-full animate-slide-left
                    items-center gap-[16px] rounded-[10px]
                    px-[18px] text-[16px] font-semibold leading-none
                    transition-all duration-200 ease-out
                  `,
                  isActive
                    ? 'bg-[#EFEFF1] text-[#343941] shadow-[0_8px_16px_rgba(0,0,0,0.14)]'
                    : 'bg-transparent text-[#6F7784] shadow-none hover:bg-[#F5F6F8] hover:text-[#343941]'
                )}
              >
                <Icon
                  size={22}
                  strokeWidth={2.15}
                  className={cn(
                    'shrink-0 transition-colors duration-200',
                    isActive
                      ? 'text-[#7B8088]'
                      : 'text-[#8B919B] group-hover:text-[#7B8088]'
                  )}
                />

                <span className="translate-y-[0.5px]">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}