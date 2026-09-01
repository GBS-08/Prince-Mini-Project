import { useEffect, useState } from 'react'
import EmailOtpField from '../../components/EmailOtpField'
import ImageUploadField from '../../components/ImageUploadField'
import { supabase, errorMessage, publicUrl } from '../../services/supabase'
import { IMAGE_BUCKET, TEACHER_FOLDER } from '../../services/storage'
import { useToast } from '../../context/ToastContext'
import { TEACHER_DEPARTMENTS, DESIGNATIONS } from '../../data/teacher'

const FIELDS = {
  name: '',
  email: '',
  phone: '',
  gender: '',
  joining_date: '',
  department: '',
  designation: '',
  qualification: '',
  experience: '',
  specialization: '',
  employee_id: '',
  subjects: '',
  address: '',
}

const UPLOAD_CLASSES = {
  area: 'tc-upload',
  icon: 'tc-upload-ico',
  text: 'tc-upload-txt',
  previewWrap: 'tc-img-prev',
  previewRemove: 'tc-img-rm',
}

/** Teacher profile creation / edit form. */
export default function TeacherSetup({ regno, teacher, onSaved, onCancel }) {
  const { showToast } = useToast()
  const isEdit = Boolean(teacher)

  const [form, setForm] = useState(() => {
    const base = { ...FIELDS }
    if (teacher) {
      Object.keys(base).forEach((key) => {
        base[key] = teacher[key] ?? ''
      })
    }
    return base
  })
  const [photo, setPhoto] = useState(null)
  const [saving, setSaving] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState(() => (teacher?.email || '').toLowerCase())

  useEffect(() => {
    setVerifiedEmail((teacher?.email || '').toLowerCase())
  }, [teacher])

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))
  const emailVerified = Boolean(verifiedEmail) && verifiedEmail === form.email.trim().toLowerCase()

  const submit = async (event) => {
    event.preventDefault()

    const required = ['name', 'email', 'phone', 'gender', 'department', 'designation', 'qualification']
    if (required.some((key) => !String(form[key]).trim())) {
      showToast('Fill all required (*) fields', 'warning')
      return
    }

    if (!emailVerified) {
      showToast('Please verify your email with OTP before saving.', 'warning')
      document.getElementById('tc_email_otp')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSaving(true)

    // Teacher photos overwrite a stable `<regno>.<ext>` path, so the cache
    // buster is required for the new image to show immediately.
    let imageUrl = teacher?.image_url || null
    if (photo) {
      const ext = (photo.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `${TEACHER_FOLDER}/${regno}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(path, photo, { upsert: true, contentType: photo.type })

      if (uploadError) {
        showToast(`Photo upload failed: ${errorMessage(uploadError)}`, 'error')
      } else {
        imageUrl = `${publicUrl(IMAGE_BUCKET, path)}?t=${Date.now()}`
        showToast('Photo uploaded!', 'success')
      }
    }

    const trimmed = (value) => (String(value ?? '').trim() ? String(value).trim() : null)

    const { error } = await supabase.from('teacher_information').upsert(
      {
        register_no: regno,
        name: trimmed(form.name),
        email: trimmed(form.email),
        phone: trimmed(form.phone),
        gender: form.gender,
        department: form.department,
        designation: form.designation,
        qualification: trimmed(form.qualification),
        experience: trimmed(form.experience),
        specialization: trimmed(form.specialization),
        employee_id: trimmed(form.employee_id),
        subjects: trimmed(form.subjects),
        joining_date: trimmed(form.joining_date),
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

    showToast(isEdit ? 'Profile updated! ✅' : 'Profile saved! 🎉', 'success')
    onSaved(imageUrl)
  }

  return (
    <div className="tc-wrap">
      <div className="tc-setup-outer">
        <div className="tc-setup-hdr">
          <div className="tc-setup-icon">
            <i className="fas fa-chalkboard-teacher" aria-hidden="true" />
          </div>
          <h2 className="tc-setup-h2">{isEdit ? 'Edit Your Profile' : 'Complete Your Profile'}</h2>
          <p className="tc-setup-sub">
            Hi <strong style={{ color: 'var(--tamb)' }}>{regno}</strong>!{' '}
            {isEdit ? 'Update your details below.' : 'Fill your details to activate the portal.'}
          </p>
        </div>

        <div className="tg tc-setup-card">
          <form onSubmit={submit} noValidate>
            <div className="tgrid">
              <div className="tdiv">
                <span className="tdiv-lbl">
                  <i className="fas fa-user" aria-hidden="true" /> Personal
                </span>
                <div className="tdiv-line" />
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_regno">
                  <i className="fas fa-id-badge" aria-hidden="true" /> Register No
                </label>
                <input id="f_regno" className="ti" value={regno} readOnly />
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_name">
                  <i className="fas fa-user" aria-hidden="true" /> Full Name *
                </label>
                <input
                  id="f_name"
                  className="ti"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Dr. / Mr. / Ms. Full Name"
                  required
                />
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_email">
                  <i className="fas fa-envelope" aria-hidden="true" /> Email *
                  {emailVerified && (
                    <span className="tc-verified-badge">
                      <i className="fas fa-check-circle" aria-hidden="true" /> Verified
                    </span>
                  )}
                </label>
                <input
                  id="f_email"
                  type="email"
                  className="ti"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="your@email.com"
                  required
                />
                <div id="tc_email_otp">
                  <EmailOtpField
                    email={form.email}
                    verified={emailVerified}
                    onVerified={setVerifiedEmail}
                    theme="dark"
                  />
                </div>
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_phone">
                  <i className="fas fa-phone" aria-hidden="true" /> Phone *
                </label>
                <input
                  id="f_phone"
                  type="tel"
                  className="ti"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+91 99999 99999"
                  required
                />
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_gender">
                  <i className="fas fa-venus-mars" aria-hidden="true" /> Gender *
                </label>
                <select id="f_gender" className="ts" value={form.gender} onChange={set('gender')} required>
                  <option value="">Select</option>
                  {['Male', 'Female', 'Other'].map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_joining">
                  <i className="fas fa-calendar-alt" aria-hidden="true" /> Date of Joining
                </label>
                <input
                  id="f_joining"
                  type="date"
                  className="ti"
                  value={form.joining_date}
                  onChange={set('joining_date')}
                />
              </div>

              <div className="tdiv">
                <span className="tdiv-lbl">
                  <i className="fas fa-graduation-cap" aria-hidden="true" /> Professional
                </span>
                <div className="tdiv-line" />
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_dept">
                  <i className="fas fa-building" aria-hidden="true" /> Department *
                </label>
                <select id="f_dept" className="ts" value={form.department} onChange={set('department')} required>
                  <option value="">Select</option>
                  {TEACHER_DEPARTMENTS.map((dep) => (
                    <option key={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_desig">
                  <i className="fas fa-user-tie" aria-hidden="true" /> Designation *
                </label>
                <select id="f_desig" className="ts" value={form.designation} onChange={set('designation')} required>
                  <option value="">Select</option>
                  {DESIGNATIONS.map((des) => (
                    <option key={des}>{des}</option>
                  ))}
                </select>
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_qual">
                  <i className="fas fa-award" aria-hidden="true" /> Qualification *
                </label>
                <input
                  id="f_qual"
                  className="ti"
                  value={form.qualification}
                  onChange={set('qualification')}
                  placeholder="e.g. M.E., Ph.D"
                  required
                />
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_exp">
                  <i className="fas fa-briefcase" aria-hidden="true" /> Experience
                </label>
                <input
                  id="f_exp"
                  className="ti"
                  value={form.experience}
                  onChange={set('experience')}
                  placeholder="e.g. 8 Years"
                />
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_spec">
                  <i className="fas fa-flask" aria-hidden="true" /> Specialization
                </label>
                <input
                  id="f_spec"
                  className="ti"
                  value={form.specialization}
                  onChange={set('specialization')}
                  placeholder="e.g. Machine Learning"
                />
              </div>

              <div className="tg-fg">
                <label className="tl" htmlFor="f_empid">
                  <i className="fas fa-hashtag" aria-hidden="true" /> Employee ID
                </label>
                <input
                  id="f_empid"
                  className="ti"
                  value={form.employee_id}
                  onChange={set('employee_id')}
                  placeholder="e.g. PDKV-TCH-001"
                />
              </div>

              <div className="tg-fg tgfull">
                <label className="tl" htmlFor="f_subjects">
                  <i className="fas fa-book-open" aria-hidden="true" /> Subjects Handling
                </label>
                <input
                  id="f_subjects"
                  className="ti"
                  value={form.subjects}
                  onChange={set('subjects')}
                  placeholder="e.g. Data Structures, DBMS (comma separated)"
                />
              </div>

              <div className="tdiv">
                <span className="tdiv-lbl">
                  <i className="fas fa-map-marker-alt" aria-hidden="true" /> Address &amp; Photo
                </span>
                <div className="tdiv-line" />
              </div>

              <div className="tg-fg tgfull">
                <label className="tl" htmlFor="f_addr">
                  <i className="fas fa-home" aria-hidden="true" /> Address
                </label>
                <textarea
                  id="f_addr"
                  className="tta"
                  value={form.address}
                  onChange={set('address')}
                  placeholder="Your residential address"
                />
              </div>

              <div className="tg-fg tgfull">
                <label className="tl" htmlFor="f_img">
                  <i className="fas fa-camera" aria-hidden="true" /> Profile Photo{' '}
                  <span style={{ opacity: 0.4, fontWeight: 400 }}>
                    (optional{isEdit ? ' — leave blank to keep existing' : ''})
                  </span>
                </label>

                {teacher?.image_url && (
                  <div className="tc-existing-photo" style={{ marginBottom: 12 }}>
                    <img src={teacher.image_url} alt="Current" />
                    <span>Current photo — upload new to replace</span>
                  </div>
                )}

                <ImageUploadField
                  id="f_img"
                  file={photo}
                  onChange={setPhoto}
                  label="Click or drag & drop"
                  hint="JPG, PNG — max 5 MB"
                  classes={UPLOAD_CLASSES}
                />
              </div>
            </div>

            {isEdit && (
              <button type="button" className="tb tb-ghost tb-full" style={{ marginTop: 8 }} onClick={onCancel}>
                <i className="fas fa-arrow-left" /> Cancel
              </button>
            )}

            <button type="submit" className="tb tb-pri tb-full" style={{ marginTop: 8 }} disabled={saving}>
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin" /> Saving…
                </>
              ) : (
                <>
                  <i className="fas fa-save" /> {isEdit ? 'Update My Profile' : 'Save My Profile'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
