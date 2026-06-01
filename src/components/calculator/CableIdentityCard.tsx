'use client'

import { CableCat } from '@/lib/types'
import { CAT_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/cn'

export interface IdentityState {
  name: string
  area: string
  cat: CableCat
  spec: string
  func: string
  equip: string
  jb: string
  from: string
  to: string
}

interface Props {
  value: IdentityState
  onChange: (v: IdentityState) => void
  errors?: Partial<Record<keyof IdentityState, string>>
}

const CAT_KEYS: CableCat[] = ['instrument', 'fng', 'control', 'power']

const inputCls =
  'w-full px-3.5 py-2.5 text-[13px] border border-gray-200 rounded-xl bg-white text-gray-900 ' +
  'placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150'

const inputErrCls =
  'w-full px-3.5 py-2.5 text-[13px] border border-red-400 rounded-xl bg-white text-gray-900 ' +
  'placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-150'

const labelCls =
  'block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5'

export default function CableIdentityCard({ value, onChange, errors = {} }: Props) {
  const set = (k: keyof IdentityState, v: string | CableCat) =>
    onChange({ ...value, [k]: v })

  return (
    <div
      className="
        h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card
        transition-shadow duration-200 hover:shadow-card-hover
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-full bg-[#2D98E9]" />
          <h3 className="text-[1em] font-semibold text-gray-900">
            Cable Identity
          </h3>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {/* Name + area */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>
              1. Cable Number / Name <span className="text-red-500 normal-case font-bold">*</span>
            </label>
            <input
              className={errors.name ? inputErrCls : inputCls}
              placeholder="C-1893"
              value={value.name}
              onChange={e => set('name', e.target.value)}
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.name}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              2. Area / Location <span className="normal-case font-normal text-gray-400">(optional)</span>
            </label>
            <input
              className={inputCls}
              placeholder="Scrubber"
              value={value.area}
              onChange={e => set('area', e.target.value)}
            />
          </div>
        </div>

        <p className="-mt-2 text-[11px] text-gray-400">
          According to your project naming standards.
        </p>

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
                    `
                      flex min-w-0 flex-col items-start justify-start gap-1
                      overflow-hidden rounded-xl border px-3 py-3 text-left
                      transition-all duration-150 active:scale-[0.97]
                    `,
                    active
                      ? 'border-[#2D98E9] bg-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
                  )}
                >
                  <span
                    className={cn(
                      'block w-full truncate text-left text-[12px] font-bold leading-tight',
                      active ? 'text-[#2D98E9]' : 'text-gray-800'
                    )}
                  >
                    {cfg.label}
                  </span>

                  <span
                    className={cn(
                      'block w-full truncate text-left text-[10.5px] leading-tight',
                      active ? 'text-[#2D98E9]/80' : 'text-gray-400'
                    )}
                  >
                    {cfg.subtitle}
                  </span>

                  <span
                    className={cn(
                      'mt-0.5 block w-full truncate text-left text-[9px] font-bold uppercase tracking-wider',
                      active ? 'text-[#2D98E9]' : 'text-gray-400'
                    )}
                  >
                    {cfg.disc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Spec */}
        <div>
          <label className={labelCls}>
            4. Specifications <span className="text-red-500 normal-case font-bold">*</span>
          </label>
          <input
            className={errors.spec ? inputErrCls : inputCls}
            placeholder="1Px2.5mm² IS shielded"
            value={value.spec}
            onChange={e => set('spec', e.target.value)}
          />
          {errors.spec && (
            <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.spec}</p>
          )}
        </div>

        {/* Functions */}
        <div>
          <label className={labelCls}>
            5. Functions / Services <span className="normal-case font-normal text-gray-400">(optional)</span>
          </label>
          <input
            className={inputCls}
            placeholder="Transmitter signal..."
            value={value.func}
            onChange={e => set('func', e.target.value)}
          />
        </div>

        {/* Equip + JB */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>
              6. Equipment <span className="normal-case font-normal text-gray-400">(optional)</span>
            </label>
            <input
              className={inputCls}
              placeholder="21-PIT-077"
              value={value.equip}
              onChange={e => set('equip', e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>
              7. Junction Box <span className="normal-case font-normal text-gray-400">(optional)</span>
            </label>
            <input
              className={inputCls}
              placeholder="JB-04"
              value={value.jb}
              onChange={e => set('jb', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}