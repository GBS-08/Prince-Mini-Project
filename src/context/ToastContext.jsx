import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const ToastContext = createContext(null)

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }

const ACCENT = {
  success: 'border-l-accent',
  error: 'border-l-danger',
  info: 'border-l-accent2',
  warning: 'border-l-gold',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
    window.setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), 280)
  }, [])

  const showToast = useCallback(
    (message, type = 'success', duration = 4000) => {
      idRef.current += 1
      const id = idRef.current
      setToasts((current) => [...current, { id, message, type, exiting: false }])
      window.setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            className="pointer-events-none fixed left-1/2 top-1/2 z-[99999] flex w-[calc(100vw-24px)] max-w-[380px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2.5 md:w-auto"
            role="status"
            aria-live="polite"
          >
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`pointer-events-auto flex w-full min-w-0 items-center gap-3 rounded-md border-l-4 bg-white px-[18px] py-[13px] text-[0.88rem] font-semibold text-ink-dark shadow-[0_10px_36px_rgba(0,0,0,0.16)] backdrop-blur-[8px] md:min-w-[280px] ${
                  ACCENT[toast.type] || ACCENT.success
                } ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}`}
              >
                <span className="shrink-0 animate-icon-pop text-[1.25rem]" aria-hidden="true">
                  {ICONS[toast.type] || ICONS.success}
                </span>
                <span>{toast.message}</span>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
