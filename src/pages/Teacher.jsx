import { useCallback, useEffect, useState } from 'react'
import TeacherLogin from '../sections/teacher/TeacherLogin'
import TeacherSetup from '../sections/teacher/TeacherSetup'
import TeacherProfile from '../sections/teacher/TeacherProfile'
import { supabase, errorMessage } from '../services/supabase'
import { useToast } from '../context/ToastContext'
import usePageMeta from '../hooks/usePageMeta'
import '../styles/teacher-portal.css'

const SESSION_KEY = 'pdkv_tc_regno'

export default function Teacher() {
  usePageMeta({
    title: 'Teacher Portal - Prince Dr K Vasudevan College',
    description:
      'PDKV teacher portal — manage your profile, create classrooms, mark attendance and maintain student exam records.',
  })

  const { showToast } = useToast()
  const [view, setView] = useState(() => (sessionStorage.getItem(SESSION_KEY) ? 'loading' : 'login'))
  const [regno, setRegno] = useState(() => sessionStorage.getItem(SESSION_KEY) || '')
  const [teacher, setTeacher] = useState(null)
  const [rooms, setRooms] = useState([])
  const [students, setStudents] = useState([])

  const loadClassroomsAndStudents = useCallback(async () => {
    const [studentsRes, roomsRes] = await Promise.all([
      supabase
        .from('student_information')
        .select('register_no,name,year,department')
        .order('year')
        .order('department')
        .order('name'),
      supabase.from('classrooms').select('*').order('created_at', { ascending: false }),
    ])

    if (!studentsRes.error) setStudents(studentsRes.data || [])
    if (!roomsRes.error) setRooms(roomsRes.data || [])
  }, [])

  const loadPortal = useCallback(
    async (register) => {
      const { data, error } = await supabase
        .from('teacher_information')
        .select('*')
        .ilike('register_no', register)
        .maybeSingle()

      if (error) {
        showToast(`Error loading profile: ${errorMessage(error)}`, 'error')
        setView('login')
        return
      }

      if (!data) {
        setTeacher(null)
        setView('setup')
        return
      }

      setTeacher(data)
      await loadClassroomsAndStudents()
      setView('profile')
    },
    [loadClassroomsAndStudents, showToast],
  )

  /** Restore an existing portal session on mount. */
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (!saved) return
    setView('loading')
    loadPortal(saved)
  }, [loadPortal])

  /** Keep the classroom grids live while the dashboard is open. */
  useEffect(() => {
    if (view !== 'profile' || !regno) return undefined

    const channel = supabase
      .channel(`tc-rooms-live-${regno}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classrooms' }, async () => {
        const { data, error } = await supabase.from('classrooms').select('*').order('created_at', { ascending: false })
        if (!error) setRooms(data || [])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [view, regno])

  const handleSignedIn = async (register, existing) => {
    sessionStorage.setItem(SESSION_KEY, register)
    setRegno(register)

    if (!existing) {
      setTeacher(null)
      setView('setup')
      return
    }

    setTeacher(existing)
    setView('loading')
    await loadClassroomsAndStudents()
    setView('profile')
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setRegno('')
    setTeacher(null)
    setRooms([])
    setStudents([])
    setView('login')
    showToast('Logged out.', 'info')
  }

  const refreshRooms = useCallback(async () => {
    const { data, error } = await supabase.from('classrooms').select('*').order('created_at', { ascending: false })
    if (!error) setRooms(data || [])
  }, [])

  return (
    <div className="tc-page">
      <section className="tc-hero">
        <div className="tc-hero-bg" aria-hidden="true" />
        <div className="tc-hero-inner">
          <div className="tc-hero-pill">
            <i className="fas fa-chalkboard-teacher" aria-hidden="true" /> Teacher Management Portal
          </div>
          <h1 className="tc-hero-h1">
            Manage Classrooms,
            <br />
            <span className="tc-hero-span">Mark Attendance</span>
          </h1>
          <p className="tc-hero-sub">Sign in to access your profile, create classrooms &amp; record attendance</p>
        </div>
        <div className="tc-hero-line" aria-hidden="true" />
      </section>

      <section className="tc-section">
        {view === 'login' && <TeacherLogin onSignedIn={handleSignedIn} />}

        {view === 'loading' && (
          <div className="tc-wrap">
            <div className="tc-loading-wrap">
              <div className="tc-ring" />
              <p>Loading your portal…</p>
            </div>
          </div>
        )}

        {view === 'setup' && (
          <TeacherSetup
            regno={regno}
            teacher={teacher}
            onSaved={async () => {
              setView('loading')
              await loadPortal(regno)
            }}
            onCancel={() => setView(teacher ? 'profile' : 'setup')}
          />
        )}

        {view === 'profile' && teacher && (
          <TeacherProfile
            teacher={teacher}
            regno={regno}
            rooms={rooms}
            students={students}
            onEdit={() => setView('setup')}
            onLogout={handleLogout}
            onRoomsChanged={refreshRooms}
          />
        )}
      </section>
    </div>
  )
}
