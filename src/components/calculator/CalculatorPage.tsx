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
  spec: '1Px2.5mm² IS shielded', func: '', equip: '', jb: '', from: '', to: '',
}

const DEFAULT_PARAMS: CalcParams = {
  horizontal: 10, vertical: 10,
  hAllowance: 10, vAllowance: 10,
  termPerEnd: 0.5, tolerance: 3,
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

  const result = useMemo(() => computeRun(params), [params])

  function handleSave() {
    if (!activeId) { toast('Select a project first'); router.push('/projects'); return }
    if (!identity.name.trim()) { toast('Fill in the cable name first'); return }
    addCable(activeId, { ...identity, from: fromVal, to: toVal, cut: result.cut })
    toast(`✓ ${identity.name} saved (${result.cut} m)`)
    setIdentity(prev => ({ ...DEFAULT_IDENTITY, cat: prev.cat, spec: prev.spec }))
    setFromVal('')
    setToVal('')
  }

  return (
    <>
      <div className="animate-fade-up px-7 py-7">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Count Cables</h1>
          <p className="text-[13px] text-gray-400">
            Complete the technical details for precision calculations.
            <span className="ml-2 text-blue-500 font-semibold">· AUTOMATIC RESULTS CALCULATED</span>
          </p>
        </div>

        {/* Two-column cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="animate-fade-up delay-100">
            <CableIdentityCard value={identity} onChange={setIdentity} />
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
            canSave={!!identity.name.trim()} onSave={handleSave}
          />
        </div>
      </div>
      {ToastComponent}
    </>
  )
}
