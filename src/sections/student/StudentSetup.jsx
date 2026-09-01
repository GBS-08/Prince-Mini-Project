import { useEffect, useState } from 'react'
import EmailOtpField from '../../components/EmailOtpField'
import ImageUploadField from '../../components/ImageUploadField'
import { supabase, errorMessage } from '../../services/supabase'
import { uploadPortalFile, STUDENT_FOLDER } from '../../services/storage'
import { useToast } from '../../context/ToastContext'
import { DEPARTMENTS, yearLabel } from '../../data/departments'

const FIELDS = {
  name: '',
  email: '',
  phone: '',
  gender: '',
  department: '',
  year: '',
  dob: '',
  guardian_name: '',
  linkedin: '',
  github: '',
  address: '',
}

/** Profile creation / edit form (`renderSetup` in the original Student.js). */
export default function StudentSetup({ regno, student, onSaved, onCancel }) {
  const { showToast } = useToast()
  const isEdit = Boolean(student)

  const [form, setForm] = useState(() => {
    const base = { ...FIELDS }
    if (student) {
      Object.keys(base).forEach((key) => {
        base[key] = student[key] ?? ''
      })
    }
    return base
  })
  const [photo, setPhoto] = useState(null)
  const [saving, setSaving] = useState(false)
  // Editing an existing profile keeps its already-verified address trusted,
  // exactly like the original `markEmailVerified(d.email)` call.
  const [verifiedEmail, setVerifiedEmail] = useState(() => (student?.email || '').toLowerCase())

  useEffect(() => {
    setVerifiedEmail((student?.email || '').toLowerCase())
  }, [student])

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))
  const emailVerified = Boolean(verifiedEmail) && verifiedEmail === form.email.trim().toLowerCase()

  const submit = async (event) => {
    event.preventDefault()

    const { name, email, phone, gender, department, year } = form
    if (!name.trim() || !email.trim() || !phone.trim() || !gender || !department || !year) {
      showToast('Please fill all required (*) fields.', 'warning')
      return
    }

    if (!emailVerified) {
      showToast('Please verify your email with OTP before saving.', 'warning')
      document.getElementById('sp_email_otp')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSaving(true)

    let imageUrl = student?.image_url || null
    if (photo) {
      const { url, error: uploadError } = await uploadPortalFile(photo, STUDENT_FOLDER, regno)
      if (uploadError) showToast(`Image upload failed: ${uploadError}`, 'error')
      if (url) imageUrl = url
    }

    const trimmed = (value) => (value?.trim?.() ? value.trim() : null)

    const { error } = await supabase.from('student_information').upsert(
      {
        register_no: regno,
        name: trimmed(form.name),
        email: trimmed(form.email),
        phone: trimmed(form.phone),
        gender: form.gender,
        department: form.department,
        year: parseInt(form.year, 10),
        dob: trimmed(form.dob),
        guardian_name: trimmed(form.guardian_name),
        linkedin: trimmed(form.linkedin),
        github: trimmed(form.github),
        address: trimmed(form.address),
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'register_no' },
    )

    setSaving(false)

    if (error) {
      showToast(`Save failed: ${errorMessage(error)}`, 'error')
      return
    }

    showToast(isEdit ? 'Profile updated successfully! ✅' : 'Profile saved! 🎉', 'success')
    onSaved()
  }

  return (
    <div className="st-wrap-single">
      <div className="sp-glass st-setup-card">
        <div className="st-setup-hdr">
          <div className="st-setup-ico">
            <i className="fas fa-id-card" aria-hidden="true" />
          </div>
          <h2>{isEdit ? 'Edit Your Profile' : 'Complete Your Profile'}</h2>
          <p>{isEdit ? 'Update your details below' : 'Fill in your details to access the portal'}</p>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="st-form-grid">
            <div className="sp-fg">
              <label htmlFor="sp_regno">Register Number *</label>
              <input id="sp_regno" className="sp-inp" value={regno} readOnly />
            </div>

            <div className="sp-fg">
              <label htmlFor="sp_name">Full Name *</label>
              <input
                id="sp_name"
                className="sp-inp"
                value={form.name}
                onChange={set('name')}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="sp-fg">
              <label htmlFor="sp_email">
                Email ID *
                {emailVerified && (
                  <span className="sp-verified-lbl">
                    <i className="fas fa-check-circle" aria-hidden="true" /> Verified
                  </span>
                )}
              </label>
              <input
                id="sp_email"
                className="sp-inp"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="your@email.com"
                required
              />
              <div id="sp_email_otp">
                <EmailOtpField email={form.email} verified={emailVerified} onVerified={setVerifiedEmail} theme="dark" />
              </div>
            </div>

            <div className="sp-fg">
              <label htmlFor="sp_phone">Phone Number *</label>
              <input
                id="sp_phone"
                className="sp-inp"
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+91 99999 99999"
                required
              />
            </div>

            <div className="sp-fg">
              <label htmlFor="sp_gender">Gender *</label>
              <select id="sp_gender" className="sp-inp" value={form.gender} onChange={set('gender')}>
                <option value="">Select Gender</option>
                {['Male', 'Female', 'Other'].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="sp-fg">
              <label htmlFor="sp_dept">Department *</label>
              <select id="sp_dept" className="sp-inp" value={form.department} onChange={set('department')}>
                <option value="">Select Department</option>
                {DEPARTMENTS.map((dep) => (
                  <option key={dep}>{dep}</option>
                ))}
              </select>
            </div>

            <div className="sp-fg">
              <label htmlFor="sp_year">Year *</label>
              <select id="sp_year" className="sp-inp" value={form.year} onChange={set('year')}>
                <option value="">Select Year</option>
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y}>
                    {yearLabel(y)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sp-fg">
              <label htmlFor="sp_dob">Date of Birth</label>
              <input id="sp_dob" className="sp-inp" type="date" value={form.dob} onChange={set('dob')} />
            </div>

            <div className="sp-fg">
              <label htmlFor="sp_guardian">Guardian Name</label>
              <input
                id="sp_guardian"
                className="sp-inp"
                value={form.guardian_name}
                onChange={set('guardian_name')}
                placeholder="Parent / Guardian name"
              />
            </div>

            <div className="sp-fg">
              <label htmlFor="sp_linkedin">LinkedIn Profile</label>
              <input
                id="sp_linkedin"
                className="sp-inp"
                type="url"
                value={form.linkedin}
                onChange={set('linkedin')}
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="sp-fg">
              <label htmlFor="sp_github">GitHub Profile</label>
              <input
                id="sp_github"
                className="sp-inp"
                type="url"
                value={form.github}
                onChange={set('github')}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="sp-fg sp-fg-full">
              <label htmlFor="sp_address">Address</label>
              <textarea
                id="sp_address"
                className="sp-inp sp-ta"
                rows={2}
                value={form.address}
                onChange={set('address')}
                placeholder="Your address"
              />
            </div>

            <div className="sp-fg sp-fg-full">
              <label htmlFor="sp_file">
                Profile Photo{' '}
                <span className="sp-opt">(optional{isEdit ? ' — leave blank to keep existing' : ''})</span>
              </label>

              {student?.image_url && (
                <div className="sp-existing-photo">
                  <img src={student.image_url} alt="Current" />
                  <span>Current photo</span>
                </div>
              )}

              <ImageUploadField id="sp_file" file={photo} onChange={setPhoto} />
            </div>
          </div>

          {isEdit && (
            <button
              type="button"
              className="sp-btn sp-btn-ghost sp-btn-full"
              style={{ marginTop: 10 }}
              onClick={onCancel}
            >
              <i className="fas fa-arrow-left" /> Cancel
            </button>
          )}

          <button type="submit" className="sp-btn sp-btn-primary sp-btn-full" disabled={saving}>
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin" /> {isEdit ? 'Updating…' : 'Saving…'}
              </>
            ) : (
              <>
                <i className="fas fa-save" /> {isEdit ? 'Update Profile' : 'Save Profile'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
