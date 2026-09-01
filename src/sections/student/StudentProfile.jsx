import Reveal from '../../components/Reveal'
import StudentAttendance from './StudentAttendance'
import StudentExams from './StudentExams'
import StudentAchievements from './StudentAchievements'
import { YEAR_SUFFIX } from '../../data/departments'

const GENDER_ICON = { Male: 'fas fa-mars', Female: 'fas fa-venus', Other: 'fas fa-transgender' }

const avatarFor = (student) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    student.name || student.register_no,
  )}&background=00f5d4&color=020c1b&size=200&bold=true`

function InfoItem({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="st-info-item">
      <i className={icon} aria-hidden="true" />
      <div>
        <span className="st-il">{label}</span>
        <span className="st-iv">{value}</span>
      </div>
    </div>
  )
}

function LinkItem({ icon, label, href }) {
  if (!href) return null
  return (
    <div className="st-info-item">
      <i className={icon} aria-hidden="true" />
      <div>
        <span className="st-il">{label}</span>
        <a href={href} target="_blank" rel="noopener noreferrer" className="st-link">
          View Profile <i className="fas fa-external-link-alt" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}

/** Signed-in student dashboard: identity card, attendance, exams, achievements. */
export default function StudentProfile({
  student,
  attendance,
  records,
  examData,
  achievements,
  onEdit,
  onLogout,
  onAchievementSaved,
}) {
  const suffix = YEAR_SUFFIX[Math.min(student.year || 1, 4)] || 'th'

  return (
    <div className="st-wrap">
      <div>
        <Reveal baseClass="sp-up" visibleClass="vis" immediate className="sp-glass st-prof-hero">
          <div className="st-av-wrap">
            <img
              src={student.image_url || avatarFor(student)}
              alt={student.name || student.register_no}
              className="st-av"
              onError={(event) => {
                event.currentTarget.src = avatarFor(student)
              }}
            />
            <div className="st-av-ring" />
          </div>
          <div className="st-prof-info">
            <div className="st-prof-name">{student.name || student.register_no}</div>
            <div className="st-prof-regno">{student.register_no}</div>
            <div className="st-prof-dept">
              {student.department || ''}
              {student.year ? ` • ${student.year}${suffix} Year` : ''}
            </div>
            <div className="st-badges">
              {student.gender && (
                <span className="sp-badge sp-badge-cyan">
                  <i className={GENDER_ICON[student.gender] || 'fas fa-user'} aria-hidden="true" /> {student.gender}
                </span>
              )}
              {student.department && (
                <span className="sp-badge sp-badge-blue">
                  <i className="fas fa-book" aria-hidden="true" /> {student.department.split(' ').pop()}
                </span>
              )}
              {student.year && (
                <span className="sp-badge sp-badge-gold">
                  <i className="fas fa-layer-group" aria-hidden="true" /> Year {student.year}
                </span>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal baseClass="sp-up" visibleClass="vis" immediate className="st-prof-actions">
          <button type="button" className="sp-btn sp-btn-ghost" onClick={onEdit}>
            <i className="fas fa-edit" /> Edit Profile
          </button>
          <button type="button" className="sp-btn sp-btn-danger" onClick={onLogout}>
            <i className="fas fa-sign-out-alt" /> Sign Out
          </button>
        </Reveal>

        <Reveal baseClass="sp-up" visibleClass="vis" className="sp-glass st-info-grid">
          <InfoItem icon="fas fa-envelope" label="Email" value={student.email} />
          <InfoItem icon="fas fa-phone" label="Phone" value={student.phone} />
          <InfoItem icon="fas fa-venus-mars" label="Gender" value={student.gender} />
          <InfoItem icon="fas fa-birthday-cake" label="Date of Birth" value={student.dob} />
          <InfoItem icon="fas fa-shield-alt" label="Guardian" value={student.guardian_name} />
          <InfoItem icon="fas fa-map-marker-alt" label="Address" value={student.address} />
          <LinkItem icon="fab fa-linkedin" label="LinkedIn" href={student.linkedin} />
          <LinkItem icon="fab fa-github" label="GitHub" href={student.github} />
        </Reveal>
      </div>

      <div>
        <Reveal baseClass="sp-up" visibleClass="vis" immediate>
          <StudentAttendance info={attendance} records={records} />
        </Reveal>
        <Reveal baseClass="sp-up" visibleClass="vis">
          <StudentExams examData={examData} />
        </Reveal>
        <Reveal baseClass="sp-up" visibleClass="vis">
          <StudentAchievements regno={student.register_no} achievements={achievements} onSaved={onAchievementSaved} />
        </Reveal>
      </div>
    </div>
  )
}
