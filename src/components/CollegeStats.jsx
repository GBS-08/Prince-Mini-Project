import { motion } from 'framer-motion'
import { Award, CalendarDays, MapPinned, University } from 'lucide-react'
import { institutionFacts } from '@/data/college'
import SectionTitle from './SectionTitle'
import { staggerContainer, staggerItem } from './Reveal'
import { toneClass } from './cards'

const ICONS = {
  calendar: CalendarDays,
  university: University,
  award: Award,
  map: MapPinned,
}

export function CollegeStats() {
  return (
    <section className="bg-surface-muted py-16 dark:bg-surface-dark-muted/40 sm:py-20">
      <div className="container">
        <SectionTitle
          eyebrow="At a Glance"
          title="About Our Institution"
          subtitle="Established in 2009 and accredited NAAC A+, we combine academic rigour with a campus built for modern engineering education."
        />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {institutionFacts.map((fact) => {
            const Icon = ICONS[fact.icon] ?? Award
            return (
              <motion.li
                key={fact.title}
                variants={staggerItem}
                className="surface-card h-full p-6 transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:shadow-card"
              >
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${toneClass(fact.tone)}`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold">{fact.title}</h3>
                <p className="mt-2 text-sm leading-relaxed prose-muted">{fact.description}</p>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}

export default CollegeStats
