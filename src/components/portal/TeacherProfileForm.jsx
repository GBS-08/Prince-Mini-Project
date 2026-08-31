import { useState } from 'react'
import { ArrowLeft, Loader2, Save, UploadCloud, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/context/ToastContext'
import { DEPARTMENTS, TEACHER_FOLDER, uploadPortalFile } from '@/lib/portal'
import Button from '../Button'
import { Field, SelectInput, TextArea, TextInput } from '../FormField'

const GENDERS = ['Male', 'Female', 'Other']

const DESIGNATIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Head of Department',
  'Lab Instructor',
  'Visiting Faculty',
]

export function TeacherProfileForm({ regno, profile, onSaved, onCancel }) {
  const { notify } = useToast()
  const isEdit = Boolean(profile)

  const [values, setValues] = useState({
    name: profile?.name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    gender: profile?.gender ?? '',
    department: profile?.department ?? '',
    designation: profile?.designation ?? '',
    qualification: profile?.qualification ?? '',
    experience: profile?.experience ?? '',
    specialization: profile?.specialization ?? '',
    employee_id: profile?.employee_id ?? '',
    subjects: profile?.subjects ?? '',
    joining_date: profile?.joining_date ?? '',
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    const required = {
      name: 'Please enter your full name.',
      email: 'Please enter your email address.',
      phone: 'Please enter your phone number.',
      gender: 'Please select your gender.',
      department: 'Please select your department.',
      designation: 'Please select your designation.',
      qualification: 'Please enter your highest qualification.',
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
        const uploaded = await uploadPortalFile(file, TEACHER_FOLDER, regno)
        if (uploaded) imageUrl = uploaded
      } catch (uploadError) {
        notify(`Photo upload failed: ${uploadError.message}`, 'error')
      }
    }

    const { error } = await supabase.from('teacher_information').upsert(
      {
        register_no: regno,
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        gender: values.gender,
        department: values.department,
        designation: values.designation,
        qualification: values.qualification.trim(),
        experience: values.experience.trim() || null,
        specialization: values.specialization.trim() || null,
        employee_id: values.employee_id.trim() || null,
        subjects: values.subjects.trim() || null,
        joining_date: values.joining_date || null,
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

    notify(isEdit ? 'Profile updated! ✅' : 'Profile saved! 🎉', 'success')
    onSaved?.()
  }

  return (
    <div className="surface-card mx-auto w-full max-w-3xl p-6 sm:p-8">
      <h2 className="font-display text-2xl font-extrabold">
        {isEdit ? 'Edit Your Profile' : 'Complete Your Faculty Profile'}
      </h2>
      <p className="mt-2 text-sm prose-muted">
        {isEdit
          ? 'Update your faculty details below.'
          : 'Fill in your details to access the teacher portal.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-7 grid gap-4 sm:grid-cols-2" noValidate>
        <Field label="Register Number" htmlFor="tc-regno">
          <TextInput id="tc-regno" value={regno} readOnly disabled />
        </Field>

        <Field label="Full Name" htmlFor="tc-name" required error={errors.name}>
          <TextInput
            id="tc-name"
            value={values.name}
            onChange={setValue('name')}
            placeholder="Your full name"
            error={errors.name}
          />
        </Field>

        <Field label="Email ID" htmlFor="tc-email" required error={errors.email}>
          <TextInput
            id="tc-email"
            type="email"
            value={values.email}
            onChange={setValue('email')}
            placeholder="your@email.com"
            error={errors.email}
          />
        </Field>

        <Field label="Phone Number" htmlFor="tc-phone" required error={errors.phone}>
          <TextInput
            id="tc-phone"
            type="tel"
            value={values.phone}
            onChange={setValue('phone')}
            placeholder="+91 99999 99999"
            error={errors.phone}
          />
        </Field>

        <Field label="Gender" htmlFor="tc-gender" required error={errors.gender}>
          <SelectInput
            id="tc-gender"
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

        <Field label="Department" htmlFor="tc-dept" required error={errors.department}>
          <SelectInput
            id="tc-dept"
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

        <Field label="Designation" htmlFor="tc-desig" required error={errors.designation}>
          <SelectInput
            id="tc-desig"
            value={values.designation}
            onChange={setValue('designation')}
            error={errors.designation}
          >
            <option value="">Select Designation</option>
            {DESIGNATIONS.map((designation) => (
              <option key={designation}>{designation}</option>
            ))}
          </SelectInput>
        </Field>

        <Field
          label="Highest Qualification"
          htmlFor="tc-qual"
          required
          error={errors.qualification}
        >
          <TextInput
            id="tc-qual"
            value={values.qualification}
            onChange={setValue('qualification')}
            placeholder="e.g. Ph.D. in Computer Science"
            error={errors.qualification}
          />
        </Field>

        <Field label="Years of Experience" htmlFor="tc-exp">
          <TextInput
            id="tc-exp"
            value={values.experience}
            onChange={setValue('experience')}
            placeholder="e.g. 12 years"
          />
        </Field>

        <Field label="Specialization" htmlFor="tc-spec">
          <TextInput
            id="tc-spec"
            value={values.specialization}
            onChange={setValue('specialization')}
            placeholder="e.g. Machine Learning"
          />
        </Field>

        <Field label="Employee ID" htmlFor="tc-empid">
          <TextInput
            id="tc-empid"
            value={values.employee_id}
            onChange={setValue('employee_id')}
            placeholder="Employee ID"
          />
        </Field>

        <Field label="Joining Date" htmlFor="tc-joining">
          <TextInput
            id="tc-joining"
            type="date"
            value={values.joining_date}
            onChange={setValue('joining_date')}
          />
        </Field>

        <Field label="Subjects Handled" htmlFor="tc-subjects" className="sm:col-span-2">
          <TextInput
            id="tc-subjects"
            value={values.subjects}
            onChange={setValue('subjects')}
            placeholder="e.g. Data Structures, Operating Systems"
          />
        </Field>

        <Field label="Address" htmlFor="tc-addr" className="sm:col-span-2">
          <TextArea
            id="tc-addr"
            rows={2}
            value={values.address}
            onChange={setValue('address')}
            placeholder="Your address"
          />
        </Field>

        <div className="sm:col-span-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Profile Photo <span className="font-normal prose-muted">(optional)</span>
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
            htmlFor="tc-file"
            className="mt-2 flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-5 text-center transition-colors hover:border-brand-400 dark:border-white/15 dark:hover:border-brand-400"
          >
            <UploadCloud className="h-6 w-6 text-brand-600" aria-hidden="true" />
            <span className="text-sm font-semibold">Click to upload a photo</span>
            <span className="text-xs prose-muted">JPG or PNG — max 5MB</span>
            <input
              id="tc-file"
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
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                }}
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
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                {isEdit ? 'Update My Profile' : 'Save My Profile'}
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

export default TeacherProfileForm
