import { useMemo, useState } from 'react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import CourseModal from '../sections/courses/CourseModal'
import AdmissionForm from '../sections/courses/AdmissionForm'
import AdmissionStatus from '../sections/courses/AdmissionStatus'
import usePageMeta from '../hooks/usePageMeta'
import { courseFilters, courses } from '../data/courses'

export default function Courses() {
  usePageMeta({
    title: 'Courses | Prince Dr. K. Vasudevan College of Engineering & Technology',
    description:
      'Explore B.Tech, M.Tech and MBA programs at Prince Dr. K. Vasudevan College of Engineering and Technology, Chennai — and apply online for admission.',
  })

  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)

  const visible = useMemo(
    () => (filter === 'all' ? courses : courses.filter((course) => course.category === filter)),
    [filter],
  )

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        overlay="linear-gradient(135deg, rgba(13,21,85,0.90), rgba(40,100,50,0.60))"
        height="min-h-[clamp(210px,35vw,350px)]"
        titleClassName="text-[clamp(2rem,5vw,3.5rem)] font-extrabold"
        contentClassName="px-6 py-10"
        title={
          <>
            <i className="fas fa-book-open" aria-hidden="true" /> Our Courses
          </>
        }
        subtitle="Explore world-class engineering & management programs"
      >
        <div className="mt-5">
          <a
            href="#admission"
            className="btn btn-primary !bg-[rgba(76,175,80,0.85)] backdrop-blur-[10px] hover:!bg-[rgba(76,175,80,0.95)]"
          >
            <i className="fas fa-file-alt" /> Apply for Admission
          </a>
        </div>
      </PageHero>

      {/* COURSES GRID */}
      <section className="section-block bg-[linear-gradient(135deg,#f0f4f8_0%,#e8f4fd_100%)]">
        <div className="container-page">
          <SectionHeading title="Academic Programs" largeGap />

          <Reveal
            as="div"
            className="mb-9 flex flex-wrap justify-center gap-2.5"
            role="group"
            aria-label="Filter courses by program type"
          >
            {courseFilters.map((item) => {
              const isActive = filter === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter(item.id)}
                  className={`cursor-pointer rounded-full border-2 px-6 py-2.5 font-body text-[0.86rem] font-bold transition-all duration-[320ms] ease-bounce ${
                    isActive
                      ? '-translate-y-[3px] scale-105 border-transparent bg-gradient-to-br from-primary to-primary-light text-white shadow-[0_10px_26px_rgba(26,35,126,0.32)]'
                      : 'border-line bg-white text-ink-body hover:-translate-y-0.5 hover:border-primary-light hover:text-primary'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </Reveal>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(285px,1fr))] gap-[26px]">
            {visible.map((course, index) => (
              <Reveal
                key={course.id}
                as="article"
                delay={index * 0.06}
                className="group cursor-pointer overflow-hidden rounded-[22px] bg-white shadow-md transition-all duration-[420ms] ease-soft hover:-translate-y-[14px] hover:scale-[1.02] hover:shadow-[0_28px_62px_rgba(26,35,126,0.16)]"
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${course.title}`}
                  onClick={() => setActive(course)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setActive(course)
                    }
                  }}
                >
                  <div className="relative h-[180px] overflow-hidden max-[480px]:h-[155px]">
                    <img
                      src={course.img}
                      alt={course.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[650ms] ease-smooth group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex translate-y-3 items-center justify-center gap-2 bg-[linear-gradient(135deg,rgba(26,35,126,0.72),rgba(33,150,243,0.55))] text-[0.96rem] font-bold tracking-[0.02em] text-white opacity-0 transition-[opacity,transform] duration-[320ms] group-hover:translate-y-0 group-hover:opacity-100">
                      <i className="fas fa-eye" aria-hidden="true" /> View Details
                    </div>
                  </div>

                  <div className="px-[18px] py-5">
                    <span className={`badge ${course.cardBadgeClass}`}>{course.cardBadge}</span>
                    <h3 className="mb-2 mt-2.5 font-heading text-[clamp(0.98rem,1.55vw,1.08rem)] font-bold leading-[1.35] text-primary transition-colors duration-[280ms] group-hover:text-accent2-dark">
                      {course.cardTitle}
                    </h3>
                    <p className="mb-[13px] text-[clamp(0.80rem,1.15vw,0.88rem)] leading-[1.62] text-ink-muted">
                      {course.cardText}
                    </p>
                    <div className="flex flex-wrap gap-[14px] text-[0.8rem] text-ink-muted">
                      <span className="flex items-center gap-[5px]">
                        <i className="fas fa-users text-accent" aria-hidden="true" /> {course.seats}
                      </span>
                      <span className="flex items-center gap-[5px]">
                        <i className="fas fa-clock text-accent" aria-hidden="true" /> {course.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="mt-8 text-center font-semibold text-ink-muted">No programs found for this filter.</p>
          )}
        </div>
      </section>

      {/* ADMISSION */}
      <section
        className="section-block relative overflow-hidden"
        id="admission"
        style={{ background: 'linear-gradient(140deg, #0d1555 0%, #1a237e 55%, #0d47a1 100%)' }}
      >
        <div className="container-page">
          <SectionHeading
            title={
              <>
                <i className="fas fa-file-alt" aria-hidden="true" /> Apply for Admission
              </>
            }
            subtitle="Fill in the form below to begin your application process"
            light
          />
          <AdmissionForm />
          <AdmissionStatus />
        </div>
      </section>

      <CourseModal course={active} onClose={() => setActive(null)} />
    </>
  )
}
