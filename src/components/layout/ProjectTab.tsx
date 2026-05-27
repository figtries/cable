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
          relative isolate flex h-[56px] w-[278px]
          items-center rounded-t-[34px] bg-white
          pl-[43px] pr-[45px]
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
          className="
            relative z-10 max-w-[145px] truncate select-none
            text-[22px] font-semibold leading-none
            tracking-[-0.035em] text-[#001F41]
          "
        >
          {active.name}
        </span>

        <button
          type="button"
          aria-label="Close project tab"
          onClick={() => setActiveId(null)}
          className="
            relative z-10 ml-auto flex h-7 w-7 shrink-0
            items-center justify-center rounded-full
            text-[#1F2328] transition-all duration-150
            hover:bg-black/[0.04] active:scale-90
          "
        >
          <X size={20} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  )
}