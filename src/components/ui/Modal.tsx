'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  maxWidth?: string
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (open) {
      document.addEventListener('keydown', handler)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex animate-fade-in items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 z-0 bg-gray-900/75 backdrop-blur-xl" />

      {/* Modal panel */}
      <div
        className={cn(
          'relative z-10 w-full overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in',
          maxWidth
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white transition-all duration-150 hover:bg-gray-700 active:scale-90"
        >
          <X size={14} />
        </button>

        {/* Header */}
        {(title || subtitle) && (
          <div className="px-6 pb-0 pt-6">
            {subtitle && (
              <p className="mb-1 text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-[#8A93A3]">
                {subtitle}
              </p>
            )}

            {title && (
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}