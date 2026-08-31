import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, ExternalLink, Loader2, Plus, Save, Trophy, UploadCloud, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/context/ToastContext'
import { ACHIEVEMENT_FOLDER, ACHIEVEMENT_TYPES, formatDate, uploadPortalFile } from '@/lib/portal'
import Button from '../Button'
import { Field, SelectInput, TextArea, TextInput } from '../FormField'
import { toneClass } from '../cards'
import { PortalEmpty, PortalSection } from './PortalShell'

const IMAGE_PATTERN = /\.(jpg|jpeg|png|webp|gif)$/i

function AchievementModal({ regno, onClose, onSaved }) {
  const { notify } = useToast()
  const [values, setValues] = useState({
    title: '',
    achievement_type: 'general',
    date_achieved: '',
    description: '',
  })
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const setValue = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!values.title.trim()) {
      setError('Title is required.')
      return
    }
    if (!supabase) {
      notify('The portal is temporarily unavailable.', 'error')
      return
    }

    setSaving(true)

    let certificateUrl = null
    if (file) {
      try {
        certificateUrl = await uploadPortalFile(file, ACHIEVEMENT_FOLDER, `${regno}_ach`)
      } catch (uploadError) {
        notify(`Upload failed: ${uploadError.message}`, 'error')
      }
    }

    const { error: insertError } = await supabase.from('student_achievements').insert({
      register_no: regno,
      title: values.title.trim(),
      achievement_type: values.achievement_type,
      date_achieved: values.date_achieved || null,
      description: values.description.trim() || null,
      certificate_url: certificateUrl,
    })

    setSaving(false)

    if (insertError) {
      notify(`Save failed: ${insertError.message}`, 'error', 5000)
      return
    }

    notify('Achievement saved! 🏆', 'success')
    onSaved?.()
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-title"
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
            <h2 id="achievement-title" className="font-display text-xl font-extrabold">
              Add Achievement
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="-m-1 inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <Field label="Title" htmlFor="ach-title" required error={error}>
              <TextInput
                id="ach-title"
                value={values.title}
                onChange={(event) => {
                  setError('')
                  setValue('title')(event)
                }}
                placeholder="e.g. First Place — Hackathon 2024"
                error={error}
              />
            </Field>

            <Field label="Category" htmlFor="ach-type">
              <SelectInput
                id="ach-type"
                value={values.achievement_type}
                onChange={setValue('achievement_type')}
              >
                {ACHIEVEMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field label="Date Achieved" htmlFor="ach-date">
              <TextInput
                id="ach-date"
                type="date"
                value={values.date_achieved}
                onChange={setValue('date_achieved')}
              />
            </Field>

            <Field label="Description" htmlFor="ach-desc">
              <TextArea
                id="ach-desc"
                rows={2}
                value={values.description}
                onChange={setValue('description')}
                placeholder="Brief description"
              />
            </Field>

            <div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Certificate / Image <span className="font-normal prose-muted">(optional)</span>
              </span>
              <label
                htmlFor="ach-file"
                className="mt-2 flex min-h-[90px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-300 p-4 text-center transition-colors hover:border-brand-400 dark:border-white/15 dark:hover:border-brand-400"
              >
                <UploadCloud className="h-5 w-5 text-brand-600" aria-hidden="true" />
                <span className="text-sm font-semibold">
                  {file ? file.name : 'Click to upload'}
                </span>
                <span className="text-xs prose-muted">Image or PDF — max 5MB</span>
                <input
                  id="ach-file"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>
            </div>

            <Button type="submit" size="lg" disabled={saving} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" aria-hidden="true" />
                  Save Achievement
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function AchievementsPanel({ regno, achievements, onChanged, icon }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <PortalSection
        title="Achievements"
        icon={icon ?? Trophy}
        action={
          <Button size="sm" variant="secondary" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add
          </Button>
        }
      >
        {achievements?.length ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {achievements.map((achievement) => {
              const type =
                ACHIEVEMENT_TYPES.find(
                  (item) => item.value === (achievement.achievement_type ?? 'general'),
                ) ?? ACHIEVEMENT_TYPES[0]
              const isImage =
                achievement.certificate_url && IMAGE_PATTERN.test(achievement.certificate_url)

              return (
                <li
                  key={achievement.id ?? `${achievement.title}-${achievement.date_achieved}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10"
                >
                  {isImage ? (
                    <img
                      src={achievement.certificate_url}
                      alt={achievement.title}
                      loading="lazy"
                      className="h-36 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : null}
                  <div className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider ${toneClass(type.tone)}`}
                      >
                        {type.label}
                      </span>
                      {achievement.date_achieved ? (
                        <span className="text-xs font-semibold prose-muted">
                          {formatDate(achievement.date_achieved)}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2.5 font-display text-base font-bold">{achievement.title}</h3>
                    {achievement.description ? (
                      <p className="mt-1.5 text-sm leading-relaxed prose-muted">
                        {achievement.description}
                      </p>
                    ) : null}
                    {achievement.certificate_url ? (
                      <a
                        href={achievement.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-slate-50 px-3.5 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 dark:bg-white/5 dark:text-brand-200 dark:hover:bg-white/10"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        View Certificate
                      </a>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <PortalEmpty
            icon={Award}
            title="No achievements added yet"
            description="Add your first achievement to showcase it on your profile."
            action={
              <Button size="sm" onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Achievement
              </Button>
            }
          />
        )}
      </PortalSection>

      {modalOpen ? (
        <AchievementModal
          regno={regno}
          onClose={() => setModalOpen(false)}
          onSaved={onChanged}
        />
      ) : null}
    </>
  )
}

export default AchievementsPanel
