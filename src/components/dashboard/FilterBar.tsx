'use client'

import { Download } from 'lucide-react'
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

  const selCls = (active: boolean) =>
    cn(
      'h-[36px] rounded-[8px] border bg-white',
      'px-0 py-0 text-center text-[13px] font-medium leading-[36px]',
      'appearance-none cursor-pointer outline-none',
      '[text-align-last:center]',
      'transition-all duration-150',
      active
        ? 'border-[#D9DEE7] bg-white text-[#111827]'
        : 'border-[#E4E7EC] bg-white text-[#374151] hover:border-[#D1D5DB]'
    )

  return (
    <div className="flex w-full flex-wrap items-center gap-[8px] overflow-x-auto">
      <select
        className={cn(selCls(!!filters.cat), 'w-[92px] shrink-0')}
        value={filters.cat}
        onChange={e => onFilterChange('cat', e.target.value)}
      >
        <option value="">Type: all</option>
        {cats.map(c => (
          <option key={c} value={c}>
            {CAT_CONFIG[c as keyof typeof CAT_CONFIG].label}
          </option>
        ))}
      </select>

      <select
        className={cn(selCls(!!filters.area), 'w-[84px] shrink-0')}
        value={filters.area}
        onChange={e => onFilterChange('area', e.target.value)}
      >
        <option value="">Area: all</option>
        {areas.map(a => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        className={cn(selCls(!!filters.equip), 'w-[76px] shrink-0')}
        value={filters.equip}
        onChange={e => onFilterChange('equip', e.target.value)}
      >
        <option value="">Tool: all</option>
        {equips.map(e => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>

      <select
        className={cn(selCls(!!filters.route), 'w-[92px] shrink-0 truncate')}
        value={filters.route}
        onChange={e => onFilterChange('route', e.target.value)}
      >
        <option value="">Route: all</option>
        {routes.map(r => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <div className="ml-auto flex shrink-0 items-center gap-[8px]">
        <button
          onClick={onReset}
          className={cn(
            'h-[36px] px-1 text-[12px] font-medium transition-colors',
            hasFilter
              ? 'text-gray-500 hover:text-gray-900'
              : 'pointer-events-none cursor-default text-gray-300'
          )}
        >
          Reset
        </button>

        <button
          onClick={onExport}
          className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-[#E4E7EC] bg-white text-gray-400 transition-colors hover:bg-gray-50"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  )
}