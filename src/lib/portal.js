import { supabase } from './supabaseClient'

export const BUCKET = 'image_files'
export const STUDENT_FOLDER = 'Student_images'
export const TEACHER_FOLDER = 'Teacher_images'
export const ACHIEVEMENT_FOLDER = 'Achievement_images'

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Cyber Security',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Master of Business Administration',
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
]

export const YEAR_OPTIONS = [
  { value: 1, label: '1st Year' },
  { value: 2, label: '2nd Year' },
  { value: 3, label: '3rd Year' },
  { value: 4, label: '4th Year' },
]

export const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8]

export function yearSuffix(year) {
  return { 1: 'st', 2: 'nd', 3: 'rd', 4: 'th' }[Number(year)] ?? 'th'
}

export function avatarUrl(name, fallbackKey) {
  const label = name || fallbackKey || 'PDKV'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    label,
  )}&background=1a237e&color=ffffff&size=256&bold=true`
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(`${String(value).split('T')[0]}T00:00:00`)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export async function uploadPortalFile(file, folder, key) {
  if (!file || !supabase) return null
  const extension = (file.name.split('.').pop() ?? 'jpg').toLowerCase()
  const path = `${folder}/${key}_${Date.now()}.${extension}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
  if (error) throw new Error(error.message)

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return publicUrl
}

/**
 * Attendance engine ported from the legacy Student.js portal.
 * Per-day value = presentPeriods / totalPeriods for that day.
 * Present% = (sum of daily present values / working days) * 100
 */
export function computeAttendance(records = [], stored = null) {
  const byDate = {}

  records.forEach((record) => {
    const date = String(record.session_date ?? '').split('T')[0]
    if (!date) return
    if (!byDate[date]) byDate[date] = { present: 0, absent: 0, total: 0, periods: [] }
    byDate[date].total += 1
    if (record.status === 'present') byDate[date].present += 1
    else byDate[date].absent += 1
    byDate[date].periods.push({
      period: record.period,
      status: record.status,
      subject: record.subject_name,
    })
  })

  const workingDates = Object.keys(byDate).sort()
  const workingDays = workingDates.length

  let sumPresent = 0
  let sumAbsent = 0
  let totalPeriods = 0
  let presentPeriods = 0
  let absentPeriods = 0

  workingDates.forEach((date) => {
    const day = byDate[date]
    sumPresent += day.total > 0 ? day.present / day.total : 0
    sumAbsent += day.total > 0 ? day.absent / day.total : 0
    totalPeriods += day.total
    presentPeriods += day.present
    absentPeriods += day.absent
  })

  const hasRecords = records.length > 0
  const storedTotal = Number(stored?.total_days ?? 0)
  const storedPresent = Number(stored?.present_days ?? 0)

  const presentPct = hasRecords
    ? workingDays > 0
      ? (sumPresent / workingDays) * 100
      : 0
    : storedTotal > 0
      ? (storedPresent / storedTotal) * 100
      : 0

  const absentPct = hasRecords
    ? workingDays > 0
      ? (sumAbsent / workingDays) * 100
      : 0
    : storedTotal > 0
      ? ((storedTotal - storedPresent) / storedTotal) * 100
      : 0

  const days = hasRecords ? workingDays : storedTotal
  const effectivePresent = hasRecords ? sumPresent : storedPresent
  const effectiveAbsent = hasRecords ? sumAbsent : Math.max(0, storedTotal - storedPresent)

  const pct = Number(presentPct.toFixed(1))

  let neededDays = 0
  if (pct < 75 && days > 0) {
    neededDays = Math.max(0, Math.ceil((0.75 * days - effectivePresent) / 0.25))
  }

  return {
    byDate,
    workingDates,
    workingDays: days,
    presentPct: pct,
    absentPct: Number(absentPct.toFixed(1)),
    effectivePresent,
    effectiveAbsent,
    totalPeriods,
    presentPeriods,
    absentPeriods,
    neededDays,
    hasData: hasRecords || storedTotal > 0,
    absentDetails: workingDates.flatMap((date) =>
      byDate[date].periods
        .filter((period) => period.status !== 'present')
        .map((period) => ({
          date,
          period: period.period,
          subject_name: period.subject ?? null,
        })),
    ),
    periodStats: workingDates.map((date) => ({
      date,
      present: byDate[date].present,
      absent: byDate[date].absent,
      total: byDate[date].total,
    })),
  }
}

/** Recalculate & persist attendance_information for a student. */
export async function recalcStudentAttendance(regno) {
  if (!supabase) return
  const { data: records } = await supabase
    .from('attendance_records')
    .select('session_date, period, status, subject_name')
    .ilike('register_no', regno)

  const summary = computeAttendance(records ?? [])

  await supabase.from('attendance_information').upsert(
    {
      register_no: regno,
      total_days: summary.workingDays,
      present_days: Number(summary.effectivePresent.toFixed(2)),
      absent_days: Number(summary.effectiveAbsent.toFixed(2)),
      absent_details: summary.absentDetails,
      period_stats: summary.periodStats,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'register_no' },
  )
}

export const EXAM_TYPES = [
  { id: 'ciat1', label: 'CIAT – I', pass: 40 },
  { id: 'ciat2', label: 'CIAT – II', pass: 40 },
  { id: 'final', label: 'Final Examination', pass: 50 },
]

export function examRowStatus(marks, max, type) {
  const maximum = Number(max) || 100
  const obtained = Number(marks) || 0
  const percentage = maximum > 0 ? (obtained / maximum) * 100 : 0
  const passMark = type === 'final' ? 50 : 40
  return { percentage, passed: percentage >= passMark }
}

export function markTone(percentage) {
  if (percentage >= 75) return 'text-leaf-600 dark:text-leaf-400'
  if (percentage >= 50) return 'text-gold-600 dark:text-gold-400'
  return 'text-rose-600 dark:text-rose-400'
}

export const ACHIEVEMENT_TYPES = [
  { value: 'general', label: 'General', tone: 'brand' },
  { value: 'academic', label: 'Academic', tone: 'sky' },
  { value: 'sports', label: 'Sports', tone: 'leaf' },
  { value: 'cultural', label: 'Cultural', tone: 'gold' },
  { value: 'technical', label: 'Technical', tone: 'violet' },
]
