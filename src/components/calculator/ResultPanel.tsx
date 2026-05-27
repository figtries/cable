'use client'

import { Save } from 'lucide-react'
import { RunResult, fmtDec } from '@/lib/utils'
import { CalcParams } from './RouteConditionsCard'
import { Project } from '@/lib/types'
import useStore from '@/store/useStore'

interface Props {
  result: RunResult
  params: CalcParams
  projects: Project[]
  activeId: string | null
  canSave: boolean
  onSave: () => void
}

function Row({
  label,
  badge,
  value,
  bold,
  blue,
  divider,
}: {
  label: string
  badge?: string
  value: string
  bold?: boolean
  blue?: boolean
  divider?: boolean
}) {
  return (
    <div
      className={[
        'flex items-center justify-between',
        divider ? 'mt-3 border-t border-[#ECEEF3] pt-4' : 'py-[9px]',
      ].join(' ')}
    >
      <div
        className={[
          'flex items-center gap-2',
          blue
            ? 'text-[13px] font-bold uppercase tracking-[0.12em] text-[#2D98E9]'
            : bold
              ? 'text-[13px] font-bold uppercase tracking-[0.03em] text-[#111827]'
              : 'text-[13px] font-medium text-[#5F6B7A]',
        ].join(' ')}
      >
        <span>{label}</span>

        {badge && (
          <span className="rounded-md bg-[#F1F3F6] px-2 py-[2px] text-[10px] font-semibold leading-none text-[#6B7280]">
            {badge}
          </span>
        )}
      </div>

      <div
        className={[
          'tabular-nums',
          blue
            ? 'text-[22px] font-bold text-[#2D98E9]'
            : bold
              ? 'text-[16px] font-bold text-[#111827]'
              : 'text-[15px] font-medium text-[#4B5563]',
        ].join(' ')}
      >
        {value}
      </div>
    </div>
  )
}

export default function ResultPanel({
  result,
  params,
  projects,
  activeId,
  canSave,
  onSave,
}: Props) {
  const setActiveId = useStore((s) => s.setActiveId)

  return (
    <div className="w-full">
      <div className="flex min-h-[300px] w-full overflow-hidden rounded-[24px] border border-[#E8EBF0] bg-white shadow-[0_10px_28px_rgba(16,24,40,0.12)]">
        {/* Left */}
        <div className="flex w-[30%] shrink-0 flex-col items-center justify-center bg-[#2D98E9] px-10 text-center">
          <p className="mb-[22px] text-center text-[12px] font-bold uppercase tracking-[0.32em] text-white/75">
            Total Estimate
          </p>

          <div className="flex items-end justify-center gap-[6px]">
            <span className="tabular-nums text-[78px] font-bold leading-[0.85] tracking-[-0.05em] text-white">
              {result.cut}
            </span>

            <span className="mb-[9px] text-[24px] font-semibold leading-none text-white/90">
              m
            </span>
          </div>
        </div>

        {/* Middle */}
        <div className="flex-1 border-r border-[#ECEEF3] bg-white px-9 py-9 lg:px-10">
          <p className="mb-6 text-[12px] font-bold uppercase tracking-[0.22em] text-[#7B8794]">
            Calculation Details
          </p>

          <Row
            label="Horizontal length"
            value={`${result.horizontal.toFixed(1)} m`}
          />

          <Row
            label="+ Vertical ups and downs"
            value={`${result.vertical.toFixed(1)} m`}
          />

          <Row
            label="+ Turns & offsets"
            badge={`${params.hAllowance}%`}
            value={`${fmtDec(result.hAdd)} m`}
          />

          <Row
            label="+ Termination flexibility"
            badge="2 ujung"
            value={`${fmtDec(result.termAdd)} m`}
          />

          <Row
            label="Installed subtotal"
            value={`${fmtDec(result.installed)} m`}
            bold
            divider
          />

          <Row
            label="+ Measurement tolerance"
            badge={`${params.tolerance}%`}
            value={`${fmtDec(result.tolAdd)} m`}
          />

          <Row
            label="Total (rounded)"
            value={`${result.cut} m`}
            blue
            bold
            divider
          />
        </div>

        {/* Right */}
        <div className="flex w-[28%] shrink-0 flex-col justify-center bg-white px-9 py-9">
          <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.22em] text-[#7B8794]">
            Save to Project
          </p>

          <select
            className="mb-5 h-[52px] w-full cursor-pointer rounded-[14px] border border-[#D9DEE7] bg-white px-4 text-[15px] font-medium text-[#1F2937] outline-none transition-colors focus:border-[#2D98E9]"
            value={activeId ?? ''}
            onChange={(e) => setActiveId(e.target.value || null)}
          >
            {projects.length === 0 && <option value="">No project yet</option>}

            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={onSave}
            disabled={!canSave || !activeId}
            className="mb-5 flex h-[56px] w-full items-center justify-center gap-2 rounded-[16px] bg-[#9DCAF0] text-[15px] font-bold text-white transition-colors hover:bg-[#84BCEA] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            Save Cable
          </button>

          <p className="max-w-[240px] text-[13px] leading-relaxed text-[#98A2B3]">
            Calculations update automatically as you type.
          </p>
        </div>
      </div>
    </div>
  )
}