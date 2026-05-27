'use client'

import { useState } from 'react'
import { LayoutGrid, SlidersHorizontal } from 'lucide-react'
import useStore from '@/store/useStore'
import ActiveProjectCard from './ActiveProjectCard'
import CreateProjectForm from './CreateProjectForm'
import SavedProjectCard from './SavedProjectCard'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

export default function ProjectsPage() {
  const projects = useStore(s => s.projects)
  const activeId = useStore(s => s.activeId)
  const setActiveId = useStore(s => s.setActiveId)
  const deleteProject = useStore(s => s.deleteProject)
  const { show: toast, ToastComponent } = useToast()

  const [confirmId, setConfirmId] = useState<string | null>(null)
  const activeProject = projects.find(p => p.id === activeId) ?? null

  function handleDelete(id: string) {
    const p = projects.find(x => x.id === id)
    deleteProject(id)
    toast(`Deleted "${p?.name}"`)
    setConfirmId(null)
  }

  return (
    <>
      <div className="animate-fade-up px-[34px] py-[34px]">
        {/* Header */}
        <div className="mb-[34px]">
          <h1 className="mb-[8px] text-[28px] font-bold leading-none tracking-[-0.04em] text-[#171B24]">
            Project Management
          </h1>
          <p className="text-[14px] font-medium text-[#9AA2AF]">
            Select a project or create a new one to begin calculations.
          </p>
        </div>

        {/* Top Section */}
        <div className="mb-[42px] grid w-full max-w-[1180px] grid-cols-[330px_minmax(0,1fr)] items-stretch gap-[28px]">
          {activeProject ? (
            <ActiveProjectCard project={activeProject} />
          ) : (
            <div className="flex min-h-[430px] rounded-[28px] border border-dashed border-gray-200 bg-white p-8">
              <div className="m-auto flex flex-col items-center justify-center gap-2 text-center">
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50">
                  <LayoutGrid size={18} className="text-gray-400" />
                </div>
                <p className="text-[13px] font-semibold text-gray-500">No active project</p>
                <p className="text-xs text-gray-400">Create a project to get started.</p>
              </div>
            </div>
          )}

          <CreateProjectForm onCreated={() => toast('✓ Project created')} />
        </div>

        {/* Saved projects */}
        {projects.length > 0 && (
          <div className="w-full max-w-[1180px]">
            <div className="mb-[18px] flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#A0A6B1]">
                Saved Projects
              </p>

              <div className="flex items-center gap-[8px]">
                <button className="flex h-[31px] w-[31px] items-center justify-center rounded-[10px] border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 active:scale-90">
                  <SlidersHorizontal size={13} />
                </button>

                <button className="flex h-[31px] w-[31px] items-center justify-center rounded-[10px] border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 active:scale-90">
                  <LayoutGrid size={13} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[18px] xl:grid-cols-3">
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  style={{ animationDelay: `${i * 50 + 250}ms` }}
                  className="animate-fade-up"
                >
                  <SavedProjectCard
                    project={p}
                    isActive={p.id === activeId}
                    onSelect={() => {
                      setActiveId(p.id)
                      toast(`Switched to "${p.name}"`)
                    }}
                    onDelete={() => setConfirmId(p.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Delete project?">
        <p className="mb-5 text-[13px] text-gray-500">
          &quot;{projects.find(p => p.id === confirmId)?.name}&quot; and all its cables will be permanently deleted.
        </p>

        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1 justify-center" onClick={() => setConfirmId(null)}>
            Cancel
          </Button>

          <Button variant="danger" className="flex-1 justify-center" onClick={() => confirmId && handleDelete(confirmId)}>
            Delete
          </Button>
        </div>
      </Modal>

      {ToastComponent}
    </>
  )
}