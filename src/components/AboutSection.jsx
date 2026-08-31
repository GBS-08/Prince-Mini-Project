import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Eye, Target } from 'lucide-react'
import campusImage from '@/assets/campus-hero.jpg'
import { college } from '@/data/college'
import Button from './Button'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'

export function AboutSection({ showVisionMission = true }) {
  return (
    <section id="about" className="bg-white py-16 dark:bg-surface-dark sm:py-20 lg:py-24">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal direction="right" className="order-2 lg:order-1">
            <div className="relative">
              <img
                src={campusImage}
                alt={`${college.name} campus`}
                loading="lazy"
                decoding="async"
                width="1408"
                height="768"
                className="w-full rounded-3xl object-cover shadow-elevated"
              />
              <div className="absolute -bottom-6 -right-2 hidden rounded-2xl bg-brand-gradient p-5 text-white shadow-brand sm:block lg:-right-6">
                <p className="font-display text-3xl font-extrabold leading-none">
                  {college.campusAcres}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/80">
                  Acre Campus
                </p>
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionTitle
              align="left"
              eyebrow="Who We Are"
              title="A premier institution for engineering education"
              className="max-w-none"
            />
            <div className="mt-6 space-y-4">
              {college.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-[0.95rem] leading-relaxed prose-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            <ul id="accreditation" className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {college.accreditations.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700 dark:bg-white/5 dark:text-slate-300"
                >
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf-500" aria-hidden="true" />
                  {item}
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/about">
                Learn More About Us
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href={college.website} target="_blank" rel="noopener noreferrer" variant="outline">
                Visit Official Website
              </Button>
            </div>
          </div>
        </div>

        {showVisionMission ? (
          <div id="vision-mission" className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-2">
            <Reveal className="surface-card h-full p-7 sm:p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                <Eye className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold">Our Vision</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed prose-muted">{college.vision}</p>
            </Reveal>

            <Reveal delay={0.1} className="surface-card h-full p-7 sm:p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-600 dark:bg-gold-900/30 dark:text-gold-300">
                <Target className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold">Our Mission</h3>
              <ul className="mt-3 space-y-2.5">
                {college.mission.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-[0.95rem] prose-muted">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default AboutSection
