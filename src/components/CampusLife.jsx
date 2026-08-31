import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { campusLifeHighlights } from '@/data/campusLife'
import Button from './Button'
import SectionTitle from './SectionTitle'
import { CampusCard } from './cards'
import { staggerContainer } from './Reveal'

export function CampusLife({ limit, showCta = true, background = 'white' }) {
  const items = limit ? campusLifeHighlights.slice(0, limit) : campusLifeHighlights
  const bgClass =
    background === 'white'
      ? 'bg-white dark:bg-surface-dark'
      : 'bg-surface-muted dark:bg-surface-dark-muted/40'

  return (
    <section className={`${bgClass} py-16 sm:py-20 lg:py-24`}>
      <div className="container">
        <SectionTitle
          eyebrow="Campus Life"
          title="Life beyond the classroom"
          subtitle="Clubs, festivals, sports and student organisations that shape well-rounded engineers."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <CampusCard key={item.title} item={item} />
          ))}
        </motion.div>

        {showCta ? (
          <div className="mt-10 text-center">
            <Button to="/campus-life" variant="secondary" size="lg">
              Discover Campus Life
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default CampusLife
