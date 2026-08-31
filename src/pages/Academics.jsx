import { motion } from 'framer-motion'
import { GraduationCap, Layers, Microscope } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Programs from '@/components/Programs'
import SectionTitle from '@/components/SectionTitle'
import CtaBanner from '@/components/CtaBanner'
import { courses } from '@/data/courses'
import { supportingDepartments } from '@/data/departments'
import { staggerContainer, staggerItem } from '@/components/Reveal'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'

const levels = [
  {
    title: 'Undergraduate',
    icon: GraduationCap,
    description:
      'Seven four-year B.Tech programmes admitted through TNEA counselling (code 4116) and the management quota.',
    filter: (course) => course.category === 'btech',
  },
  {
    title: 'Postgraduate',
    icon: Microscope,
    description:
      'Two-year M.Tech and MBA programmes admitted through TANCET / GATE scores for advanced specialisation.',
    filter: (course) => course.category !== 'btech',
  },
]

export default function Academics() {
  usePageMeta(pageSeo.academics)

  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Programs designed for industry and research"
        description="Undergraduate, postgraduate and management programmes affiliated to Anna University, approved by AICTE and delivered by 183 faculty members."
        image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <section className="bg-white py-16 dark:bg-surface-dark sm:py-20">
        <div className="container">
          <SectionTitle
            eyebrow="Study Levels"
            title="Choose your academic pathway"
            subtitle="Every programme combines Anna University curriculum with hands-on laboratory and industry exposure."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-11 grid gap-5 md:grid-cols-2"
          >
            {levels.map((level) => {
              const Icon = level.icon
              const items = courses.filter(level.filter)
              return (
                <motion.article
                  key={level.title}
                  variants={staggerItem}
                  className="surface-card h-full p-7"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold">{level.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed prose-muted">{level.description}</p>
                  <ul className="mt-5 space-y-2">
                    {items.map((course) => (
                      <li
                        key={course.id}
                        className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm dark:bg-white/5"
                      >
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {course.shortTitle}
                        </span>
                        <span className="shrink-0 text-xs font-bold text-brand-600 dark:text-brand-300">
                          {course.duration}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              )
            })}
          </motion.div>

          <div className="surface-card mt-8 flex flex-col gap-4 p-7 sm:flex-row sm:items-center">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600 dark:bg-gold-900/30 dark:text-gold-300">
              <Layers className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold">Supporting Science & Humanities</h3>
              <p className="mt-1.5 text-sm prose-muted">
                Foundation departments that support every engineering programme:{' '}
                {supportingDepartments.join(', ')}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Programs background="muted" eyebrow="All Programs" title="Explore every programme" />
      <CtaBanner />
    </>
  )
}
