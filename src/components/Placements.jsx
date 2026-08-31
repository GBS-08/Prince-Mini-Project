import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { placementStats, recruiters } from '@/data/placements'
import Button from './Button'
import CountUp from './CountUp'
import SectionTitle from './SectionTitle'
import { staggerContainer, staggerItem } from './Reveal'

export function Placements({ showCta = true }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 py-16 sm:py-20 lg:py-24">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(57,73,171,0.35),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(255,152,0,0.18),transparent_50%)]"
        aria-hidden="true"
      />
      <div className="container">
        <SectionTitle
          tone="light"
          eyebrow="Careers"
          title="Placement Highlights"
          subtitle="Our students are placed in leading technology and engineering companies across India."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-10">
          <motion.dl
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-1"
          >
            {placementStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="rounded-2xl bg-white/5 p-5 ring-1 ring-inset ring-white/10 backdrop-blur transition-transform duration-300 hover:-translate-y-1"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-extrabold text-gold-300 sm:text-4xl">
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals ?? 0}
                    />
                  </span>
                  <span className="mt-1 block text-sm font-medium text-white/70">{stat.label}</span>
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          <div className="lg:col-span-3">
            <h3 className="font-display text-lg font-bold text-white">Top Recruiters</h3>
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            >
              {recruiters.map((recruiter) => (
                <motion.li
                  key={recruiter.name}
                  variants={staggerItem}
                  className="flex h-20 items-center justify-center rounded-xl bg-white/95 p-3 transition-transform duration-300 hover:-translate-y-1 hover:shadow-elevated"
                >
                  <img
                    src={recruiter.logo}
                    alt={recruiter.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-10 w-auto max-w-[85%] object-contain"
                    onError={(event) => {
                      const target = event.currentTarget
                      target.style.display = 'none'
                      target.parentElement.textContent = recruiter.name
                      target.parentElement.classList.add(
                        'font-display',
                        'text-sm',
                        'font-bold',
                        'text-brand-700',
                      )
                    }}
                  />
                </motion.li>
              ))}
            </motion.ul>

            {showCta ? (
              <div className="mt-8">
                <Button to="/placements" variant="glass" size="lg">
                  Explore Placement Support
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Placements
