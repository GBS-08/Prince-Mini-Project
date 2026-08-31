import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, CheckCircle2, Loader2, Users, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/context/ToastContext'
import Button from './Button'
import { Field, SelectInput, TextInput } from './FormField'

const YEARS = ['I Year', 'II Year', 'III Year', 'IV Year', 'Faculty']

export function EventRegisterModal({ notice, onClose, onRegistered }) {
  const { notify } = useToast()
  const [values, setValues] = useState({ name: '', phone: '', regno: '', year: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!notice) return null

  const registrations = Array.isArray(notice.registrations) ? notice.registrations : []

  const setValue = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!values.phone.trim()) nextErrors.phone = 'Please enter your phone number.'
    if (!values.regno.trim()) nextErrors.regno = 'Please enter your register number.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    if (!supabase) {
      notify('Event registration is temporarily unavailable.', 'error')
      return
    }

    const regno = values.regno.trim().toUpperCase()
    const email = `${regno}@guest.pdkv`

    if (registrations.some((entry) => entry.regno === regno || entry.email === email)) {
      notify('You are already registered for this event!', 'warning')
      return
    }

    setSubmitting(true)

    const [studentCred, teacherCred] = await Promise.all([
      supabase.from('student_credentials').select('register_no').eq('register_no', regno).maybeSingle(),
      supabase.from('teacher_credentials').select('register_no').eq('register_no', regno).maybeSingle(),
    ])

    if (studentCred.error || teacherCred.error || (!studentCred.data && !teacherCred.data)) {
      setSubmitting(false)
      notify('You have no access to register for this event or program.', 'error', 5000)
      return
    }

    const { error } = await supabase
      .from('notices_informations')
      .update({
        registrations: [
          ...registrations,
          {
            name: values.name.trim(),
            phone: values.phone.trim(),
            regno,
            year: values.year,
            email,
            registered_at: new Date().toISOString(),
          },
        ],
      })
      .eq('id', notice.id)

    setSubmitting(false)

    if (error) {
      notify(`Registration failed: ${error.message}`, 'error', 5000)
      return
    }

    notify(`Successfully registered for "${notice.title}"! 🎉`, 'success', 5000)
    onRegistered?.()
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-register-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => event.stopPropagation()}
          className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-elevated dark:bg-surface-dark-muted sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
                Event Registration
              </span>
              <h2 id="event-register-title" className="mt-1.5 font-display text-xl font-extrabold">
                {notice.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-m-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close registration form"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold prose-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {notice.dateLabel}
              {notice.time ? ` • ${notice.time}` : ''}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {registrations.length} already registered
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
            <Field label="Full Name" htmlFor="reg-name" required error={errors.name}>
              <TextInput
                id="reg-name"
                value={values.name}
                onChange={setValue('name')}
                placeholder="Your name"
                error={errors.name}
              />
            </Field>
            <Field label="Phone Number" htmlFor="reg-phone" required error={errors.phone}>
              <TextInput
                id="reg-phone"
                type="tel"
                value={values.phone}
                onChange={setValue('phone')}
                placeholder="+91 99999 99999"
                error={errors.phone}
              />
            </Field>
            <Field label="Register Number" htmlFor="reg-regno" required error={errors.regno}>
              <TextInput
                id="reg-regno"
                value={values.regno}
                onChange={setValue('regno')}
                placeholder="e.g. 411621104001"
                className="uppercase"
                error={errors.regno}
              />
            </Field>
            <Field label="Year" htmlFor="reg-year">
              <SelectInput id="reg-year" value={values.year} onChange={setValue('year')}>
                <option value="">Select Year</option>
                {YEARS.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </SelectInput>
            </Field>

            <p className="text-xs prose-muted sm:col-span-2">
              Only registered students and faculty of the college can sign up for campus events.
            </p>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Registering…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Confirm Registration
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EventRegisterModal
