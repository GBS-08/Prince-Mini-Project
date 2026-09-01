import { useMemo, useState } from 'react'
import TcModal from './TcModal'
import { supabase, errorMessage } from '../../services/supabase'
import { useToast } from '../../context/ToastContext'
import { PERIODS } from '../../data/teacher'

/** Recomputes `attendance_information` for everyone in a classroom. */
async function updateStudentAttendance(classroomId) {
  const { data: records } = await supabase
    .from('attendance_records')
    .select('register_no, status, session_date, period, subject_name')
    .eq('classroom_id', classroomId)

  if (!records?.length) return

  const byStudent = {}
  records.forEach((record) => {
    if (!byStudent[record.register_no]) byStudent[record.register_no] = []
    byStudent[record.register_no].push(record)
  })

  await Promise.all(
    Object.entries(byStudent).map(([regno, list]) => {
      const absent = list.filter((r) => r.status === 'absent')
      const statsByDate = {}
      list.forEach((r) => {
        const date = r.session_date
        if (!statsByDate[date]) statsByDate[date] = { date, present: 0, absent: 0, total: 0 }
        statsByDate[date].total += 1
        if (r.status === 'present') statsByDate[date].present += 1
        else statsByDate[date].absent += 1
      })

      return supabase.from('attendance_information').upsert(
        {
          register_no: regno,
          total_days: list.length,
          present_days: list.filter((r) => r.status === 'present').length,
          absent_days: absent.length,
          absent_details: absent.map((r) => ({ date: r.session_date, period: r.period, subject_name: r.subject_name })),
          period_stats: Object.values(statsByDate),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'register_no' },
      )
    }),
  )
}

/** Per-session attendance marking sheet. */
export default function MarkAttendanceModal({ open, room, students, regno, onClose, onSaved }) {
  const { showToast } = useToast()

  const roster = useMemo(
    () => students.filter((s) => (room?.student_regnos || []).includes(s.register_no)),
    [students, room],
  )

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [period, setPeriod] = useState('1')
  const [subject, setSubject] = useState(room?.subject || '')
  const [marks, setMarks] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmUnmarked, setConfirmUnmarked] = useState(0)

  const markedCount = Object.values(marks).filter(Boolean).length
  const progress = roster.length ? Math.round((markedCount / roster.length) * 100) : 0

  const markOne = (register, status) => setMarks((current) => ({ ...current, [register]: status }))
  const markAll = (status) => setMarks(Object.fromEntries(roster.map((s) => [s.register_no, status])))

  const persist = async () => {
    setConfirmUnmarked(0)
    setSaving(true)

    const { data: session, error: sessionError } = await supabase
      .from('attendance_sessions')
      .upsert(
        {
          classroom_id: room.id,
          teacher_regno: regno,
          session_date: date,
          period: parseInt(period, 10),
          subject_name: subject.trim(),
        },
        { onConflict: 'classroom_id,session_date,period' },
      )
      .select()
      .single()

    if (sessionError) {
      setSaving(false)
      showToast(`Session error: ${errorMessage(sessionError)}`, 'error')
      return
    }

    const records = roster
      .filter((s) => marks[s.register_no])
      .map((s) => ({
        session_id: session.id,
        classroom_id: room.id,
        register_no: s.register_no,
        student_name: s.name || '',
        status: marks[s.register_no],
        session_date: date,
        period: parseInt(period, 10),
        subject_name: subject.trim(),
      }))

    if (records.length) {
      const { error: recordError } = await supabase
        .from('attendance_records')
        .upsert(records, { onConflict: 'session_id,register_no' })

      if (recordError) {
        setSaving(false)
        showToast(`Records error: ${errorMessage(recordError)}`, 'error')
        return
      }
    }

    await updateStudentAttendance(room.id)

    setSaving(false)
    showToast(
      `Attendance saved for ${records.length} students ✅ (${date} · Period ${period} · ${subject.trim()})`,
      'success',
    )
    onSaved(room)
  }

  const save = () => {
    if (!date || !period || !subject.trim()) {
      showToast('Enter date, period AND subject name.', 'warning')
      return
    }

    const unmarked = roster.length - markedCount
    if (unmarked > 0) {
      setConfirmUnmarked(unmarked)
      return
    }
    persist()
  }

  if (!room) return null

  return (
    <TcModal
      open={open}
      onClose={onClose}
      size="md"
      icon="fas fa-clipboard-check"
      title={`Mark Attendance — ${room.class_name}`}
    >
      <div className="tc-sess-hdr">
        <div>
          <label htmlFor="attDate">Date *</label>
          <input
            id="attDate"
            type="date"
            className="ti"
            style={{ minWidth: 145 }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="attPer">Period *</label>
          <select
            id="attPer"
            className="ts"
            style={{ minWidth: 125 }}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                Period {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="attSubj">Subject Name *</label>
          <input
            id="attSubj"
            className="ti"
            placeholder="e.g. Python, OOPS"
            style={{ minWidth: 180 }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </div>

      <div className="tc-bulk-row">
        <span className="tc-bulk-lbl">Mark All:</span>
        <button type="button" className="tb tb-green tb-sm" onClick={() => markAll('present')}>
          <i className="fas fa-check-double" /> All Present
        </button>
        <button type="button" className="tb tb-danger tb-sm" onClick={() => markAll('absent')}>
          <i className="fas fa-times" /> All Absent
        </button>
      </div>

      <div style={{ marginBottom: 13 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '.79rem',
            color: 'var(--tmut)',
            marginBottom: 5,
          }}
        >
          <span>
            Marked: <strong style={{ color: 'var(--tamb)' }}>{markedCount}</strong> / {roster.length}
          </span>
        </div>
        <div className="tc-prog">
          <div className="tc-prog-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div>
        {roster.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 28, color: 'var(--tmut)' }}>
            <i
              className="fas fa-users"
              style={{ fontSize: '2rem', opacity: 0.3, display: 'block', marginBottom: 10 }}
              aria-hidden="true"
            />
            No student profiles found for this classroom.
          </div>
        ) : (
          roster.map((student) => (
            <div className="tc-att-row" key={student.register_no}>
              <div>
                <div className="tc-att-sname">{student.name || '—'}</div>
                <div className="tc-att-sreg">
                  {student.register_no}
                  {student.department ? ` · ${student.department}` : ''} · Yr {student.year || '—'}
                </div>
              </div>
              <div className="tc-att-tog">
                <button
                  type="button"
                  className={`tc-p${marks[student.register_no] === 'present' ? ' on' : ''}`}
                  onClick={() => markOne(student.register_no, 'present')}
                  aria-label={`Mark ${student.name || student.register_no} present`}
                >
                  <i className="fas fa-check" aria-hidden="true" /> P
                </button>
                <button
                  type="button"
                  className={`tc-a${marks[student.register_no] === 'absent' ? ' on' : ''}`}
                  onClick={() => markOne(student.register_no, 'absent')}
                  aria-label={`Mark ${student.name || student.register_no} absent`}
                >
                  <i className="fas fa-times" aria-hidden="true" /> A
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {confirmUnmarked > 0 && (
        <div className="tc-msg tc-msg-err" style={{ display: 'flex', marginTop: 14 }}>
          <i className="fas fa-exclamation-circle" aria-hidden="true" />
          <span>{confirmUnmarked} student(s) not marked yet. Save anyway?</span>
          <button type="button" className="tb tb-ghost tb-sm" onClick={() => setConfirmUnmarked(0)}>
            Cancel
          </button>
          <button type="button" className="tb tb-pri tb-sm" onClick={persist}>
            Save Anyway
          </button>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'flex-end',
          marginTop: 18,
          paddingTop: 15,
          borderTop: '1px solid var(--tbord)',
        }}
      >
        <button type="button" className="tb tb-ghost tb-sm" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="tb tb-pri" onClick={save} disabled={saving}>
          {saving ? (
            <>
              <i className="fas fa-spinner fa-spin" /> Saving…
            </>
          ) : (
            <>
              <i className="fas fa-save" /> Save Attendance
            </>
          )}
        </button>
      </div>
    </TcModal>
  )
}
