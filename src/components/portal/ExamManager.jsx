import { useState } from 'react'
import { FileSpreadsheet, Loader2, Plus, Save, Search, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/context/ToastContext'
import { EXAM_TYPES } from '@/lib/portal'
import Button from '../Button'
import { Field, SelectInput, TextInput } from '../FormField'
import { PortalEmpty, PortalSection } from './PortalShell'

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

const emptyRow = () => ({ subject: '', code: '', marks: '', max: 100 })

export function ExamManager() {
  const { notify } = useToast()
  const [regnoInput, setRegnoInput] = useState('')
  const [student, setStudent] = useState(null)
  const [examData, setExamData] = useState({})
  const [semester, setSemester] = useState('sem1')
  const [examType, setExamType] = useState('ciat1')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const rows = examData[semester]?.[examType] ?? []

  const setRows = (nextRows) => {
    setExamData((current) => ({
      ...current,
      [semester]: { ...(current[semester] ?? {}), [examType]: nextRows },
    }))
  }

  const updateRow = (index, field, value) => {
    const next = rows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [field]: value } : row,
    )
    setRows(next)
  }

  const handleLoad = async (event) => {
    event.preventDefault()
    const regno = regnoInput.trim().toUpperCase()
    setError('')

    if (!regno) {
      setError('Enter a register number.')
      return
    }
    if (!supabase) {
      setError('The portal is temporarily unavailable.')
      return
    }

    setLoading(true)

    const [studentRes, examRes] = await Promise.all([
      supabase
        .from('student_information')
        .select('register_no,name,department,year')
        .ilike('register_no', regno)
        .maybeSingle(),
      supabase.from('exam_information').select('*').ilike('register_no', regno).maybeSingle(),
    ])

    setLoading(false)

    if (!studentRes.data) {
      setStudent(null)
      setError('Student not found with this register number.')
      return
    }

    setStudent(studentRes.data)
    setExamData(examRes.data?.exam_data ?? {})
  }

  const handleSave = async () => {
    if (!student || !supabase) return

    setSaving(true)
    const cleaned = {}
    Object.entries(examData).forEach(([sem, types]) => {
      const semEntry = {}
      Object.entries(types ?? {}).forEach(([type, typeRows]) => {
        const valid = (typeRows ?? []).filter((row) => String(row.subject ?? '').trim())
        if (valid.length) {
          semEntry[type] = valid.map((row) => ({
            subject: String(row.subject).trim(),
            code: String(row.code ?? '').trim(),
            marks: Number(row.marks) || 0,
            max: Number(row.max) || 100,
          }))
        }
      })
      if (Object.keys(semEntry).length) cleaned[sem] = semEntry
    })

    const { error: saveError } = await supabase.from('exam_information').upsert(
      {
        register_no: student.register_no,
        exam_data: cleaned,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'register_no' },
    )

    setSaving(false)

    if (saveError) {
      notify(`Save failed: ${saveError.message}`, 'error', 5000)
      return
    }
    notify('Exam marks saved successfully ✅', 'success')
  }

  return (
    <PortalSection title="Exam Marks Manager" icon={FileSpreadsheet}>
      <form onSubmit={handleLoad} className="flex flex-wrap items-end gap-3" noValidate>
        <Field label="Student Register Number" htmlFor="exam-regno" className="min-w-[220px] flex-1">
          <TextInput
            id="exam-regno"
            value={regnoInput}
            onChange={(event) => setRegnoInput(event.target.value)}
            placeholder="e.g. 411621104001"
            className="uppercase"
          />
        </Field>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="h-4 w-4" aria-hidden="true" />
          )}
          Load Student
        </Button>
      </form>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
        >
          {error}
        </p>
      ) : null}

      {student ? (
        <div className="mt-6">
          <div className="rounded-2xl bg-brand-50 p-4 dark:bg-brand-900/30">
            <p className="font-display text-base font-bold text-brand-900 dark:text-brand-100">
              {student.name || student.register_no}
            </p>
            <p className="mt-0.5 text-sm text-brand-700 dark:text-brand-200">
              {student.register_no}
              {student.department ? ` • ${student.department}` : ''}
              {student.year ? ` • Year ${student.year}` : ''}
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Semester" htmlFor="exam-sem">
              <SelectInput
                id="exam-sem"
                value={semester}
                onChange={(event) => setSemester(event.target.value)}
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={`sem${sem}`}>
                    Semester {sem}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Exam Type" htmlFor="exam-type">
              <SelectInput
                id="exam-type"
                value={examType}
                onChange={(event) => setExamType(event.target.value)}
              >
                {EXAM_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          {rows.length ? (
            <div className="mt-5 space-y-3">
              {rows.map((row, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/5 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]"
                >
                  <TextInput
                    id={`exam-subject-${index}`}
                    value={row.subject}
                    onChange={(event) => updateRow(index, 'subject', event.target.value)}
                    placeholder="Subject name"
                    aria-label={`Subject name for row ${index + 1}`}
                  />
                  <TextInput
                    id={`exam-code-${index}`}
                    value={row.code}
                    onChange={(event) => updateRow(index, 'code', event.target.value)}
                    placeholder="Code"
                    aria-label={`Subject code for row ${index + 1}`}
                  />
                  <TextInput
                    id={`exam-marks-${index}`}
                    type="number"
                    min="0"
                    value={row.marks}
                    onChange={(event) => updateRow(index, 'marks', event.target.value)}
                    placeholder="Marks"
                    aria-label={`Marks for row ${index + 1}`}
                  />
                  <TextInput
                    id={`exam-max-${index}`}
                    type="number"
                    min="1"
                    value={row.max}
                    onChange={(event) => updateRow(index, 'max', event.target.value)}
                    placeholder="Max"
                    aria-label={`Maximum marks for row ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => setRows(rows.filter((_, rowIndex) => rowIndex !== index))}
                    className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-rose-50 px-3.5 text-rose-600 transition-colors hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300"
                    aria-label={`Remove subject row ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <PortalEmpty
                icon={FileSpreadsheet}
                title="No subjects added"
                description="Add subject rows to record marks for this exam."
              />
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setRows([...rows, emptyRow()])}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Subject
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" aria-hidden="true" />
                  Save Marks
                </>
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </PortalSection>
  )
}

export default ExamManager
