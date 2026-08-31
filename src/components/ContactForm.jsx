import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react'
import { college } from '@/data/college'
import { useToast } from '@/context/ToastContext'
import Button from './Button'
import { Field, SelectInput, TextArea, TextInput } from './FormField'

const SUBJECTS = [
  'Admission Enquiry',
  'Course Information',
  'Placement Enquiry',
  'Hostel & Transport',
  'Campus Visit',
  'Other',
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '' }

export function ContactForm() {
  const { notify } = useToast()
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const setValue = (field) => (event) => {
    const { value } = event.target
    setValues((current) => ({ ...current, [field]: value }))
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
    if (!values.email.trim()) nextErrors.email = 'Please enter your email address.'
    else if (!EMAIL_PATTERN.test(values.email.trim()))
      nextErrors.email = 'Enter a valid email address.'
    if (!values.subject) nextErrors.subject = 'Please choose a subject.'
    if (!values.message.trim()) nextErrors.message = 'Please write your message.'
    else if (values.message.trim().length < 10)
      nextErrors.message = 'Please provide at least 10 characters.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      notify('Please correct the highlighted fields.', 'warning')
      return
    }

    setSubmitting(true)

    const body = [
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      `Phone: ${values.phone.trim() || '—'}`,
      `Subject: ${values.subject}`,
      '',
      values.message.trim(),
    ].join('\n')

    const mailto = `mailto:${college.email}?subject=${encodeURIComponent(
      `[Website Enquiry] ${values.subject}`,
    )}&body=${encodeURIComponent(body)}`

    await new Promise((resolve) => {
      window.setTimeout(resolve, 600)
    })

    window.location.href = mailto
    setSubmitting(false)
    setSent(true)
    notify('Your enquiry is ready to send from your email app.', 'success', 5000)
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card p-8 text-center sm:p-10"
      >
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-600 dark:bg-leaf-900/30 dark:text-leaf-300">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-xl font-extrabold">Thanks, {values.name.trim()}!</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed prose-muted">
          Your enquiry has been prepared in your email app. If it did not open automatically, write
          to us directly and our team will respond within 2 working days.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href={`mailto:${college.email}`} variant="secondary">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {college.email}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSent(false)
              setValues(INITIAL)
            }}
          >
            Send Another Enquiry
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card grid gap-4 p-6 sm:grid-cols-2 sm:p-8" noValidate>
      <div className="sm:col-span-2">
        <h3 className="font-display text-xl font-bold">Send us a message</h3>
        <p className="mt-2 text-sm prose-muted">
          Fill in the form and our team will get back to you. Fields marked with * are required.
        </p>
      </div>

      <Field label="Full Name" htmlFor="contact-name" required error={errors.name}>
        <TextInput
          id="contact-name"
          value={values.name}
          onChange={setValue('name')}
          placeholder="Your name"
          autoComplete="name"
          error={errors.name}
        />
      </Field>

      <Field label="Email Address" htmlFor="contact-email" required error={errors.email}>
        <TextInput
          id="contact-email"
          type="email"
          value={values.email}
          onChange={setValue('email')}
          placeholder="your@email.com"
          autoComplete="email"
          error={errors.email}
        />
      </Field>

      <Field label="Phone Number" htmlFor="contact-phone">
        <TextInput
          id="contact-phone"
          type="tel"
          value={values.phone}
          onChange={setValue('phone')}
          placeholder="+91 99999 99999"
          autoComplete="tel"
        />
      </Field>

      <Field label="Subject" htmlFor="contact-subject" required error={errors.subject}>
        <SelectInput
          id="contact-subject"
          value={values.subject}
          onChange={setValue('subject')}
          error={errors.subject}
        >
          <option value="">Select a subject</option>
          {SUBJECTS.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </SelectInput>
      </Field>

      <Field
        label="Message"
        htmlFor="contact-message"
        required
        error={errors.message}
        hint="Tell us how we can help — the more detail, the better."
        className="sm:col-span-2"
      >
        <TextArea
          id="contact-message"
          rows={5}
          value={values.message}
          onChange={setValue('message')}
          placeholder="Write your enquiry here…"
          error={errors.message}
        />
      </Field>

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Preparing…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send Message
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default ContactForm
