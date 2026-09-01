import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase, errorMessage } from '../services/supabase'
import { useToast } from '../context/ToastContext'

const OTP_LENGTH = 8
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Inline e-mail OTP verification widget (React port of `injectOtpWidget`).
 * Used by the admission form and the student profile setup — sends an 8-digit
 * Supabase OTP, verifies it, then reports the verified address upwards.
 */
export default function EmailOtpField({ email, verified, onVerified, theme = 'light' }) {
  const { showToast } = useToast()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [digits, setDigits] = useState(() => Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const inputsRef = useRef([])

  useEffect(() => {
    if (resendIn <= 0) return undefined
    const id = window.setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(id)
  }, [resendIn])

  const send = useCallback(async () => {
    const clean = (email || '').trim().toLowerCase()
    if (!EMAIL_RE.test(clean)) {
      showToast('Enter a valid email address first.', 'warning')
      return
    }
    setSending(true)
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email: clean,
      options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
    })
    setSending(false)

    if (sendError) {
      showToast(`Could not send OTP: ${errorMessage(sendError)}`, 'error')
      return
    }
    showToast('OTP sent! Check your inbox 📬', 'success')
    setDigits(Array(OTP_LENGTH).fill(''))
    setError('')
    setSent(true)
    setResendIn(60)
    window.setTimeout(() => inputsRef.current[0]?.focus(), 60)
  }, [email, showToast])

  const verify = useCallback(
    async (code) => {
      if (code.replace(/\D/g, '').length < 6) {
        setError('Please enter the complete code.')
        return
      }
      const clean = (email || '').trim().toLowerCase()
      setVerifying(true)

      let ok = false
      const first = await supabase.auth.verifyOtp({ email: clean, token: code, type: 'email' })
      if (!first.error) ok = true
      else {
        const second = await supabase.auth.verifyOtp({ email: clean, token: code.slice(-6), type: 'email' })
        if (!second.error) ok = true
      }
      setVerifying(false)

      if (!ok) {
        setError('Invalid or expired code. Please try again.')
        return
      }

      setError('')
      showToast('Email verified! ✅', 'success')
      onVerified?.(clean)
    },
    [email, onVerified, showToast],
  )

  const setDigit = (index, value) => {
    const next = [...digits]
    next[index] = value
    setDigits(next)
    setError('')
    if (value && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus()
    const code = next.join('')
    if (code.length === OTP_LENGTH && !next.includes('')) verify(code)
  }

  if (verified) {
    return (
      <div className="mt-2.5 flex items-center gap-2 rounded-[14px] border-[1.5px] border-accent/[0.28] bg-accent/[0.08] px-4 py-3 text-[0.84rem] font-bold text-accent-dark">
        <i className="fas fa-circle-check" aria-hidden="true" /> Email verified
      </div>
    )
  }

  const dark = theme === 'dark'

  return (
    <div
      className={`mt-2.5 animate-fade-in-up rounded-[14px] border-[1.5px] px-[18px] py-4 ${
        dark ? 'border-white/[0.14] bg-white/[0.04]' : 'border-accent/[0.22] bg-accent/[0.04]'
      }`}
    >
      {!sent ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={`flex items-center gap-[7px] text-[0.82rem] ${dark ? 'text-white/70' : 'text-ink-muted'}`}>
            <i className="fas fa-shield-halved text-accent" aria-hidden="true" />
            Verify this email address to continue.
          </p>
          <button
            type="button"
            onClick={send}
            disabled={sending}
            className="btn btn-primary !px-5 !py-2 !text-[0.82rem]"
          >
            {sending ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Sending…
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane" /> Send OTP
              </>
            )}
          </button>
        </div>
      ) : (
        <>
          <p className={`mb-3 flex items-center gap-[7px] text-[0.82rem] ${dark ? 'text-white/70' : 'text-ink-muted'}`}>
            <i className="fas fa-envelope-open-text text-accent" aria-hidden="true" />
            Enter the 8-digit code sent to <strong className="break-all">{email}</strong>
          </p>

          <div className="flex flex-wrap justify-center gap-1.5">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                aria-label={`OTP digit ${index + 1}`}
                value={digit}
                onChange={(e) => setDigit(index, e.target.value.replace(/\D/g, '').slice(0, 1))}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace') {
                    e.preventDefault()
                    const next = [...digits]
                    if (!next[index] && index > 0) {
                      next[index - 1] = ''
                      inputsRef.current[index - 1]?.focus()
                    } else next[index] = ''
                    setDigits(next)
                    setError('')
                  }
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    verify(digits.join(''))
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault()
                  const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
                  if (!pasted) return
                  const next = Array(OTP_LENGTH).fill('')
                  pasted.split('').forEach((ch, i) => {
                    next[i] = ch
                  })
                  setDigits(next)
                  if (pasted.length === OTP_LENGTH) verify(pasted)
                }}
                className={`h-11 w-8 rounded-xs border-2 text-center font-heading text-[1.1rem] font-extrabold outline-none transition-all duration-200 focus:scale-105 focus:border-accent focus:shadow-[0_0_0_3px_rgba(76,175,80,0.14)] ${
                  error ? 'animate-otp-shake border-danger text-danger' : 'border-line text-primary'
                } ${digit && !error ? 'border-accent2 bg-accent2/5 text-accent2-dark' : 'bg-white'}`}
              />
            ))}
          </div>

          {error && <p className="mt-2 text-center text-[0.8rem] font-bold text-danger">{error}</p>}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => verify(digits.join(''))}
              disabled={verifying}
              className="btn btn-primary !px-5 !py-2 !text-[0.82rem]"
            >
              {verifying ? (
                <>
                  <i className="fas fa-spinner fa-spin" /> Verifying…
                </>
              ) : (
                <>
                  <i className="fas fa-shield-halved" /> Verify
                </>
              )}
            </button>

            {resendIn > 0 ? (
              <span className={`text-[0.8rem] ${dark ? 'text-white/60' : 'text-ink-muted'}`}>
                Resend in <strong>{resendIn}</strong>s
              </span>
            ) : (
              <button
                type="button"
                onClick={send}
                className="cursor-pointer border-0 bg-transparent p-0 text-[0.8rem] font-bold text-accent2 underline"
              >
                Resend Code
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
