import { useMemo, useState } from 'react'
import PortalPending from './PortalPending'

const TYPE_CFG = {
  ciat1: { label: 'CIAT – I', icon: 'fas fa-pencil-alt', color: '#3b82f6' },
  ciat2: { label: 'CIAT – II', icon: 'fas fa-pen-nib', color: '#8b5cf6' },
  final: { label: 'Final Examination', icon: 'fas fa-graduation-cap', color: '#f43f5e' },
}

/** Semester-tabbed exam results table. */
export default function StudentExams({ examData }) {
  const semKeys = useMemo(
    () =>
      Object.keys(examData || {}).sort(
        (a, b) => parseInt(a.replace('sem', ''), 10) - parseInt(b.replace('sem', ''), 10),
      ),
    [examData],
  )
  const [activeSem, setActiveSem] = useState(semKeys[0] || '')

  if (!examData || semKeys.length === 0) {
    return (
      <PortalPending
        icon="fas fa-file-alt"
        bg="rgba(139,92,246,0.12)"
        color="#c4b5fd"
        title="Exam Results Not Available"
        subtitle="Results will appear here after admin enters your marks."
      />
    )
  }

  const current = semKeys.includes(activeSem) ? activeSem : semKeys[0]

  return (
    <div className="sp-glass st-exam-card">
      <div className="st-exam-heading">
        <i className="fas fa-file-alt" aria-hidden="true" /> Exam Results
      </div>

      <div className="st-sem-tabs">
        {semKeys.map((key) => (
          <button
            key={key}
            type="button"
            className={`st-sem-tab${key === current ? ' act' : ''}`}
            onClick={() => setActiveSem(key)}
          >
            Sem {parseInt(key.replace('sem', ''), 10)}
          </button>
        ))}
      </div>

      <div className="st-sem-panel">
        {Object.keys(TYPE_CFG).map((type) => {
          const rows = examData[current]?.[type]
          if (!rows?.length) return null

          const cfg = TYPE_CFG[type]
          const total = rows.reduce((sum, r) => sum + (Number(r.marks) || 0), 0)
          const maxTotal = rows.reduce((sum, r) => sum + (Number(r.max) || 100), 0)
          const passMark = type === 'final' ? 50 : 40
          const passCount = rows.filter((r) => {
            const pct = r.max > 0 ? (r.marks / r.max) * 100 : 0
            return pct >= passMark
          }).length

          return (
            <div className="st-exam-block" key={type} style={{ borderTop: `3px solid ${cfg.color}` }}>
              <div className="st-exam-block-hdr">
                <div className="st-exam-block-ico" style={{ background: `${cfg.color}22`, color: cfg.color }}>
                  <i className={cfg.icon} aria-hidden="true" />
                </div>
                <div>
                  <div className="st-exam-block-name">{cfg.label}</div>
                  <div className="st-exam-block-meta">
                    {passCount}/{rows.length} Pass • Avg: {rows.length ? (total / rows.length).toFixed(1) : 0}/
                    {maxTotal > 0 ? (maxTotal / rows.length).toFixed(0) : 100}
                  </div>
                </div>
              </div>

              <div className="st-tbl-wrap">
                <table className="st-tbl">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Code</th>
                      <th>Marks</th>
                      <th>Max</th>
                      <th>%</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                      const max = Number(row.max) || 100
                      const obtained = Number(row.marks) || 0
                      const pct = max > 0 ? ((obtained / max) * 100).toFixed(1) : '—'
                      const pass = (obtained / max) * 100 >= passMark
                      const code = row.code || row.subject_code
                      return (
                        <tr key={`${row.subject || row.subject_name || 'row'}-${index}`}>
                          <td className="st-sname">{row.subject || row.subject_name || '—'}</td>
                          <td>{code ? <span className="st-scode">{code}</span> : '—'}</td>
                          <td>
                            <strong>{obtained}</strong>
                          </td>
                          <td>{max}</td>
                          <td>{pct}%</td>
                          <td>
                            <span className={`st-chip ${pass ? 'st-chip-pass' : 'st-chip-fail'}`}>
                              <i className={`fas fa-${pass ? 'check' : 'times'}`} aria-hidden="true" />
                              {pass ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>{total.toFixed(1)}</strong>
                      </td>
                      <td>{maxTotal.toFixed(0)}</td>
                      <td>
                        <strong>{maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(1) : '—'}%</strong>
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
