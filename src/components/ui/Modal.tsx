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

export default function Modal({ open, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop — nutupin seluruh viewport termasuk sidebar & header */}
      <div className="absolute inset-0 bg-gray-900/75 backdrop-blur-xl" />

      {/* Modal panel */}
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in',
          maxWidth
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all duration-150 active:scale-90"
        >
          <X size={14} />
        </button>

        {/* Header */}
        {(title || subtitle) && (
          <div className="px-6 pt-6 pb-0">
            {subtitle && (
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
            )}
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}
