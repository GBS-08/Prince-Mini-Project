import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import useLockBodyScroll from '../hooks/useLockBodyScroll'

/**
 * Accessible dialog matching `.modal-overlay` / `.modal-box` from shared.css:
 * blurred backdrop, gradient header, rotate-on-hover close button.
 * Closes on backdrop click and on Escape.
 */
export default function Modal({ open, onClose, title, children, size = 'md', headerClassName = '' }) {
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  const width = { sm: 'max-w-[460px]', md: 'max-w-[480px]', lg: 'max-w-[640px]', xl: 'max-w-[840px]' }[size]

  return createPortal(
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center bg-[rgba(8,10,28,0.72)] p-5 backdrop-blur-[10px]"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : undefined}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <div
        className={`relative max-h-[92vh] w-full ${width} animate-modal-in overflow-y-auto rounded-lg bg-white shadow-[0_32px_88px_rgba(0,0,0,0.30)] sm:rounded-xl`}
      >
        <div
          className={`relative rounded-t-lg bg-gradient-to-br from-primary to-primary-light px-7 pb-[18px] pt-[22px] text-white sm:rounded-t-xl ${headerClassName}`}
        >
          <h3 className="pr-10 font-heading text-[1.2rem] font-bold">{title}</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-[18px] top-1/2 flex h-[34px] w-[34px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/[0.18] text-[1.15rem] leading-none text-white transition-all duration-[450ms] ease-bounce hover:rotate-90 hover:scale-[1.12] hover:bg-white/35"
          >
            &times;
          </button>
        </div>
        <div className="p-[26px]">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
