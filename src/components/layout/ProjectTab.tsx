'use client'

import { X } from 'lucide-react'
import useStore from '@/store/useStore'

export default function ProjectTab() {
  const projects = useStore(s => s.projects)
  const activeId = useStore(s => s.activeId)
  const setActiveId = useStore(s => s.setActiveId)

  const active = projects.find(p => p.id === activeId) ?? null

  if (!active) return null

  return (
    <div className="relative z-20 -ml-[82px] animate-fade-in">
      <div
        className="
          relative isolate flex h-[58px] w-[338px]
          items-center overflow-visible rounded-t-[34px] bg-white
          pl-[48px] pr-[66px]
        "
      >
        {/* smooth white curve kiri bawah tab */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[-34px] h-[34px] w-[34px]"
          style={{
            borderBottomRightRadius: 34,
            boxShadow: '17px 17px 0 17px #ffffff',
          }}
        />

        {/* smooth white curve kanan bawah tab */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-[-34px] h-[34px] w-[34px]"
          style={{
            borderBottomLeftRadius: 34,
            boxShadow: '-17px 17px 0 17px #ffffff',
          }}
        />

        <span
          title={active.name}
          className="
            relative z-10 flex h-[34px] min-w-0 flex-1
            items-center overflow-hidden text-ellipsis whitespace-nowrap
            select-none text-[20px] font-semibold leading-[34px]
            tracking-[-0.025em] text-[#001F41]
          "
        >
          {active.name}
        </span>

        <button
          type="button"
          aria-label="Close project tab"
          onClick={() => setActiveId(null)}
          className="
            absolute right-[30px] top-1/2 z-20 flex h-[32px] w-[32px]
            -translate-y-1/2 items-center justify-center rounded-full
            text-[#1F2328] transition-all duration-150
            hover:bg-[#EEF0F3] active:scale-90
          "
        >
          <X size={22} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}