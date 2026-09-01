import { useState } from 'react'
import ImageUploadField from '../../components/ImageUploadField'
import { supabase, errorMessage } from '../../services/supabase'
import { uploadPortalFile, ACHIEVEMENT_FOLDER } from '../../services/storage'
import { useToast } from '../../context/ToastContext'
import useLockBodyScroll from '../../hooks/useLockBodyScroll'

const TYPE_BADGE = {
  academic: { label: 'Academic', color: '#3b82f6' },
  sports: { label: 'Sports', color: '#10b981' },
  cultural: { label: 'Cultural', color: '#f59e0b' },
  technical: { label: 'Technical', color: '#8b5cf6' },
  general: { label: 'General', color: '#64748b' },
}

const isImage = (url) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url || '')

const EMPTY = { title: '', achievement_type: 'general', date_achieved: '', description: '' }

/** Achievements list + "Add Achievement" modal. */
export default function StudentAchievements({ regno, achievements, onSaved }) {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)

  useLockBodyScroll(open)

  const close = () => {
    setOpen(false)
    setForm(EMPTY)
    setFile(null)
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!form.title.trim()) {
      showToast('Title is required.', 'error')
      return
    }

    setSaving(true)

    const { url } = await uploadPortalFile(file, ACHIEVEMENT_FOLDER, `${regno}_ach`)

    const { error } = await supabase.from('student_achievements').insert({
      register_no: regno,
      title: form.title.trim(),
      achievement_type: form.achievement_type,
      date_achieved: form.date_achieved || null,
      description: form.description.trim() || null,
      certificate_url: url || null,
    })

    setSaving(false)

    if (error) {
      showToast(`Save failed: ${errorMessage(error)}`, 'error')
      return
    }

    showToast('Achievement saved! 🏆', 'success')
    close()
    onSaved()
  }

  return (
    <>
      <div className="sp-glass st-ach-card">
        <div className="st-exam-heading">
          <i className="fas fa-trophy" aria-hidden="true" /> Achievements
        </div>

        {achievements.length === 0 ? (
          <div className="st-ach-empty">
            <i className="fas fa-trophy" aria-hidden="true" />
            <p>No achievements added yet. Add your first achievement!</p>
          </div>
        ) : (
          <div className="st-ach-grid">
            {achievements.map((item) => {
              const badge = TYPE_BADGE[item.achievement_type || 'general'] || TYPE_BADGE.general
              return (
                <div className="st-ach-card-item" key={item.id || `${item.title}-${item.date_achieved}`}>
                  {isImage(item.certificate_url) && (
                    <div className="st-ach-img-wrap">
                      <img src={item.certificate_url} alt={item.title} className="st-ach-img" />
                    </div>
                  )}
                  <div className="st-ach-body">
                    <div className="st-ach-top">
                      <span className="st-ach-badge" style={{ background: `${badge.color}22`, color: badge.color }}>
                        {badge.label}
                      </span>
                      {item.date_achieved && (
                        <span className="st-ach-date">
                          <i className="fas fa-calendar" aria-hidden="true" /> {item.date_achieved}
                        </span>
                      )}
                    </div>
                    <div className="st-ach-title">{item.title}</div>
                    {item.description && <div className="st-ach-desc">{item.description}</div>}
                    {item.certificate_url && (
                      <a
                        href={item.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="st-ach-cert-btn"
                      >
                        <i className="fas fa-certificate" aria-hidden="true" /> View Certificate
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button type="button" className="sp-btn sp-btn-ghost st-ach-add-btn" onClick={() => setOpen(true)}>
          <i className="fas fa-plus-circle" /> Add Achievement
        </button>
      </div>

      {open && (
        <div
          className="sp-modal-overlay sp-modal-visible"
          role="dialog"
          aria-modal="true"
          aria-label="Add achievement"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close()
          }}
        >
          <div className="sp-modal-box">
            <div className="sp-modal-hdr">
              <h3>
                <i className="fas fa-trophy" aria-hidden="true" /> Add Achievement
              </h3>
              <button type="button" className="sp-modal-close" onClick={close} aria-label="Close">
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </div>

            <div className="sp-modal-body">
              <form onSubmit={submit}>
                <div className="sp-fg">
                  <label htmlFor="ach_title">Title *</label>
                  <input
                    id="ach_title"
                    className="sp-inp"
                    placeholder="e.g. First Place — Hackathon 2024"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="sp-fg">
                  <label htmlFor="ach_type">Category</label>
                  <select
                    id="ach_type"
                    className="sp-inp"
                    value={form.achievement_type}
                    onChange={(e) => setForm((f) => ({ ...f, achievement_type: e.target.value }))}
                  >
                    <option value="general">General</option>
                    <option value="academic">Academic</option>
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>

                <div className="sp-fg">
                  <label htmlFor="ach_date">Date Achieved</label>
                  <input
                    id="ach_date"
                    className="sp-inp"
                    type="date"
                    value={form.date_achieved}
                    onChange={(e) => setForm((f) => ({ ...f, date_achieved: e.target.value }))}
                  />
                </div>

                <div className="sp-fg">
                  <label htmlFor="ach_desc">Description</label>
                  <textarea
                    id="ach_desc"
                    className="sp-inp sp-ta"
                    rows={2}
                    placeholder="Brief description"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>

                <div className="sp-fg">
                  <label htmlFor="ach_file">
                    Certificate / Image <span className="sp-opt">(optional)</span>
                  </label>
                  <ImageUploadField
                    id="ach_file"
                    accept="image/*,application/pdf"
                    icon="fas fa-file-upload"
                    label="Click or drag & drop"
                    hint="Image or PDF — max 5MB"
                    file={file}
                    onChange={setFile}
                  />
                </div>

                <button type="submit" className="sp-btn sp-btn-primary sp-btn-full" disabled={saving}>
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save" /> Save Achievement
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
