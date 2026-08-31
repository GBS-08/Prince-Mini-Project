import { motion } from 'framer-motion'
import PageHero from '@/components/PageHero'
import SectionTitle from '@/components/SectionTitle'
import CtaBanner from '@/components/CtaBanner'
import { DepartmentCard } from '@/components/cards'
import { departments, supportingDepartments } from '@/data/departments'
import { staggerContainer } from '@/components/Reveal'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'

export default function Departments() {
  usePageMeta(pageSeo.departments)

  return (
    <>
      <PageHero
        eyebrow="Departments"
        title="Engineering & management departments"
        description="Ten academic departments supported by dedicated laboratories, research facilities and experienced faculty."
        image="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <section className="bg-white py-16 dark:bg-surface-dark sm:py-20 lg:py-24">
        <div className="container">
          <SectionTitle
            eyebrow="Academic Departments"
            title="Where your specialisation begins"
            subtitle="Each department combines Anna University curriculum with modern laboratories and industry projects."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {departments.map((department) => (
              <DepartmentCard key={department.id} department={department} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-surface-muted py-16 dark:bg-surface-dark-muted/40 sm:py-20">
        <div className="container">
          <SectionTitle
            eyebrow="Foundation"
            title="Science & Humanities"
            subtitle="Core departments that deliver the foundational curriculum across all engineering programmes."
          />
          <ul className="mx-auto mt-9 flex max-w-3xl flex-wrap justify-center gap-3">
            {supportingDepartments.map((name) => (
              <li
                key={name}
                className="surface-card px-5 py-3 text-sm font-bold text-slate-700 transition-transform duration-300 hover:-translate-y-1 dark:text-slate-200"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
