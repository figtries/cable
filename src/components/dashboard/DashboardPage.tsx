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
  const router = useRouter()
  const projects = useStore(s => s.projects)
  const activeId = useStore(s => s.activeId)
  const deleteCable = useStore(s => s.deleteCable)
  const project = projects.find(p => p.id === activeId) ?? null

  const [disc, setDisc] = useState<Disc>('all')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    cat: '',
    area: '',
    equip: '',
    route: '',
  })
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
      if (filters.cat && c.cat !== filters.cat) return false
      if (filters.area && c.area !== filters.area) return false
      if (filters.equip && c.equip !== filters.equip) return false
      if (filters.route && `${c.from} → ${c.to}` !== filters.route) return false

      if (tokens.length) {
        const blob = [
          c.name,
          c.spec,
          c.func,
          c.area,
          c.equip,
          c.jb,
          c.from,
          c.to,
        ]
          .join(' ')
          .toLowerCase()

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

  function exportCables(cables: CableType[], filename: string) {
    if (!cables.length) return

    const headers = [
      'Name',
      'Type',
      'Spec',
      'Area',
      'Equipment',
      'JB',
      'From',
      'To',
      'Length(m)',
    ]

    const rows = cables.map(c =>
      [
        c.name,
        CAT_CONFIG[c.cat].label,
        c.spec,
        c.area,
        c.equip,
        c.jb,
        c.from,
        c.to,
        c.cut,
      ].join(',')
    )

    const a = document.createElement('a')
    a.href = URL.createObjectURL(
      new Blob([[headers.join(','), ...rows].join('\n')], {
        type: 'text/csv',
      })
    )
    a.download = filename
    a.click()
  }

  function handleExportAll() {
    if (!project) return
    exportCables(project.cables, `${project.name}-cable-schedule-all.csv`)
  }

  function handleExportFiltered() {
    if (!project) return
    const hasFilter = disc !== 'all' || search || filters.cat || filters.area || filters.equip || filters.route
    if (hasFilter) {
      const parts = [project.name]
      if (disc !== 'all') parts.push(disc)
      if (filters.cat) parts.push(CAT_CONFIG[filters.cat as keyof typeof CAT_CONFIG]?.label || filters.cat)
      if (filters.area) parts.push(filters.area)
      if (filters.equip) parts.push(filters.equip)
      if (search) parts.push(search.trim())
      exportCables(filteredCables, `${parts.join('-')}-filtered.csv`)
    } else {
      exportCables(project.cables, `${project.name}-cable-schedule-all.csv`)
    }
  }

  function handleDelete(cableId: string) {
    if (!activeId) return

    const cable = project?.cables.find(c => c.id === cableId)
    deleteCable(activeId, cableId)
    toast(`Deleted "${cable?.name}"`)
  }

  return (
    <div className="animate-fade-up px-4 py-5 md:px-7 md:py-7">
      {/* ── Page header ── */}
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1 text-lg font-bold leading-tight tracking-tight text-gray-900 sm:text-[22px]">
            Cable Schedule
          </h1>
          <p className="text-[12px] text-gray-400 sm:text-[13px]">
            Manage and monitor your entire project cable list in one integrated dashboard.
          </p>
        </div>

        <div className="mt-0.5 flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportAll}
            disabled={!project?.cables.length}
          >
            <Download size={13} /> <span className="hidden sm:inline">Export All Data</span><span className="sm:hidden">Export</span>
          </Button>

          <Button variant="dark" size="sm" onClick={() => setShowModal(true)}>
            <Plus size={13} /> <span className="hidden sm:inline">Add Project</span><span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      {project && <StatCards project={project} />}

      {/* ── No-project empty state ── */}
      {!project && (
        <div className="mb-6 animate-fade-up rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
            <Cable size={22} className="text-gray-300" />
          </div>

          <h3 className="mb-1 text-sm font-semibold text-gray-900">
            No active project
          </h3>

          <p className="mb-5 text-xs text-gray-400">
            Create a project to start managing your cable schedule.
          </p>

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
          <div className="mb-4 animate-fade-up rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-card delay-100 sm:px-5 sm:py-4">
            {/* Row 1 — disc tabs + search */}
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                {(['all', 'instrument', 'electrical'] as Disc[]).map(d => (
                  <button
                    key={d}
                    onClick={() => {
                      setDisc(d)
                      setFilters({ cat: '', area: '', equip: '', route: '' })
                    }}
                    className={`rounded-lg px-4 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
                      disc === d
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search
                  size={13}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Find Cable..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-4 text-[12px] transition-all duration-150 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-50 sm:w-52"
                />
              </div>
            </div>

            {/* Row 2 — filter selects */}
            <div className="border-t border-gray-100 pt-3">
              <FilterBar
                cables={project.cables}
                disc={disc}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
                onExport={handleExportFiltered}
              />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              Cable list card
          ══════════════════════════════════════════════ */}
          <div className="mb-4 animate-fade-up overflow-hidden rounded-[14px] border border-[#E2E6EE] bg-white shadow-[0_2px_5px_rgba(15,23,42,0.10)] delay-150">
            <div className="flex min-h-[56px] items-center justify-between border-b border-[#E6EAF0] px-4 py-3 sm:h-[66px] sm:px-[24px] sm:py-0">
              <div className="flex flex-col justify-center">
                <h3 className="text-[15px] font-bold leading-[18px] tracking-[-0.01em] text-[#111827]">
                  List of Registered Cables
                </h3>

                <p className="mt-[4px] text-[12px] font-medium leading-[15px] text-[#8A93A3]">
                  {filteredCables.length} active cable
                  {filteredCables.length !== 1 ? 's' : ''} in this view
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push('/calculator')}
                className="inline-flex h-[34px] items-center justify-center gap-[7px] rounded-[9px] bg-[#2D9BEF] px-[16px] text-[13px] font-semibold leading-none text-white shadow-sm transition-all duration-150 hover:bg-[#238FE4] active:scale-[0.98]"
              >
                <Plus size={14} strokeWidth={2.2} />
                Add Cable
              </button>
            </div>

            {filteredCables.length > 0 ? (
              <CableTable
                cables={filteredCables}
                tokens={tokens}
                onDelete={handleDelete}
              />
            ) : (
              <div className="py-14 text-center">
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