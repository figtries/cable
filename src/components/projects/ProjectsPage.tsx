'use client'

import { useState } from 'react'
import { LayoutGrid } from 'lucide-react'
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
      <div className="animate-fade-up px-4 py-5 md:px-[34px] md:py-[34px]">
        {/* Header */}
        <div className="mb-6 md:mb-[34px]">
          <h1 className="mb-[8px] text-xl font-bold leading-none tracking-[-0.04em] text-[#171B24] md:text-[28px]">
            Project Management
          </h1>
          <p className="text-[13px] font-medium text-[#9AA2AF] md:text-[14px]">
            Select a project or create a new one to begin calculations.
          </p>
        </div>

        {/* Top Section */}
        <div className="mb-8 grid w-full grid-cols-1 items-stretch gap-5 md:mb-[42px] md:gap-[28px] lg:grid-cols-[330px_minmax(0,1fr)]">
          {activeProject ? (
            <ActiveProjectCard project={activeProject} />
          ) : (
            <div className="flex min-h-[430px] rounded-[28px] border border-dashed border-gray-200 bg-white p-8">
              <div className="m-auto flex flex-col items-center justify-center gap-2 text-center">
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50">
                  <LayoutGrid size={18} className="text-gray-400" />
                </div>
                <p className="text-[13px] font-semibold text-gray-500">
                  No active project
                </p>
                <p className="text-xs text-gray-400">
                  Select a project or create a new one to view project data.
                </p>
              </div>
            </div>
          )}

          <CreateProjectForm onCreated={() => toast('✓ Project created')} />
        </div>

        {/* Saved projects */}
        {projects.length > 0 && (
          <div className="w-full">
            <p className="mb-[20px] text-[13px] font-semibold tracking-normal text-[#A0A6B1]">
              Saved Projects
            </p>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-[22px] lg:grid-cols-3">
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  style={{ animationDelay: `${i * 50 + 250}ms` }}
                  className="min-w-0 animate-fade-up"
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

      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Delete project?"
      >
        <p className="mb-5 text-[13px] text-gray-500">
          &quot;{projects.find(p => p.id === confirmId)?.name}&quot; and all
          its cables will be permanently deleted.
        </p>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1 justify-center"
            onClick={() => setConfirmId(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            className="flex-1 justify-center"
            onClick={() => confirmId && handleDelete(confirmId)}
          >
            Delete
          </Button>
        </div>
      </Modal>

      {ToastComponent}
    </>
  )
}