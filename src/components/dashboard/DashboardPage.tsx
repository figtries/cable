'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Download, Search, Cable } from 'lucide-react'
import useStore from '@/store/useStore'
import { CAT_CONFIG } from '@/lib/constants'
import { Cable as CableType } from '@/lib/types'
import Button from '@/components/ui/Button'
import StatCards from './StatCards'
import CableTable from './CableTable'
import FilterBar, { FilterState } from './FilterBar'
import AddProjectModal from './AddProjectModal'
import { useToast } from '@/components/ui/Toast'

type Disc = 'all' | 'instrument' | 'electrical'

function discMatch(c: CableType, disc: Disc) {
  return disc === 'all' || CAT_CONFIG[c.cat].disc === disc
}

export default function DashboardPage() {
  const router      = useRouter()
  const projects    = useStore(s => s.projects)
  const activeId    = useStore(s => s.activeId)
  const deleteCable = useStore(s => s.deleteCable)
  const project     = projects.find(p => p.id === activeId) ?? null

  const [disc, setDisc]           = useState<Disc>('all')
  const [search, setSearch]       = useState('')
  const [filters, setFilters]     = useState<FilterState>({ cat: '', area: '', equip: '', route: '' })
  const [showModal, setShowModal] = useState(false)
  const { show: toast, ToastComponent } = useToast()

  const tokens = useMemo(
    () => search.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [search]
  )

  const filteredCables = useMemo(() => {
    if (!project) return []
    return project.cables.filter(c => {
      if (!discMatch(c, disc)) return false
      if (filters.cat   && c.cat  !== filters.cat)   return false
      if (filters.area  && c.area !== filters.area)   return false
      if (filters.equip && c.equip !== filters.equip) return false
      if (filters.route && `${c.from} → ${c.to}` !== filters.route) return false
      if (tokens.length) {
        const blob = [c.name, c.spec, c.func, c.area, c.equip, c.jb, c.from, c.to].join(' ').toLowerCase()
        if (!tokens.every(t => blob.includes(t))) return false
      }
      return true
    })
  }, [project, disc, filters, tokens])

  function handleFilterChange(key: keyof FilterState, val: string) {
    setFilters(prev => ({ ...prev, [key]: val }))
  }

  function handleReset() {
    setFilters({ cat: '', area: '', equip: '', route: '' })
    setSearch('')
  }

  function handleExport() {
    if (!project?.cables.length) return
    const headers = ['Name', 'Type', 'Spec', 'Area', 'Equipment', 'JB', 'From', 'To', 'Length(m)']
    const rows = project.cables.map(c =>
      [c.name, CAT_CONFIG[c.cat].label, c.spec, c.area, c.equip, c.jb, c.from, c.to, c.cut].join(',')
    )
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' }))
    a.download = `${project.name}-cable-schedule.csv`
    a.click()
  }

  function handleDelete(cableId: string) {
    if (!activeId) return
    const cable = project?.cables.find(c => c.id === cableId)
    deleteCable(activeId, cableId)
    toast(`Deleted "${cable?.name}"`)
  }

  return (
    <div className="animate-fade-up px-7 py-7">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight mb-1">
            Cable Schedule
          </h1>
          <p className="text-[13px] text-gray-400">
            Manage and monitor your entire project cable list in one integrated dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <Button variant="secondary" size="sm" onClick={handleExport} disabled={!project?.cables.length}>
            <Download size={13} /> Export All Data
          </Button>
          <Button variant="dark" size="sm" onClick={() => setShowModal(true)}>
            <Plus size={13} /> Add Project
          </Button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      {project && <StatCards project={project} />}

      {/* ── No-project empty state ── */}
      {!project && (
        <div className="animate-fade-up bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center mb-6">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Cable size={22} className="text-gray-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No active project</h3>
          <p className="text-xs text-gray-400 mb-5">Create a project to start managing your cable schedule.</p>
          <Button variant="dark" size="sm" onClick={() => setShowModal(true)}>
            <Plus size={13} /> Add Project
          </Button>
        </div>
      )}

      {project && (
        <>
          {/* ══════════════════════════════════════════════
              ONE unified card: tabs + search + filters
          ══════════════════════════════════════════════ */}
          <div className="animate-fade-up delay-100 bg-white rounded-2xl border border-gray-100 shadow-card px-5 py-4 mb-4">

            {/* Row 1 — disc tabs + search */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {(['all', 'instrument', 'electrical'] as Disc[]).map(d => (
                  <button
                    key={d}
                    onClick={() => { setDisc(d); setFilters({ cat: '', area: '', equip: '', route: '' }) }}
                    className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200
                      ${disc === d
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Find Cable..."
                  className="pl-8 pr-4 py-2 text-[12px] border border-gray-200 rounded-xl bg-white
                    focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 w-52
                    transition-all duration-150 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Row 2 — filter selects */}
            <div className="pt-3 border-t border-gray-100">
              <FilterBar
                cables={project.cables}
                disc={disc}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
                onExport={handleExport}
              />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              Cable list card
          ══════════════════════════════════════════════ */}
          <div className="animate-fade-up delay-150 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden mb-4">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-semibold text-gray-900">List of Registered Cables</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {filteredCables.length} active cable{filteredCables.length !== 1 ? 's' : ''} in this view
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={() => router.push('/calculator')}>
                <Plus size={13} /> Add Cable
              </Button>
            </div>

            {filteredCables.length > 0 ? (
              <CableTable cables={filteredCables} tokens={tokens} onDelete={handleDelete} />
            ) : (
              <div className="py-16 text-center">
                <p className="text-xs text-gray-400">
                  {project.cables.length === 0
                    ? 'No cables yet. Add one from the Calculator.'
                    : 'No cables match the current filter.'}
                </p>
              </div>
            )}
          </div>

        </>
      )}

      <AddProjectModal open={showModal} onClose={() => setShowModal(false)} />
      {ToastComponent}
    </div>
  )
}
