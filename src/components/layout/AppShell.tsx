'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import ProjectTab from './ProjectTab'
import useStore from '@/store/useStore'

export default function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useStore.persist.rehydrate()
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#EAECF5] px-2 pb-2 pt-2 md:px-4 md:pb-4 md:pt-3">
      {/* Header / tab area — hidden on mobile */}
      <div className="hidden h-[62px] shrink-0 items-end overflow-hidden lg:flex">
        <div className="flex h-full w-[260px] shrink-0 items-center pl-[48px]">
          <Image
            src="/figtries-logo.png"
            alt="Figtries"
            width={2048}
            height={1116}
            style={{ height: '54px', width: 'auto' }}
            className="shrink-0"
          />
        </div>
        <ProjectTab />
      </div>

      {/* Main white shell */}
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-[16px] bg-white shadow-sm md:rounded-[24px]">
        {/* Desktop sidebar */}
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          {/* Mobile header */}
          <div className="flex h-[52px] shrink-0 items-center border-b border-gray-100 px-4 lg:hidden">
            <Image
              src="/figtries-logo.png"
              alt="Figtries"
              width={2048}
              height={1116}
              style={{ height: '30px', width: 'auto' }}
              className="shrink-0"
            />
          </div>

          <main className="flex-1 overflow-y-auto pb-[68px] lg:pb-0">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  )
}
