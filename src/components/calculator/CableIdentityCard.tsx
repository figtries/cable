'use client'

import { CableCat } from '@/lib/types'
import { CAT_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/cn'

export interface IdentityState {
  name: string; area: string; cat: CableCat; spec: string
  func: string; equip: string; jb: string; from: string; to: string
}

interface Props { value: IdentityState; onChange: (v: IdentityState) => void }

const CAT_KEYS: CableCat[] = ['instrument', 'fng', 'control', 'power']

const inputCls =
  'w-full px-3.5 py-2.5 text-[13px] border border-gray-200 rounded-xl bg-white text-gray-900 ' +
  'placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150'

const labelCls = 'block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5'

export default function CableIdentityCard({ value, onChange }: Props) {
  const set = (k: keyof IdentityState, v: string | CableCat) => onChange({ ...value, [k]: v })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden h-full
      hover:shadow-card-hover transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-[#2D98E9]" />
          <h3 className="text-[13px] font-semibold text-gray-900">Cable Identity</h3>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Name + area */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>1. Cable Number / Name</label>
            <input className={inputCls} placeholder="C-1893" value={value.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>2. Area / Location</label>
            <input className={inputCls} placeholder="KANAN ATAS" value={value.area} onChange={e => set('area', e.target.value)} />
          </div>
        </div>
        <p className="text-[11px] text-gray-400 -mt-2">According to your project naming standards.</p>

        {/* Cable type */}
        <div>
          <label className={labelCls}>3. Cable Type</label>
          <div className="grid grid-cols-4 gap-2">
            {CAT_KEYS.map(cat => {
              const cfg = CAT_CONFIG[cat]
              const active = value.cat === cat
              return (
                <button
                  key={cat}
                  onClick={() => set('cat', cat)}
                  className={cn(
                    'flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all duration-150 active:scale-[0.97]',
                    active
                      ? 'border-[#2D98E9] bg-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                  )}
                >
                  <span className={cn(
                    'text-[13px] font-bold leading-tight',
                    active ? 'text-[#2D98E9]' : 'text-gray-800'
                  )}>
                    {cfg.label}
                  </span>
                  <span className={cn(
                    'text-[11px] leading-tight',
                    active ? 'text-[#2D98E9]/80' : 'text-gray-400'
                  )}>
                    {cfg.subtitle}
                  </span>
                  <span className={cn(
                    'mt-0.5 text-[9px] font-bold uppercase tracking-wider',
                    active ? 'text-[#2D98E9]' : 'text-gray-400'
                  )}>
                    {cfg.disc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Spec */}
        <div>
          <label className={labelCls}>4. Specifications</label>
          <input className={inputCls} placeholder="1Px2.5mm² IS shielded" value={value.spec} onChange={e => set('spec', e.target.value)} />
        </div>

        {/* Functions */}
        <div>
          <label className={labelCls}>5. Functions / Services</label>
          <input className={inputCls} placeholder="Transmitter signal..." value={value.func} onChange={e => set('func', e.target.value)} />
        </div>

        {/* Equip + JB */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>6. Equipment</label>
            <input className={inputCls} placeholder="21-PIT-077" value={value.equip} onChange={e => set('equip', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>7. Junction Box</label>
            <input className={inputCls} placeholder="JB-04" value={value.jb} onChange={e => set('jb', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  )
}
