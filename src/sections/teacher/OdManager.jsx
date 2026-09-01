import { useMemo, useState } from 'react'
import { supabase, errorMessage } from '../../services/supabase'
import { useToast } from '../../context/ToastContext'
import { ordinal } from '../../data/teacher'

const statCellStyle = { padding: '14px 10px', textAlign: 'center', borderRight: '1px solid var(--tc-border)' }
const statNumStyle = { fontFamily: "'Syne', sans-serif", fontSize: '1.45rem', fontWeight: 800 }
const statLabelStyle = {
  fontSize: '.68rem',
  color: 'var(--tc-muted)',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  marginTop: 2,
}

/** Recomputes the `attendance_information` summary row for one student. */
export async function recalcStudentAttendance(regno) {
  const { data: records } = await supabase.from('attendance_records').select('*').ilike('register_no', regno)
  if (!records?.length) return

  const absent = records.filter((r) => r.status === 'absent')
  const statsByDate = {}
  records.forEach((r) => {
    const date = r.session_date
    if (!statsByDate[date]) statsByDate[date] = { date, present: 0, absent: 0, total: 0 }
    statsByDate[date].total += 1
    if (r.status === 'present') statsByDate[date].present += 1
    else statsByDate[date].absent += 1
  })

  await supabase.from('attendance_information').upsert(
    {
      register_no: regno,
      total_days: records.length,
      present_days: records.filter((r) => r.status === 'present').length,
      absent_days: absent.length,
      absent_details: absent.map((r) => ({ date: r.session_date, period: r.period, subject_name: r.subject_name })),
      period_stats: Object.values(statsByDate),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'register_no' },
  )
}

/** OD / attendance correction: flip selected absent sessions to present. */
export default function OdManager() {
  const { showToast } = useToast()

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [selected, setSelected] = useState(() => new Set())
  const [saving, setSaving] = useState(false)

  const stats = useMemo(() => {
    if (!result) return null
    const { records } = result

    const byDate = {}
    records.forEach((r) => {
      const date = (r.session_date || '').split('T')[0]
      if (!date) return
      if (!byDate[date]) byDate[date] = { present: 0, absent: 0, total: 0 }
      byDate[date].total += 1
      if (r.status === 'present') byDate[date].present += 1
      else byDate[date].absent += 1
    })

    const dates = Object.keys(byDate)
    const D = dates.length
    let sumP = 0
    dates.forEach((date) => {
      const day = byDate[date]
      sumP += day.total > 0 ? day.present / day.total : 0
    })

    const pNum = parseFloat((D > 0 ? (sumP / D) * 100 : 0).toFixed(1))

    return {
      D,
      sumP,
      pNum,
      totalPeriods: records.length,
      presentPeriods: records.filter((r) => r.status === 'present').length,
      absentPeriods: records.filter((r) => r.status === 'absent').length,
      absentRecords: records.filter((r) => r.status === 'absent'),
    }
  }, [result])

  const load = async (regnoOverride) => {
    const clean = (regnoOverride ?? input).trim().toUpperCase()
    if (!clean) {
      showToast('Enter a Register Number.', 'warning')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setSelected(new Set())

    const { data: student } = await supabase
      .from('student_information')
      .select('register_no,name,department,year')
      .ilike('register_no', clean)
      .maybeSingle()

    if (!student) {
      setLoading(false)
      setError('Student not found with this Register Number.')
      return
    }

    const { data: records } = await supabase
      .from('attendance_records')
      .select('*')
      .ilike('register_no', clean)
      .order('session_date', { ascending: true })
      .order('period', { ascending: true })

    setLoading(false)

    if (!records?.length) {
      setError('No attendance records found for this student yet.')
      return
    }

    setResult({ regno: clean, student, records })
  }

  const toggle = (id) =>
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const save = async () => {
    if (selected.size === 0) {
      showToast('No sessions selected. Tick the checkboxes for sessions you want to grant OD.', 'warning')
      return
    }

    setSaving(true)

    let success = 0
    let failed = 0

    // Sequential updates, mirroring the original loop.
    for (const id of selected) {
      const { error: updateError } = await supabase
        .from('attendance_records')
        .update({ status: 'present' })
        .eq('id', id)
      if (updateError) failed += 1
      else success += 1
    }

    if (failed > 0 && success === 0) {
      setSaving(false)
      showToast('Failed to update records. Please try again.', 'error')
      return
    }

    try {
      await recalcStudentAttendance(result.regno)
    } catch (err) {
      showToast(`Recalculation issue: ${errorMessage(err)}`, 'warning')
    }

    setSaving(false)

    if (failed > 0) showToast(`${success} session(s) updated, ${failed} failed.`, 'warning')
    else showToast(`OD granted for ${success} session(s)! Attendance recalculated. ✅`, 'success')

    load(result.regno)
  }

  const student = result?.student
  const year = student?.year || 0
  const pctCol = stats ? (stats.pNum >= 75 ? 'var(--tc-green)' : stats.pNum >= 65 ? '#fbbf24' : 'var(--tc-red)') : ''

  let warnText = ''
  let warnBg = ''
  let warnCol = ''
  if (stats) {
    if (stats.pNum >= 75) {
      warnText = '✅ Good standing! Attendance meets the 75% requirement.'
      warnBg = 'rgba(52,211,153,0.10)'
      warnCol = '#6ee7b7'
    } else if (stats.pNum >= 65) {
      const need = Math.max(0, Math.ceil((0.75 * stats.D - stats.sumP) / 0.25))
      warnText = `⚠️ Low attendance! Needs ${need} more consecutive full-day attendances to reach 75%.`
      warnBg = 'rgba(251,191,36,0.10)'
      warnCol = '#fde68a'
    } else {
      warnText = '🚨 Critical attendance! Immediate improvement required.'
      warnBg = 'rgba(248,113,113,0.12)'
      warnCol = '#fca5a5'
    }
  }

  return (
    <div style={{ marginTop: 30, marginBottom: 8 }}>
      <div className="tc-att-hdr">
        <i className="fas fa-user-check" aria-hidden="true" /> OD / Attendance Correction
      </div>

      <div className="tg" style={{ padding: '26px 24px' }}>
        <p style={{ fontSize: '.88rem', color: 'var(--tc-muted)', marginBottom: 18, lineHeight: 1.7 }}>
          <i className="fas fa-info-circle" style={{ color: 'var(--tc-blue)' }} aria-hidden="true" /> Enter a
          student&apos;s Register Number to view their attendance and correct absent records by granting OD.
        </p>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="tl" htmlFor="odRegnoInput" style={{ marginBottom: 7 }}>
              <i className="fas fa-id-badge" aria-hidden="true" /> Student Register Number
            </label>
            <input
              id="odRegnoInput"
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
          <button type="button" className="tb tb-pri" onClick={() => load()} disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Loading…
              </>
            ) : (
              <>
                <i className="fas fa-search" /> Load Attendance
              </>
            )}
          </button>
        </div>

        {result && stats && (
          <div style={{ border: '1px solid var(--tc-border)', borderRadius: 16, overflow: 'hidden', marginBottom: 4 }}>
            <div
              style={{
                background: 'rgba(245,158,11,0.08)',
                borderBottom: '1px solid var(--tc-border)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                  <i
                    className="fas fa-user-graduate"
                    style={{ color: 'var(--tc-amber)', marginRight: 8 }}
                    aria-hidden="true"
                  />
                  {student.name || result.regno}
                </div>
                <div style={{ fontSize: '.78rem', color: 'var(--tc-muted)', marginTop: 4 }}>
                  {result.regno}
                  {student.department ? ` • ${student.department}` : ''}
                  {year ? ` • Year ${year}${ordinal(year)}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="tbd tb-amber" style={{ fontSize: '.9rem', padding: '6px 16px' }}>
                  <i className="fas fa-percentage" aria-hidden="true" /> {stats.pNum.toFixed(1)}% Attendance
                </span>
                <span className={`tbd ${stats.pNum >= 75 ? 'tb-green' : 'tb-red'}`} style={{ fontSize: '.85rem' }}>
                  <i
                    className={`fas fa-${stats.pNum >= 75 ? 'check-circle' : 'exclamation-triangle'}`}
                    aria-hidden="true"
                  />{' '}
                  {stats.pNum >= 75 ? 'Good Standing' : 'Low Attendance'}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5,1fr)',
                borderBottom: '1px solid var(--tc-border)',
              }}
            >
              <div style={statCellStyle}>
                <div style={{ ...statNumStyle, color: 'var(--tc-blue)' }}>{stats.D}</div>
                <div style={statLabelStyle}>Working Days</div>
              </div>
              <div style={statCellStyle}>
                <div style={{ ...statNumStyle, color: 'var(--tc-green)' }}>{stats.presentPeriods}</div>
                <div style={statLabelStyle}>Present Periods</div>
              </div>
              <div style={statCellStyle}>
                <div style={{ ...statNumStyle, color: 'var(--tc-red)' }}>{stats.absentPeriods}</div>
                <div style={statLabelStyle}>Absent Periods</div>
              </div>
              <div style={statCellStyle}>
                <div style={{ ...statNumStyle, color: '#93c5fd' }}>{stats.totalPeriods}</div>
                <div style={statLabelStyle}>Total Periods</div>
              </div>
              <div style={{ ...statCellStyle, borderRight: 'none' }}>
                <div style={{ ...statNumStyle, color: pctCol }}>{stats.pNum.toFixed(1)}%</div>
                <div style={statLabelStyle}>Attendance %</div>
              </div>
            </div>

            <div style={{ padding: '10px 20px', background: warnBg, borderBottom: '1px solid var(--tc-border)' }}>
              <span style={{ fontSize: '.83rem', fontWeight: 700, color: warnCol }}>{warnText}</span>
            </div>

            <div style={{ padding: '18px 20px' }}>
              <div
                style={{
                  fontSize: '.9rem',
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <i className="fas fa-times-circle" style={{ color: 'var(--tc-red)' }} aria-hidden="true" />
                Absent Sessions ({stats.absentRecords.length})
                <span style={{ fontSize: '.72rem', color: 'var(--tc-muted)', fontWeight: 500 }}>
                  — Tick checkboxes to grant OD &amp; mark as Present
                </span>
              </div>

              {stats.absentRecords.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 24,
                    color: 'var(--tc-muted)',
                    background: 'rgba(52,211,153,0.04)',
                    border: '1px solid rgba(52,211,153,0.14)',
                    borderRadius: 12,
                  }}
                >
                  <i
                    className="fas fa-check-circle"
                    style={{
                      fontSize: '2rem',
                      color: 'var(--tc-green)',
                      opacity: 0.6,
                      display: 'block',
                      marginBottom: 10,
                    }}
                    aria-hidden="true"
                  />
                  <div style={{ fontWeight: 700, color: 'var(--tc-green)', marginBottom: 4 }}>No Absent Records</div>
                  <div style={{ fontSize: '.82rem' }}>This student has no absent sessions on record.</div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 10, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="tb tb-ghost tb-sm"
                      onClick={() => setSelected(new Set(stats.absentRecords.map((r) => r.id)))}
                    >
                      <i className="fas fa-check-double" /> Select All
                    </button>
                    <button type="button" className="tb tb-ghost tb-sm" onClick={() => setSelected(new Set())}>
                      <i className="fas fa-times" /> Deselect All
                    </button>
                    <span style={{ fontSize: '.78rem', color: 'var(--tc-muted)', fontWeight: 700 }}>
                      {selected.size} of {stats.absentRecords.length} selected
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      maxHeight: 400,
                      overflowY: 'auto',
                      paddingRight: 2,
                    }}
                  >
                    {stats.absentRecords.map((record) => {
                      const raw = (record.session_date || '').split('T')[0]
                      const dateStr = raw
                        ? new Date(`${raw}T00:00:00`).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'

                      return (
                        <label className="od-abs-row" key={record.id}>
                          <input
                            type="checkbox"
                            className="od-chk"
                            checked={selected.has(record.id)}
                            onChange={() => toggle(record.id)}
                          />
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: '.86rem',
                                fontWeight: 700,
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                flexWrap: 'wrap',
                              }}
                            >
                              <i
                                className="fas fa-calendar-times"
                                style={{ color: 'var(--tc-red)', fontSize: '.8rem' }}
                                aria-hidden="true"
                              />
                              <span>{dateStr}</span>
                              {record.period && (
                                <span
                                  style={{
                                    color: 'var(--tc-amber)',
                                    background: 'rgba(245,158,11,0.10)',
                                    padding: '1px 8px',
                                    borderRadius: 50,
                                    fontSize: '.75rem',
                                  }}
                                >
                                  Period {record.period}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '.74rem', color: 'var(--tc-muted)', marginTop: 3 }}>
                              {record.subject_name ? (
                                <>
                                  <i className="fas fa-book" style={{ marginRight: 4 }} aria-hidden="true" />
                                  {record.subject_name}
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-minus" aria-hidden="true" /> Subject not recorded
                                </>
                              )}
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: '.72rem',
                              fontWeight: 800,
                              padding: '3px 10px',
                              borderRadius: 50,
                              flexShrink: 0,
                              background: 'rgba(248,113,113,0.12)',
                              color: 'var(--tc-red)',
                              border: '1px solid rgba(248,113,113,0.24)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <i className="fas fa-times" aria-hidden="true" /> Absent
                          </span>
                        </label>
                      )
                    })}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      justifyContent: 'flex-end',
                      marginTop: 16,
                      paddingTop: 14,
                      borderTop: '1px solid var(--tc-border)',
                    }}
                  >
                    <button type="button" className="tb tb-pri" onClick={save} disabled={saving}>
                      {saving ? (
                        <>
                          <i className="fas fa-spinner fa-spin" /> Saving…
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-check" /> Grant OD &amp; Save
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
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
