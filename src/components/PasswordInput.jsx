import { forwardRef, useState } from 'react'

/**
 * Password field with the show/hide eye button (`.pw-toggle-wrap` + `.pw-eye-btn`).
 * `inputClassName` lets each portal keep its own input skin (`.sp-inp`, `.tc-input`…).
 */
const PasswordInput = forwardRef(function PasswordInput(
  { inputClassName = 'form-input', className = '', ...props },
  ref,
) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={`relative flex items-center ${className}`}>
      <input ref={ref} type={visible ? 'text' : 'password'} className={`${inputClassName} w-full !pr-11`} {...props} />
      <button
        type="button"
        title={visible ? 'Hide password' : 'Show password'}
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-[11px] top-1/2 z-[2] flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-xs border-0 bg-transparent px-1.5 py-[5px] text-[0.96rem] leading-none text-ink-muted transition-colors duration-200 hover:bg-accent2/[0.09] hover:text-accent2"
      >
        <i className={visible ? 'fas fa-eye-slash' : 'fas fa-eye'} aria-hidden="true" />
      </button>
    </div>
  )
})

export default PasswordInput
