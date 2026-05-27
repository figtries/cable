'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onDone: () => void
}

export default function Toast({ message, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300) }, 2500)
    return () => clearTimeout(t)
  }, [message, onDone])

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300
        bg-gray-900 text-white text-sm font-medium px-5 py-3.5 rounded-2xl shadow-xl
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      {message}
    </div>
  )
}

// Hook to use toast easily
import { useCallback } from 'react'

export function useToast() {
  const [msg, setMsg] = useState('')

  const show = useCallback((message: string) => setMsg(message), [])
  const clear = useCallback(() => setMsg(''), [])

  const ToastComponent = msg ? <Toast message={msg} onDone={clear} /> : null

  return { show, ToastComponent }
}
