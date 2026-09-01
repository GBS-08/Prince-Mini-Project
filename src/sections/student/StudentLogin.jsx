import { useState } from 'react'
import PasswordInput from '../../components/PasswordInput'
import { supabase, errorMessage } from '../../services/supabase'
import { useToast } from '../../context/ToastContext'

/** Register-number + password sign-in for the student portal. */
export default function StudentLogin({ onSignedIn }) {
  const { showToast } = useToast()
  const [regno, setRegno] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()

    const cleanRegno = regno.trim().toUpperCase()
    if (!cleanRegno || !password) {
      setMessage({ type: 'err', text: 'Please enter Register No. & Password.' })
      showToast('Please enter Register No. & Password.', 'warning')
      return
    }

    setBusy(true)
    setMessage(null)

    const [credRes, profileRes] = await Promise.all([
      supabase.from('student_credentials').select('password').eq('register_no', cleanRegno).maybeSingle(),
      supabase.from('student_information').select('*').ilike('register_no', cleanRegno).maybeSingle(),
    ])

    setBusy(false)

    if (credRes.error) {
      setMessage({ type: 'err', text: 'Database error — try again.' })
      showToast(`Database error — ${errorMessage(credRes.error)}`, 'error')
      return
    }
    if (!credRes.data) {
      setMessage({ type: 'err', text: 'Register number not found. Contact admin.' })
      showToast('Register number not found.', 'error')
      return
    }
    if (credRes.data.password !== password) {
      setMessage({ type: 'err', text: 'Incorrect password.' })
      showToast('Incorrect password.', 'error')
      return
    }

    showToast(`Welcome! Signed in as ${cleanRegno}`, 'success')
    onSignedIn(cleanRegno, profileRes.data || null)
  }

  return (
    <div className="st-login-wrap sp-up vis">
      <div className="sp-glass st-login-card">
        <div className="st-login-logo">
          <i className="fas fa-user-graduate" aria-hidden="true" />
        </div>
        <h2 className="st-login-title">Student Sign In</h2>
        <p className="st-login-sub">Sign in with your Register Number &amp; Password</p>

        <form onSubmit={submit} noValidate>
          <div className="sp-fg">
            <label htmlFor="inRegno">Register Number *</label>
            <input
              id="inRegno"
              className="sp-inp"
              placeholder="e.g. 22CS0001"
              autoComplete="off"
              style={{ textTransform: 'uppercase' }}
              value={regno}
              onChange={(e) => setRegno(e.target.value)}
              required
            />
          </div>

          <div className="sp-fg">
            <label htmlFor="inPass">Password *</label>
            <PasswordInput
              id="inPass"
              inputClassName="sp-inp"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <div className={`sp-msg sp-msg-${message.type}`} style={{ display: 'flex' }}>
              <i
                className={`fas fa-${message.type === 'err' ? 'exclamation-circle' : 'check-circle'}`}
                aria-hidden="true"
              />{' '}
              {message.text}
            </div>
          )}

          <button type="submit" className="sp-btn sp-btn-primary sp-btn-full" disabled={busy}>
            {busy ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Signing In…
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt" /> Sign In
              </>
            )}
          </button>
        </form>

        <p style={{ marginTop: 18, fontSize: '0.82rem', color: 'var(--sp-muted)', textAlign: 'center' }}>
          <i className="fas fa-info-circle" aria-hidden="true" /> Don&apos;t have a password? Contact your college
          administrator.
        </p>
      </div>
    </div>
  )
}
