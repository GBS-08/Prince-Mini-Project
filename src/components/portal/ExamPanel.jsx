import { useMemo, useState } from 'react'
import { Check, FileText, X } from 'lucide-react'
import { EXAM_TYPES, examRowStatus } from '@/lib/portal'
import { PortalEmpty, PortalSection } from './PortalShell'

export function ExamPanel({ examData, icon }) {
  const semesters = useMemo(() => {
    if (!examData) return []
    return Object.keys(examData).sort(
      (a, b) => parseInt(a.replace('sem', ''), 10) - parseInt(b.replace('sem', ''), 10),
    )
  }, [examData])

  const [activeSem, setActiveSem] = useState(semesters[0] ?? null)
  const currentSem = activeSem && semesters.includes(activeSem) ? activeSem : semesters[0]

  if (!semesters.length) {
    return (
      <PortalSection title="Exam Results" icon={icon}>
        <PortalEmpty
          icon={FileText}
          title="Exam Results Not Available"
          description="Results will appear here after your marks are entered."
        />
      </PortalSection>
    )
  }

  return (
    <PortalSection title="Exam Results" icon={icon}>
      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {semesters.map((sem) => {
          const active = sem === currentSem
          return (
            <button
              key={sem}
              type="button"
              onClick={() => setActiveSem(sem)}
              aria-pressed={active}
              className={`min-h-[40px] whitespace-nowrap rounded-xl px-4 text-sm font-bold transition-all ${
                active
                  ? 'bg-brand-gradient text-white shadow-brand'
                  : 'bg-slate-100 text-slate-600 hover:text-brand-700 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Sem {sem.replace('sem', '')}
            </button>
          )
        })}
      </div>

      <div className="mt-5 space-y-6">
        {EXAM_TYPES.map((type) => {
          const rows = examData[currentSem]?.[type.id]
          if (!Array.isArray(rows) || !rows.length) return null

          const total = rows.reduce((sum, row) => sum + (Number(row.marks) || 0), 0)
          const maxTotal = rows.reduce((sum, row) => sum + (Number(row.max) || 100), 0)
          const passCount = rows.filter(
            (row) => examRowStatus(row.marks, row.max, type.id).passed,
          ).length

          return (
            <div
              key={type.id}
              className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-4 py-3 dark:bg-white/5">
                <h3 className="font-display text-base font-bold">{type.label}</h3>
                <p className="text-xs font-semibold prose-muted">
                  {passCount}/{rows.length} Pass • Total {total.toFixed(1)}/{maxTotal.toFixed(0)}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <caption className="sr-only">{type.label} marks</caption>
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:text-slate-400">
                      <th scope="col" className="px-4 py-2.5">Subject</th>
                      <th scope="col" className="px-4 py-2.5">Code</th>
                      <th scope="col" className="px-4 py-2.5">Marks</th>
                      <th scope="col" className="px-4 py-2.5">Max</th>
                      <th scope="col" className="px-4 py-2.5">%</th>
                      <th scope="col" className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                      const max = Number(row.max) || 100
                      const marks = Number(row.marks) || 0
                      const { percentage, passed } = examRowStatus(marks, max, type.id)
                      return (
                        <tr
                          key={`${row.code ?? row.subject_code ?? index}-${index}`}
                          className="border-b border-slate-100 last:border-0 dark:border-white/5"
                        >
                          <td className="px-4 py-2.5 font-semibold text-slate-800 dark:text-white">
                            {row.subject || row.subject_name || '—'}
                          </td>
                          <td className="px-4 py-2.5 prose-muted">
                            {row.code || row.subject_code || '—'}
                          </td>
                          <td className="px-4 py-2.5 font-bold">{marks}</td>
                          <td className="px-4 py-2.5 prose-muted">{max}</td>
                          <td className="px-4 py-2.5 font-semibold">{percentage.toFixed(1)}%</td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${
                                passed
                                  ? 'bg-leaf-50 text-leaf-700 dark:bg-leaf-500/15 dark:text-leaf-300'
                                  : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
                              }`}
                            >
                              {passed ? (
                                <Check className="h-3 w-3" aria-hidden="true" />
                              ) : (
                                <X className="h-3 w-3" aria-hidden="true" />
                              )}
                              {passed ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-bold dark:bg-white/5">
                      <td className="px-4 py-2.5" colSpan={2}>
                        Total
                      </td>
                      <td className="px-4 py-2.5">{total.toFixed(1)}</td>
                      <td className="px-4 py-2.5">{maxTotal.toFixed(0)}</td>
                      <td className="px-4 py-2.5" colSpan={2}>
                        {maxTotal > 0 ? `${((total / maxTotal) * 100).toFixed(1)}%` : '—'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </PortalSection>
  )
}

export default ExamPanel
