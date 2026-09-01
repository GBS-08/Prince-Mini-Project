import { useEffect, useMemo, useState } from 'react'
import TcModal from './TcModal'
import { supabase } from '../../services/supabase'
import { formatDateFull } from '../../data/teacher'

/**
 * Classroom detail modal: room summary, student list toggle and the last
 * 7 days of attendance sessions grouped (and collapsible) by date.
 */
export default function RoomModal({
  open,
  room,
  students,
  onClose,
  onMarkAttendance,
  onEdit,
  onDelete,
  onViewSession,
}) {
  const [sessions, setSessions] = useState([])
  const [showStudents, setShowStudents] = useState(false)
  const [expanded, setExpanded] = useState(() => new Set())

  const todayISO = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!open || !room) return undefined
    let active = true

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 6)
    const cutoffISO = cutoff.toISOString().split('T')[0]

    supabase
      .from('attendance_sessions')
      .select('*')
      .eq('classroom_id', room.id)
      .gte('session_date', cutoffISO)
      .lte('session_date', todayISO)
      .order('session_date', { ascending: false })
      .order('period', { ascending: true })
      .then(({ data }) => {
        if (active) setSessions(data || [])
      })

    return () => {
      active = false
    }
  }, [open, room, todayISO])

  const roomStudents = useMemo(
    () => students.filter((s) => (room?.student_regnos || []).includes(s.register_no)),
    [students, room],
  )

  const groups = useMemo(() => {
    const byDate = {}
    sessions.forEach((session) => {
      const date = (session.session_date || '').split('T')[0]
      if (!date) return
      if (!byDate[date]) byDate[date] = []
      byDate[date].push(session)
    })
    return Object.keys(byDate)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({ date, sessions: byDate[date] }))
  }, [sessions])

  if (!room) return null

  const toggleDate = (date) =>
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      return next
    })

  return (
    <TcModal open={open} onClose={onClose} size="lg" icon="fas fa-door-open" title={room.class_name}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 13,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>{room.class_name}</div>
          <div style={{ fontSize: '.8rem', color: 'var(--tc-muted)', marginTop: 4 }}>
            {room.subject && (
              <>
                <i className="fas fa-book" aria-hidden="true" /> {room.subject} •{' '}
              </>
            )}
            <i className="fas fa-users" aria-hidden="true" /> {(room.student_regnos || []).length} Students •{' '}
            <i className="fas fa-user-tie" aria-hidden="true" /> {room.teacher_name || room.teacher_regno || '—'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="tb tb-green tb-sm" onClick={() => onMarkAttendance(room)}>
            <i className="fas fa-clipboard-check" /> Mark Attendance
          </button>
          <button type="button" className="tb tb-ghost tb-sm" onClick={() => onEdit(room)}>
            <i className="fas fa-edit" /> Edit
          </button>
          <button type="button" className="tb tb-danger tb-sm" onClick={() => onDelete(room)}>
            <i className="fas fa-trash" /> Delete
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <button type="button" className="tb tb-ghost tb-sm" onClick={() => setShowStudents((v) => !v)}>
          <i className="fas fa-users" /> {showStudents ? 'Hide Student List' : 'Student List'}
        </button>

        {showStudents && (
          <div className="tc-stu-list-panel">
            <div className="tc-stu-list-title">
              <i className="fas fa-users" aria-hidden="true" /> Students in this Classroom ({roomStudents.length})
            </div>
            <div className="tc-stu-chips">
              {roomStudents.length > 0 ? (
                roomStudents.map((student) => (
                  <span className="tc-stu-chip" key={student.register_no}>
                    <i className="fas fa-user" aria-hidden="true" /> {student.name || student.register_no}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--tc-muted)', fontSize: '.84rem' }}>
                  No student profiles found for this classroom.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: '.9rem',
            color: '#fff',
            fontWeight: 700,
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <span>
            <i className="fas fa-history" style={{ color: 'var(--tc-amber)' }} aria-hidden="true" /> Attendance Sessions
            — Last 7 Days
          </span>
          <span style={{ fontSize: '.75rem', color: 'var(--tc-muted)', fontWeight: 400 }}>
            {groups.length} day{groups.length !== 1 ? 's' : ''} · {sessions.length} session
            {sessions.length !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: '.72rem', color: 'var(--tc-muted)', fontWeight: 500 }}>
            (Click a date to expand sessions)
          </span>
        </div>

        {groups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--tc-muted)' }}>
            <i
              className="fas fa-calendar-times"
              style={{ fontSize: '2rem', opacity: 0.3, display: 'block', marginBottom: 10 }}
              aria-hidden="true"
            />
            No sessions in the last 7 days.
          </div>
        ) : (
          groups.map(({ date, sessions: daySessions }) => {
            const isToday = date === todayISO
            const isOpen = expanded.has(date)
            const subjects = [...new Set(daySessions.map((s) => s.subject_name).filter(Boolean))]
            const summary = subjects.length ? subjects.slice(0, 2).join(', ') + (subjects.length > 2 ? '…' : '') : ''

            return (
              <div className={`tc-date-group${isOpen ? ' expanded' : ''}`} key={date}>
                <div
                  className="tc-date-group-hdr"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onClick={() => toggleDate(date)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      toggleDate(date)
                    }
                  }}
                >
                  <div className="tc-date-group-left">
                    <div>
                      <div className="tc-date-group-date">
                        {isToday && (
                          <span
                            style={{
                              color: 'var(--tc-amber)',
                              fontSize: '.72rem',
                              fontWeight: 800,
                              marginRight: 6,
                              background: 'rgba(245,158,11,0.12)',
                              padding: '1px 7px',
                              borderRadius: 50,
                              border: '1px solid rgba(245,158,11,0.25)',
                            }}
                          >
                            TODAY
                          </span>
                        )}
                        {formatDateFull(date)}
                      </div>
                      <div className="tc-date-group-meta">
                        {daySessions.length} period{daySessions.length !== 1 ? 's' : ''}
                        {summary ? ` • ${summary}` : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="tbd tb-amber" style={{ fontSize: '.72rem', padding: '2px 9px' }}>
                      {daySessions.length} Period{daySessions.length !== 1 ? 's' : ''}
                    </span>
                    <i className="fas fa-chevron-down tc-date-arrow" aria-hidden="true" />
                  </div>
                </div>

                <div className="tc-date-group-body">
                  {daySessions.map((session) => (
                    <div className="tc-period-row" key={session.id}>
                      <div className="tc-period-left">
                        <span className="tc-period-badge">Period {session.period || '—'}</span>
                        <span className="tc-period-subj">{session.subject_name || 'No subject recorded'}</span>
                      </div>
                      <button
                        type="button"
                        className="tb tb-ghost tb-sm"
                        style={{ fontSize: '.72rem', padding: '5px 12px' }}
                        onClick={() => onViewSession(session.id)}
                      >
                        <i className="fas fa-eye" /> View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </TcModal>
  )
}
