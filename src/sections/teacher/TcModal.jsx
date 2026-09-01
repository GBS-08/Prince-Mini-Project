import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import useLockBodyScroll from '../../hooks/useLockBodyScroll'

const SIZES = { sm: 'tc-mb-sm', md: 'tc-mb-md', lg: 'tc-mb-lg' }

/** Teacher-portal modal shell (`.tc-mo` / `.tc-mb` from Teacher.css). */
export default function TcModal({ open, onClose, title, icon, size = 'lg', children }) {
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="tc-page tc-mo open"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : 'Dialog'}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={`tc-mb ${SIZES[size] || SIZES.lg}`}>
        <div className="tc-mh">
          <div className="tc-mt">
            {icon && <i className={icon} aria-hidden="true" />} {title}
          </div>
          <button type="button" className="tc-mc" onClick={onClose} aria-label="Close">
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>
        <div className="tc-mbd">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
