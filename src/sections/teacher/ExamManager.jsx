import { useState } from 'react'
import { supabase, errorMessage } from '../../services/supabase'
import { useToast } from '../../context/ToastContext'
import { EXAM_TYPES, SEMESTERS } from '../../data/teacher'

const emptyRow = () => ({ subject: '', subject_name: '', code: '', subject_code: '', max: 100, marks: 0 })

const pctColor = (pct) => (pct >= 75 ? 'var(--tc-green)' : pct >= 50 ? '#fbbf24' : 'var(--tc-red)')

/** Per-student exam data editor (semester + exam type tabs, subject rows). */
export default function ExamManager() {
  const { showToast } = useToast()

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [student, setStudent] = useState(null)
  const [regno, setRegno] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [examData, setExamData] = useState({})
  const [sem, setSem] = useState('sem1')
  const [type, setType] = useState('ciat1')
  const [saving, setSaving] = useState(false)

  const rows = examData[sem]?.[type] || []

  const updateRows = (next) => setExamData((data) => ({ ...data, [sem]: { ...(data[sem] || {}), [type]: next } }))

  const load = async () => {
    const clean = input.trim().toUpperCase()
    if (!clean) {
      showToast('Enter a Register Number.', 'warning')
      return
    }

    setLoading(true)
    setError('')

    const { data: stu } = await supabase
      .from('student_information')
      .select('register_no,name,department,year')
      .ilike('register_no', clean)
      .maybeSingle()

    if (!stu) {
      setLoading(false)
      setStudent(null)
      setError('Student not found with this Register Number.')
      return
    }

    const { data: examRow } = await supabase
      .from('exam_information')
      .select('*')
      .ilike('register_no', clean)
      .maybeSingle()

    setLoading(false)
    setRegno(clean)
    setStudent(stu)
    setIsNew(!examRow)
    setExamData(examRow?.exam_data ? JSON.parse(JSON.stringify(examRow.exam_data)) : {})
    setSem('sem1')
    setType('ciat1')
    showToast(
      !examRow ? `Creating new exam record for ${clean}` : `Loaded exam data for ${clean}`,
      !examRow ? 'info' : 'success',
    )
  }

  const save = async () => {
    if (!regno) {
      showToast('No student loaded.', 'warning')
      return
    }

    const totalSubjects = Object.values(examData).reduce(
      (sum, semData) => sum + Object.values(semData || {}).reduce((s, list) => s + (list || []).length, 0),
      0,
    )

    if (totalSubjects === 0) {
      showToast('Please add at least one subject before saving.', 'warning')
      return
    }

    setSaving(true)

    const { error: saveError } = await supabase
      .from('exam_information')
      .upsert(
        { register_no: regno, exam_data: examData, updated_at: new Date().toISOString() },
        { onConflict: 'register_no' },
      )

    setSaving(false)

    if (saveError) {
      showToast(`Save failed: ${errorMessage(saveError)}`, 'error')
      return
    }

    showToast(`Exam data saved for ${regno}! ✅`, 'success')
    setIsNew(false)
  }

  const typeLabel = EXAM_TYPES.find((t) => t.id === type)?.longLabel || EXAM_TYPES.find((t) => t.id === type)?.label

  return (
    <div style={{ marginTop: 30, marginBottom: 8 }}>
      <div className="tc-att-hdr">
        <i className="fas fa-file-alt" aria-hidden="true" /> Student Exam Management
      </div>

      <div className="tg" style={{ padding: '26px 24px' }}>
        <p style={{ fontSize: '.88rem', color: 'var(--tc-muted)', marginBottom: 18, lineHeight: 1.7 }}>
          <i className="fas fa-info-circle" style={{ color: 'var(--tc-blue)' }} aria-hidden="true" /> Enter a
          student&apos;s Register Number to create or edit their exam details.
        </p>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="tl" htmlFor="examRegnoInput" style={{ marginBottom: 7 }}>
              <i className="fas fa-id-badge" aria-hidden="true" /> Student Register Number
            </label>
            <input
              id="examRegnoInput"
              className="ti"
              placeholder="e.g. 22CS0001"
              style={{ textTransform: 'uppercase' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  load()
                }
              }}
            />
          </div>
          <button type="button" className="tb tb-pri" onClick={load} disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Loading…
              </>
            ) : (
              <>
                <i className="fas fa-search" /> Load / Create
              </>
            )}
          </button>
        </div>

        {student && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
              <span className="tbd tb-amber" style={{ fontSize: '.86rem', padding: '6px 16px' }}>
                <i className="fas fa-user-graduate" aria-hidden="true" /> {student.name || regno} · {regno}
              </span>
              <span
                className={`tbd ${isNew ? 'tb-green' : 'tb-amber'}`}
                style={{ fontSize: '.80rem', padding: '5px 13px' }}
              >
                <i className={`fas fa-${isNew ? 'plus-circle' : 'edit'}`} aria-hidden="true" />{' '}
                {isNew ? 'New Record' : 'Editing Existing'}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {SEMESTERS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`tc-tab${sem === `sem${n}` ? ' act' : ''}`}
                  onClick={() => setSem(`sem${n}`)}
                >
                  Sem {n}
                </button>
              ))}
            </div>

            <div className="tc-tabs" style={{ marginBottom: 20 }}>
              {EXAM_TYPES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`tc-tab${type === item.id ? ' act' : ''}`}
                  onClick={() => setType(item.id)}
                >
                  <i className={item.icon} aria-hidden="true" /> {item.label}
                </button>
              ))}
            </div>

            <div>
              <div
                style={{
                  fontSize: '.85rem',
                  fontWeight: 800,
                  color: 'var(--tc-amber)',
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <i className="fas fa-layer-group" aria-hidden="true" /> Semester {parseInt(sem.replace('sem', ''), 10)}{' '}
                &nbsp;→&nbsp; {typeLabel}
                <span style={{ fontSize: '.72rem', color: 'var(--tc-muted)', fontWeight: 600, marginLeft: 4 }}>
                  ({rows.length} subject{rows.length !== 1 ? 's' : ''})
                </span>
              </div>

              {rows.length === 0 ? (
                <div className="tc-empty" style={{ padding: '28px 20px', marginBottom: 14 }}>
                  <div className="tc-empty-ico" style={{ fontSize: '1.8rem' }}>
                    📋
                  </div>
                  <div className="tc-empty-title">No Subjects Added</div>
                  <div className="tc-empty-sub">Click &quot;Add Subject&quot; below to start entering exam data.</div>
                </div>
              ) : (
                <>
                  <div className="exam-subj-hdr">
                    <span>Subject Name</span>
                    <span>Subject Code</span>
                    <span>Max Marks</span>
                    <span>Marks Obtained</span>
                    <span>Percentage</span>
                    <span />
                  </div>

                  <div>
                    {rows.map((row, index) => {
                      const max = parseFloat(row.max) || 0
                      const marks = parseFloat(row.marks) || 0
                      const pct = max > 0 ? ((marks / max) * 100).toFixed(1) : null

                      const patch = (changes) => {
                        const next = rows.map((r, i) => (i === index ? { ...r, ...changes } : r))
                        updateRows(next)
                      }

                      return (
                        <div className="exam-subj-row" key={index}>
                          <input
                            className="ti"
                            placeholder="Subject Name *"
                            aria-label="Subject name"
                            value={row.subject || row.subject_name || ''}
                            onChange={(e) => patch({ subject: e.target.value, subject_name: e.target.value })}
                          />
                          <input
                            className="ti"
                            placeholder="e.g. CS3401"
                            aria-label="Subject code"
                            value={row.code || row.subject_code || ''}
                            onChange={(e) => patch({ code: e.target.value, subject_code: e.target.value })}
                          />
                          <input
                            className="ti"
                            type="number"
                            placeholder="Max"
                            aria-label="Maximum marks"
                            min="0"
                            max="200"
                            step="0.5"
                            value={row.max}
                            onChange={(e) => patch({ max: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                          />
                          <input
                            className="ti"
                            type="number"
                            placeholder="Marks"
                            aria-label="Marks obtained"
                            min="0"
                            max="200"
                            step="0.5"
                            value={row.marks}
                            onChange={(e) => patch({ marks: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                          />
                          <span
                            style={{
                              color: pct === null ? 'var(--tc-muted)' : pctColor(parseFloat(pct)),
                              fontWeight: 800,
                              fontSize: '.85rem',
                              textAlign: 'center',
                            }}
                          >
                            {pct === null ? '—' : `${pct}%`}
                          </span>
                          <button
                            type="button"
                            className="exam-rm-btn"
                            title="Remove subject"
                            aria-label="Remove subject"
                            onClick={() => updateRows(rows.filter((_, i) => i !== index))}
                          >
                            <i className="fas fa-trash" aria-hidden="true" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-end',
                marginTop: 20,
                paddingTop: 16,
                borderTop: '1px solid var(--tc-border)',
              }}
            >
              <button type="button" className="tb tb-ghost tb-sm" onClick={() => updateRows([...rows, emptyRow()])}>
                <i className="fas fa-plus" /> Add Subject
              </button>
              <button type="button" className="tb tb-pri" onClick={save} disabled={saving}>
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <i className="fas fa-save" /> Save Exam Data
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="tc-msg tc-msg-err" style={{ display: 'flex' }}>
            <i className="fas fa-exclamation-circle" aria-hidden="true" /> {error}
          </div>
        )}
      </div>
    </div>
  )
}
