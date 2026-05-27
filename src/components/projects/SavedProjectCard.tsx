'use client'

import { FolderOpen, ArrowRight, Trash2 } from 'lucide-react'
import { Project } from '@/lib/types'
import { fmt0 } from '@/lib/utils'
import { cn } from '@/lib/cn'

interface Props {
  project: Project
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}

export default function SavedProjectCard({
  project,
  isActive,
  onSelect,
  onDelete,
}: Props) {
  const totalLen = project.cables.reduce((s, c) => s + c.cut, 0)

  const createdDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative h-[94px] cursor-pointer rounded-[15px] border bg-white px-[14px] py-[14px]',
        'transition-all duration-200 ease-out',
        isActive
          ? 'border-[#43474F]/25 bg-gray-50/50 shadow-[0_8px_20px_rgba(15,23,42,0.06)]'
          : 'border-gray-100 shadow-[0_8px_20px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]'
      )}
    >
      <button
        onClick={e => {
          e.stopPropagation()
          onDelete()
        }}
        className="
          absolute right-[11px] top-[11px] flex h-[26px] w-[26px] items-center justify-center
          rounded-[8px] text-gray-400 opacity-0 transition-all duration-150
          hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 active:scale-90
        "
      >
        <Trash2 size={12} />
      </button>

      <div className="flex items-start gap-[12px]">
        <div
          className={cn(
            'flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[11px] transition-colors duration-200',
            isActive ? 'bg-[#43474F] text-white' : 'bg-gray-100 text-gray-500'
          )}
        >
          <FolderOpen size={14} />
        </div>

        <div className="min-w-0 flex-1 pr-[26px]">
          <div className="mb-[4px] flex items-center gap-[8px]">
            {isActive && (
              <span className="rounded-full bg-blue-100 px-[8px] py-[2px] text-[9px] font-bold uppercase leading-none tracking-[0.08em] text-[#2D98E9]">
                Active
              </span>
            )}

            <p className="truncate text-[13px] font-bold leading-none tracking-[-0.02em] text-gray-900">
              {project.name}
            </p>
          </div>

          <p className="truncate text-[11px] font-medium leading-none text-gray-400">
            {project.pic ? `${project.pic} · ` : ''}
            Created {createdDate}
          </p>
        </div>
      </div>

      <div className="absolute bottom-[13px] left-[14px] right-[14px] flex items-center justify-between border-t border-gray-100 pt-[10px]">
        <p className="text-[11px] font-medium leading-none text-gray-500">
          <span className="font-bold text-gray-900">{project.cables.length}</span> cables ·{' '}
          <span className="font-bold text-gray-900">{fmt0(totalLen)}</span> M
        </p>

        <ArrowRight
          size={13}
          className="text-gray-400 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </div>
    </div>
  )
}