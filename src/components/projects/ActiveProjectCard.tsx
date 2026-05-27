'use client'

import { useRouter } from 'next/navigation'
import { Star, User } from 'lucide-react'
import { Project } from '@/lib/types'
import { fmt0 } from '@/lib/utils'

export default function ActiveProjectCard({ project }: { project: Project }) {
  const router = useRouter()

  const totalLen = project.cables.reduce((s, c) => s + c.cut, 0)

  const handover = project.handover
    ? new Date(project.handover).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—'

  return (
    <div className="relative flex min-h-[430px] overflow-hidden rounded-[28px] bg-[#AEB3BA] px-[36px] pb-[32px] pt-[42px] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 74% 18%, rgba(255,255,255,0.22) 0%, transparent 58%)',
        }}
      />

      <div className="absolute right-[34px] top-[34px] flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-white/12 text-white/80">
        <Star size={13} fill="currentColor" strokeWidth={0} />
      </div>

      <div className="relative z-10 flex w-full flex-col">
        <p className="mb-[18px] text-[10px] font-bold uppercase leading-none tracking-[0.28em] text-white/70">
          Active Project
        </p>

        <h2 className="mb-[14px] max-w-[210px] truncate text-[34px] font-bold leading-none tracking-[-0.045em] text-white">
          {project.name}
        </h2>

        <div className="mb-[26px] space-y-[7px] text-[13px] font-semibold leading-none text-white/70">
          {project.pic && (
            <p className="flex items-center gap-[6px]">
              <User size={11} className="shrink-0 text-white/55" />
              <span>PM: {project.pic}</span>
            </p>
          )}

          {project.location && <p className="pl-[17px]">{project.location}</p>}

          {project.contract && <p className="pl-[17px]">{project.contract}</p>}
        </div>

        <div className="mb-[34px] h-px w-full bg-white/20" />

        <div className="mb-[30px] flex items-start justify-between">
          <div>
            <p className="mb-[12px] text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-white/58">
              Total Cables
            </p>
            <p className="text-[25px] font-bold leading-none tracking-[-0.035em] text-white tabular-nums">
              {project.cables.length}
            </p>
          </div>

          <div className="text-right">
            <p className="mb-[12px] text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-white/58">
              Total Length
            </p>
            <p className="text-[25px] font-bold leading-none tracking-[-0.035em] text-white tabular-nums">
              {fmt0(totalLen)} m
            </p>
          </div>
        </div>

        <div className="mb-[28px]">
          <p className="mb-[10px] text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-white/58">
            Target Handover
          </p>
          <p className="text-[17px] font-bold leading-none tracking-[-0.02em] text-white">
            {handover}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-[10px]">
          <button
            onClick={() => router.push('/calculator')}
            className="h-[44px] w-full rounded-[10px] bg-white text-[15px] font-bold text-gray-950 shadow-[0_10px_20px_rgba(0,0,0,0.10)] transition-all duration-150 hover:bg-gray-50 active:scale-[0.98]"
          >
            Open Calculator →
          </button>

          <button
            onClick={() => router.push('/')}
            className="h-[44px] w-full rounded-[10px] bg-[#3F4249] text-[15px] font-bold text-white transition-all duration-150 hover:bg-[#34373D] active:scale-[0.98]"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}