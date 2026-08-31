import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarCheck,
  CalendarX2,
  ClipboardList,
  Loader2,
  Plus,
  Save,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/context/ToastContext'
import { DEPARTMENTS, PERIODS, YEAR_OPTIONS, formatDate, yearSuffix } from '@/lib/portal'
import Button from '../Button'
import { Field, SelectInput, TextInput } from '../FormField'
import { PortalEmpty, PortalSection } from './PortalShell'

function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => event.stopPropagation()}
          className={`max-h-[88vh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-elevated dark:bg-surface-dark-muted sm:p-8 ${
            wide ? 'max-w-3xl' : 'max-w-lg'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-xl font-extrabold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="-m-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function CreateClassroomModal({ teacher, students, onClose, onCreated }) {
  const { notify } = useToast()
  const [values, setValues] = useState({ class_name: '', subject: '', department: '', year: '' })
  const [selected, setSelected] = useState(new Set())
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)

  const setValue = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }))

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return students
    return students.filter((student) =>
      [student.name, student.register_no, student.department]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term)),
    )
  }, [students, query])

  const toggle = (registerNo) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(registerNo)) next.delete(registerNo)
      else next.add(registerNo)
      return next
    })
  }

  const handleSave = async () => {
    if (!values.class_name.trim()) {
      notify('Classroom name is required.', 'warning')
      return
    }
    if (selected.size === 0) {
      notify('Select at least one student.', 'warning')
      return
    }
    if (!supabase) {
      notify('The portal is temporarily unavailable.', 'error')
      return
    }

    setSaving(true)

    const { data, error } = await supabase
      .from('classrooms')
      .insert({
        teacher_regno: teacher.register_no,
        teacher_name: teacher.name || teacher.register_no,
        class_name: values.class_name.trim(),
        subject: values.subject.trim() || null,
        department: values.department || null,
        year: values.year ? parseInt(values.year, 10) : null,
        student_regnos: [...selected],
      })
      .select()
      .single()

    setSaving(false)

    if (error) {
      notify(`Failed to create classroom: ${error.message}`, 'error', 5000)
      return
    }

    notify(`Classroom "${data.class_name}" created! 🎉`, 'success')
    onCreated(data)
    onClose()
  }

  return (
    <Modal title="Create Classroom" onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Classroom Name" htmlFor="cc-name" required>
          <TextInput
            id="cc-name"
            value={values.class_name}
            onChange={setValue('class_name')}
            placeholder="e.g. CSE III Year — Section A"
          />
        </Field>
        <Field label="Subject" htmlFor="cc-subject">
          <TextInput
            id="cc-subject"
            value={values.subject}
            onChange={setValue('subject')}
            placeholder="e.g. Data Structures"
          />
        </Field>
        <Field label="Department" htmlFor="cc-dept">
          <SelectInput id="cc-dept" value={values.department} onChange={setValue('department')}>
            <option value="">Select Department</option>
            {DEPARTMENTS.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Year" htmlFor="cc-year">
          <SelectInput id="cc-year" value={values.year} onChange={setValue('year')}>
            <option value="">Select Year</option>
            {YEAR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-base font-bold">
            Select Students{' '}
            <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">
              ({selected.size} selected)
            </span>
          </h3>
          <div className="relative w-full sm:w-64">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <TextInput
              id="cc-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students…"
              aria-label="Search students"
              className="pl-10"
            />
          </div>
        </div>

        <ul className="mt-4 max-h-72 space-y-1.5 overflow-y-auto rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
          {filtered.length ? (
            filtered.map((student) => (
              <li key={student.register_no}>
                <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl bg-white px-3.5 py-2 text-sm transition-colors hover:bg-brand-50 dark:bg-white/5 dark:hover:bg-white/10">
                  <input
                    type="checkbox"
                    checked={selected.has(student.register_no)}
                    onChange={() => toggle(student.register_no)}
                    className="h-5 w-5 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-white/20 dark:bg-white/10"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-slate-800 dark:text-white">
                      {student.name || student.register_no}
                    </span>
                    <span className="block truncate text-xs prose-muted">
                      {student.register_no}
                      {student.department ? ` • ${student.department}` : ''}
                      {student.year ? ` • ${student.year}${yearSuffix(student.year)} Year` : ''}
                    </span>
                  </span>
                </label>
              </li>
            ))
          ) : (
            <li className="py-6 text-center text-sm prose-muted">No students match your search.</li>
          )}
        </ul>
      </div>

      <Button onClick={handleSave} size="lg" disabled={saving} className="mt-6 w-full">
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Creating…
          </>
        ) : (
          <>
            <Save className="h-4 w-4" aria-hidden="true" />
            Create Classroom
          </>
        )}
      </Button>
    </Modal>
  )
}

function MarkAttendanceModal({ classroom, teacher, students, onClose, onSaved }) {
  const { notify } = useToast()
  const today = new Date().toISOString().split('T')[0]
  const [meta, setMeta] = useState({
    session_date: today,
    period: '1',
    subject_name: classroom.subject ?? '',
  })
  const [marks, setMarks] = useState({})
  const [saving, setSaving] = useState(false)

  const roster = students.filter((student) =>
    (classroom.student_regnos ?? []).includes(student.register_no),
  )

  const markedCount = Object.values(marks).filter(Boolean).length
  const progress = roster.length ? Math.round((markedCount / roster.length) * 100) : 0

  const setMetaValue = (field) => (event) =>
    setMeta((current) => ({ ...current, [field]: event.target.value }))

  const markAll = (status) => {
    const next = {}
    roster.forEach((student) => {
      next[student.register_no] = status
    })
    setMarks(next)
  }

  const handleSave = async () => {
    if (!meta.session_date || !meta.period || !meta.subject_name.trim()) {
      notify('Enter date, period and subject name.', 'warning')
      return
    }
    if (!supabase) {
      notify('The portal is temporarily unavailable.', 'error')
      return
    }

    setSaving(true)

    const period = parseInt(meta.period, 10)
    const subject = meta.subject_name.trim()

    const { data: session, error: sessionError } = await supabase
      .from('attendance_sessions')
      .upsert(
        {
          classroom_id: classroom.id,
          teacher_regno: teacher.register_no,
          session_date: meta.session_date,
          period,
          subject_name: subject,
        },
        { onConflict: 'classroom_id,session_date,period' },
      )
      .select()
      .single()

    if (sessionError || !session) {
      setSaving(false)
      notify(`Session error: ${sessionError?.message ?? 'Unknown error'}`, 'error', 5000)
      return
    }

    const records = roster
      .filter((student) => marks[student.register_no])
      .map((student) => ({
        session_id: session.id,
        classroom_id: classroom.id,
        register_no: student.register_no,
        student_name: student.name ?? '',
        status: marks[student.register_no],
        session_date: meta.session_date,
        period,
        subject_name: subject,
      }))

    if (records.length) {
      const { error: recordError } = await supabase
        .from('attendance_records')
        .upsert(records, { onConflict: 'session_id,register_no' })

      if (recordError) {
        setSaving(false)
        notify(`Records error: ${recordError.message}`, 'error', 5000)
        return
      }
    }

    await onSaved(classroom.id)
    setSaving(false)
    notify(
      `Attendance saved for ${records.length} students ✅ (${meta.session_date} · Period ${period})`,
      'success',
      5000,
    )
    onClose()
  }

  return (
    <Modal title={`Mark Attendance — ${classroom.class_name}`} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Date" htmlFor="att-date" required>
          <TextInput
            id="att-date"
            type="date"
            value={meta.session_date}
            onChange={setMetaValue('session_date')}
          />
        </Field>
        <Field label="Period" htmlFor="att-period" required>
          <SelectInput id="att-period" value={meta.period} onChange={setMetaValue('period')}>
            {PERIODS.map((period) => (
              <option key={period} value={period}>
                Period {period}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Subject" htmlFor="att-subject" required>
          <TextInput
            id="att-subject"
            value={meta.subject_name}
            onChange={setMetaValue('subject_name')}
            placeholder="Subject name"
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold">
          Marked {markedCount}/{roster.length}
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => markAll('present')}>
            All Present
          </Button>
          <Button size="sm" variant="outline" onClick={() => markAll('absent')}>
            All Absent
          </Button>
        </div>
      </div>

      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Marking progress"
      >
        <div
          className="h-full rounded-full bg-brand-gradient transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="mt-5 max-h-80 space-y-2 overflow-y-auto">
        {roster.map((student) => {
          const status = marks[student.register_no]
          return (
            <li
              key={student.register_no}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                  {student.name || student.register_no}
                </p>
                <p className="truncate text-xs prose-muted">{student.register_no}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setMarks((current) => ({ ...current, [student.register_no]: 'present' }))
                  }
                  aria-pressed={status === 'present'}
                  className={`min-h-[40px] rounded-lg px-3.5 text-xs font-bold transition-colors ${
                    status === 'present'
                      ? 'bg-leaf-500 text-white'
                      : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10'
                  }`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMarks((current) => ({ ...current, [student.register_no]: 'absent' }))
                  }
                  aria-pressed={status === 'absent'}
                  className={`min-h-[40px] rounded-lg px-3.5 text-xs font-bold transition-colors ${
                    status === 'absent'
                      ? 'bg-rose-500 text-white'
                      : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10'
                  }`}
                >
                  Absent
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <Button onClick={handleSave} size="lg" disabled={saving} className="mt-6 w-full">
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Saving…
          </>
        ) : (
          <>
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Attendance
          </>
        )}
      </Button>
    </Modal>
  )
}

function ClassroomDetailModal({ classroom, students, onClose }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 6)
      const { data } = await supabase
        .from('attendance_sessions')
        .select('*')
        .eq('classroom_id', classroom.id)
        .gte('session_date', cutoff.toISOString().split('T')[0])
        .lte('session_date', new Date().toISOString().split('T')[0])
        .order('session_date', { ascending: false })
        .order('period', { ascending: true })

      if (active) {
        setSessions(data ?? [])
        setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [classroom.id])

  const byDate = useMemo(() => {
    const grouped = {}
    sessions.forEach((session) => {
      const date = String(session.session_date ?? '').split('T')[0]
      if (!date) return
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(session)
    })
    return grouped
  }, [sessions])

  const roster = students.filter((student) =>
    (classroom.student_regnos ?? []).includes(student.register_no),
  )

  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a))

  return (
    <Modal title={classroom.class_name} onClose={onClose} wide>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Subject', classroom.subject || '—'],
          ['Department', classroom.department || '—'],
          ['Year', classroom.year ? `${classroom.year}${yearSuffix(classroom.year)}` : '—'],
          ['Students', roster.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 p-3.5 dark:bg-white/5">
            <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {label}
            </dt>
            <dd className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-white">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-6 font-display text-base font-bold">Sessions — last 7 days</h3>
      {loading ? (
        <div className="mt-4 flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" aria-hidden="true" />
        </div>
      ) : dates.length ? (
        <ul className="mt-4 space-y-3">
          {dates.map((date) => (
            <li key={date} className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
              <p className="font-display text-sm font-bold">{formatDate(date)}</p>
              <ul className="mt-2.5 space-y-1.5">
                {byDate[date].map((session) => (
                  <li
                    key={session.id}
                    className="flex flex-wrap items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm dark:bg-white/5"
                  >
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                      Period {session.period ?? '—'}
                    </span>
                    <span className="prose-muted">
                      {session.subject_name || 'No subject recorded'}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          <PortalEmpty
            icon={CalendarX2}
            title="No sessions in the last 7 days"
            description="Mark attendance to create a session record."
          />
        </div>
      )}

      <h3 className="mt-6 font-display text-base font-bold">Students ({roster.length})</h3>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {roster.map((student) => (
          <li
            key={student.register_no}
            className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm dark:bg-white/5"
          >
            <p className="font-semibold text-slate-800 dark:text-white">
              {student.name || student.register_no}
            </p>
            <p className="text-xs prose-muted">{student.register_no}</p>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

export function ClassroomManager({ teacher, students, classrooms, onRefresh, onAttendanceSaved }) {
  const { notify } = useToast()
  const [tab, setTab] = useState('mine')
  const [createOpen, setCreateOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const [marking, setMarking] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const mine = classrooms.filter((room) => room.teacher_regno === teacher.register_no)
  const visible = tab === 'mine' ? mine : classrooms

  const handleDelete = async (room) => {
    if (!supabase) return
    setDeleting(room.id)
    await supabase.from('attendance_records').delete().eq('classroom_id', room.id)
    await supabase.from('attendance_sessions').delete().eq('classroom_id', room.id)
    const { error } = await supabase.from('classrooms').delete().eq('id', room.id)
    setDeleting(null)

    if (error) {
      notify(`Delete failed: ${error.message}`, 'error')
      return
    }
    notify(`Classroom "${room.class_name}" deleted.`, 'success')
    onRefresh()
  }

  return (
    <>
      <PortalSection
        title="Classrooms"
        icon={ClipboardList}
        action={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create
          </Button>
        }
      >
        <div className="flex gap-2">
          {[
            { id: 'mine', label: `My Classrooms (${mine.length})` },
            { id: 'all', label: `All Classrooms (${classrooms.length})` },
          ].map((item) => {
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-pressed={active}
                className={`min-h-[40px] rounded-xl px-4 text-sm font-bold transition-all ${
                  active
                    ? 'bg-brand-gradient text-white shadow-brand'
                    : 'bg-slate-100 text-slate-600 hover:text-brand-700 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {visible.length ? (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {visible.map((room) => {
              const owned = room.teacher_regno === teacher.register_no
              return (
                <li
                  key={room.id}
                  className="rounded-2xl border border-slate-200 p-4 transition-shadow hover:shadow-card dark:border-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-base font-bold">
                        {room.class_name}
                      </h3>
                      <p className="mt-1 truncate text-xs prose-muted">
                        {room.subject || 'No subject'}
                        {room.department ? ` • ${room.department}` : ''}
                        {room.year ? ` • ${room.year}${yearSuffix(room.year)} Year` : ''}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                      <Users className="h-3 w-3" aria-hidden="true" />
                      {(room.student_regnos ?? []).length}
                    </span>
                  </div>

                  <p className="mt-2 text-xs prose-muted">By {room.teacher_name || '—'}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setDetail(room)}>
                      View
                    </Button>
                    {owned ? (
                      <>
                        <Button size="sm" onClick={() => setMarking(room)}>
                          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                          Attendance
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={deleting === room.id}
                          onClick={() => handleDelete(room)}
                        >
                          {deleting === room.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          ) : (
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          )}
                          Delete
                        </Button>
                      </>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="mt-5">
            <PortalEmpty
              icon={ClipboardList}
              title="No classrooms yet"
              description="Create a classroom to start marking attendance."
              action={
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Create Classroom
                </Button>
              }
            />
          </div>
        )}
      </PortalSection>

      {createOpen ? (
        <CreateClassroomModal
          teacher={teacher}
          students={students}
          onClose={() => setCreateOpen(false)}
          onCreated={onRefresh}
        />
      ) : null}

      {detail ? (
        <ClassroomDetailModal
          classroom={detail}
          students={students}
          onClose={() => setDetail(null)}
        />
      ) : null}

      {marking ? (
        <MarkAttendanceModal
          classroom={marking}
          teacher={teacher}
          students={students}
          onClose={() => setMarking(null)}
          onSaved={onAttendanceSaved}
        />
      ) : null}
    </>
  )
}

export default ClassroomManager
