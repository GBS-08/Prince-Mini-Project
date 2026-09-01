import { useMemo, useState } from 'react'
import { ordinal } from '../../data/teacher'

/** Groups students by year → department, exactly like `grpStus` in Teacher.js. */
function groupStudents(students) {
  const groups = {}
  students.forEach((s) => {
    const year = s.year || '?'
    const dept = s.department || 'Unknown'
    if (!groups[year]) groups[year] = {}
    if (!groups[year][dept]) groups[year][dept] = []
    groups[year][dept].push(s)
  })
  return groups
}

/** Searchable, year/department grouped student picker used by the classroom modals. */
export default function StudentSelector({ students, selected, onChange, maxHeight = 370 }) {
  const [query, setQuery] = useState('')
  const groups = useMemo(() => groupStudents(students), [students])

  const toggle = (regno) => {
    const next = new Set(selected)
    if (next.has(regno)) next.delete(regno)
    else next.add(regno)
    onChange(next)
  }

  const toggleDept = (list) => {
    const next = new Set(selected)
    const allSelected = list.every((s) => next.has(s.register_no))
    list.forEach((s) => (allSelected ? next.delete(s.register_no) : next.add(s.register_no)))
    onChange(next)
  }

  const years = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b)

  const q = query.trim().toLowerCase()

  const rendered = years
    .map((year) => {
      const depts = Object.keys(groups[year]).sort()
      const blocks = depts
        .map((dept) => {
          const list = q
            ? groups[year][dept].filter(
                (s) => (s.name || '').toLowerCase().includes(q) || (s.register_no || '').toLowerCase().includes(q),
              )
            : groups[year][dept]
          return list.length ? { dept, list } : null
        })
        .filter(Boolean)
      return blocks.length ? { year, blocks } : null
    })
    .filter(Boolean)

  return (
    <>
      <div className="tc-msearch tg-fg">
        <i className="fas fa-search tc-msearch-ico" aria-hidden="true" />
        <input
          className="ti"
          placeholder="Search name or reg no…"
          aria-label="Search students"
          style={{ paddingLeft: 37 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div style={{ maxHeight, overflowY: 'auto', paddingRight: 3 }}>
        {students.length === 0 && (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--tmut)' }}>No students in system yet.</div>
        )}

        {students.length > 0 && rendered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--tmut)' }}>No matching students.</div>
        )}

        {rendered.map(({ year, blocks }) => (
          <div className="tc-yr-blk" key={year}>
            <div className="tc-yr-title">
              <i className="fas fa-layer-group" aria-hidden="true" /> Year {year}
              {ordinal(year)}
            </div>

            {blocks.map(({ dept, list }) => {
              const allSelected = list.every((s) => selected.has(s.register_no))
              return (
                <div className="tc-dp-blk" key={dept}>
                  <div className="tc-dp-title">
                    <span>
                      <i className="fas fa-building" aria-hidden="true" /> {dept}
                    </span>
                    <button type="button" className="tc-dp-sall" onClick={() => toggleDept(list)}>
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  {list.map((student) => {
                    const isSelected = selected.has(student.register_no)
                    return (
                      <div
                        key={student.register_no}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        className={`tc-sr${isSelected ? ' sel' : ''}`}
                        onClick={() => toggle(student.register_no)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            toggle(student.register_no)
                          }
                        }}
                      >
                        <div>
                          <div className="tc-sr-name">{student.name || '—'}</div>
                          <div className="tc-sr-meta">
                            {student.register_no} · {dept}
                          </div>
                        </div>
                        <div className="tc-sr-chk">{isSelected ? '✓' : ''}</div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}
