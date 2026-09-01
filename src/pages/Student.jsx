import { useCallback, useEffect, useRef, useState } from 'react'
import HeroParticles from '../components/HeroParticles'
import StudentLogin from '../sections/student/StudentLogin'
import StudentSetup from '../sections/student/StudentSetup'
import StudentProfile from '../sections/student/StudentProfile'
import { supabase, errorMessage } from '../services/supabase'
import { useToast } from '../context/ToastContext'
import usePageMeta from '../hooks/usePageMeta'
import '../styles/student-portal.css'

const SESSION_KEY = 'st_regno'

export default function Student() {
  usePageMeta({
    title: 'Student Portal - Prince Dr K Vasudevan College',
    description: 'Sign in to the PDKV student portal to view your profile, attendance, exam results and achievements.',
  })

  const { showToast } = useToast()
  const [view, setView] = useState(() => (sessionStorage.getItem(SESSION_KEY) ? 'loading' : 'login'))
  const [regno, setRegno] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [student, setStudent] = useState(null)
  const [portal, setPortal] = useState({ attendance: null, records: [], examData: null, achievements: [] })
  const channelRef = useRef(null)

  /** Attendance, exams and achievements for the signed-in register number. */
  const loadPortalData = useCallback(async (register) => {
    const [attInfo, attRecords, exam, achievements] = await Promise.all([
      supabase.from('attendance_information').select('*').ilike('register_no', register).maybeSingle(),
      supabase
        .from('attendance_records')
        .select('session_date, period, status, subject_name')
        .ilike('register_no', register)
        .order('session_date', { ascending: true }),
      supabase.from('exam_information').select('*').ilike('register_no', register).maybeSingle(),
      supabase
        .from('student_achievements')
        .select('*')
        .ilike('register_no', register)
        .order('date_achieved', { ascending: false }),
    ])

    setPortal({
      attendance: attInfo.data || null,
      records: attRecords.data || [],
      examData: exam.data?.exam_data || null,
      achievements: achievements.data || [],
    })
  }, [])

  const loadStudent = useCallback(
    async (register) => {
      const { data, error } = await supabase
        .from('student_information')
        .select('*')
        .ilike('register_no', register)
        .maybeSingle()

      if (error) {
        showToast(`Error loading profile: ${errorMessage(error)}`, 'error')
        setView('login')
        return null
      }

      setStudent(data || null)
      if (data) await loadPortalData(register)
      return data
    },
    [loadPortalData, showToast],
  )

  /** Restore an existing portal session on mount. */
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (!saved) return
    setView('loading')
    loadStudent(saved).then((data) => setView(data ? 'profile' : 'setup'))
  }, [loadStudent])

  /** Live refresh while a profile is open, matching the original `setupRT`. */
  useEffect(() => {
    if (view !== 'profile' || !regno) return undefined

    const channel = supabase
      .channel(`st-rt-${regno}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_information' }, () =>
        loadPortalData(regno),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_records' }, () =>
        loadPortalData(regno),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exam_information' }, () => loadPortalData(regno))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_achievements' }, () =>
        loadPortalData(regno),
      )
      .subscribe()

    channelRef.current = channel
    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [view, regno, loadPortalData])

  const handleSignedIn = async (register, existing) => {
    sessionStorage.setItem(SESSION_KEY, register)
    setRegno(register)
    setStudent(existing)
    if (existing) {
      setView('loading')
      await loadPortalData(register)
      setView('profile')
    } else {
      setView('setup')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setRegno('')
    setStudent(null)
    setPortal({ attendance: null, records: [], examData: null, achievements: [] })
    setView('login')
    showToast('Logged out.', 'info')
  }

  const afterSave = async () => {
    setView('loading')
    const data = await loadStudent(regno)
    setView(data ? 'profile' : 'setup')
  }

  return (
    <div className="st-page">
      <section className="st-hero">
        <div className="st-hero-overlay" aria-hidden="true" />
        <HeroParticles className="pointer-events-none absolute inset-0 z-[1] h-full w-full" />
        <div className="st-hero-content">
          <h1>
            <i className="fas fa-user-graduate" aria-hidden="true" /> Student Portal
          </h1>
          <p>Sign in to view your profile, attendance &amp; results</p>
        </div>
      </section>

      <section className="st-section">
        <div className="st-container">
          {view === 'login' && <StudentLogin onSignedIn={handleSignedIn} />}

          {view === 'loading' && (
            <div className="st-loading-wrap sp-up vis">
              <div className="st-spinner" />
              <p>Loading your portal…</p>
            </div>
          )}

          {view === 'setup' && (
            <StudentSetup
              regno={regno}
              student={student}
              onSaved={afterSave}
              onCancel={() => setView(student ? 'profile' : 'setup')}
            />
          )}

          {view === 'profile' && student && (
            <StudentProfile
              student={student}
              attendance={portal.attendance}
              records={portal.records}
              examData={portal.examData}
              achievements={portal.achievements}
              onEdit={() => setView('setup')}
              onLogout={handleLogout}
              onAchievementSaved={() => loadPortalData(regno)}
            />
          )}
        </div>
      </section>
    </div>
  )
}
