import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Clock, ExternalLink, Users, X } from 'lucide-react'
import { courseCategories, courses } from '@/data/courses'
import Button from './Button'
import SectionTitle from './SectionTitle'
import SmartImage from './SmartImage'
import { ProgramCard } from './cards'
import { staggerContainer } from './Reveal'

function ProgramModal({ program, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="program-modal-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-elevated dark:bg-surface-dark-muted sm:rounded-3xl"
      >
        <div className="relative">
          <SmartImage
            src={program.image}
            alt={program.title}
            wrapperClassName="aspect-[16/9] w-full sm:rounded-t-3xl"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur transition hover:bg-slate-900"
            aria-label="Close programme details"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <h2 id="program-modal-title" className="font-display text-2xl font-extrabold">
            {program.title}
          </h2>

          <ul className="mt-4 flex flex-wrap gap-2">
            <li className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              {program.badge}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-700 dark:bg-leaf-900/30 dark:text-leaf-300">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {program.seats} Seats
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1 text-xs font-bold text-gold-700 dark:bg-gold-900/30 dark:text-gold-300">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {program.duration}
            </li>
          </ul>

          <p className="mt-5 text-[0.95rem] leading-relaxed prose-muted">{program.description}</p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {program.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700 dark:bg-white/5 dark:text-slate-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button to="/admissions#apply" className="flex-1">
              Apply for this Programme
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              href={program.link}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="flex-1"
            >
              Learn More
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Programs({
  limit,
  showFilters = true,
  eyebrow = 'Academics',
  title = 'Academic Programs',
  subtitle = 'Undergraduate, postgraduate and management programmes affiliated to Anna University and approved by AICTE.',
  background = 'muted',
}) {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const visible = useMemo(() => {
    const list = filter === 'all' ? courses : courses.filter((course) => course.category === filter)
    return limit ? list.slice(0, limit) : list
  }, [filter, limit])

  const bgClass =
    background === 'white'
      ? 'bg-white dark:bg-surface-dark'
      : 'bg-surface-muted dark:bg-surface-dark-muted/40'

  return (
    <section id="programs" className={`${bgClass} py-16 sm:py-20 lg:py-24`}>
      <div className="container">
        <SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />

        {showFilters ? (
          <div
            className="mt-9 flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Filter programmes by level"
          >
            {courseCategories.map((category) => {
              const active = filter === category.id
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(category.id)}
                  className={`min-h-[44px] rounded-xl px-4 text-sm font-bold transition-all duration-300 ${
                    active
                      ? 'bg-brand-gradient text-white shadow-brand'
                      : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:text-brand-700 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10 dark:hover:text-white'
                  }`}
                >
                  {category.label}
                </button>
              )
            })}
          </div>
        ) : null}

        <motion.div
          key={filter}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((program) => (
            <ProgramCard key={program.id} program={program} onSelect={setSelected} />
          ))}
        </motion.div>

        {limit ? (
          <div className="mt-10 text-center">
            <Button to="/academics" variant="secondary" size="lg">
              View All Programs
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {selected ? <ProgramModal program={selected} onClose={() => setSelected(null)} /> : null}
      </AnimatePresence>
    </section>
  )
}

export default Programs
