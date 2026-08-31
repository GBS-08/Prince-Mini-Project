import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Search } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/context/ToastContext'
import Button from './Button'
import { Field, TextInput } from './FormField'

export function AdmissionStatus() {
  const { notify } = useToast()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('idle')
  const [rows, setRows] = useState([])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim() || !phone.trim()) {
      notify('Please enter both email and phone number.', 'warning')
      return
    }

    if (!supabase) {
      notify('Status lookup is temporarily unavailable.', 'error')
      return
    }

    setStatus('loading')

    const { data, error } = await supabase
      .from('admission_information')
      .select('name,email,phone,course_pref_1,status,created_at')
      .eq('email', email.trim().toLowerCase())
      .eq('phone', phone.trim())
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      setStatus('error')
      setRows([])
      return
    }

    setRows(data ?? [])
    setStatus((data ?? []).length ? 'loaded' : 'empty')
  }

  return (
    <div className="surface-card mx-auto max-w-3xl p-6 sm:p-8">
      <h3 className="font-display text-xl font-bold">Check Application Status</h3>
      <p className="mt-2 text-sm prose-muted">
        Already applied? Enter the email and phone number you used in your application.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2" noValidate>
        <Field label="Email Address" htmlFor="status-email" required>
          <TextInput
            id="status-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Phone Number" htmlFor="status-phone" required>
          <TextInput
            id="status-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+91 99999 99999"
            autoComplete="tel"
          />
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto">
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Checking…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" aria-hidden="true" />
                Check Status
              </>
            )}
          </Button>
        </div>
      </form>

      <div aria-live="polite" className="mt-6">
        {status === 'error' ? (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
            Unable to check right now. Please try again in a moment.
          </p>
        ) : null}

        {status === 'empty' ? (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium prose-muted dark:bg-white/5">
            No admission form found for these details.
          </p>
        ) : null}

        {status === 'loaded' ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {rows.map((row, index) => {
              const approved = String(row.status ?? '').toLowerCase() === 'approved'
              return (
                <motion.li
                  key={`${row.email}-${row.created_at ?? index}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-white/10 dark:bg-white/5"
                >
                  <p className="font-display text-base font-bold">{row.name || '—'}</p>
                  <p className="mt-1 prose-muted">{row.email || '—'}</p>
                  <p className="mt-1 prose-muted">Course: {row.course_pref_1 || '—'}</p>
                  <p className="mt-1 prose-muted">
                    Submitted:{' '}
                    {row.created_at ? new Date(row.created_at).toLocaleString('en-IN') : '—'}
                  </p>
                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      approved
                        ? 'bg-leaf-50 text-leaf-700 dark:bg-leaf-500/15 dark:text-leaf-300'
                        : 'bg-gold-50 text-gold-700 dark:bg-gold-500/15 dark:text-gold-300'
                    }`}
                  >
                    {row.status || 'Pending'}
                  </span>
                </motion.li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export default AdmissionStatus
