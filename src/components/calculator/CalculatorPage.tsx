'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/store/useStore'
import { computeRun } from '@/lib/utils'
import { CableCat } from '@/lib/types'
import CableIdentityCard, { IdentityState } from './CableIdentityCard'
import RouteConditionsCard, { CalcParams } from './RouteConditionsCard'
import ResultPanel from './ResultPanel'
import { useToast } from '@/components/ui/Toast'

const DEFAULT_IDENTITY: IdentityState = {
  name: '', area: '', cat: 'instrument' as CableCat,
  spec: '', func: '', equip: '', jb: '', from: '', to: '',
}

const DEFAULT_PARAMS: CalcParams = {
  horizontal: 50, vertical: 4,
  bends: 10,
  termPerEnd: 2, tolerance: 3,
}

export default function CalculatorPage() {
  const router     = useRouter()
  const projects   = useStore(s => s.projects)
  const activeId   = useStore(s => s.activeId)
  const addCable   = useStore(s => s.addCable)
  const { show: toast, ToastComponent } = useToast()

  const [identity, setIdentity] = useState<IdentityState>(DEFAULT_IDENTITY)
  const [params,   setParams]   = useState<CalcParams>(DEFAULT_PARAMS)
  const [fromVal,  setFromVal]  = useState('')
  const [toVal,    setToVal]    = useState('')
  const [errors,   setErrors]   = useState<Partial<Record<keyof IdentityState, string>>>({})

  const result = useMemo(() => computeRun(params), [params])

  function handleIdentityChange(v: IdentityState) {
    setIdentity(v)
    setErrors(prev => ({
      ...prev,
      ...(v.name.trim()  ? { name: undefined } : {}),
      ...(v.spec.trim()  ? { spec: undefined } : {}),
    }))
  }

  function handleSave() {
    if (!activeId) { toast('Select a project first'); router.push('/projects'); return }
    const newErrors: Partial<Record<keyof IdentityState, string>> = {}
    if (!identity.name.trim()) newErrors.name = 'Cable name is required'
    if (!identity.spec.trim()) newErrors.spec = 'Specification is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast('Please fill in all required fields')
      return
    }
    addCable(activeId, { ...identity, from: fromVal, to: toVal, cut: result.cut })
    toast(`✓ ${identity.name} saved (${result.cut} m)`)
    setIdentity(prev => ({ ...DEFAULT_IDENTITY, cat: prev.cat, spec: prev.spec }))
    setErrors({})
    setFromVal('')
    setToVal('')
  }

  return (
    <>
      <div className="animate-fade-up px-4 py-5 md:px-7 md:py-7">
        {/* Header */}
        <div className="mb-5 md:mb-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1 md:text-2xl">Count Cables</h1>
          <p className="text-[12px] text-gray-400 md:text-[13px]">
            Complete the technical details for precision calculations.
            <span className="ml-2 text-blue-500 font-semibold hidden sm:inline">· AUTOMATIC RESULTS CALCULATED</span>
          </p>
        </div>

        {/* Two-column cards → single column on mobile/tablet */}
        <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-2">
          <div className="animate-fade-up delay-100">
            <CableIdentityCard value={identity} onChange={handleIdentityChange} errors={errors} />
          </div>
          <div className="animate-fade-up delay-150">
            <RouteConditionsCard
              value={params} onChange={setParams}
              fromVal={fromVal} toVal={toVal}
              onFromChange={setFromVal} onToChange={setToVal}
            />
          </div>
        </div>

        {/* Result panel */}
        <div className="animate-fade-up delay-200">
          <ResultPanel
            result={result} params={params}
            projects={projects} activeId={activeId}
            canSave={!!identity.name.trim() && !!identity.spec.trim()} onSave={handleSave}
          />
        </div>
      </div>
      {ToastComponent}
    </>
  )
}
