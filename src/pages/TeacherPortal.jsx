import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  IdCard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Presentation,
  SquarePen,
  UserRound,
} from 'lucide-react'
import PortalLogin from '@/components/portal/PortalLogin'
import TeacherProfileForm from '@/components/portal/TeacherProfileForm'
import ClassroomManager from '@/components/portal/ClassroomManager'
import ExamManager from '@/components/portal/ExamManager'
import OdManager from '@/components/portal/OdManager'
import { InfoItem, PortalLoading } from '@/components/portal/PortalShell'
import Button from '@/components/Button'
import { supabase } from '@/lib/supabaseClient'
import { avatarUrl, computeAttendance, formatDate } from '@/lib/portal'
import { useToast } from '@/context/ToastContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'

const SESSION_KEY = 'tc_regno'

const TABS = [
  { id: 'classrooms', label: 'Classrooms', icon: Presentation },
  { id: 'exams', label: 'Exam Marks', icon: BookOpen },
  { id: 'od', label: 'On-Duty', icon: CalendarDays },
]

export default function TeacherPortal() {
  usePageMeta(pageSeo.teacher)

  const { notify } = useToast()
  const [regno, setRegno] = useState(() => sessionStorage.getItem(SESSION_KEY) ?? null)
  const [view, setView] = useState(regno ? 'loading' : 'login')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [tab, setTab] = useState('classrooms')

  const [profile, setProfile] = useState(null)
  const [students, setStudents] = useState([])
  const [classrooms, setClassrooms] = useState([])

  const loadDirectory = useCallback(async () => {
    if (!supabase) return
    const [studentsRes, roomsRes] = await Promise.all([
      supabase
        .from('student_information')
        .select('register_no,name,year,department')
        .order('year')
        .order('department')
        .order('name'),
      supabase.from('classrooms').select('*').order('created_at', { ascending: false }),
    ])
    setStudents(studentsRes.data ?? [])
    setClassrooms(roomsRes.data ?? [])
  }, [])

  const refresh = useCallback(
    async (registerNo = regno) => {
      if (!registerNo || !supabase) return
      const { data } = await supabase
        .from('teacher_information')
        .select('*')
        .ilike('register_no', registerNo)
        .maybeSingle()

      setProfile(data ?? null)
      await loadDirectory()
      setView(data ? 'profile' : 'setup')
    },
    [regno, loadDirectory],
  )

  useEffect(() => {
    if (!regno) return
    refresh(regno)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regno])

  useEffect(() => {
    if (!regno || !supabase) return undefined
    const channel = supabase
      .channel(`tc-rooms-${regno}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classrooms' }, loadDirectory)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [regno, loadDirectory])

  const handleLogin = async ({ regno: inputRegno, password }) => {
    setLoginError('')

    if (!inputRegno || !password) {
      setLoginError('Please enter your register number and password.')
      return
    }
    if (!supabase) {
      setLoginError('The portal is temporarily unavailable. Please try again later.')
      return
    }

    setLoggingIn(true)

    const { data, error } = await supabase
      .from('teacher_credentials')
      .select('password')
      .eq('register_no', inputRegno)
      .maybeSingle()

    setLoggingIn(false)

    if (error) {
      setLoginError('Database error — please try again.')
      return
    }
    if (!data) {
      setLoginError('Register number not found. Please contact the administration.')
      return
    }
    if (data.password !== password) {
      setLoginError('Incorrect password.')
      return
    }

    sessionStorage.setItem(SESSION_KEY, inputRegno)
    setRegno(inputRegno)
    setView('loading')
    notify(`Welcome! Signed in as ${inputRegno}`, 'success')
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setRegno(null)
    setProfile(null)
    setClassrooms([])
    setStudents([])
    setView('login')
    notify('Logged out.', 'info')
  }

  /** After marking attendance, recompute every affected student's summary. */
  const handleAttendanceSaved = useCallback(async (classroomId) => {
    if (!supabase) return
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
      Object.entries(byStudent).map(([studentRegno, studentRecords]) => {
        const summary = computeAttendance(studentRecords)
        return supabase.from('attendance_information').upsert(
          {
            register_no: studentRegno,
            total_days: summary.workingDays,
            present_days: Number(summary.effectivePresent.toFixed(2)),
            absent_days: Number(summary.effectiveAbsent.toFixed(2)),
            absent_details: summary.absentDetails,
            period_stats: summary.periodStats,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'register_no' },
        )
      }),
    )
  }, [])

  return (
    <div className="relative isolate min-h-svh bg-surface-muted pb-16 pt-28 dark:bg-surface-dark sm:pt-32">
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-brand-gradient" aria-hidden="true" />
      <div className="container">
        <header className="mb-8 text-center">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white ring-1 ring-inset ring-white/25">
            Faculty Portal
          </span>
          <h1 className="mt-3 text-display-sm font-extrabold text-white">Teaching dashboard</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">
            Manage classrooms, mark attendance, record exam marks and grant on-duty.
          </p>
        </header>

        {view === 'login' ? (
          <PortalLogin
            title="Faculty Sign In"
            subtitle="Use the register number and password issued by the college."
            icon={GraduationCap}
            onSubmit={handleLogin}
            loading={loggingIn}
            error={loginError}
          />
        ) : null}

        {view === 'loading' ? <PortalLoading label="Loading your dashboard…" /> : null}

        {view === 'setup' && regno ? (
          <TeacherProfileForm
            regno={regno}
            profile={profile}
            onSaved={() => refresh(regno)}
            onCancel={profile ? () => setView('profile') : undefined}
          />
        ) : null}

        {view === 'profile' && profile ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start">
            <motion.aside
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="surface-card p-6 lg:sticky lg:top-28"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={profile.image_url || avatarUrl(profile.name, profile.register_no)}
                  alt={profile.name || profile.register_no}
                  className="h-28 w-28 rounded-2xl object-cover ring-4 ring-brand-100 dark:ring-white/10"
                  onError={(event) => {
                    event.currentTarget.src = avatarUrl(profile.name, profile.register_no)
                  }}
                />
                <h2 className="mt-4 font-display text-xl font-extrabold">
                  {profile.name || profile.register_no}
                </h2>
                <p className="mt-1 text-sm font-bold text-brand-700 dark:text-brand-300">
                  {profile.designation}
                </p>
                <p className="mt-1 text-sm prose-muted">{profile.department}</p>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => setView('setup')}>
                  <SquarePen className="h-4 w-4" aria-hidden="true" />
                  Edit Profile
                </Button>
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign Out
                </Button>
              </div>

              <dl className="mt-6 space-y-2.5">
                <InfoItem icon={Mail} label="Email" value={profile.email} />
                <InfoItem icon={Phone} label="Phone" value={profile.phone} />
                <InfoItem icon={UserRound} label="Gender" value={profile.gender} />
                <InfoItem icon={GraduationCap} label="Qualification" value={profile.qualification} />
                <InfoItem
                  icon={BriefcaseBusiness}
                  label="Experience"
                  value={profile.experience}
                />
                <InfoItem icon={BookOpen} label="Specialization" value={profile.specialization} />
                <InfoItem icon={IdCard} label="Employee ID" value={profile.employee_id} />
                <InfoItem icon={Presentation} label="Subjects" value={profile.subjects} />
                <InfoItem
                  icon={CalendarDays}
                  label="Joined"
                  value={profile.joining_date ? formatDate(profile.joining_date) : null}
                />
                <InfoItem icon={MapPin} label="Address" value={profile.address} />
              </dl>
            </motion.aside>

            <div className="space-y-6">
              <div className="scrollbar-none flex gap-2 overflow-x-auto">
                {TABS.map((item) => {
                  const Icon = item.icon
                  const active = tab === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      aria-pressed={active}
                      className={`inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-bold transition-all ${
                        active
                          ? 'bg-brand-gradient text-white shadow-brand'
                          : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:text-brand-700 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </button>
                  )
                })}
              </div>

              {tab === 'classrooms' ? (
                <ClassroomManager
                  teacher={profile}
                  students={students}
                  classrooms={classrooms}
                  onRefresh={loadDirectory}
                  onAttendanceSaved={handleAttendanceSaved}
                />
              ) : null}
              {tab === 'exams' ? <ExamManager /> : null}
              {tab === 'od' ? <OdManager /> : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
