import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

const TONES = {
  success: { icon: CheckCircle2, className: 'border-leaf-400/40 text-leaf-700 dark:text-leaf-300' },
  error: { icon: XCircle, className: 'border-rose-400/40 text-rose-700 dark:text-rose-300' },
  warning: { icon: AlertTriangle, className: 'border-gold-400/40 text-gold-700 dark:text-gold-300' },
  info: { icon: Info, className: 'border-sky-400/40 text-sky-700 dark:text-sky-300' },
}

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (message, type = 'success', duration = 4000) => {
      const id = ++toastId
      setToasts((current) => [...current, { id, message, type }])
      window.setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss],
  )

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const tone = TONES[toast.type] ?? TONES.info
            const Icon = tone.icon
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border bg-white/95 p-3.5 shadow-elevated backdrop-blur dark:bg-surface-dark-muted/95 ${tone.className}`}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <p className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {toast.message}
                </p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="-m-1 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
