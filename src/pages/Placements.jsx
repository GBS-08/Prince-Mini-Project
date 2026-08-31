import { motion } from 'framer-motion'
import { ArrowRight, Briefcase } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionTitle from '@/components/SectionTitle'
import Button from '@/components/Button'
import PlacementsSection from '@/components/Placements'
import CtaBanner from '@/components/CtaBanner'
import { LucideIcon } from '@/components/cards'
import { staggerContainer, staggerItem } from '@/components/Reveal'
import { placementSupport, recruiters } from '@/data/placements'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'
import campusImage from '@/assets/campus-hero.jpg'

export default function Placements() {
  usePageMeta(pageSeo.placements)

  return (
    <>
      <PageHero
        eyebrow="Training & Placements"
        title="Careers that start here"
        description="82.37% of our eligible students were placed in 2024-25, with an average package of 8 LPA and a highest package of 25 LPA."
        image={campusImage}
      >
        <Button to="/admissions#apply">
          Apply for Admission
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PageHero>

      <PlacementsSection showCta={false} />

      <section className="bg-white py-16 dark:bg-surface-dark sm:py-20">
        <div className="container">
          <SectionTitle
            eyebrow="Placement Support"
            title="How we prepare students for recruitment"
            subtitle="Training, mentoring and industry connections that run through every year of the programme."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-11 grid gap-5 md:grid-cols-3"
          >
            {placementSupport.map((item) => (
              <motion.article key={item.title} variants={staggerItem} className="surface-card p-6">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  <LucideIcon name={item.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed prose-muted">{item.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-surface-muted py-16 dark:bg-surface-dark-muted/40 sm:py-20">
        <div className="container">
          <SectionTitle
            eyebrow="Our Recruiters"
            title="Companies that hire from PDKV"
            subtitle={`${recruiters.length} leading organisations have recruited from our campus.`}
          />
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-11 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {recruiters.map((recruiter) => (
              <motion.li
                key={recruiter.name}
                variants={staggerItem}
                className="surface-card flex h-24 items-center justify-center p-4 transition-transform duration-300 hover:-translate-y-1"
              >
                <img
                  src={recruiter.logo}
                  alt={recruiter.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-12 w-auto max-w-[85%] object-contain"
                  onError={(event) => {
                    const target = event.currentTarget
                    target.style.display = 'none'
                    target.parentElement.textContent = recruiter.name
                    target.parentElement.classList.add(
                      'font-display',
                      'text-sm',
                      'font-bold',
                      'text-brand-700',
                      'dark:text-brand-200',
                    )
                  }}
                />
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-10 flex justify-center">
            <Button to="/contact" variant="secondary" size="lg">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
              Recruit from PDKV
            </Button>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Build a career with industry-ready skills"
        description="Join a programme backed by a dedicated placement cell, structured training and strong recruiter relationships."
      />
    </>
  )
}
