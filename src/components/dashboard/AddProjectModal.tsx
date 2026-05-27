'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import useStore from '@/store/useStore'

interface AddProjectModalProps {
  open: boolean
  onClose: () => void
  onCreated?: (id: string) => void
}

const EMPTY = { name: '', client: '', location: '', pic: '', contract: '', handover: '' }

export default function AddProjectModal({ open, onClose, onCreated }: AddProjectModalProps) {
  const createProject = useStore(s => s.createProject)
  const [form, setForm] = useState(EMPTY)

  function set(key: keyof typeof EMPTY, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleSubmit() {
    if (!form.name.trim()) return
    const id = createProject(form)
    onCreated?.(id)
    setForm(EMPTY)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      subtitle="Cable Validation System"
      title="Create a new project"
    >
      <div className="space-y-4 mt-4">
        <Input
          label="Project Name"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="Example: Balikpapan Oil Refinery Phase 1"
        />

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Client"
            value={form.client}
            onChange={e => set('client', e.target.value)}
            placeholder="Company name"
          />
          <Input
            label="Location"
            value={form.location}
            onChange={e => set('location', e.target.value)}
            placeholder="City / Region"
          />
          <Input
            label="Person in Charge"
            value={form.pic}
            onChange={e => set('pic', e.target.value)}
            placeholder="Full Name"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Contract Number"
            value={form.contract}
            onChange={e => set('contract', e.target.value)}
            placeholder="CTR-2024-XXXX"
          />
          <Input
            label="Target Handover"
            type="date"
            value={form.handover}
            onChange={e => set('handover', e.target.value)}
          />
        </div>

        <Button
          variant="dark"
          className="w-full justify-center mt-2"
          disabled={!form.name.trim()}
          onClick={handleSubmit}
        >
          + Create &amp; start project
        </Button>
      </div>
    </Modal>
  )
}
