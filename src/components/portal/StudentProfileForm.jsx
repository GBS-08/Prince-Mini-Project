import { useState } from 'react'
import { ArrowLeft, Loader2, Save, UploadCloud, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/context/ToastContext'
import {
  DEPARTMENTS,
  STUDENT_FOLDER,
  YEAR_OPTIONS,
  uploadPortalFile,
} from '@/lib/portal'
import Button from '../Button'
import { Field, SelectInput, TextArea, TextInput } from '../FormField'

const GENDERS = ['Male', 'Female', 'Other']

export function StudentProfileForm({ regno, profile, onSaved, onCancel }) {
  const { notify } = useToast()
  const isEdit = Boolean(profile)

  const [values, setValues] = useState({
    name: profile?.name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    gender: profile?.gender ?? '',
    department: profile?.department ?? '',
    year: profile?.year ? String(profile.year) : '',
    dob: profile?.dob ?? '',
    guardian_name: profile?.guardian_name ?? '',
    linkedin: profile?.linkedin ?? '',
    github: profile?.github ?? '',
    address: profile?.address ?? '',
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

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

  const handleFile = (event) => {
    const selected = event.target.files?.[0]
    if (!selected) return
    if (selected.size > 5 * 1024 * 1024) {
      notify('Image must be 5MB or smaller.', 'warning')
      return
    }
    setFile(selected)
    const reader = new FileReader()
    reader.onload = (loadEvent) => setPreview(loadEvent.target?.result ?? null)
    reader.readAsDataURL(selected)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const required = {
      name: 'Please enter your full name.',
      email: 'Please enter your email address.',
      phone: 'Please enter your phone number.',
      gender: 'Please select your gender.',
      department: 'Please select your department.',
      year: 'Please select your year.',
    }
    const nextErrors = {}
    Object.entries(required).forEach(([field, message]) => {
      if (!String(values[field] ?? '').trim()) nextErrors[field] = message
    })
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      notify('Please fill all required (*) fields.', 'warning')
      return
    }

    if (!supabase) {
      notify('The portal is temporarily unavailable.', 'error')
      return
    }

    setSaving(true)

    let imageUrl = profile?.image_url ?? null
    if (file) {
      try {
        const uploaded = await uploadPortalFile(file, STUDENT_FOLDER, regno)
        if (uploaded) imageUrl = uploaded
      } catch (uploadError) {
        notify(`Image upload failed: ${uploadError.message}`, 'error')
      }
    }

    const { error } = await supabase.from('student_information').upsert(
      {
        register_no: regno,
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        gender: values.gender,
        department: values.department,
        year: parseInt(values.year, 10),
        dob: values.dob || null,
        guardian_name: values.guardian_name.trim() || null,
        linkedin: values.linkedin.trim() || null,
        github: values.github.trim() || null,
        address: values.address.trim() || null,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'register_no' },
    )

    setSaving(false)

    if (error) {
      notify(`Save failed: ${error.message}`, 'error', 5000)
      return
    }

    notify(isEdit ? 'Profile updated successfully! ✅' : 'Profile saved! 🎉', 'success')
    onSaved?.()
  }

  return (
    <div className="surface-card mx-auto w-full max-w-3xl p-6 sm:p-8">
      <h2 className="font-display text-2xl font-extrabold">
        {isEdit ? 'Edit Your Profile' : 'Complete Your Profile'}
      </h2>
      <p className="mt-2 text-sm prose-muted">
        {isEdit
          ? 'Update your details below.'
          : 'Fill in your details to access the student portal.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-7 grid gap-4 sm:grid-cols-2" noValidate>
        <Field label="Register Number" htmlFor="sp-regno">
          <TextInput id="sp-regno" value={regno} readOnly disabled />
        </Field>

        <Field label="Full Name" htmlFor="sp-name" required error={errors.name}>
          <TextInput
            id="sp-name"
            value={values.name}
            onChange={setValue('name')}
            placeholder="Your full name"
            error={errors.name}
          />
        </Field>

        <Field label="Email ID" htmlFor="sp-email" required error={errors.email}>
          <TextInput
            id="sp-email"
            type="email"
            value={values.email}
            onChange={setValue('email')}
            placeholder="your@email.com"
            error={errors.email}
          />
        </Field>

        <Field label="Phone Number" htmlFor="sp-phone" required error={errors.phone}>
          <TextInput
            id="sp-phone"
            type="tel"
            value={values.phone}
            onChange={setValue('phone')}
            placeholder="+91 99999 99999"
            error={errors.phone}
          />
        </Field>

        <Field label="Gender" htmlFor="sp-gender" required error={errors.gender}>
          <SelectInput
            id="sp-gender"
            value={values.gender}
            onChange={setValue('gender')}
            error={errors.gender}
          >
            <option value="">Select Gender</option>
            {GENDERS.map((gender) => (
              <option key={gender}>{gender}</option>
            ))}
          </SelectInput>
        </Field>

        <Field label="Department" htmlFor="sp-dept" required error={errors.department}>
          <SelectInput
            id="sp-dept"
            value={values.department}
            onChange={setValue('department')}
            error={errors.department}
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </SelectInput>
        </Field>

        <Field label="Year" htmlFor="sp-year" required error={errors.year}>
          <SelectInput
            id="sp-year"
            value={values.year}
            onChange={setValue('year')}
            error={errors.year}
          >
            <option value="">Select Year</option>
            {YEAR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field label="Date of Birth" htmlFor="sp-dob">
          <TextInput id="sp-dob" type="date" value={values.dob} onChange={setValue('dob')} />
        </Field>

        <Field label="Guardian Name" htmlFor="sp-guardian">
          <TextInput
            id="sp-guardian"
            value={values.guardian_name}
            onChange={setValue('guardian_name')}
            placeholder="Parent / Guardian name"
          />
        </Field>

        <Field label="LinkedIn Profile" htmlFor="sp-linkedin">
          <TextInput
            id="sp-linkedin"
            type="url"
            value={values.linkedin}
            onChange={setValue('linkedin')}
            placeholder="https://linkedin.com/in/…"
          />
        </Field>

        <Field label="GitHub Profile" htmlFor="sp-github">
          <TextInput
            id="sp-github"
            type="url"
            value={values.github}
            onChange={setValue('github')}
            placeholder="https://github.com/…"
          />
        </Field>

        <Field label="Address" htmlFor="sp-address" className="sm:col-span-2">
          <TextArea
            id="sp-address"
            rows={2}
            value={values.address}
            onChange={setValue('address')}
            placeholder="Your address"
          />
        </Field>

        <div className="sm:col-span-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Profile Photo{' '}
            <span className="font-normal prose-muted">
              (optional{isEdit ? ' — leave blank to keep existing' : ''})
            </span>
          </span>

          {profile?.image_url && !preview ? (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={profile.image_url}
                alt="Current profile"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <span className="text-xs prose-muted">Current photo</span>
            </div>
          ) : null}

          <label
            htmlFor="sp-file"
            className="mt-2 flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-5 text-center transition-colors hover:border-brand-400 dark:border-white/15 dark:hover:border-brand-400"
          >
            <UploadCloud className="h-6 w-6 text-brand-600" aria-hidden="true" />
            <span className="text-sm font-semibold">Click to upload a photo</span>
            <span className="text-xs prose-muted">JPG or PNG — max 5MB</span>
            <input
              id="sp-file"
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="sr-only"
            />
          </label>

          {preview ? (
            <div className="relative mt-3 inline-block">
              <img src={preview} alt="Preview" className="h-24 w-24 rounded-xl object-cover" />
              <button
                type="button"
                onClick={clearFile}
                className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-card"
                aria-label="Remove selected photo"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {isEdit ? 'Updating…' : 'Saving…'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                {isEdit ? 'Update Profile' : 'Save Profile'}
              </>
            )}
          </Button>
          {isEdit && onCancel ? (
            <Button type="button" variant="outline" size="lg" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  )
}

export default StudentProfileForm
