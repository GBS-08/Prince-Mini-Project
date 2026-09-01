import { useEffect, useState } from 'react'
import Reveal from '../../components/Reveal'
import ExamManager from './ExamManager'
import OdManager from './OdManager'
import AttendanceManager from './AttendanceManager'
import { supabase, publicUrl } from '../../services/supabase'
import { IMAGE_BUCKET, TEACHER_FOLDER } from '../../services/storage'

const fallbackAvatar = (teacher) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    teacher.name || teacher.register_no,
  )}&background=f59e0b&color=060912&size=300&bold=true`

function InfoCard({ icon, tone, label, value }) {
  if (!value) return null
  return (
    <div className="tg tc-info-card">
      <div className={`tc-info-icon ${tone}`}>
        <i className={icon} aria-hidden="true" />
      </div>
      <div>
        <div className="tc-info-lbl">{label}</div>
        <div className="tc-info-val">{value}</div>
      </div>
    </div>
  )
}

/** Signed-in teacher dashboard. */
export default function TeacherProfile({ teacher, regno, rooms, students, onEdit, onLogout, onRoomsChanged }) {
  const [photo, setPhoto] = useState(() =>
    teacher.image_url?.startsWith('http')
      ? `${teacher.image_url.split('?')[0]}?t=${Date.now()}`
      : fallbackAvatar(teacher),
  )

  /**
   * When the row has no `image_url`, look for an uploaded `<regno>.<ext>` file
   * in storage and back-fill the column — same recovery the original did.
   */
  useEffect(() => {
    if (teacher.image_url?.startsWith('http')) {
      setPhoto(`${teacher.image_url.split('?')[0]}?t=${Date.now()}`)
      return
    }

    let active = true
    supabase.storage
      .from(IMAGE_BUCKET)
      .list(TEACHER_FOLDER, { search: teacher.register_no })
      .then(({ data, error }) => {
        if (!active || error || !data?.length) return
        const match = data.find((file) => file.name?.startsWith(`${teacher.register_no}.`))
        if (!match) return
        const url = `${publicUrl(IMAGE_BUCKET, `${TEACHER_FOLDER}/${match.name}`)}?t=${Date.now()}`
        setPhoto(url)
        supabase.from('teacher_information').update({ image_url: url }).ilike('register_no', teacher.register_no)
      })

    return () => {
      active = false
    }
  }, [teacher])

  const subjects = teacher.subjects
    ? teacher.subjects
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  return (
    <div className="tc-wrap">
      <Reveal baseClass="tu" visibleClass="v" immediate className="tg tc-prof-card-new" style={{ marginBottom: 22 }}>
        <div className="tc-photo-center-wrap">
          <div className="tc-photo-ring-outer">
            <div className="tc-photo-ring-inner">
              <img
                src={photo}
                alt={teacher.name || teacher.register_no}
                className="tc-photo-big"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = fallbackAvatar(teacher)
                }}
              />
            </div>
            <div className="tc-photo-ring-glow" />
          </div>
          <div className="tc-photo-status-dot" />
        </div>

        <div className="tc-prof-text-center">
          <div className="tc-prof-name-big">{teacher.name || teacher.register_no}</div>
          <div className="tc-prof-desig-new">{teacher.designation || ''}</div>
          <div className="tc-prof-dept-new">{teacher.department ? `Dept. of ${teacher.department}` : ''}</div>
          <div className="tc-prof-badges-center">
            <span className="tbd tb-amber">
              <i className="fas fa-id-badge" aria-hidden="true" /> {teacher.register_no}
            </span>
            {teacher.qualification && (
              <span className="tbd tb-teal">
                <i className="fas fa-graduation-cap" aria-hidden="true" /> {teacher.qualification}
              </span>
            )}
            {teacher.experience && (
              <span className="tbd tb-green">
                <i className="fas fa-briefcase" aria-hidden="true" /> {teacher.experience}
              </span>
            )}
          </div>
        </div>

        <div className="tc-prof-btns-center">
          <button type="button" className="tb tb-ghost" onClick={onEdit}>
            <i className="fas fa-edit" /> Edit Profile
          </button>
          <button type="button" className="tb tb-danger" onClick={onLogout}>
            <i className="fas fa-sign-out-alt" /> Sign Out
          </button>
        </div>
      </Reveal>

      <Reveal baseClass="tu" visibleClass="v" immediate className="tc-info-grid">
        <InfoCard icon="fas fa-envelope" tone="tci-amb" label="Email" value={teacher.email} />
        <InfoCard icon="fas fa-phone" tone="tci-tel" label="Phone" value={teacher.phone} />
        <InfoCard icon="fas fa-venus-mars" tone="tci-vio" label="Gender" value={teacher.gender} />
        <InfoCard icon="fas fa-calendar-alt" tone="tci-grn" label="Date of Joining" value={teacher.joining_date} />
        <InfoCard icon="fas fa-hashtag" tone="tci-amb" label="Employee ID" value={teacher.employee_id} />
        <InfoCard icon="fas fa-flask" tone="tci-tel" label="Specialization" value={teacher.specialization} />
        <InfoCard icon="fas fa-briefcase" tone="tci-blu" label="Experience" value={teacher.experience} />
        <InfoCard icon="fas fa-map-marker-alt" tone="tci-red" label="Address" value={teacher.address} />
      </Reveal>

      {subjects.length > 0 && (
        <Reveal baseClass="tu" visibleClass="v" className="tg tc-subj-wrap">
          <div className="tc-subj-h">
            <i className="fas fa-book-open" aria-hidden="true" /> Subjects Handling
          </div>
          <div className="tc-subj-chips">
            {subjects.map((subject, index) => (
              <span className="tc-schip" key={subject} style={{ animationDelay: `${index * 0.06}s` }}>
                <i className="fas fa-book" aria-hidden="true" /> {subject}
              </span>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal baseClass="tu" visibleClass="v">
        <ExamManager />
      </Reveal>

      <Reveal baseClass="tu" visibleClass="v">
        <OdManager />
      </Reveal>

      <Reveal baseClass="tu" visibleClass="v">
        <AttendanceManager
          regno={regno}
          teacher={teacher}
          rooms={rooms}
          students={students}
          onRoomsChanged={onRoomsChanged}
        />
      </Reveal>
    </div>
  )
}
