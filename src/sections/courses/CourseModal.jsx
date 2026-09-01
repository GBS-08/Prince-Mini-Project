import Modal from '../../components/Modal'

/** Course detail dialog (`#courseModal`) — image, badges, description, highlights. */
export default function CourseModal({ course, onClose }) {
  return (
    <Modal open={Boolean(course)} onClose={onClose} title={course?.title || 'Course Details'} size="lg">
      {course && (
        <>
          <div className="group relative mb-4 h-[220px] overflow-hidden rounded-md">
            <img
              src={course.img}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-[550ms] group-hover:scale-105"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-md bg-[linear-gradient(180deg,transparent_58%,rgba(26,35,126,0.52)_100%)]"
            />
          </div>

          <div className="mb-2 flex flex-wrap gap-2.5">
            <span className={`badge ${course.badgeClass}`}>{course.badge}</span>
            <span className="badge badge-green">
              <i className="fas fa-users" /> {course.seats}
            </span>
            <span className="badge badge-gold">
              <i className="fas fa-clock" /> {course.duration}
            </span>
          </div>

          <p className="my-4 mb-5 text-[clamp(0.9rem,1.5vw,1rem)] leading-[1.8] text-ink-body">{course.desc}</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {course.highlights.map((highlight, index) => (
              <span
                key={highlight}
                style={{ animationDelay: `${0.05 * (index + 1)}s` }}
                className="inline-flex animate-modal-in items-center gap-[5px] rounded-full border border-accent/[0.22] bg-accent/[0.09] px-[13px] py-[5px] text-[0.78rem] font-bold text-accent-dark transition-all duration-[280ms] ease-bounce hover:-translate-y-0.5 hover:scale-[1.06] hover:bg-accent/[0.18]"
              >
                <i className="fas fa-check-circle text-[0.72rem] text-accent" aria-hidden="true" /> {highlight}
              </span>
            ))}
          </div>

          <a
            href={course.link}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary mt-2 w-full justify-center"
          >
            <i className="fas fa-external-link-alt" /> Learn More on College Website
          </a>
        </>
      )}
    </Modal>
  )
}
