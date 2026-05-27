'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Sidebar from './Sidebar'
import ProjectTab from './ProjectTab'
import useStore from '@/store/useStore'

export default function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useStore.persist.rehydrate()
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#EAECF5] px-4 pb-4 pt-3">
      {/* Header / tab area */}
      <div className="flex h-[62px] shrink-0 items-end overflow-hidden">
        {/* Logo zone: harus sama dengan width Sidebar */}
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
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-[24px] bg-white shadow-sm">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}