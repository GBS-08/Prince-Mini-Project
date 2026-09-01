import { useEffect, useState } from 'react'
import TcModal from './TcModal'
import { supabase } from '../../services/supabase'
import { formatDate } from '../../data/teacher'

/** Read-only report for a single attendance session. */
export default function SessionModal({ open, sessionId, onClose }) {
  const [session, setSession] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open || !sessionId) return undefined
    let active = true
    setLoading(true)

    Promise.all([
      supabase.from('attendance_records').select('*').eq('session_id', sessionId).order('student_name'),
      supabase.from('attendance_sessions').select('*').eq('id', sessionId).maybeSingle(),
    ]).then(([recordsRes, sessionRes]) => {
      if (!active) return
      setRecords(recordsRes.data || [])
      setSession(sessionRes.data || null)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [open, sessionId])

  const present = records.filter((r) => r.status === 'present')
  const absent = records.filter((r) => r.status === 'absent')

  return (
    <TcModal open={open} onClose={onClose} size="md" icon="fas fa-eye" title="Session Report">
      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 16 }}>
        <span className="tbd tb-amber">
          <i className="fas fa-calendar" aria-hidden="true" /> {session ? formatDate(session.session_date) : '—'}
        </span>
        <span className="tbd tb-teal">
          <i className="fas fa-clock" aria-hidden="true" /> Period {session?.period || '—'}
        </span>
        <span className="tbd tb-blue">
          <i className="fas fa-book" aria-hidden="true" /> {session?.subject_name || '—'}
        </span>
        <span className="tbd tb-green">
          <i className="fas fa-check" aria-hidden="true" /> {present.length} Present
        </span>
        <span className="tbd tb-red">
          <i className="fas fa-times" aria-hidden="true" /> {absent.length} Absent
        </span>
      </div>

      {loading ? (
        <div className="tc-loading-wrap">
          <div className="tc-ring" />
          <p>Loading session…</p>
        </div>
      ) : records.length ? (
        <div className="tc-tbl-wrap">
          <table className="tc-tbl">
            <thead>
              <tr>
                <th>Student</th>
                <th>Reg No</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td style={{ fontWeight: 700, color: '#fff' }}>{record.student_name || '—'}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--tmut)' }}>{record.register_no}</td>
                  <td>
                    <span className={`tbd ${record.status === 'present' ? 'tb-green' : 'tb-red'}`}>
                      <i className={`fas fa-${record.status === 'present' ? 'check' : 'times'}`} aria-hidden="true" />{' '}
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="tc-empty">
          <div className="tc-empty-title">No records found for this session.</div>
        </div>
      )}

      <div style={{ textAlign: 'right', marginTop: 15 }}>
        <button type="button" className="tb tb-ghost tb-sm" onClick={onClose}>
          Close
        </button>
      </div>
    </TcModal>
  )
}
