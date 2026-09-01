import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, errorMessage } from '../../services/supabase'
import { useToast } from '../../context/ToastContext'
import EmailOtpField from '../../components/EmailOtpField'
import {
  admissionSteps,
  boards,
  categories,
  coursePreferenceGroups,
  entranceExams,
  quotas,
  streams,
} from '../../data/courses'

const TOTAL_STEPS = 4

const INITIAL = {
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
  tenth: '',
  twelfthSchool: '',
  twelfthBoard: '',
  twelfthYear: '',
  stream: '',
  twelfth: '',
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
  ugPct: '',
  course1: '',
  course2: '',
  course3: '',
  entrance: '',
  entranceScore: '',
  extra: '',
  sports: false,
  ncc: false,
  declaration: false,
}

const num = (value) => {
  const parsed = parseFloat(value)
  return Number.isNaN(parsed) ? null : parsed
}
const int = (value) => {
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}
const str = (value) => (value?.trim?.() ? value.trim() : null)

function CourseSelect({ id, label, icon, value, onChange, required, placeholder }) {
  return (
    <div className="form-group col-span-full">
      <label className="form-label" htmlFor={id}>
        <i className={icon} /> {label}
      </label>
      <select id={id} className="form-select" value={value} onChange={onChange} required={required}>
        <option value="">{placeholder}</option>
        {coursePreferenceGroups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[0.72rem] font-bold uppercase tracking-[0.04em] text-ink-muted">{label}</span>
      <span className="text-[0.88rem] font-semibold text-ink-body">{value || '—'}</span>
    </div>
  )
}

/** Four-step admission application (React port of the Courses.js wizard). */
export default function AdmissionForm() {
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL)
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)

  const set = (key) => (event) => {
    const target = event.target
    setForm((f) => ({ ...f, [key]: target.type === 'checkbox' ? target.checked : target.value }))
  }

  const isPG = form.applicantType === 'PG'
  const emailVerified = Boolean(verifiedEmail) && verifiedEmail === form.email.trim().toLowerCase()

  /** Anna University style cut-off, recalculated whenever the marks change. */
  const cutoff = useMemo(() => {
    const physics = parseFloat(form.physics) || 0
    const chemistry = parseFloat(form.chemistry) || 0
    const maths = parseFloat(form.maths) || 0
    const biology = parseFloat(form.biology) || 0

    if (form.stream.includes('PCM') && (physics || chemistry || maths)) {
      return maths / 2 + physics / 4 + chemistry / 4
    }
    if (form.stream.includes('PCB') && (physics || chemistry || biology)) {
      return biology / 2 + physics / 4 + chemistry / 4
    }
    return 0
  }, [form.stream, form.physics, form.chemistry, form.maths, form.biology])

  const goToStep = (next) => {
    setStep(next)
    document.getElementById('admission')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const next = (from) => {
    if (from === 1) {
      const required = [
        form.name,
        form.email,
        form.phone,
        form.gender,
        form.dob,
        form.category,
        form.address,
        form.city,
        form.pincode,
      ]
      if (required.some((value) => !value.trim())) {
        showToast('Please fill all required fields in Step 1.', 'warning')
        return
      }
      if (!emailVerified) {
        showToast('Please verify your email address with the OTP before proceeding.', 'warning')
        document.getElementById('adm-email')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
    }
    if (from === 2) {
      const required = [form.tenth, form.tenthSchool, form.tenthBoard, form.twelfth, form.twelfthSchool, form.stream]
      if (required.some((value) => !String(value).trim())) {
        showToast('Please fill all required academic details in Step 2.', 'warning')
        return
      }
    }
    if (from === 3 && !form.course1) {
      showToast('Please select at least your first course preference.', 'warning')
      return
    }
    goToStep(from + 1)
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!form.declaration) {
      showToast('Please agree to the declaration before submitting.', 'warning')
      return
    }
    if (!emailVerified) {
      showToast('Email verification required. Please go back to Step 1 and verify your email.', 'warning')
      return
    }

    setSubmitting(true)

    const payload = {
      applicant_type: form.applicantType,
      name: str(form.name),
      gender: str(form.gender),
      dob: str(form.dob),
      email: str(form.email),
      phone: str(form.phone),
      category: str(form.category),
      quota: str(form.quota),
      address: str(form.address),
      city: str(form.city),
      state: str(form.state) || 'Tamil Nadu',
      pincode: str(form.pincode),
      tenth_school: str(form.tenthSchool),
      tenth_board: str(form.tenthBoard),
      tenth_year: int(form.tenthYear),
      tenth_percentage: num(form.tenth),
      twelfth_school: str(form.twelfthSchool),
      twelfth_board: str(form.twelfthBoard),
      twelfth_year: int(form.twelfthYear),
      twelfth_stream: str(form.stream),
      twelfth_percentage: num(form.twelfth),
      twelfth_physics: num(form.physics),
      twelfth_chemistry: num(form.chemistry),
      twelfth_maths: num(form.maths),
      twelfth_biology: num(form.biology),
      twelfth_english: num(form.english),
      twelfth_cutoff: cutoff > 0 ? Number(cutoff.toFixed(2)) : null,
      ug_degree: str(form.ugDegree),
      ug_college: str(form.ugCollege),
      ug_university: str(form.ugUniversity),
      ug_year: int(form.ugYear),
      ug_cgpa: num(form.ugCgpa),
      ug_percentage: num(form.ugPct),
      course_pref_1: str(form.course1),
      course_pref_2: str(form.course2),
      course_pref_3: str(form.course3),
      entrance_exam: str(form.entrance),
      entrance_score: str(form.entranceScore),
      sports_quota: form.sports,
      ncc_quota: form.ncc,
      extra_curricular: str(form.extra),
      declaration_agreed: true,
      status: 'Pending',
      email_verified: true,
    }

    const { data, error } = await supabase
      .from('admission_information')
      .insert(payload)
      .select('name,email,phone,course_pref_1,status,created_at')
      .single()

    setSubmitting(false)

    if (error || !data) {
      showToast(`Submission failed: ${errorMessage(error, 'Unknown error')}`, 'error')
      return
    }

    setVerifiedEmail('')
    setSuccess({ ...data, appId: `PDKV-${Date.now().toString().slice(-8)}` })
    showToast('Application submitted successfully! 🎉 We will contact you soon.', 'success', 6000)
  }

  const reset = () => {
    setForm(INITIAL)
    setSuccess(null)
    setStep(1)
  }

  if (success) {
    return (
      <div className="relative z-[1] mx-auto max-w-[920px] rounded-2xl bg-white p-[clamp(28px,5vw,50px)] shadow-[0_32px_88px_rgba(0,0,0,0.30)] max-[480px]:px-4 max-[480px]:py-[22px]">
        <div className="px-[22px] py-11 text-center">
          <div className="mb-4 block animate-modal-in text-[4rem]">🎉</div>
          <h3 className="mb-2.5 font-heading text-[1.48rem] font-extrabold text-accent-dark">
            Application Submitted Successfully!
          </h3>
          <p className="leading-[1.72] text-ink-muted">
            Thank you <strong>{success.name}</strong>! Your application has been received. Our admissions team will
            contact you at <strong>{success.email}</strong> within 2–3 working days.
          </p>
          <div className="mt-3 inline-block rounded-sm border border-primary/[0.14] bg-primary/[0.06] px-[22px] py-2 font-heading text-[0.98rem] font-extrabold text-primary">
            Application ID: {success.appId}
          </div>

          <div className="mx-auto mt-4 grid max-w-[620px] gap-2.5 text-left">
            <article className="grid gap-[5px] rounded-xl border border-line bg-white p-3">
              <div>
                <strong>Applicant:</strong> {success.name}
              </div>
              <div>
                <strong>Email:</strong> {success.email} ✅ Verified
              </div>
              <div>
                <strong>Phone:</strong> {success.phone || '—'}
              </div>
              <div>
                <strong>Course:</strong> {success.course_pref_1 || '—'}
              </div>
              <div>
                <strong>Submitted:</strong> {new Date(success.created_at || Date.now()).toLocaleString('en-IN')}
              </div>
              <div>
                <strong>Status:</strong> <span className="badge badge-gold">{success.status || 'Pending'}</span>
              </div>
            </article>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn btn-primary">
              <i className="fas fa-home" /> Go to Home
            </Link>
            <button type="button" onClick={reset} className="btn btn-outline">
              <i className="fas fa-redo" /> Apply Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-[1] mx-auto max-w-[920px] rounded-2xl bg-white p-[clamp(28px,5vw,50px)] shadow-[0_32px_88px_rgba(0,0,0,0.30)] max-[480px]:px-4 max-[480px]:py-[22px]">
      {/* Step indicator */}
      <ol className="mb-9 flex flex-wrap items-center justify-center gap-0.5 md:gap-1">
        {admissionSteps.map((item, index) => (
          <li key={item.step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-[42px] w-[42px] items-center justify-center rounded-full border-2 text-[0.88rem] font-extrabold transition-all duration-[420ms] ease-bounce ${
                  step === item.step
                    ? 'scale-[1.12] border-transparent bg-gradient-to-br from-primary to-primary-light text-white shadow-[0_6px_18px_rgba(26,35,126,0.38)]'
                    : step > item.step
                      ? 'border-transparent bg-gradient-to-br from-accent to-accent-dark text-white'
                      : 'border-line bg-surface-subtle text-ink-muted'
                }`}
              >
                {item.step}
              </span>
              <span
                className={`hidden whitespace-nowrap text-[0.74rem] font-bold md:block ${
                  step === item.step ? 'text-primary' : step > item.step ? 'text-accent-dark' : 'text-ink-muted'
                }`}
              >
                {item.label}
              </span>
            </div>
            {index < admissionSteps.length - 1 && (
              <span
                className={`mx-1 h-0.5 min-w-[28px] flex-1 transition-colors duration-[420ms] ${
                  step > item.step ? 'bg-gradient-to-r from-accent to-accent2' : 'bg-line'
                }`}
              />
            )}
          </li>
        ))}
      </ol>

      <form onSubmit={submit} noValidate>
        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-modal-in">
            <h3 className="mb-6 flex items-center gap-2.5 border-b-2 border-surface-subtle pb-3.5 font-heading text-[1.18rem] font-bold text-primary">
              <i className="fas fa-user text-accent2" /> Personal Information
            </h3>

            <div className="mb-6 flex flex-col gap-3 md:flex-row">
              {[
                { value: 'UG', icon: 'fas fa-university', label: 'UG (B.Tech / Arts)' },
                { value: 'PG', icon: 'fas fa-graduation-cap', label: 'PG (M.Tech / MBA)' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-2 px-[22px] py-3 font-body text-[0.93rem] font-bold transition-all duration-[320ms] ease-bounce ${
                    form.applicantType === option.value
                      ? 'border-primary bg-[linear-gradient(135deg,rgba(26,35,126,0.07),rgba(33,150,243,0.07))] text-primary shadow-[0_4px_14px_rgba(26,35,126,0.14)]'
                      : 'border-line text-ink-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="applicantType"
                    value={option.value}
                    checked={form.applicantType === option.value}
                    onChange={set('applicantType')}
                    className="pointer-events-none absolute opacity-0"
                  />
                  <i className={option.icon} /> {option.label}
                </label>
              ))}
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-group">
                <label className="form-label" htmlFor="adm-name">
                  <i className="fas fa-user" /> Full Name *
                </label>
                <input
                  id="adm-name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adm-gender">
                  <i className="fas fa-venus-mars" /> Gender *
                </label>
                <select id="adm-gender" className="form-select" value={form.gender} onChange={set('gender')} required>
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adm-dob">
                  <i className="fas fa-birthday-cake" /> Date of Birth *
                </label>
                <input
                  id="adm-dob"
                  type="date"
                  className="form-input"
                  value={form.dob}
                  onChange={set('dob')}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adm-email">
                  <i className="fas fa-envelope" /> Email Address *
                </label>
                <input
                  id="adm-email"
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
                <EmailOtpField email={form.email} verified={emailVerified} onVerified={setVerifiedEmail} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adm-phone">
                  <i className="fas fa-phone" /> Phone Number *
                </label>
                <input
                  id="adm-phone"
                  type="tel"
                  className="form-input"
                  placeholder="+91 99999 99999"
                  value={form.phone}
                  onChange={set('phone')}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adm-category">
                  <i className="fas fa-tag" /> Category *
                </label>
                <select
                  id="adm-category"
                  className="form-select"
                  value={form.category}
                  onChange={set('category')}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adm-quota">
                  <i className="fas fa-ticket-alt" /> Quota
                </label>
                <select id="adm-quota" className="form-select" value={form.quota} onChange={set('quota')}>
                  <option value="">Select Quota</option>
                  {quotas.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-group md:col-span-2">
                <label className="form-label" htmlFor="adm-address">
                  <i className="fas fa-map-marker-alt" /> Address *
                </label>
                <textarea
                  id="adm-address"
                  className="form-textarea"
                  rows={3}
                  placeholder="Door No., Street, Area…"
                  value={form.address}
                  onChange={set('address')}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adm-city">
                  <i className="fas fa-city" /> City *
                </label>
                <input
                  id="adm-city"
                  className="form-input"
                  placeholder="City"
                  value={form.city}
                  onChange={set('city')}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adm-state">
                  <i className="fas fa-map" /> State *
                </label>
                <input
                  id="adm-state"
                  className="form-input"
                  placeholder="State"
                  value={form.state}
                  onChange={set('state')}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adm-pincode">
                  <i className="fas fa-mail-bulk" /> Pincode *
                </label>
                <input
                  id="adm-pincode"
                  className="form-input"
                  placeholder="600127"
                  value={form.pincode}
                  onChange={set('pincode')}
                  required
                />
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3 border-t border-surface-subtle pt-5">
              <button type="button" className="btn btn-primary" onClick={() => next(1)}>
                Next <i className="fas fa-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="animate-modal-in">
            <h3 className="mb-6 flex items-center gap-2.5 border-b-2 border-surface-subtle pb-3.5 font-heading text-[1.18rem] font-bold text-primary">
              <i className="fas fa-graduation-cap text-accent2" /> Academic Details
            </h3>

            <h4 className="mb-3.5 mt-5 flex items-center gap-2 border-t border-surface-subtle pt-4 font-heading text-[0.98rem] font-bold text-primary">
              <i className="fas fa-school" /> 10th Standard Details
            </h4>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-group">
                <label className="form-label" htmlFor="adm-tenthSchool">
                  10th School Name *
                </label>
                <input
                  id="adm-tenthSchool"
                  className="form-input"
                  placeholder="School name"
                  value={form.tenthSchool}
                  onChange={set('tenthSchool')}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="adm-tenthBoard">
                  10th Board *
                </label>
                <select
                  id="adm-tenthBoard"
                  className="form-select"
                  value={form.tenthBoard}
                  onChange={set('tenthBoard')}
                  required
                >
                  <option value="">Select Board</option>
                  {boards.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="adm-tenthYear">
                  10th Year of Passing *
                </label>
                <input
                  id="adm-tenthYear"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 2022"
                  min="2000"
                  max="2030"
                  value={form.tenthYear}
                  onChange={set('tenthYear')}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="adm-tenth">
                  10th Percentage *
                </label>
                <input
                  id="adm-tenth"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 92.5"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.tenth}
                  onChange={set('tenth')}
                  required
                />
              </div>
            </div>

            <h4 className="mb-3.5 mt-5 flex items-center gap-2 border-t border-surface-subtle pt-4 font-heading text-[0.98rem] font-bold text-primary">
              <i className="fas fa-school" /> 12th Standard Details
            </h4>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-group">
                <label className="form-label" htmlFor="adm-twelfthSchool">
                  12th School / College *
                </label>
                <input
                  id="adm-twelfthSchool"
                  className="form-input"
                  placeholder="School/College name"
                  value={form.twelfthSchool}
                  onChange={set('twelfthSchool')}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="adm-twelfthBoard">
                  12th Board *
                </label>
                <select
                  id="adm-twelfthBoard"
                  className="form-select"
                  value={form.twelfthBoard}
                  onChange={set('twelfthBoard')}
                  required
                >
                  <option value="">Select Board</option>
                  {boards.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="adm-twelfthYear">
                  12th Year of Passing *
                </label>
                <input
                  id="adm-twelfthYear"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 2024"
                  min="2000"
                  max="2030"
                  value={form.twelfthYear}
                  onChange={set('twelfthYear')}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="adm-stream">
                  12th Stream *
                </label>
                <select id="adm-stream" className="form-select" value={form.stream} onChange={set('stream')} required>
                  <option value="">Select Stream</option>
                  {streams.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="adm-twelfth">
                  12th Overall Percentage *
                </label>
                <input
                  id="adm-twelfth"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 88.5"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.twelfth}
                  onChange={set('twelfth')}
                  required
                />
              </div>
            </div>

            <h4 className="mb-3.5 mt-5 flex items-center gap-2 border-t border-surface-subtle pt-4 font-heading text-[0.98rem] font-bold text-primary">
              <i className="fas fa-list-ol" /> Subject-wise Marks (12th)
            </h4>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { key: 'physics', icon: 'fas fa-atom', label: 'Physics' },
                { key: 'chemistry', icon: 'fas fa-flask', label: 'Chemistry' },
                { key: 'maths', icon: 'fas fa-square-root-alt', label: 'Mathematics' },
                { key: 'biology', icon: 'fas fa-leaf', label: 'Biology/Computer' },
                { key: 'english', icon: 'fas fa-book', label: 'English' },
              ].map((field) => (
                <div className="form-group" key={field.key}>
                  <label className="form-label" htmlFor={`adm-${field.key}`}>
                    <i className={field.icon} /> {field.label}
                  </label>
                  <input
                    id={`adm-${field.key}`}
                    type="number"
                    className="form-input"
                    placeholder="Marks out of 100"
                    min="0"
                    max="100"
                    step="0.01"
                    value={form[field.key]}
                    onChange={set(field.key)}
                  />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-calculator" /> Cutoff Mark
                </label>
                <div className="flex items-center gap-2.5">
                  <div className="min-w-[120px] rounded-sm border-2 border-line bg-[#f8fafc] px-4 py-3 text-center font-bold text-primary">
                    {cutoff > 0 ? cutoff.toFixed(2) : '—'} <small className="font-normal text-ink-muted">(auto)</small>
                  </div>
                  <small className="text-ink-muted">
                    Calculated automatically from Physics, Chemistry &amp; Maths/Biology
                  </small>
                </div>
              </div>
            </div>

            {isPG && (
              <>
                <h4 className="mb-3.5 mt-5 flex items-center gap-2 border-t border-surface-subtle pt-4 font-heading text-[0.98rem] font-bold text-primary">
                  <i className="fas fa-university" /> UG Degree Details (for PG Applicants)
                </h4>
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    { key: 'ugDegree', label: 'UG Degree *', placeholder: 'e.g. B.E. Computer Science', type: 'text' },
                    { key: 'ugCollege', label: 'UG College *', placeholder: 'College name', type: 'text' },
                    { key: 'ugUniversity', label: 'UG University', placeholder: 'e.g. Anna University', type: 'text' },
                    { key: 'ugYear', label: 'UG Year of Passing', placeholder: 'e.g. 2024', type: 'number' },
                    { key: 'ugCgpa', label: 'UG CGPA (out of 10)', placeholder: 'e.g. 8.5', type: 'number' },
                    { key: 'ugPct', label: 'UG Percentage', placeholder: 'e.g. 78.5', type: 'number' },
                  ].map((field) => (
                    <div className="form-group" key={field.key}>
                      <label className="form-label" htmlFor={`adm-${field.key}`}>
                        {field.label}
                      </label>
                      <input
                        id={`adm-${field.key}`}
                        type={field.type}
                        className="form-input"
                        placeholder={field.placeholder}
                        value={form[field.key]}
                        onChange={set(field.key)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-7 flex justify-end gap-3 border-t border-surface-subtle pt-5">
              <button type="button" className="btn btn-outline" onClick={() => goToStep(1)}>
                <i className="fas fa-arrow-left" /> Back
              </button>
              <button type="button" className="btn btn-primary" onClick={() => next(2)}>
                Next <i className="fas fa-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="animate-modal-in">
            <h3 className="mb-6 flex items-center gap-2.5 border-b-2 border-surface-subtle pb-3.5 font-heading text-[1.18rem] font-bold text-primary">
              <i className="fas fa-book-open text-accent2" /> Course Preference
            </h3>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <CourseSelect
                id="adm-course1"
                icon="fas fa-star"
                label="First Preference Course *"
                placeholder="Select Preferred Course"
                value={form.course1}
                onChange={set('course1')}
                required
              />
              <CourseSelect
                id="adm-course2"
                icon="fas fa-star-half-alt"
                label="Second Preference (Optional)"
                placeholder="Select (Optional)"
                value={form.course2}
                onChange={set('course2')}
              />
              <CourseSelect
                id="adm-course3"
                icon="fas fa-circle"
                label="Third Preference (Optional)"
                placeholder="Select (Optional)"
                value={form.course3}
                onChange={set('course3')}
              />

              <div className="form-group">
                <label className="form-label" htmlFor="adm-entrance">
                  <i className="fas fa-file-alt" /> Entrance Exam
                </label>
                <select id="adm-entrance" className="form-select" value={form.entrance} onChange={set('entrance')}>
                  <option value="">None / Not Applicable</option>
                  {entranceExams.map((exam) => (
                    <option key={exam}>{exam}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adm-entranceScore">
                  <i className="fas fa-trophy" /> Entrance Score / Rank
                </label>
                <input
                  id="adm-entranceScore"
                  className="form-input"
                  placeholder="e.g. 1234 / 98.5 percentile"
                  value={form.entranceScore}
                  onChange={set('entranceScore')}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adm-extra">
                  <i className="fas fa-running" /> Extra Curricular Activities
                </label>
                <input
                  id="adm-extra"
                  className="form-input"
                  placeholder="Sports, NCC, NSS, Cultural etc."
                  value={form.extra}
                  onChange={set('extra')}
                />
              </div>

              <div className="form-group flex flex-col gap-2.5 pt-6">
                <label className="flex cursor-pointer items-center gap-2 text-[0.88rem] font-semibold text-ink-body">
                  <input
                    type="checkbox"
                    checked={form.sports}
                    onChange={set('sports')}
                    className="h-[17px] w-[17px] accent-accent"
                  />
                  Sports Achievement (Quota)
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[0.88rem] font-semibold text-ink-body">
                  <input
                    type="checkbox"
                    checked={form.ncc}
                    onChange={set('ncc')}
                    className="h-[17px] w-[17px] accent-accent"
                  />
                  NCC Certificate
                </label>
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3 border-t border-surface-subtle pt-5">
              <button type="button" className="btn btn-outline" onClick={() => goToStep(2)}>
                <i className="fas fa-arrow-left" /> Back
              </button>
              <button type="button" className="btn btn-primary" onClick={() => next(3)}>
                Review <i className="fas fa-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === TOTAL_STEPS && (
          <div className="animate-modal-in">
            <h3 className="mb-6 flex items-center gap-2.5 border-b-2 border-surface-subtle pb-3.5 font-heading text-[1.18rem] font-bold text-primary">
              <i className="fas fa-check-double text-accent2" /> Review &amp; Submit
            </h3>

            <div className="mb-5 rounded-lg bg-surface-subtle p-6">
              <section className="mb-5">
                <h4 className="mb-3 font-heading text-[0.88rem] font-extrabold uppercase tracking-[0.05em] text-primary">
                  Personal Info
                </h4>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <ReviewRow label="Type" value={form.applicantType} />
                  <ReviewRow label="Name" value={form.name} />
                  <ReviewRow label="Gender" value={form.gender} />
                  <ReviewRow label="DOB" value={form.dob} />
                  <ReviewRow label="Email" value={`${form.email || '—'} ✅`} />
                  <ReviewRow label="Phone" value={form.phone} />
                  <ReviewRow label="Category" value={form.category} />
                  <ReviewRow label="Quota" value={form.quota} />
                </div>
              </section>

              <section className="mb-5">
                <h4 className="mb-3 font-heading text-[0.88rem] font-extrabold uppercase tracking-[0.05em] text-primary">
                  Academic Details
                </h4>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <ReviewRow label="10th %" value={form.tenth ? `${form.tenth}%` : '—'} />
                  <ReviewRow label="10th Board" value={form.tenthBoard} />
                  <ReviewRow label="12th %" value={form.twelfth ? `${form.twelfth}%` : '—'} />
                  <ReviewRow label="12th Stream" value={form.stream} />
                  {(form.stream.includes('PCM') || form.stream.includes('PCB')) && (
                    <>
                      <ReviewRow label="Physics" value={form.physics} />
                      <ReviewRow label="Chemistry" value={form.chemistry} />
                      <ReviewRow
                        label={form.stream.includes('PCM') ? 'Maths' : 'Biology'}
                        value={form.stream.includes('PCM') ? form.maths : form.biology}
                      />
                      <ReviewRow label="Cutoff" value={cutoff > 0 ? cutoff.toFixed(2) : '—'} />
                    </>
                  )}
                  {isPG && (
                    <>
                      <ReviewRow label="UG Degree" value={form.ugDegree} />
                      <ReviewRow label="UG College" value={form.ugCollege} />
                      <ReviewRow label="UG CGPA/%" value={form.ugCgpa || form.ugPct} />
                    </>
                  )}
                </div>
              </section>

              <section>
                <h4 className="mb-3 font-heading text-[0.88rem] font-extrabold uppercase tracking-[0.05em] text-primary">
                  Course Preference
                </h4>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <ReviewRow label="1st Choice" value={form.course1} />
                  <ReviewRow label="2nd Choice" value={form.course2} />
                  <ReviewRow label="3rd Choice" value={form.course3} />
                  <ReviewRow label="Entrance" value={`${form.entrance || '—'} — ${form.entranceScore || '—'}`} />
                  <ReviewRow label="Sports Quota" value={form.sports ? 'Yes' : 'No'} />
                  <ReviewRow label="NCC" value={form.ncc ? 'Yes' : 'No'} />
                </div>
              </section>
            </div>

            <div className="mb-5 rounded-md border-[1.5px] border-accent/[0.22] bg-accent/[0.06] px-5 py-4">
              <label className="flex cursor-pointer items-start gap-2.5 text-[0.86rem] leading-[1.65] text-ink-body">
                <input
                  type="checkbox"
                  checked={form.declaration}
                  onChange={set('declaration')}
                  className="mt-0.5 h-[17px] w-[17px] shrink-0 accent-accent"
                  required
                />
                I hereby declare that all the information provided above is true and correct to the best of my
                knowledge. I understand that providing false information may lead to disqualification.
              </label>
            </div>

            <div className="mt-7 flex justify-end gap-3 border-t border-surface-subtle pt-5">
              <button type="button" className="btn btn-outline" onClick={() => goToStep(3)}>
                <i className="fas fa-arrow-left" /> Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" /> Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
