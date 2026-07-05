'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Save } from 'lucide-react'
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
            ? 'text-[13px] font-bold uppercase tracking-[0.03em] text-[#2D98E9]'
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

function ProjectDropdown({
  projects,
  activeId,
  onChange,
}: {
  projects: Project[]
  activeId: string | null
  onChange: (id: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const activeProject = projects.find((p) => p.id === activeId)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapRef} className="relative mb-5 w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          'flex h-[52px] w-full items-center justify-between rounded-[14px] border bg-white px-4',
          'text-left text-[15px] font-medium text-[#1F2937]',
          'outline-none transition-all',
          open
            ? 'border-[#2D98E9] shadow-[0_0_0_3px_rgba(45,152,233,0.12)]'
            : 'border-[#D9DEE7] hover:border-[#BFC7D4]',
        ].join(' ')}
      >
        <span className="truncate">
          {activeProject?.name ?? 'Select project'}
        </span>

        <ChevronDown
          size={18}
          className={[
            'shrink-0 text-[#1F2937] transition-transform duration-200',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[14px] border border-[#D9DEE7] bg-white shadow-[0_14px_32px_rgba(16,24,40,0.14)]">
          {projects.length === 0 ? (
            <div className="px-4 py-3 text-[14px] font-medium text-[#98A2B3]">
              No project yet
            </div>
          ) : (
            projects.map((project) => {
              const selected = project.id === activeId

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    onChange(project.id)
                    setOpen(false)
                  }}
                  className={[
                    'flex min-h-[44px] w-full items-center px-4 text-left text-[15px] font-medium transition-colors',
                    selected
                      ? 'bg-[#2D98E9] text-white'
                      : 'bg-white text-[#1F2937] hover:bg-[#F2F7FC]',
                  ].join(' ')}
                >
                  <span className="truncate">{project.name}</span>
                </button>
              )
            })
          )}
        </div>
      )}
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
      <div className="flex flex-col w-full overflow-visible rounded-[24px] border border-[#E8EBF0] bg-white shadow-[0_10px_28px_rgba(16,24,40,0.12)] md:flex-row md:min-h-[300px]">
        {/* Left — total */}
        <div className="flex w-full shrink-0 flex-col items-center justify-center rounded-t-[24px] bg-[#2D98E9] px-10 py-8 text-center md:w-[30%] md:rounded-l-[24px] md:rounded-tr-none md:py-0">
          <p className="mb-[22px] text-center text-[12px] font-bold uppercase tracking-[0.22em] text-white/75">
            Total
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

        {/* Middle — calculation details */}
        <div className="flex-1 border-b border-[#ECEEF3] bg-white px-5 py-6 md:border-b-0 md:border-r md:px-9 md:py-9 lg:px-10">
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
            badge={`${params.bends}%`}
            value={`${fmtDec(result.bendsAdd)} m`}
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
          label="TOTAL (ROUNDED)"
          value={`${result.cut} m`}
          blue
          bold
          divider
        />
        </div>

        {/* Right — save */}
        <div className="flex w-full shrink-0 flex-col justify-center rounded-b-[24px] bg-white px-5 py-6 md:w-[28%] md:rounded-r-[24px] md:rounded-bl-none md:px-9 md:py-9">
          <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.22em] text-[#7B8794]">
            Save to Project
          </p>

          <ProjectDropdown
            projects={projects}
            activeId={activeId}
            onChange={setActiveId}
          />

          <button
            onClick={onSave}
            disabled={!canSave || !activeId}
            className="mb-5 flex h-[56px] w-full items-center justify-center gap-2 rounded-[16px] bg-[#2D98E9] text-[15px] font-bold text-white transition-colors hover:bg-[#2387D5] disabled:cursor-not-allowed disabled:bg-[#2D98E9]/35 disabled:text-white/80"
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