import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarCheck,
  Cake,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  SquarePen,
  Trophy,
  UserRound,
} from 'lucide-react'
import PortalLogin from '@/components/portal/PortalLogin'
import StudentProfileForm from '@/components/portal/StudentProfileForm'
import AttendancePanel from '@/components/portal/AttendancePanel'
import ExamPanel from '@/components/portal/ExamPanel'
import AchievementsPanel from '@/components/portal/AchievementsPanel'
import { InfoItem, PortalLoading } from '@/components/portal/PortalShell'
import Button from '@/components/Button'
import { supabase } from '@/lib/supabaseClient'
import { avatarUrl, formatDate, yearSuffix } from '@/lib/portal'
import { useToast } from '@/context/ToastContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'

const SESSION_KEY = 'st_regno'

export default function StudentPortal() {
  usePageMeta(pageSeo.student)

  const { notify } = useToast()
  const [regno, setRegno] = useState(() => sessionStorage.getItem(SESSION_KEY) ?? null)
  const [view, setView] = useState(regno ? 'loading' : 'login')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [profile, setProfile] = useState(null)
  const [attendanceInfo, setAttendanceInfo] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [examData, setExamData] = useState(null)
  const [achievements, setAchievements] = useState([])

  const loadPortalData = useCallback(async (registerNo) => {
    if (!supabase) return null

    const [profileRes, attInfoRes, recordsRes, examRes, achRes] = await Promise.all([
      supabase.from('student_information').select('*').ilike('register_no', registerNo).maybeSingle(),
      supabase
        .from('attendance_information')
        .select('*')
        .ilike('register_no', registerNo)
        .maybeSingle(),
      supabase
        .from('attendance_records')
        .select('session_date, period, status, subject_name')
        .ilike('register_no', registerNo)
        .order('session_date', { ascending: true }),
      supabase.from('exam_information').select('*').ilike('register_no', registerNo).maybeSingle(),
      supabase
        .from('student_achievements')
        .select('*')
        .ilike('register_no', registerNo)
        .order('date_achieved', { ascending: false }),
    ])

    setAttendanceInfo(attInfoRes.data ?? null)
    setAttendanceRecords(recordsRes.data ?? [])
    setExamData(examRes.data?.exam_data ?? null)
    setAchievements(achRes.data ?? [])
    setProfile(profileRes.data ?? null)

    return profileRes.data ?? null
  }, [])

  const refresh = useCallback(
    async (registerNo = regno) => {
      if (!registerNo) return
      const student = await loadPortalData(registerNo)
      setView(student ? 'profile' : 'setup')
    },
    [regno, loadPortalData],
  )

  useEffect(() => {
    if (!regno) return
    refresh(regno)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regno])

  // Realtime updates for the signed-in student
  useEffect(() => {
    if (!regno || !supabase) return undefined

    const reload = () => loadPortalData(regno)
    const channel = supabase
      .channel(`st-rt-${regno}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_information' }, reload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_records' }, reload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exam_information' }, reload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_achievements' }, reload)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [regno, loadPortalData])

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
      .from('student_credentials')
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
    setAttendanceRecords([])
    setAchievements([])
    setExamData(null)
    setView('login')
    notify('Logged out.', 'info')
  }

  return (
    <div className="relative isolate min-h-svh bg-surface-muted pb-16 pt-28 dark:bg-surface-dark sm:pt-32">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-64 bg-brand-gradient"
        aria-hidden="true"
      />
      <div className="container">
        <header className="mb-8 text-center">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white ring-1 ring-inset ring-white/25">
            Student Portal
          </span>
          <h1 className="mt-3 text-display-sm font-extrabold text-white">
            Your academic dashboard
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75">
            Profile, attendance, exam results and achievements — all in one place.
          </p>
        </header>

        {view === 'login' ? (
          <PortalLogin
            title="Student Sign In"
            subtitle="Use the register number and password issued by the college."
            icon={GraduationCap}
            onSubmit={handleLogin}
            loading={loggingIn}
            error={loginError}
          />
        ) : null}

        {view === 'loading' ? <PortalLoading /> : null}

        {view === 'setup' && regno ? (
          <StudentProfileForm
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
                  {profile.register_no}
                </p>
                <p className="mt-1 text-sm prose-muted">
                  {profile.department}
                  {profile.year ? ` • ${profile.year}${yearSuffix(profile.year)} Year` : ''}
                </p>
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
                <InfoItem icon={Cake} label="Date of Birth" value={formatDate(profile.dob)} />
                <InfoItem icon={ShieldCheck} label="Guardian" value={profile.guardian_name} />
                <InfoItem icon={MapPin} label="Address" value={profile.address} />
                <InfoItem
                  icon={Linkedin}
                  label="LinkedIn"
                  value={profile.linkedin ? 'View Profile' : null}
                  href={profile.linkedin}
                />
                <InfoItem
                  icon={Github}
                  label="GitHub"
                  value={profile.github ? 'View Profile' : null}
                  href={profile.github}
                />
              </dl>
            </motion.aside>

            <div className="space-y-6">
              <AttendancePanel
                records={attendanceRecords}
                stored={attendanceInfo}
                icon={CalendarCheck}
              />
              <ExamPanel examData={examData} icon={FileText} />
              <AchievementsPanel
                regno={profile.register_no}
                achievements={achievements}
                onChanged={() => loadPortalData(profile.register_no)}
                icon={Trophy}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
