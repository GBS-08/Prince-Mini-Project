import { useMemo, useState } from 'react'
import { Loader2, Search, UserCheck } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/context/ToastContext'
import { computeAttendance, formatDate, recalcStudentAttendance } from '@/lib/portal'
import Button from '../Button'
import { Field, TextInput } from '../FormField'
import { PortalEmpty, PortalSection } from './PortalShell'

export function OdManager() {
  const { notify } = useToast()
  const [regnoInput, setRegnoInput] = useState('')
  const [student, setStudent] = useState(null)
  const [records, setRecords] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const summary = useMemo(() => computeAttendance(records), [records])
  const absentRecords = useMemo(
    () => records.filter((record) => record.status !== 'present'),
    [records],
  )

  const load = async (registerNo) => {
    if (!supabase) {
      setError('The portal is temporarily unavailable.')
      return
    }

    setLoading(true)
    setError('')

    const [studentRes, recordsRes] = await Promise.all([
      supabase
        .from('student_information')
        .select('register_no,name,department,year')
        .ilike('register_no', registerNo)
        .maybeSingle(),
      supabase
        .from('attendance_records')
        .select('*')
        .ilike('register_no', registerNo)
        .order('session_date', { ascending: false })
        .order('period', { ascending: true }),
    ])

    setLoading(false)

    if (!studentRes.data) {
      setStudent(null)
      setRecords([])
      setError('Student not found with this register number.')
      return
    }

    setStudent(studentRes.data)
    setRecords(recordsRes.data ?? [])
    setSelected(new Set())

    if (!(recordsRes.data ?? []).length) {
      setError('No attendance records found for this student yet.')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const regno = regnoInput.trim().toUpperCase()
    if (!regno) {
      setError('Enter a register number.')
      return
    }
    load(regno)
  }

  const toggle = (id) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleGrantOd = async () => {
    if (!selected.size || !supabase || !student) {
      notify('Select at least one session to grant OD.', 'warning')
      return
    }

    setSaving(true)

    let success = 0
    let failed = 0

    for (const recordId of selected) {
      const { error: updateError } = await supabase
        .from('attendance_records')
        .update({ status: 'present' })
        .eq('id', recordId)
      if (updateError) failed += 1
      else success += 1
    }

    if (success > 0) await recalcStudentAttendance(student.register_no)

    setSaving(false)

    if (failed && !success) {
      notify('Failed to update records. Please try again.', 'error')
      return
    }
    notify(
      failed
        ? `${success} session(s) updated, ${failed} failed.`
        : `OD granted for ${success} session(s)! Attendance recalculated. ✅`,
      failed ? 'warning' : 'success',
      5000,
    )
    load(student.register_no)
  }

  return (
    <PortalSection title="On-Duty (OD) Manager" icon={UserCheck}>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3" noValidate>
        <Field label="Student Register Number" htmlFor="od-regno" className="min-w-[220px] flex-1">
          <TextInput
            id="od-regno"
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
          Load Attendance
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

      {student && records.length ? (
        <div className="mt-6">
          <div className="rounded-2xl bg-brand-50 p-4 dark:bg-brand-900/30">
            <p className="font-display text-base font-bold text-brand-900 dark:text-brand-100">
              {student.name || student.register_no}
            </p>
            <p className="mt-0.5 text-sm text-brand-700 dark:text-brand-200">
              {student.register_no}
              {student.department ? ` • ${student.department}` : ''}
            </p>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Present %', `${summary.presentPct}%`],
              ['Absent %', `${summary.absentPct}%`],
              ['Working Days', summary.workingDays],
              ['Absent Periods', summary.absentPeriods],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-3.5 dark:bg-white/5">
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {label}
                </dt>
                <dd className="mt-1 font-display text-lg font-extrabold text-slate-900 dark:text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-6 font-display text-base font-bold">
            Absent Sessions ({absentRecords.length})
          </h3>

          {absentRecords.length ? (
            <>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelected(new Set(absentRecords.map((record) => record.id)))}
                >
                  Select All
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelected(new Set())}>
                  Clear Selection
                </Button>
              </div>

              <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto">
                {absentRecords.map((record) => (
                  <li key={record.id}>
                    <label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-sm transition-colors hover:bg-brand-50 dark:bg-white/5 dark:hover:bg-white/10">
                      <input
                        type="checkbox"
                        checked={selected.has(record.id)}
                        onChange={() => toggle(record.id)}
                        className="h-5 w-5 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-white/20 dark:bg-white/10"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-slate-800 dark:text-white">
                          {formatDate(record.session_date)} • Period {record.period ?? '—'}
                        </span>
                        <span className="block truncate text-xs prose-muted">
                          {record.subject_name || 'No subject recorded'}
                        </span>
                      </span>
                      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                        Absent
                      </span>
                    </label>
                  </li>
                ))}
              </ul>

              <Button onClick={handleGrantOd} disabled={saving} className="mt-5">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" aria-hidden="true" />
                    Grant OD &amp; Save ({selected.size})
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="mt-4">
              <PortalEmpty
                icon={UserCheck}
                title="No absent sessions"
                description="This student has full attendance across recorded sessions."
              />
            </div>
          )}
        </div>
      ) : null}
    </PortalSection>
  )
}

export default OdManager
