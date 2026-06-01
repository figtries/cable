'use client'

import { FolderOpen, Trash2, Star } from 'lucide-react'
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

  const Icon = isActive ? Star : FolderOpen

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative h-[174px] w-full cursor-pointer overflow-hidden rounded-[10px] border bg-white',
        'px-[20px] py-[20px] transition-all duration-200 ease-out',
        isActive
          ? 'border-gray-300 shadow-[0_8px_18px_rgba(15,23,42,0.12)]'
          : 'border-gray-100 shadow-[0_8px_18px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(15,23,42,0.12)]'
      )}
    >
      <button
        onClick={e => {
          e.stopPropagation()
          onDelete()
        }}
        className="
          absolute right-[12px] top-[12px] z-20 flex h-[28px] w-[28px]
          items-center justify-center rounded-[8px] text-gray-400 opacity-0
          transition-all duration-150 hover:bg-red-50 hover:text-red-500
          group-hover:opacity-100 active:scale-90
        "
      >
        <Trash2 size={13} />
      </button>

      <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] bg-[#43474F] text-white">
        <Icon
          size={15}
          fill={isActive ? 'currentColor' : 'none'}
          strokeWidth={isActive ? 0 : 2}
        />
      </div>

      <div className="mt-[18px] min-w-0">
        <p className="truncate text-[15px] font-bold leading-none tracking-[-0.02em] text-gray-950">
          {project.name}
        </p>

        <p className="mt-[8px] truncate text-[11px] font-medium leading-none text-gray-500">
          {project.pic ? `${project.pic} · ` : ''}
          Created {createdDate}
        </p>
      </div>

      <div className="absolute bottom-[20px] left-[20px] right-[20px] border-t border-gray-100 pt-[15px]">
        <div>
          <p className="text-[22px] font-bold leading-none tracking-[-0.04em] text-gray-950 tabular-nums">
            {project.cables.length}
          </p>

          <p className="mt-[8px] text-[9px] font-bold uppercase leading-none tracking-[0.16em] text-gray-500">
            Cables · {fmt0(totalLen)} M
          </p>
        </div>
      </div>
    </div>
  )
}