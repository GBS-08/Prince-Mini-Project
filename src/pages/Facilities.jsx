import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionTitle from '@/components/SectionTitle'
import SmartImage from '@/components/SmartImage'
import CtaBanner from '@/components/CtaBanner'
import { FacilityCard, LucideIcon } from '@/components/cards'
import Reveal, { staggerContainer, staggerItem } from '@/components/Reveal'
import {
  academicInfrastructure,
  auditorium,
  canteen,
  clubs,
  committees,
  facilityHighlights,
  facilitySections,
  hostel,
  sports,
  transport,
} from '@/data/facilities'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'
import campusImage from '@/assets/campus-hero.jpg'

function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`scroll-mt-28 py-16 sm:py-20 ${className}`}>
      <div className="container">{children}</div>
    </section>
  )
}

export default function Facilities() {
  usePageMeta(pageSeo.facilities)

  return (
    <>
      <PageHero
        eyebrow="Campus Facilities"
        title="A 65-acre campus built for learning"
        description="Smart classrooms, advanced laboratories, hostels, sports grounds, an auditorium and a fleet of buses covering 35+ routes across Chennai."
        image={campusImage}
      >
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facilityHighlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-inset ring-white/20 backdrop-blur"
            >
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block font-display text-2xl font-extrabold text-gold-300">
                  {item.value}
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-white/70">
                  {item.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Quick nav */}
      <nav
        aria-label="Facilities sections"
        className="sticky top-[72px] z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-surface-dark/90"
      >
        <div className="container">
          <ul className="scrollbar-none flex gap-2 overflow-x-auto py-3">
            {facilitySections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <LucideIcon name={section.icon} className="h-4 w-4" />
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Clubs */}
      <Section id="clubs" className="bg-white dark:bg-surface-dark">
        <SectionTitle
          eyebrow="Student Clubs"
          title="Clubs & student chapters"
          subtitle="Over 20 active clubs give students a place to build, compete, perform and lead."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {clubs.map((club) => (
            <FacilityCard key={club.name} facility={club} />
          ))}
        </motion.div>

        <Reveal className="surface-card mt-10 p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold">Statutory Committees & Cells</h3>
          <p className="mt-2 text-sm prose-muted">
            Mandated committees that safeguard student welfare, equity and grievance redressal.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {committees.map((committee) => (
              <li
                key={committee.name}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  <LucideIcon name={committee.icon} className="h-4 w-4" />
                </span>
                {committee.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* Hostel */}
      <Section id="hostel" className="bg-surface-muted dark:bg-surface-dark-muted/40">
        <SectionTitle eyebrow="Hostel" title={hostel.title} subtitle={hostel.description} />
        <div className="mt-11 grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal direction="right">
            <SmartImage
              src={hostel.image}
              alt="Hostel accommodation at PDKV College"
              wrapperClassName="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-card"
              className="h-full w-full object-cover"
            />
          </Reveal>
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {hostel.features.map((feature) => (
              <motion.li
                key={feature.title}
                variants={staggerItem}
                className="surface-card p-4"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-leaf-500"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-sm font-bold">{feature.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed prose-muted">{feature.detail}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Section>

      {/* Canteen */}
      <Section id="canteen" className="bg-white dark:bg-surface-dark">
        <SectionTitle
          eyebrow="Dining"
          title="Canteen & food services"
          subtitle="Hygienic, affordable meals and snacks available across campus through the day."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-11 grid gap-5 md:grid-cols-3"
        >
          {canteen.map((item) => (
            <FacilityCard key={item.name} facility={item} />
          ))}
        </motion.div>
      </Section>

      {/* Sports */}
      <Section id="sports" className="bg-surface-muted dark:bg-surface-dark-muted/40">
        <SectionTitle
          eyebrow="Sports"
          title="Sports & fitness facilities"
          subtitle="Grounds, courts and a gymnasium supporting more than 10 competitive sports."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sports.map((sport) => (
            <motion.article
              key={sport.name}
              variants={staggerItem}
              className="surface-card group overflow-hidden"
            >
              <SmartImage
                src={sport.image}
                alt={sport.name}
                wrapperClassName="aspect-[16/10] w-full overflow-hidden"
                className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
              />
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                    <LucideIcon name={sport.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base font-bold">{sport.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed prose-muted">{sport.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Section>

      {/* Auditorium */}
      <Section id="auditorium" className="bg-white dark:bg-surface-dark">
        <SectionTitle eyebrow="Auditorium" title={auditorium.title} subtitle={auditorium.description} />
        <div className="mt-11 grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <dl className="grid grid-cols-2 gap-4">
              {auditorium.specs.map((spec) => (
                <div key={spec.label} className="surface-card p-5 text-center">
                  <dt className="sr-only">{spec.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-extrabold text-brand-700 dark:text-brand-200">
                      {spec.value}
                    </span>
                    <span className="mt-1 block text-xs font-semibold prose-muted">
                      {spec.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {auditorium.features.map((feature) => (
                <li
                  key={feature.label}
                  className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200"
                >
                  <LucideIcon name={feature.icon} className="h-4 w-4 shrink-0" />
                  {feature.label}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal direction="left">
            <SmartImage
              src={auditorium.image}
              alt="Auditorium at PDKV College"
              wrapperClassName="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-card"
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </Section>

      {/* Classrooms & labs */}
      <Section id="classrooms" className="bg-surface-muted dark:bg-surface-dark-muted/40">
        <SectionTitle
          eyebrow="Academic Infrastructure"
          title="Classrooms, laboratories & library"
          subtitle="Technology-enabled learning spaces supported by a 60,000+ volume central library."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {academicInfrastructure.map((item) => (
            <FacilityCard key={item.name} facility={item} />
          ))}
        </motion.div>
      </Section>

      {/* Transport */}
      <Section id="transport" className="bg-white dark:bg-surface-dark">
        <SectionTitle
          eyebrow="Transport"
          title="College bus network"
          subtitle={transport.description}
        />
        <motion.dl
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {transport.stats.map((stat) => (
            <motion.div key={stat.label} variants={staggerItem} className="surface-card p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-600 dark:bg-gold-900/30 dark:text-gold-300">
                <LucideIcon name={stat.icon} className="h-5 w-5" />
              </span>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="mt-4 block font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="mt-0.5 block text-sm prose-muted">{stat.label}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        <Reveal className="surface-card mt-8 p-6 sm:p-8">
          <h3 className="font-display text-lg font-bold">Major Routes Covered</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {transport.routes.map((route) => (
              <li
                key={route}
                className="rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
              >
                {route}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm prose-muted">{transport.note}</p>
        </Reveal>
      </Section>

      <CtaBanner
        title="Come see the campus for yourself"
        description="Schedule a campus visit with our admissions team and explore the facilities in person."
        primaryLabel="Plan a Visit"
        primaryTo="/contact"
      />
    </>
  )
}
