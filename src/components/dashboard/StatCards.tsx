'use client'

import { Plug, Ruler, Layers } from 'lucide-react'
import { Project } from '@/lib/types'
import { fmt0 } from '@/lib/utils'

export default function StatCards({ project }: { project: Project | null }) {
  if (!project) return null

  const totalLen = project.cables.reduce((s, c) => s + c.cut, 0)
  const specs    = new Set(project.cables.map(c => c.spec)).size

  const cableCount = project.cables.length
  const cards = [
    {
      icon: <Plug size={16} className="text-blue-500" />,
      iconBg: 'bg-blue-50',
      label: 'Total Cable Lines',
      value: String(cableCount),
      sub: `route point${cableCount !== 1 ? 's' : ''}`,
      badge: (
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 shrink-0 uppercase tracking-wide">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          active
        </span>
      ),
    },
    {
      icon: <Ruler size={16} className="text-violet-500" />,
      iconBg: 'bg-violet-50',
      label: 'Accumulated Length',
      value: fmt0(totalLen),
      sub: 'Meter',
    },
    {
      icon: <Layers size={16} className="text-amber-500" />,
      iconBg: 'bg-amber-50',
      label: 'Specification Variation',
      value: String(specs),
      sub: `Cable Type${specs !== 1 ? 's' : ''}`,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {cards.map((c, i) => (
        <div
          key={i}
          style={{ animationDelay: `${i * 60}ms` }}
          className="animate-fade-up bg-white rounded-2xl p-5 border border-gray-100 shadow-card
            hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 ease-out"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
              {c.icon}
            </div>
            {c.badge}
          </div>
          <p className="text-[11px] text-gray-400 font-medium mb-1">{c.label}</p>
          <div className="text-[28px] font-bold text-gray-900 tracking-tight tabular-nums leading-none">{c.value}</div>
          <div className="text-[11px] text-gray-400 mt-1.5">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}
