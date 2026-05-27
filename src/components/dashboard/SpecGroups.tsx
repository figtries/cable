'use client'

import { useState } from 'react'
import { Cable } from '@/lib/types'
import { CAT_CONFIG, DRUM_SIZES } from '@/lib/constants'
import { packDrums, bestDrumSize, fmt0 } from '@/lib/utils'

interface SpecGroupsProps {
  cables: Cable[]
  projectId: string
}

export default function SpecGroups({ cables, projectId }: SpecGroupsProps) {
  const [drumSizes, setDrumSizes] = useState<Record<string, number>>({})

  const groups = cables.reduce<Record<string, Cable[]>>((acc, c) => {
    ;(acc[c.spec] = acc[c.spec] || []).push(c)
    return acc
  }, {})

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden mb-4">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Total per cable type</h3>
          <p className="text-xs text-gray-400 mt-0.5">Grouped by specification · includes drum purchase optimisation</p>
        </div>
      </div>

      {Object.entries(groups).map(([spec, grp], idx) => {
        const key = `${projectId}|${spec}`
        const sz = drumSizes[key] ?? 1000
        const splice = CAT_CONFIG[grp[0].cat].splice
        const lengths = grp.map(c => c.cut)
        const need = lengths.reduce((a, b) => a + b, 0)
        const pk = packDrums(lengths, sz, splice)
        const buy = pk.count * sz
        const util = buy > 0 ? Math.round((need / buy) * 100) : 0
        const rec = bestDrumSize(lengths, splice)
        const cat = CAT_CONFIG[grp[0].cat]

        return (
          <div key={spec} className={idx > 0 ? 'border-t border-gray-100' : ''}>
            <div className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-900">{spec}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${cat.tagClass}`}>
                    {cat.shortLabel}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {grp.length} runs · need {fmt0(need)} m
                  {splice ? ' · splicing allowed' : ' · no splice'}
                </div>
              </div>
              <div className="flex items-center gap-5 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Buy</div>
                  <div className="text-lg font-bold text-gray-900 tabular-nums">{pk.count} drum</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total</div>
                  <div className="text-lg font-bold text-gray-900 tabular-nums">{fmt0(buy)} m</div>
                </div>
                <select
                  value={sz}
                  onChange={e => setDrumSizes(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  className="px-2.5 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  {DRUM_SIZES.map(d => <option key={d} value={d}>{d} m</option>)}
                </select>
              </div>
            </div>

            {/* Utilisation bar */}
            <div className="px-5 pb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-green-700">Used {fmt0(need)} m ({util}%)</span>
                <span className="font-semibold text-amber-600">Waste {fmt0(buy - need)} m</span>
              </div>
              <div className="h-1.5 rounded-full bg-amber-100 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${util}%` }} />
              </div>
            </div>

            {pk.oversize.length > 0 && (
              <div className="mx-5 mb-4 flex gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                <span>⚠️</span>
                <span>{pk.oversize.length} run(s) exceed drum size {sz} m and no splicing allowed. Select a larger drum.</span>
              </div>
            )}

            {rec && rec !== sz && (() => {
              const rpk = packDrums(lengths, rec, splice)
              const rbuy = rpk.count * rec
              const rutil = rbuy > 0 ? Math.round((need / rbuy) * 100) : 0
              return (
                <div className="mx-5 mb-4 flex gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-600">
                  <span>💡</span>
                  <span>Drum {rec} m is more efficient (utilisation {rutil}%, waste {fmt0(rbuy - need)} m).</span>
                </div>
              )
            })()}
          </div>
        )
      })}
    </div>
  )
}
