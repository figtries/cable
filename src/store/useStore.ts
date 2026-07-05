'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Project, Cable } from '@/lib/types'
import { uid } from '@/lib/utils'

interface StoreState {
  projects: Project[]
  activeId: string | null
}

interface StoreActions {
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'cables'>) => string
  deleteProject: (id: string) => void
  setActiveId: (id: string | null) => void
  addCable: (projectId: string, cable: Omit<Cable, 'id'>) => void
  deleteCable: (projectId: string, cableId: string) => void
  activeProject: () => Project | null
}

const useStore = create<StoreState & StoreActions>()(
  persist(
    (set, get) => ({
      projects: [],
      activeId: null,

      createProject: (data) => {
        const project: Project = { id: uid(), createdAt: Date.now(), cables: [], ...data }
        set(s => ({ projects: [project, ...s.projects], activeId: project.id }))
        return project.id
      },

      deleteProject: (id) => {
        set(s => {
          const projects = s.projects.filter(p => p.id !== id)
          const activeId = s.activeId === id ? (projects[0]?.id ?? null) : s.activeId
          return { projects, activeId }
        })
      },

      setActiveId: (id) => set({ activeId: id }),

      addCable: (projectId, cable) => {
        set(s => ({
          projects: s.projects.map(p =>
            p.id === projectId
              ? { ...p, cables: [...p.cables, { id: uid(), ...cable }] }
              : p
          ),
        }))
      },

      deleteCable: (projectId, cableId) => {
        set(s => ({
          projects: s.projects.map(p =>
            p.id === projectId
              ? { ...p, cables: p.cables.filter(c => c.id !== cableId) }
              : p
          ),
        }))
      },

      activeProject: () => {
        const { projects, activeId } = get()
        return projects.find(p => p.id === activeId) ?? null
      },
    }),
    { name: 'figtries-cable-v2', skipHydration: true }
  )
)

export default useStore
