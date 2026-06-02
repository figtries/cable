'use client'

import { useState } from 'react'
import useStore from '@/store/useStore'

const EMPTY = {
  name: '',
  client: '',
  location: '',
  pic: '',
  contract: '',
  handover: '',
}

interface Props {
  onCreated?: () => void
}

function Field({
  label,
  value,
  placeholder,
  type = 'text',
  onChange,
}: {
  label: string
  value: string
  placeholder?: string
  type?: string
  onChange: (value: string) => void
}) {
  const isEmptyDate = type === 'date' && !value

  return (
    <label className="block">
      <span className="mb-[10px] block text-[12px] font-bold leading-none tracking-[0.09em] text-[#404751]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className={`
          h-[48px] w-full rounded-[14px] border border-[#E1E4EA] bg-[#F7F7F8]
          px-[18px] text-[14px] font-medium outline-none
          transition-all placeholder:text-[#9BA3AF]
          focus:border-[#C9CDD4] focus:bg-white
          ${isEmptyDate ? 'text-[#9BA3AF]' : 'text-gray-900'}
        `}
      />
    </label>
  )
}

export default function CreateProjectForm({ onCreated }: Props) {
  const createProject = useStore(s => s.createProject)
  const [form, setForm] = useState(EMPTY)

  function set(key: keyof typeof EMPTY, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleSubmit() {
    if (!form.name.trim()) return

    createProject(form)
    setForm(EMPTY)
    onCreated?.()
  }

  return (
    <div className="flex min-h-[320px] flex-col rounded-[20px] border border-[#ECEEF3] bg-white px-5 pb-6 pt-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)] md:min-h-[430px] md:rounded-[28px] md:px-[36px] md:pb-[32px] md:pt-[36px]">
      <p className="mb-[12px] text-[12px] font-bold leading-none tracking-[0.12em] text-[#A0A6B1]">
        Cable Validation System
      </p>

      <h2 className="mb-[26px] text-[26px] font-bold leading-none tracking-[-0.045em] text-[#1F2430]">
        Create a new project
      </h2>

      <div className="flex flex-1 flex-col">
        <div className="mb-[22px]">
          <Field
            label="Project Name"
            value={form.name}
            onChange={value => set('name', value)}
            placeholder="Example: Balikpapan Oil Refinery Phase 1"
          />
        </div>

        <div className="mb-[22px] grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Client"
            value={form.client}
            onChange={value => set('client', value)}
            placeholder="Company name"
          />

          <Field
            label="Location"
            value={form.location}
            onChange={value => set('location', value)}
            placeholder="City / Region"
          />

          <Field
            label="Person in Charge"
            value={form.pic}
            onChange={value => set('pic', value)}
            placeholder="Full Name"
          />
        </div>

        <div className="mb-[24px] grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <Field
            label="Contract Number"
            value={form.contract}
            onChange={value => set('contract', value)}
            placeholder="CTR-2024-XXXX"
          />

          <Field
            label="Target Handover"
            type="date"
            value={form.handover}
            onChange={value => set('handover', value)}
          />
        </div>

        <button
          disabled={!form.name.trim()}
          onClick={handleSubmit}
          className="
            mt-auto h-[48px] w-full rounded-[12px] bg-[#3F4249] text-[15px] font-bold text-white
            transition-all duration-150 hover:bg-[#34373D] active:scale-[0.99]
            disabled:cursor-not-allowed disabled:bg-[#3F4249] disabled:opacity-100
          "
        >
          + Create &amp; start project
        </button>
      </div>
    </div>
  )
}