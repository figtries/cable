'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'

export interface CalcParams {
  horizontal: number; vertical: number
  bends: number
  termPerEnd: number; tolerance: number
}

interface Props {
  value: CalcParams; onChange: (v: CalcParams) => void
  fromVal: string; toVal: string
  onFromChange: (v: string) => void; onToChange: (v: string) => void
}

const labelCls = 'block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5'

const boxCls =
  'flex items-center border border-gray-200 rounded-xl bg-white ' +
  'focus-within:border-[#2D98E9] focus-within:ring-2 focus-within:ring-[#2D98E9]/15 transition-all duration-150'

const innerInputCls =
  'flex-1 px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 bg-transparent ' +
  'outline-none tabular-nums placeholder:text-gray-400 placeholder:font-normal'

const txtCls =
  'w-full px-3.5 py-2.5 text-[13px] border border-gray-200 rounded-xl bg-gray-50 text-gray-900 ' +
  'placeholder:text-gray-400 focus:outline-none focus:border-[#2D98E9] focus:ring-2 focus:ring-[#2D98E9]/15 transition-all duration-150'

const LENGTH_UNITS = [
  { label: 'm',  factor: 1,        group: 'Metric',   desc: 'Meter' },
  { label: 'cm', factor: 0.01,     group: 'Metric',   desc: 'Centimeter' },
  { label: 'mm', factor: 0.001,    group: 'Metric',   desc: 'Millimeter' },
  { label: 'km', factor: 1000,     group: 'Metric',   desc: 'Kilometer' },
  { label: 'ft', factor: 0.3048,   group: 'Imperial', desc: 'Foot' },
  { label: 'in', factor: 0.0254,   group: 'Imperial', desc: 'Inch' },
  { label: 'yd', factor: 0.9144,   group: 'Imperial', desc: 'Yard' },
  { label: 'mi', factor: 1609.344, group: 'Imperial', desc: 'Mile' },
]

function LengthInput({
  label, valueMeters, unit, hint, required, onChangeMeters, onUnitChange,
}: {
  label: string; valueMeters: number; unit: string; hint?: string; required?: boolean
  onChangeMeters: (v: number) => void; onUnitChange: (u: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const unitDef = LENGTH_UNITS.find(u => u.label === unit) ?? LENGTH_UNITS[0]
  const displayed = parseFloat((valueMeters / unitDef.factor).toFixed(6))
  const groups = Array.from(new Set(LENGTH_UNITS.map(u => u.group)))

  const updatePos = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 6, left: rect.right - 160 })
  }, [])

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  useEffect(() => {
    if (!open) return
    updatePos()
    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
    return () => {
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }
  }, [open, updatePos])

  const dropdown = open && createPortal(
    <div
      ref={ref}
      className="fixed w-[160px] max-h-[200px] overflow-y-auto rounded-2xl border border-gray-100 bg-white py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-scale-in"
      style={{ top: pos.top, left: pos.left, zIndex: 9999 }}
    >
      {groups.map((group, gi) => (
        <div key={group}>
          {gi > 0 && <div className="mx-3 my-1.5 border-t border-gray-100" />}
          <p className="px-3.5 pb-1 pt-1.5 text-[9px] font-bold uppercase tracking-widest text-gray-400">
            {group}
          </p>
          {LENGTH_UNITS.filter(u => u.group === group).map(u => (
            <button
              key={u.label}
              type="button"
              onClick={() => { onUnitChange(u.label); setOpen(false) }}
              className="flex w-full items-center justify-between px-3.5 py-2 text-left text-[13px] transition-colors hover:bg-gray-50"
              style={unit === u.label ? { color: '#2D98E9', fontWeight: 700 } : { color: '#374151' }}
            >
              <span className="font-semibold">{u.label}</span>
              <span className="text-[11px] text-gray-400">{u.desc}</span>
            </button>
          ))}
        </div>
      ))}
    </div>,
    document.body
  )

  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-red-500 normal-case font-bold">*</span>}
      </label>
      <div className="relative">
        <div className={boxCls}>
          <input
            type="number" min={0} step={0.1}
            value={displayed === 0 ? '' : displayed}
            placeholder="0"
            onChange={e => onChangeMeters((parseFloat(e.target.value) || 0) * unitDef.factor)}
            className={innerInputCls}
          />
          <button
            ref={btnRef}
            type="button"
            onClick={() => setOpen(v => !v)}
            className="shrink-0 w-[48px] flex items-center justify-center gap-1 text-[13px] font-semibold text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          >
            <span>{unit}</span>
            <ChevronDown
              size={12}
              className="text-gray-400 transition-transform duration-150"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        </div>
        {dropdown}
      </div>
      {hint && <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">{hint}</p>}
    </div>
  )
}

function NumUnit({
  label, value, unit = '%', hint, step = 1, required, onChange,
}: { label: string; value: number; unit?: string; hint?: string; step?: number; required?: boolean; onChange: (v: number) => void }) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-red-500 normal-case font-bold">*</span>}
      </label>
      <div className={boxCls}>
        <input
          type="number" min={0} step={step}
          placeholder="0"
          value={value || ''}
          onChange={e => onChange(e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0))}
          className={innerInputCls}
        />
        <span className="shrink-0 w-[48px] inline-flex items-center justify-center self-stretch text-[13px] font-semibold text-gray-400">{unit}</span>
      </div>
      {hint && <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">{hint}</p>}
    </div>
  )
}

export default function RouteConditionsCard({ value, onChange, fromVal, toVal, onFromChange, onToChange }: Props) {
  const [hUnit, setHUnit] = useState('m')
  const [vUnit, setVUnit] = useState('m')
  const [termUnit, setTermUnit] = useState('m')
  const set = (k: keyof CalcParams, v: number) => onChange({ ...value, [k]: v })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card h-full hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-center gap-2 px-5 pt-5 pb-4">
        <div className="w-1 h-5 rounded-full bg-[#2D98E9]" />
        <h3 className="text-[1em] font-semibold text-gray-900">Route and Conditions</h3>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>
              From <span className="normal-case font-normal text-gray-400">(optional)</span>
            </label>
            <input className={txtCls} placeholder="JB-04" value={fromVal} onChange={e => onFromChange(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>
              To <span className="normal-case font-normal text-gray-400">(optional)</span>
            </label>
            <input className={txtCls} placeholder="21-PIT-077" value={toVal} onChange={e => onToChange(e.target.value)} />
          </div>
        </div>
        <p className="text-[11px] text-gray-400 -mt-2 leading-relaxed">
          The JB where this cable is terminated can be used as a filter on the dashboard.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <LengthInput label="Horizontal" valueMeters={value.horizontal} unit={hUnit} required
            hint="Horizontal distance in the tray/trench."
            onChangeMeters={v => set('horizontal', v)} onUnitChange={setHUnit} />
          <LengthInput label="Vertical" valueMeters={value.vertical} unit={vUnit} required
            hint="Total drop/riser between elevations."
            onChangeMeters={v => set('vertical', v)} onUnitChange={setVUnit} />
        </div>

        <NumUnit label="Turns & offset allowance (%)" value={value.bends} unit="%" required
          hint="For turns, offsets, tray changes. Ideally 5–15% (straight → 5%, complex → 15%)."
          onChange={v => set('bends', v)} />

        <LengthInput
          label="Termination / service loop (per end)" valueMeters={value.termPerEnd} unit={termUnit} required
          hint={`Make-up gland, termination, service loop. Ideally 2–3 m per end. Total: ${value.termPerEnd * 2} m (2 ends).`}
          onChangeMeters={v => set('termPerEnd', v)} onUnitChange={setTermUnit}
        />

        <NumUnit label="Measurement tolerance (%)" value={value.tolerance} unit="%" required
          hint="Measurement uncertainty. Ideally 2–3%. Made small — the buffer comes from drum rounding."
          onChange={v => set('tolerance', v)} />
      </div>
    </div>
  )
}
