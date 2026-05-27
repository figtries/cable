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
  cables, disc, filters, onFilterChange, onReset, onExport,
}: FilterBarProps) {
  const pool   = disc === 'all' ? cables : cables.filter(c => CAT_CONFIG[c.cat].disc === disc)
  const cats   = uniq(pool.map(c => c.cat))
  const areas  = uniq(pool.map(c => c.area))
  const equips = uniq(pool.map(c => c.equip))
  const routes = uniq(pool.map(c => (c.from && c.to) ? `${c.from} → ${c.to}` : ''))
  const hasFilter = !!(filters.cat || filters.area || filters.equip || filters.route)

  const selCls = (active: boolean) =>
    cn(
      'h-8 px-3 text-[12px] font-medium border rounded-lg bg-white cursor-pointer appearance-none',
      'focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors',
      active
        ? 'border-blue-400 text-blue-600 bg-blue-50/50'
        : 'border-gray-200 text-gray-600 hover:border-gray-300'
    )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select className={selCls(!!filters.cat)} value={filters.cat}
        onChange={e => onFilterChange('cat', e.target.value)}>
        <option value="">Type: all</option>
        {cats.map(c => (
          <option key={c} value={c}>{CAT_CONFIG[c as keyof typeof CAT_CONFIG].label}</option>
        ))}
      </select>

      <select className={selCls(!!filters.area)} value={filters.area}
        onChange={e => onFilterChange('area', e.target.value)}>
        <option value="">Area: all</option>
        {areas.map(a => <option key={a} value={a}>{a}</option>)}
      </select>

      <select className={selCls(!!filters.equip)} value={filters.equip}
        onChange={e => onFilterChange('equip', e.target.value)}>
        <option value="">Tool: all</option>
        {equips.map(e => <option key={e} value={e}>{e}</option>)}
      </select>

      <select className={selCls(!!filters.route)} value={filters.route}
        onChange={e => onFilterChange('route', e.target.value)}>
        <option value="">Route: all</option>
        {routes.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={onReset}
          className={cn(
            'text-[12px] font-medium transition-colors',
            hasFilter ? 'text-gray-500 hover:text-gray-900' : 'text-gray-300 cursor-default pointer-events-none'
          )}
        >
          Reset
        </button>
        <button
          onClick={onExport}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 transition-colors"
        >
          <Download size={13} />
        </button>
      </div>
    </div>
  )
}
