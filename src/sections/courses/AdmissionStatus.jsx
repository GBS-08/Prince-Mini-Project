import { useState } from 'react'
import { supabase, errorMessage } from '../../services/supabase'
import { useToast } from '../../context/ToastContext'
import Reveal from '../../components/Reveal'

/** "Admission Form Status" lookup by email + phone. */
export default function AdmissionStatus() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [state, setState] = useState({ status: 'idle', rows: [] })

  const check = async (event) => {
    event.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPhone = phone.trim()

    if (!cleanEmail || !cleanPhone) {
      showToast('Please enter email and phone number.', 'warning')
      return
    }

    setState({ status: 'loading', rows: [] })

    const { data, error } = await supabase
      .from('admission_information')
      .select('name,email,phone,course_pref_1,status,created_at')
      .eq('email', cleanEmail)
      .eq('phone', cleanPhone)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Admission status error:', errorMessage(error))
      setState({ status: 'error', rows: [] })
      return
    }

    setState({ status: data?.length ? 'done' : 'empty', rows: data || [] })
  }

  return (
    <Reveal className="mx-auto mt-5 max-w-[920px] rounded-lg bg-white/[0.97] p-[clamp(18px,3vw,26px)] shadow-[0_18px_52px_rgba(0,0,0,0.22)]">
      <h3 className="mb-1.5 font-heading text-[1.08rem] font-bold text-primary">
        <i className="fas fa-history" aria-hidden="true" /> Admission Form Status
      </h3>
      <p className="mb-4 text-[0.88rem] text-ink-muted">
        Enter your Email and Phone to view previously submitted admission forms and status.
      </p>

      <form onSubmit={check} noValidate className="grid grid-cols-1 items-end gap-3 md:grid-cols-3">
        <div className="form-group !mb-0">
          <label className="form-label" htmlFor="admStatusEmail">
            <i className="fas fa-envelope" /> Email
          </label>
          <input
            id="admStatusEmail"
            type="email"
            className="form-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group !mb-0">
          <label className="form-label" htmlFor="admStatusPhone">
            <i className="fas fa-phone" /> Phone
          </label>
          <input
            id="admStatusPhone"
            type="tel"
            className="form-input"
            placeholder="+91 99999 99999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-outline justify-center">
          <i className="fas fa-search" /> Check Status
        </button>
      </form>

      <div className="mt-3.5">
        {state.status === 'loading' && (
          <p className="font-semibold text-ink-muted">
            <i className="fas fa-spinner fa-spin" /> Checking application history…
          </p>
        )}
        {state.status === 'error' && (
          <p className="font-semibold text-ink-muted">Unable to check now. Please try again.</p>
        )}
        {state.status === 'empty' && <p className="font-semibold text-ink-muted">No admission form filled before.</p>}
        {state.status === 'done' && (
          <div className="grid gap-2.5">
            {state.rows.map((row) => (
              <article
                key={`${row.email}-${row.created_at}`}
                className="grid gap-[5px] rounded-xl border border-line bg-white p-3"
              >
                <div>
                  <strong>{row.name || '—'}</strong>
                </div>
                <div>{row.email || '—'}</div>
                <div>Course: {row.course_pref_1 || '—'}</div>
                <div>Submitted: {new Date(row.created_at).toLocaleString('en-IN')}</div>
                <span
                  className={`badge w-fit ${
                    String(row.status || '').toLowerCase() === 'approved' ? 'badge-green' : 'badge-gold'
                  }`}
                >
                  {row.status || 'Pending'}
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  )
}
