import { useState } from 'react'
import PasswordInput from '../../components/PasswordInput'
import { supabase, errorMessage } from '../../services/supabase'
import { useToast } from '../../context/ToastContext'

/** Teacher register-number + password sign-in. */
export default function TeacherLogin({ onSignedIn }) {
  const { showToast } = useToast()
  const [regno, setRegno] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()

    const cleanRegno = regno.trim().toUpperCase()
    if (!cleanRegno || !password) {
      setError('Enter Register No. & Password')
      showToast('Enter Register No. & Password', 'warning')
      return
    }

    setBusy(true)
    setError('')

    try {
      const [credRes, profileRes] = await Promise.all([
        supabase.from('teacher_credentials').select('password').eq('register_no', cleanRegno).maybeSingle(),
        supabase.from('teacher_information').select('*').ilike('register_no', cleanRegno).maybeSingle(),
      ])

      setBusy(false)

      if (credRes.error || !credRes.data) {
        setError('Register number not found. Contact admin.')
        showToast('Register number not found.', 'error')
        return
      }
      if (credRes.data.password !== password) {
        setError('Incorrect password.')
        showToast('Incorrect password.', 'error')
        return
      }

      showToast(`Welcome, Teacher ${cleanRegno}!`, 'success')
      onSignedIn(cleanRegno, profileRes.data || null)
    } catch (err) {
      setBusy(false)
      showToast(`Login error: ${errorMessage(err)}`, 'error')
    }
  }

  return (
    <div className="tc-wrap">
      <div className="tc-login-outer">
        <div className="tc-glass tc-login-card">
          <div className="tc-login-icon">
            <i className="fas fa-chalkboard-teacher" aria-hidden="true" />
          </div>
          <h2 className="tc-login-h2">Teacher Sign In</h2>
          <p className="tc-login-hint">Enter your Register Number &amp; Password to access the portal.</p>

          {error && (
            <div className="tc-msg tc-msg-err" style={{ display: 'flex' }}>
              <i className="fas fa-exclamation-circle" aria-hidden="true" /> {error}
            </div>
          )}

          <form onSubmit={submit} noValidate>
            <div className="tc-fg">
              <label className="tc-label" htmlFor="inRegno">
                <i className="fas fa-id-badge" aria-hidden="true" /> Register Number
              </label>
              <input
                id="inRegno"
                className="tc-input"
                placeholder="e.g. TCH001"
                autoComplete="username"
                value={regno}
                onChange={(e) => setRegno(e.target.value)}
                required
              />
            </div>

            <div className="tc-fg">
              <label className="tc-label" htmlFor="inPass">
                <i className="fas fa-lock" aria-hidden="true" /> Password
              </label>
              <PasswordInput
                id="inPass"
                inputClassName="tc-input"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" id="loginBtn" className="tb tb-pri tb-full" style={{ marginTop: 6 }} disabled={busy}>
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

          <p
            style={{
              marginTop: 18,
              fontSize: '.79rem',
              color: 'var(--tc-muted)',
              textAlign: 'center',
              lineHeight: 1.7,
            }}
          >
            <i className="fas fa-info-circle" style={{ color: 'var(--tc-blue)' }} aria-hidden="true" /> Credentials are
            issued by admin. Contact admin if you cannot sign in.
          </p>
        </div>
      </div>
    </div>
  )
}
