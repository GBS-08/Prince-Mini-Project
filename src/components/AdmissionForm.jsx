import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Loader2, PartyPopper, Send } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/context/ToastContext'
import {
  boards,
  categories,
  entranceExams,
  genders,
  quotas,
  streams,
  applicantTypes,
} from '@/data/admissions'
import { coursePreferenceGroups } from '@/data/courses'
import Button from './Button'
import { Checkbox, Field, SelectInput, TextArea, TextInput } from './FormField'

const STEPS = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Academic Details' },
  { id: 3, label: 'Course Selection' },
  { id: 4, label: 'Review & Submit' },
]

const INITIAL_VALUES = {
  applicantType: 'UG',
  name: '',
  gender: '',
  dob: '',
  email: '',
  phone: '',
  category: '',
  quota: '',
  address: '',
  city: '',
  state: 'Tamil Nadu',
  pincode: '',
  tenthSchool: '',
  tenthBoard: '',
  tenthYear: '',
  tenthPercentage: '',
  twelfthSchool: '',
  twelfthBoard: '',
  twelfthYear: '',
  stream: '',
  twelfthPercentage: '',
  physics: '',
  chemistry: '',
  maths: '',
  biology: '',
  english: '',
  ugDegree: '',
  ugCollege: '',
  ugUniversity: '',
  ugYear: '',
  ugCgpa: '',
  ugPercentage: '',
  course1: '',
  course2: '',
  course3: '',
  entranceExam: '',
  entranceScore: '',
  extraCurricular: '',
  sportsQuota: false,
  nccQuota: false,
  declaration: false,
}

const STEP_REQUIRED = {
  1: {
    name: 'Please enter your full name.',
    gender: 'Please select your gender.',
    dob: 'Please enter your date of birth.',
    email: 'Please enter your email address.',
    phone: 'Please enter your phone number.',
    category: 'Please select your category.',
    address: 'Please enter your address.',
    city: 'Please enter your city.',
    pincode: 'Please enter your pincode.',
  },
  2: {
    tenthSchool: 'Please enter your 10th school name.',
    tenthBoard: 'Please select your 10th board.',
    tenthPercentage: 'Please enter your 10th percentage.',
    twelfthSchool: 'Please enter your 12th school or college.',
    twelfthBoard: 'Please select your 12th board.',
    stream: 'Please select your 12th stream.',
    twelfthPercentage: 'Please enter your 12th percentage.',
  },
  3: {
    course1: 'Please select at least your first course preference.',
  },
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+\d][\d\s-]{8,15}$/
const PINCODE_PATTERN = /^\d{6}$/

function toNumber(value) {
  const parsed = parseFloat(value)
  return Number.isNaN(parsed) ? null : parsed
}

function toInt(value) {
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function CourseSelect({ id, label, value, onChange, required, error, placeholder }) {
  return (
    <Field label={label} htmlFor={id} required={required} error={error} className="sm:col-span-2">
      <SelectInput id={id} value={value} onChange={onChange} error={error}>
        <option value="">{placeholder}</option>
        {coursePreferenceGroups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </optgroup>
        ))}
      </SelectInput>
    </Field>
  )
}

export function AdmissionForm() {
  const { notify } = useToast()
  const [step, setStep] = useState(1)
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const isPG = values.applicantType === 'PG'

  const cutoff = useMemo(() => {
    const physics = toNumber(values.physics) ?? 0
    const chemistry = toNumber(values.chemistry) ?? 0
    const maths = toNumber(values.maths) ?? 0
    const biology = toNumber(values.biology) ?? 0

    if (values.stream.includes('PCM') && (physics || chemistry || maths)) {
      return maths / 2 + physics / 4 + chemistry / 4
    }
    if (values.stream.includes('PCB') && (physics || chemistry || biology)) {
      return biology / 2 + physics / 4 + chemistry / 4
    }
    return 0
  }, [values.stream, values.physics, values.chemistry, values.maths, values.biology])

  const setValue = (field) => (event) => {
    const target = event.target
    const nextValue = target.type === 'checkbox' ? target.checked : target.value
    setValues((current) => ({ ...current, [field]: nextValue }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const validateStep = (stepNumber) => {
    const required = STEP_REQUIRED[stepNumber] ?? {}
    const nextErrors = {}

    Object.entries(required).forEach(([field, message]) => {
      if (!String(values[field] ?? '').trim()) nextErrors[field] = message
    })

    if (stepNumber === 1) {
      if (values.email && !EMAIL_PATTERN.test(values.email)) {
        nextErrors.email = 'Enter a valid email address.'
      }
      if (values.phone && !PHONE_PATTERN.test(values.phone.trim())) {
        nextErrors.phone = 'Enter a valid phone number.'
      }
      if (values.pincode && !PINCODE_PATTERN.test(values.pincode.trim())) {
        nextErrors.pincode = 'Pincode must be 6 digits.'
      }
    }

    if (stepNumber === 2) {
      ;['tenthPercentage', 'twelfthPercentage'].forEach((field) => {
        const parsed = toNumber(values[field])
        if (parsed != null && (parsed < 0 || parsed > 100)) {
          nextErrors[field] = 'Percentage must be between 0 and 100.'
        }
      })
      if (isPG) {
        if (!values.ugDegree.trim()) nextErrors.ugDegree = 'Please enter your UG degree.'
        if (!values.ugCollege.trim()) nextErrors.ugCollege = 'Please enter your UG college.'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const goToStep = (next) => {
    setStep(next)
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNext = () => {
    if (!validateStep(step)) {
      notify('Please correct the highlighted fields before continuing.', 'warning')
      return
    }
    goToStep(step + 1)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!values.declaration) {
      setErrors({ declaration: 'Please agree to the declaration before submitting.' })
      notify('Please agree to the declaration before submitting.', 'warning')
      return
    }

    setSubmitting(true)

    const payload = {
      applicant_type: values.applicantType,
      name: values.name.trim(),
      gender: values.gender || null,
      dob: values.dob || null,
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      category: values.category || null,
      quota: values.quota || null,
      address: values.address.trim(),
      city: values.city.trim(),
      state: values.state.trim() || 'Tamil Nadu',
      pincode: values.pincode.trim(),
      tenth_school: values.tenthSchool.trim() || null,
      tenth_board: values.tenthBoard || null,
      tenth_year: toInt(values.tenthYear),
      tenth_percentage: toNumber(values.tenthPercentage),
      twelfth_school: values.twelfthSchool.trim() || null,
      twelfth_board: values.twelfthBoard || null,
      twelfth_year: toInt(values.twelfthYear),
      twelfth_stream: values.stream || null,
      twelfth_percentage: toNumber(values.twelfthPercentage),
      twelfth_physics: toNumber(values.physics),
      twelfth_chemistry: toNumber(values.chemistry),
      twelfth_maths: toNumber(values.maths),
      twelfth_biology: toNumber(values.biology),
      twelfth_english: toNumber(values.english),
      twelfth_cutoff: cutoff > 0 ? Number(cutoff.toFixed(2)) : null,
      ug_degree: values.ugDegree.trim() || null,
      ug_college: values.ugCollege.trim() || null,
      ug_university: values.ugUniversity.trim() || null,
      ug_year: toInt(values.ugYear),
      ug_cgpa: toNumber(values.ugCgpa),
      ug_percentage: toNumber(values.ugPercentage),
      course_pref_1: values.course1 || null,
      course_pref_2: values.course2 || null,
      course_pref_3: values.course3 || null,
      entrance_exam: values.entranceExam || null,
      entrance_score: values.entranceScore.trim() || null,
      sports_quota: values.sportsQuota,
      ncc_quota: values.nccQuota,
      extra_curricular: values.extraCurricular.trim() || null,
      declaration_agreed: true,
      status: 'Pending',
    }

    if (!supabase) {
      setSubmitting(false)
      notify('Online applications are temporarily unavailable. Please call the admissions office.', 'error')
      return
    }

    const { data, error } = await supabase
      .from('admission_information')
      .insert(payload)
      .select('name,email,phone,course_pref_1,status,created_at')
      .single()

    setSubmitting(false)

    if (error || !data) {
      notify(`Submission failed: ${error?.message ?? 'Unknown error'}`, 'error', 6000)
      return
    }

    setResult({
      ...data,
      applicationId: `PDKV-${Date.now().toString().slice(-8)}`,
    })
    notify('Application submitted successfully! We will contact you soon.', 'success', 6000)
  }

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card mx-auto max-w-2xl p-8 text-center sm:p-10"
      >
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-600 dark:bg-leaf-900/30 dark:text-leaf-300">
          <PartyPopper className="h-8 w-8" aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-extrabold">
          Application Submitted Successfully!
        </h3>
        <p className="mt-3 text-sm leading-relaxed prose-muted">
          Thank you <strong className="text-slate-800 dark:text-white">{result.name}</strong>! Your
          application has been received. Our admissions team will contact you at{' '}
          <strong className="text-slate-800 dark:text-white">{result.email}</strong> within 2–3
          working days.
        </p>
        <p className="mt-5 inline-flex rounded-xl bg-brand-50 px-4 py-2.5 font-display text-sm font-extrabold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          Application ID: {result.applicationId}
        </p>

        <dl className="mt-6 space-y-2 rounded-2xl bg-slate-50 p-5 text-left text-sm dark:bg-white/5">
          {[
            ['Applicant', result.name],
            ['Email', result.email],
            ['Phone', result.phone || '—'],
            ['Course', result.course_pref_1 || '—'],
            [
              'Submitted',
              new Date(result.created_at ?? Date.now()).toLocaleString('en-IN'),
            ],
            ['Status', result.status || 'Pending'],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-wrap justify-between gap-2">
              <dt className="font-semibold text-slate-600 dark:text-slate-400">{label}</dt>
              <dd className="font-bold text-slate-800 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button to="/">Go to Home</Button>
          <Button
            variant="outline"
            onClick={() => {
              setResult(null)
              setValues(INITIAL_VALUES)
              setStep(1)
            }}
          >
            Apply Again
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="surface-card mx-auto max-w-4xl p-6 sm:p-8 lg:p-10">
      <ol className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-3">
        {STEPS.map((item, index) => {
          const done = item.id < step
          const active = item.id === step
          return (
            <li key={item.id} className="flex flex-1 items-center gap-2">
              <span
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition-colors ${
                  done
                    ? 'bg-leaf-500 text-white'
                    : active
                      ? 'bg-brand-gradient text-white shadow-brand'
                      : 'bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500'
                }`}
                aria-current={active ? 'step' : undefined}
              >
                {done ? <Check className="h-4 w-4" aria-hidden="true" /> : item.id}
              </span>
              <span
                className={`hidden text-xs font-bold sm:inline ${
                  active ? 'text-brand-700 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>
              {index < STEPS.length - 1 ? (
                <span
                  className={`hidden h-0.5 flex-1 rounded-full sm:block ${
                    done ? 'bg-leaf-400' : 'bg-slate-200 dark:bg-white/10'
                  }`}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          )
        })}
      </ol>

      <form onSubmit={handleSubmit} noValidate>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 ? (
              <fieldset>
                <legend className="mb-5 font-display text-lg font-bold">
                  Personal Information
                </legend>

                <div className="mb-6 grid gap-2 sm:grid-cols-2">
                  {applicantTypes.map((type) => {
                    const active = values.applicantType === type.value
                    return (
                      <label
                        key={type.value}
                        className={`flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all ${
                          active
                            ? 'bg-brand-gradient text-white shadow-brand'
                            : 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200 hover:text-brand-700 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10'
                        }`}
                      >
                        <input
                          type="radio"
                          name="applicantType"
                          value={type.value}
                          checked={active}
                          onChange={setValue('applicantType')}
                          className="sr-only"
                        />
                        {type.label}
                      </label>
                    )
                  })}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name" htmlFor="adm-name" required error={errors.name}>
                    <TextInput
                      id="adm-name"
                      value={values.name}
                      onChange={setValue('name')}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      error={errors.name}
                    />
                  </Field>

                  <Field label="Gender" htmlFor="adm-gender" required error={errors.gender}>
                    <SelectInput
                      id="adm-gender"
                      value={values.gender}
                      onChange={setValue('gender')}
                      error={errors.gender}
                    >
                      <option value="">Select Gender</option>
                      {genders.map((gender) => (
                        <option key={gender}>{gender}</option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field label="Date of Birth" htmlFor="adm-dob" required error={errors.dob}>
                    <TextInput
                      id="adm-dob"
                      type="date"
                      value={values.dob}
                      onChange={setValue('dob')}
                      error={errors.dob}
                    />
                  </Field>

                  <Field label="Email Address" htmlFor="adm-email" required error={errors.email}>
                    <TextInput
                      id="adm-email"
                      type="email"
                      value={values.email}
                      onChange={setValue('email')}
                      placeholder="your@email.com"
                      autoComplete="email"
                      error={errors.email}
                    />
                  </Field>

                  <Field label="Phone Number" htmlFor="adm-phone" required error={errors.phone}>
                    <TextInput
                      id="adm-phone"
                      type="tel"
                      value={values.phone}
                      onChange={setValue('phone')}
                      placeholder="+91 99999 99999"
                      autoComplete="tel"
                      error={errors.phone}
                    />
                  </Field>

                  <Field label="Category" htmlFor="adm-category" required error={errors.category}>
                    <SelectInput
                      id="adm-category"
                      value={values.category}
                      onChange={setValue('category')}
                      error={errors.category}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field label="Quota" htmlFor="adm-quota">
                    <SelectInput id="adm-quota" value={values.quota} onChange={setValue('quota')}>
                      <option value="">Select Quota</option>
                      {quotas.map((quota) => (
                        <option key={quota}>{quota}</option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field
                    label="Address"
                    htmlFor="adm-address"
                    required
                    error={errors.address}
                    className="sm:col-span-2"
                  >
                    <TextArea
                      id="adm-address"
                      rows={3}
                      value={values.address}
                      onChange={setValue('address')}
                      placeholder="Door No., Street, Area…"
                      error={errors.address}
                    />
                  </Field>

                  <Field label="City" htmlFor="adm-city" required error={errors.city}>
                    <TextInput
                      id="adm-city"
                      value={values.city}
                      onChange={setValue('city')}
                      placeholder="City"
                      error={errors.city}
                    />
                  </Field>

                  <Field label="State" htmlFor="adm-state">
                    <TextInput id="adm-state" value={values.state} onChange={setValue('state')} />
                  </Field>

                  <Field label="Pincode" htmlFor="adm-pincode" required error={errors.pincode}>
                    <TextInput
                      id="adm-pincode"
                      inputMode="numeric"
                      value={values.pincode}
                      onChange={setValue('pincode')}
                      placeholder="600127"
                      error={errors.pincode}
                    />
                  </Field>
                </div>
              </fieldset>
            ) : null}

            {step === 2 ? (
              <fieldset>
                <legend className="mb-5 font-display text-lg font-bold">Academic Details</legend>

                <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">
                  10th Standard
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="10th School Name"
                    htmlFor="adm-tenthSchool"
                    required
                    error={errors.tenthSchool}
                  >
                    <TextInput
                      id="adm-tenthSchool"
                      value={values.tenthSchool}
                      onChange={setValue('tenthSchool')}
                      placeholder="School name"
                      error={errors.tenthSchool}
                    />
                  </Field>
                  <Field
                    label="10th Board"
                    htmlFor="adm-tenthBoard"
                    required
                    error={errors.tenthBoard}
                  >
                    <SelectInput
                      id="adm-tenthBoard"
                      value={values.tenthBoard}
                      onChange={setValue('tenthBoard')}
                      error={errors.tenthBoard}
                    >
                      <option value="">Select Board</option>
                      {boards.map((board) => (
                        <option key={board}>{board}</option>
                      ))}
                    </SelectInput>
                  </Field>
                  <Field label="10th Year of Passing" htmlFor="adm-tenthYear">
                    <TextInput
                      id="adm-tenthYear"
                      type="number"
                      min="2000"
                      max="2030"
                      value={values.tenthYear}
                      onChange={setValue('tenthYear')}
                      placeholder="e.g. 2022"
                    />
                  </Field>
                  <Field
                    label="10th Percentage"
                    htmlFor="adm-tenth"
                    required
                    error={errors.tenthPercentage}
                  >
                    <TextInput
                      id="adm-tenth"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={values.tenthPercentage}
                      onChange={setValue('tenthPercentage')}
                      placeholder="e.g. 92.5"
                      error={errors.tenthPercentage}
                    />
                  </Field>
                </div>

                <h4 className="mb-3 mt-7 text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">
                  12th Standard
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="12th School / College"
                    htmlFor="adm-twelfthSchool"
                    required
                    error={errors.twelfthSchool}
                  >
                    <TextInput
                      id="adm-twelfthSchool"
                      value={values.twelfthSchool}
                      onChange={setValue('twelfthSchool')}
                      placeholder="School/College name"
                      error={errors.twelfthSchool}
                    />
                  </Field>
                  <Field
                    label="12th Board"
                    htmlFor="adm-twelfthBoard"
                    required
                    error={errors.twelfthBoard}
                  >
                    <SelectInput
                      id="adm-twelfthBoard"
                      value={values.twelfthBoard}
                      onChange={setValue('twelfthBoard')}
                      error={errors.twelfthBoard}
                    >
                      <option value="">Select Board</option>
                      {boards.map((board) => (
                        <option key={board}>{board}</option>
                      ))}
                    </SelectInput>
                  </Field>
                  <Field label="12th Year of Passing" htmlFor="adm-twelfthYear">
                    <TextInput
                      id="adm-twelfthYear"
                      type="number"
                      min="2000"
                      max="2030"
                      value={values.twelfthYear}
                      onChange={setValue('twelfthYear')}
                      placeholder="e.g. 2024"
                    />
                  </Field>
                  <Field label="12th Stream" htmlFor="adm-stream" required error={errors.stream}>
                    <SelectInput
                      id="adm-stream"
                      value={values.stream}
                      onChange={setValue('stream')}
                      error={errors.stream}
                    >
                      <option value="">Select Stream</option>
                      {streams.map((stream) => (
                        <option key={stream}>{stream}</option>
                      ))}
                    </SelectInput>
                  </Field>
                  <Field
                    label="12th Overall Percentage"
                    htmlFor="adm-twelfth"
                    required
                    error={errors.twelfthPercentage}
                  >
                    <TextInput
                      id="adm-twelfth"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={values.twelfthPercentage}
                      onChange={setValue('twelfthPercentage')}
                      placeholder="e.g. 88.5"
                      error={errors.twelfthPercentage}
                    />
                  </Field>
                </div>

                <h4 className="mb-3 mt-7 text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">
                  Subject-wise Marks (12th)
                </h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ['physics', 'Physics'],
                    ['chemistry', 'Chemistry'],
                    ['maths', 'Mathematics'],
                    ['biology', 'Biology / Computer'],
                    ['english', 'English'],
                  ].map(([field, label]) => (
                    <Field key={field} label={label} htmlFor={`adm-${field}`}>
                      <TextInput
                        id={`adm-${field}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={values[field]}
                        onChange={setValue(field)}
                        placeholder="Marks out of 100"
                      />
                    </Field>
                  ))}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Cutoff Mark
                    </span>
                    <output
                      htmlFor="adm-physics adm-chemistry adm-maths adm-biology"
                      className="flex min-h-[46px] items-center justify-center rounded-xl bg-brand-50 px-3.5 font-display text-lg font-extrabold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                    >
                      {cutoff > 0 ? cutoff.toFixed(2) : '—'}
                    </output>
                    <p className="text-xs prose-muted">
                      Calculated automatically from Physics, Chemistry &amp; Maths/Biology.
                    </p>
                  </div>
                </div>

                {isPG ? (
                  <>
                    <h4 className="mb-3 mt-7 text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">
                      UG Degree Details
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="UG Degree"
                        htmlFor="adm-ugDegree"
                        required
                        error={errors.ugDegree}
                      >
                        <TextInput
                          id="adm-ugDegree"
                          value={values.ugDegree}
                          onChange={setValue('ugDegree')}
                          placeholder="e.g. B.E. Computer Science"
                          error={errors.ugDegree}
                        />
                      </Field>
                      <Field
                        label="UG College"
                        htmlFor="adm-ugCollege"
                        required
                        error={errors.ugCollege}
                      >
                        <TextInput
                          id="adm-ugCollege"
                          value={values.ugCollege}
                          onChange={setValue('ugCollege')}
                          placeholder="College name"
                          error={errors.ugCollege}
                        />
                      </Field>
                      <Field label="UG University" htmlFor="adm-ugUniversity">
                        <TextInput
                          id="adm-ugUniversity"
                          value={values.ugUniversity}
                          onChange={setValue('ugUniversity')}
                          placeholder="e.g. Anna University"
                        />
                      </Field>
                      <Field label="UG Year of Passing" htmlFor="adm-ugYear">
                        <TextInput
                          id="adm-ugYear"
                          type="number"
                          value={values.ugYear}
                          onChange={setValue('ugYear')}
                          placeholder="e.g. 2024"
                        />
                      </Field>
                      <Field label="UG CGPA (out of 10)" htmlFor="adm-ugCgpa">
                        <TextInput
                          id="adm-ugCgpa"
                          type="number"
                          min="0"
                          max="10"
                          step="0.01"
                          value={values.ugCgpa}
                          onChange={setValue('ugCgpa')}
                          placeholder="e.g. 8.5"
                        />
                      </Field>
                      <Field label="UG Percentage" htmlFor="adm-ugPct">
                        <TextInput
                          id="adm-ugPct"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={values.ugPercentage}
                          onChange={setValue('ugPercentage')}
                          placeholder="e.g. 78.5"
                        />
                      </Field>
                    </div>
                  </>
                ) : null}
              </fieldset>
            ) : null}

            {step === 3 ? (
              <fieldset>
                <legend className="mb-5 font-display text-lg font-bold">Course Preference</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CourseSelect
                    id="adm-course1"
                    label="First Preference Course"
                    value={values.course1}
                    onChange={setValue('course1')}
                    required
                    error={errors.course1}
                    placeholder="Select Preferred Course"
                  />
                  <CourseSelect
                    id="adm-course2"
                    label="Second Preference (Optional)"
                    value={values.course2}
                    onChange={setValue('course2')}
                    placeholder="Select (Optional)"
                  />
                  <CourseSelect
                    id="adm-course3"
                    label="Third Preference (Optional)"
                    value={values.course3}
                    onChange={setValue('course3')}
                    placeholder="Select (Optional)"
                  />

                  <Field label="Entrance Exam" htmlFor="adm-entrance">
                    <SelectInput
                      id="adm-entrance"
                      value={values.entranceExam}
                      onChange={setValue('entranceExam')}
                    >
                      <option value="">None / Not Applicable</option>
                      {entranceExams.map((exam) => (
                        <option key={exam}>{exam}</option>
                      ))}
                    </SelectInput>
                  </Field>

                  <Field label="Entrance Score / Rank" htmlFor="adm-entranceScore">
                    <TextInput
                      id="adm-entranceScore"
                      value={values.entranceScore}
                      onChange={setValue('entranceScore')}
                      placeholder="e.g. 1234 / 98.5 percentile"
                    />
                  </Field>

                  <Field
                    label="Extra Curricular Activities"
                    htmlFor="adm-extra"
                    className="sm:col-span-2"
                  >
                    <TextInput
                      id="adm-extra"
                      value={values.extraCurricular}
                      onChange={setValue('extraCurricular')}
                      placeholder="Sports, NCC, NSS, Cultural etc."
                    />
                  </Field>

                  <Checkbox
                    id="adm-sports"
                    label="Sports Achievement (Quota)"
                    checked={values.sportsQuota}
                    onChange={setValue('sportsQuota')}
                  />
                  <Checkbox
                    id="adm-ncc"
                    label="NCC Certificate"
                    checked={values.nccQuota}
                    onChange={setValue('nccQuota')}
                  />
                </div>
              </fieldset>
            ) : null}

            {step === 4 ? (
              <fieldset>
                <legend className="mb-5 font-display text-lg font-bold">Review &amp; Submit</legend>

                <div className="space-y-5">
                  {[
                    {
                      heading: 'Personal Info',
                      rows: [
                        ['Type', values.applicantType],
                        ['Name', values.name],
                        ['Gender', values.gender],
                        ['Date of Birth', values.dob],
                        ['Email', values.email],
                        ['Phone', values.phone],
                        ['Category', values.category],
                        ['Quota', values.quota],
                        ['City', values.city],
                        ['Pincode', values.pincode],
                      ],
                    },
                    {
                      heading: 'Academic Details',
                      rows: [
                        ['10th %', values.tenthPercentage],
                        ['10th Board', values.tenthBoard],
                        ['12th %', values.twelfthPercentage],
                        ['12th Stream', values.stream],
                        ['Physics', values.physics],
                        ['Chemistry', values.chemistry],
                        [values.stream.includes('PCB') ? 'Biology' : 'Maths',
                          values.stream.includes('PCB') ? values.biology : values.maths],
                        ['Cutoff', cutoff > 0 ? cutoff.toFixed(2) : '—'],
                        ...(isPG
                          ? [
                              ['UG Degree', values.ugDegree],
                              ['UG College', values.ugCollege],
                              ['UG CGPA / %', values.ugCgpa || values.ugPercentage],
                            ]
                          : []),
                      ],
                    },
                    {
                      heading: 'Course Preference',
                      rows: [
                        ['1st Choice', values.course1],
                        ['2nd Choice', values.course2],
                        ['3rd Choice', values.course3],
                        ['Entrance', `${values.entranceExam || '—'} — ${values.entranceScore || '—'}`],
                        ['Sports Quota', values.sportsQuota ? 'Yes' : 'No'],
                        ['NCC', values.nccQuota ? 'Yes' : 'No'],
                      ],
                    },
                  ].map((section) => (
                    <div key={section.heading} className="rounded-2xl bg-slate-50 p-5 dark:bg-white/5">
                      <h4 className="font-display text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">
                        {section.heading}
                      </h4>
                      <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                        {section.rows.map(([label, value]) => (
                          <div
                            key={label}
                            className="flex justify-between gap-3 border-b border-slate-200/70 pb-1.5 text-sm dark:border-white/5"
                          >
                            <dt className="prose-muted">{label}</dt>
                            <dd className="text-right font-semibold text-slate-800 dark:text-white">
                              {value || '—'}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Checkbox
                    id="adm-declaration"
                    checked={values.declaration}
                    onChange={setValue('declaration')}
                    error={errors.declaration}
                    label="I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that providing false information may lead to disqualification."
                  />
                  {errors.declaration ? (
                    <p role="alert" className="mt-2 text-xs font-semibold text-rose-600">
                      {errors.declaration}
                    </p>
                  ) : null}
                </div>
              </fieldset>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-white/10">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={() => goToStep(step - 1)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </Button>
          ) : (
            <span />
          )}

          {step < 4 ? (
            <Button type="button" onClick={handleNext}>
              {step === 3 ? 'Review' : 'Next'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AdmissionForm
