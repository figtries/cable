'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown, Check } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Cable } from '@/lib/types'
import { CAT_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/cn'

export interface FilterState {
  cat: string
  area: string
  equip: string
  route: string
}

interface FilterBarProps {
  cables: Cable[]
  disc: string
  filters: FilterState
  onFilterChange: (key: keyof FilterState, val: string) => void
  onReset: () => void
  onExport: () => void
}

function uniq(arr: string[]) {
  const seen: Record<string, true> = {}
  return arr.filter(x => x && !seen[x] && (seen[x] = true)).sort()
}

/* ─── Custom dropdown ─── */
interface DropdownOption {
  value: string
  label: string
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: DropdownOption[]
  onChange: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })

  const active = !!value
  const displayLabel = value
    ? options.find(o => o.value === value)?.label ?? value
    : `${label}: all`

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !dropRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  useEffect(() => {
    if (!open || !btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const dropWidth = Math.max(rect.width, 160)
    setPos({ top: rect.bottom + 6, left: rect.left, width: dropWidth })
  }, [open])

  function handleSelect(val: string) {
    onChange(val)
    setOpen(false)
  }

  const allOptions: DropdownOption[] = [
    { value: '', label: `${label}: all` },
    ...options,
  ]

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex h-[34px] shrink-0 items-center gap-1.5 rounded-[10px] border px-3 text-[12px] font-medium transition-all duration-150',
          active
            ? 'border-[#2D98E9]/30 bg-[#F0F7FF] text-[#2D98E9]'
            : 'border-[#E4E7EC] bg-white text-[#4B5563] hover:border-[#D1D5DB] hover:bg-gray-50',
          open && 'border-[#2D98E9] ring-2 ring-[#2D98E9]/10'
        )}
      >
        <span className="max-w-[140px] truncate">{displayLabel}</span>
        <ChevronDown
          size={12}
          className={cn(
            'shrink-0 text-gray-400 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropRef}
            className="fixed z-[9999] overflow-hidden rounded-[12px] border border-gray-100 bg-white py-1 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            <div className="max-h-[220px] overflow-y-auto py-1">
              {allOptions.map(opt => {
                const selected = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors',
                      selected
                        ? 'bg-[#F0F7FF] font-semibold text-[#2D98E9]'
                        : 'font-medium text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-all',
                        selected
                          ? 'border-[#2D98E9] bg-[#2D98E9] text-white'
                          : 'border-gray-300 bg-white'
                      )}
                    >
                      {selected && <Check size={10} strokeWidth={3} />}
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

/* ─── FilterBar ─── */
export default function FilterBar({
  cables,
  disc,
  filters,
  onFilterChange,
  onReset,
  onExport,
}: FilterBarProps) {
  const pool = disc === 'all' ? cables : cables.filter(c => CAT_CONFIG[c.cat].disc === disc)
  const cats = uniq(pool.map(c => c.cat))
  const areas = uniq(pool.map(c => c.area))
  const equips = uniq(pool.map(c => c.equip))
  const routes = uniq(pool.map(c => (c.from && c.to ? `${c.from} → ${c.to}` : '')))

  const hasFilter = !!(filters.cat || filters.area || filters.equip || filters.route)

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <FilterDropdown
        label="Type"
        value={filters.cat}
        options={cats.map(c => ({
          value: c,
          label: CAT_CONFIG[c as keyof typeof CAT_CONFIG].label,
        }))}
        onChange={v => onFilterChange('cat', v)}
      />

      <FilterDropdown
        label="Area"
        value={filters.area}
        options={areas.map(a => ({ value: a, label: a }))}
        onChange={v => onFilterChange('area', v)}
      />

      <FilterDropdown
        label="Tool"
        value={filters.equip}
        options={equips.map(e => ({ value: e, label: e }))}
        onChange={v => onFilterChange('equip', v)}
      />

      <FilterDropdown
        label="Route"
        value={filters.route}
        options={routes.map(r => ({ value: r, label: r }))}
        onChange={v => onFilterChange('route', v)}
      />

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          onClick={onReset}
          className={cn(
            'h-[34px] rounded-lg px-2.5 text-[12px] font-medium transition-colors',
            hasFilter
              ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              : 'pointer-events-none cursor-default text-gray-300'
          )}
        >
          Reset
        </button>

        <button
          onClick={onExport}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-[#E4E7EC] bg-white text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  )
}
