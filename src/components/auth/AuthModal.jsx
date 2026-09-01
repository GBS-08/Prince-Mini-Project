import { useCallback, useEffect, useRef, useState } from 'react'
import Modal from '../Modal'
import { supabase, errorMessage } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const OTP_LENGTH = 8
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emptyDigits = () => Array(OTP_LENGTH).fill('')

/**
 * Passwordless e-mail OTP sign-in / sign-up.
 * A faithful React port of the `globalAuthModal` built by the old shared.js —
 * same two-step flow, same 8-digit code, same resend timer and copy.
 */
export default function AuthModal() {
  const { authModal, closeAuthModal, saveLoginInformation } = useAuth()
  const { showToast } = useToast()

  const [mode, setMode] = useState('login')
  const [step, setStep] = useState('email')
  const [form, setForm] = useState({ name: '', regno: '', phone: '', gender: '', email: '' })
  const [digits, setDigits] = useState(emptyDigits)
  const [otpError, setOtpError] = useState('')
  const [shake, setShake] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  const inputsRef = useRef([])
  const signupDataRef = useRef(null)

  const { open } = authModal

  useEffect(() => {
    if (!open) return
    setMode(authModal.mode)
    setStep('email')
    setDigits(emptyDigits())
    setOtpError('')
    signupDataRef.current = null
  }, [open, authModal.mode])

  useEffect(() => {
    if (resendIn <= 0) return undefined
    const id = window.setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(id)
  }, [resendIn])

  const update = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))

  const flagError = useCallback((message) => {
    setOtpError(message)
    setShake(true)
    window.setTimeout(() => setShake(false), 600)
  }, [])

  const sendCode = useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
    })
    return error
  }, [])

  const handleEmailSubmit = async (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()

    if (!EMAIL_RE.test(email)) {
      showToast('Please enter a valid email address.', 'warning')
      return
    }

    if (mode === 'signup') {
      if (!form.name.trim() || !form.phone.trim() || !form.gender) {
        showToast('Please fill in all required fields.', 'warning')
        return
      }
      signupDataRef.current = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        gender: form.gender,
        regno: form.regno.trim(),
      }
    }

    setSending(true)
    const error = await sendCode(email)
    setSending(false)

    if (error) {
      showToast(`Failed to send code: ${errorMessage(error)}`, 'error')
      return
    }

    setForm((f) => ({ ...f, email }))
    showToast('Verification code sent! Check your inbox 📬', 'success', 5000)
    setDigits(emptyDigits())
    setOtpError('')
    setStep('otp')
    setResendIn(60)
    window.setTimeout(() => inputsRef.current[0]?.focus(), 60)
  }

  const verify = useCallback(
    async (code) => {
      if (code.length < 6) {
        flagError('Please enter the complete verification code.')
        return
      }

      setVerifying(true)
      let session = null
      let failure = null

      const first = await supabase.auth.verifyOtp({ email: form.email, token: code, type: 'email' })
      if (first.error) {
        const second = await supabase.auth.verifyOtp({
          email: form.email,
          token: code.slice(-6),
          type: 'email',
        })
        if (second.error) failure = second.error
        else session = second.data?.session
      } else {
        session = first.data?.session
      }
      setVerifying(false)

      if (failure) {
        flagError('Invalid or expired code. Please try again.')
        showToast('Verification failed — wrong or expired code.', 'error')
        return
      }

      const authUser = session?.user || (await supabase.auth.getUser()).data?.user
      if (authUser) await saveLoginInformation(authUser, signupDataRef.current)

      showToast(mode === 'login' ? 'Welcome back! 👋' : 'Account created! Welcome 🎉', 'success')
      closeAuthModal()
    },
    [form.email, flagError, mode, saveLoginInformation, showToast, closeAuthModal],
  )

  const setDigit = (index, value) => {
    const next = [...digits]
    next[index] = value
    setDigits(next)
    setOtpError('')
    if (value && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus()
    const code = next.join('')
    if (code.length === OTP_LENGTH && !code.includes('')) verify(code)
  }

  const onDigitKeyDown = (index) => (event) => {
    if (event.key === 'Backspace') {
      event.preventDefault()
      const next = [...digits]
      if (!next[index] && index > 0) {
        next[index - 1] = ''
        inputsRef.current[index - 1]?.focus()
      } else {
        next[index] = ''
      }
      setDigits(next)
      setOtpError('')
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      inputsRef.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault()
      inputsRef.current[index + 1]?.focus()
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      verify(digits.join(''))
    }
  }

  const onPaste = (event) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = emptyDigits()
    pasted.split('').forEach((ch, i) => {
      next[i] = ch
    })
    setDigits(next)
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1)
    inputsRef.current[focusIdx]?.focus()
    if (pasted.length === OTP_LENGTH) verify(pasted)
  }

  const resend = async () => {
    const error = await sendCode(form.email)
    if (error) {
      showToast(`Resend failed: ${errorMessage(error)}`, 'error')
      return
    }
    showToast('New verification code sent! 📬', 'success')
    setResendIn(60)
  }

  const shortEmail =
    form.email.length > 28 ? `${form.email.slice(0, 12)}…${form.email.slice(form.email.lastIndexOf('@'))}` : form.email

  const title =
    step === 'otp' ? (mode === 'login' ? 'Sign In' : 'Verify Email') : mode === 'login' ? 'Sign In' : 'Create Account'

  return (
    <Modal open={open} onClose={closeAuthModal} title={title} size="sm">
      {step === 'email' ? (
        <>
          <p className="mb-5 text-center text-[0.88rem] leading-[1.6] text-ink-muted">
            {mode === 'login'
              ? 'Enter your email to receive a verification code'
              : 'Enter your details below to create your account'}
          </p>

          <StepDots step={1} />

          <form onSubmit={handleEmailSubmit} noValidate>
            {mode === 'signup' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="_authName">
                    <i className="fas fa-user" /> Full Name *
                  </label>
                  <input
                    id="_authName"
                    className="form-input"
                    placeholder="Your full name"
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="_authRegno">
                    <i className="fas fa-id-card" /> Register Number
                    <span className="text-[0.76rem] font-normal opacity-[0.55]">(optional)</span>
                  </label>
                  <input
                    id="_authRegno"
                    className="form-input"
                    placeholder="e.g. 22CS0001"
                    value={form.regno}
                    onChange={update('regno')}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="_authPhone">
                    <i className="fas fa-phone" /> Phone *
                  </label>
                  <input
                    id="_authPhone"
                    type="tel"
                    className="form-input"
                    placeholder="+91 99999 99999"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="_authGender">
                    <i className="fas fa-venus-mars" /> Gender *
                  </label>
                  <select
                    id="_authGender"
                    className="form-select"
                    value={form.gender}
                    onChange={update('gender')}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="my-[18px] h-px bg-line" />
              </>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="_authEmail">
                <i className="fas fa-envelope" /> Email Address *
              </label>
              <input
                id="_authEmail"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                autoComplete="email"
                value={form.email}
                onChange={update('email')}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary mt-3 w-full justify-center" disabled={sending}>
              {sending ? (
                <>
                  <i className="fas fa-spinner fa-spin" /> Sending…
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane" /> Send Verification Code
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              signupDataRef.current = null
              setMode(mode === 'login' ? 'signup' : 'login')
            }}
            className="mt-3.5 block w-full cursor-pointer border-0 bg-transparent py-1.5 text-center font-body text-[0.83rem] font-semibold text-ink-muted"
          >
            {mode === 'login' ? (
              <>
                Don&apos;t have an account? <strong>Create one</strong>
              </>
            ) : (
              <>
                Already have an account? <strong>Sign In</strong>
              </>
            )}
          </button>

          <p className="mt-2.5 text-center text-[0.76rem] leading-[1.5] text-ink-light">
            <i className="fas fa-shield-alt text-accent2" /> A secure 8-digit OTP will be sent to your email
          </p>
        </>
      ) : (
        <>
          <StepDots step={2} />

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/[0.26] bg-gradient-to-br from-accent/[0.12] to-accent2/[0.12] text-[1.75rem]">
            ✉️
          </div>

          <p className="mb-1.5 text-center text-[1.02rem] font-bold text-primary">Check your inbox!</p>
          <p className="mb-3.5 text-center text-[0.86rem] leading-[1.65] text-ink-muted">
            We sent an <strong>8-digit code</strong> to:
          </p>

          <div className="mb-[18px] flex items-center gap-2 break-all rounded-sm border border-accent/[0.22] bg-accent/[0.07] px-4 py-2.5 text-[0.88rem] font-semibold text-accent-dark">
            <i className="fas fa-envelope shrink-0 text-accent" />
            <span>{shortEmail}</span>
          </div>

          <label className="mb-1 block text-center text-[0.80rem] font-bold tracking-[0.04em] text-ink-dark">
            ENTER 8-DIGIT CODE
          </label>

          <div className="mb-1.5 mt-[18px] flex justify-center gap-2">
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
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                value={digit}
                onChange={(e) => setDigit(index, e.target.value.replace(/\D/g, '').slice(0, 1))}
                onKeyDown={onDigitKeyDown(index)}
                onPaste={onPaste}
                className={`h-[52px] w-9 rounded-sm border-2 bg-white text-center font-heading text-[1.45rem] font-extrabold caret-transparent outline-none transition-all duration-[220ms] focus:scale-[1.06] focus:border-accent focus:shadow-[0_0_0_4px_rgba(76,175,80,0.14)] sm:w-11 ${
                  otpError && shake ? 'animate-otp-shake border-danger bg-danger/5 text-danger' : ''
                } ${digit && !otpError ? 'border-accent2 bg-accent2/5 text-accent2-dark' : 'border-line text-primary'}`}
              />
            ))}
          </div>

          {otpError && <p className="mt-2 text-center text-[0.82rem] font-bold text-danger">{otpError}</p>}

          <button
            type="button"
            onClick={() => verify(digits.join(''))}
            disabled={verifying}
            className="btn btn-primary mt-[18px] w-full justify-center"
          >
            {verifying ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Verifying…
              </>
            ) : (
              <>
                <i className="fas fa-check-circle" /> Verify Code
              </>
            )}
          </button>

          <div className="mt-3.5 text-center text-[0.83rem] text-ink-muted">
            {resendIn > 0 ? (
              <>
                Resend code in <strong>{resendIn}</strong>s
              </>
            ) : (
              <button
                type="button"
                onClick={resend}
                className="cursor-pointer border-0 bg-transparent p-0 font-body text-[0.83rem] font-bold text-accent2 underline"
              >
                Resend Code
              </button>
            )}
          </div>

          <p className="mt-2 text-center text-[0.78rem] leading-[1.55] text-ink-muted">
            <i className="fas fa-info-circle" /> Can&apos;t find it? Check your spam / junk folder.
            <br />
            Code expires in <strong>10 minutes</strong>.
          </p>

          <button
            type="button"
            onClick={() => {
              setStep('email')
              setResendIn(0)
            }}
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-1.5 border-0 bg-transparent p-0 font-body text-[0.83rem] font-bold text-ink-muted transition-colors hover:text-primary"
          >
            <i className="fas fa-arrow-left" /> Use a different email
          </button>
        </>
      )}
    </Modal>
  )
}

function StepDots({ step }) {
  return (
    <div className="mb-5 flex items-center justify-center gap-2">
      <span
        className={`h-2 w-2 rounded-full transition-all duration-300 ${
          step === 1 ? 'scale-[1.3] bg-accent' : 'bg-accent2'
        }`}
      />
      <span className={`h-px w-7 ${step === 2 ? 'bg-accent2' : 'bg-line'}`} />
      <span
        className={`h-2 w-2 rounded-full transition-all duration-300 ${step === 2 ? 'scale-[1.3] bg-accent' : 'bg-line'}`}
      />
    </div>
  )
}
