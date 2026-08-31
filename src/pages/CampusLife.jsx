import { motion } from 'framer-motion'
import PageHero from '@/components/PageHero'
import SectionTitle from '@/components/SectionTitle'
import CampusLifeSection from '@/components/CampusLife'
import Gallery from '@/components/Gallery'
import CtaBanner from '@/components/CtaBanner'
import { FacilityCard, LucideIcon } from '@/components/cards'
import { staggerContainer, staggerItem } from '@/components/Reveal'
import { clubs, committees } from '@/data/facilities'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'
import campusImage from '@/assets/campus-hero.jpg'

export default function CampusLife() {
  usePageMeta(pageSeo.campusLife)

  return (
    <>
      <PageHero
        eyebrow="Campus Life"
        title="More than a degree"
        description="Clubs, festivals, sports, hackathons and student-led organisations make the 65-acre PDKV campus a place to grow beyond the syllabus."
        image={campusImage}
      />

      <CampusLifeSection showCta={false} background="white" />

      <section className="bg-surface-muted py-16 dark:bg-surface-dark-muted/40 sm:py-20">
        <div className="container">
          <SectionTitle
            eyebrow="Clubs & Chapters"
            title="Find your community"
            subtitle="Every club is student-run, with faculty mentors and a calendar of events across the year."
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
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-surface-dark sm:py-20">
        <div className="container">
          <SectionTitle
            eyebrow="Student Welfare"
            title="Committees & support cells"
            subtitle="Statutory bodies that protect student rights, welfare and equal opportunity on campus."
          />
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {committees.map((committee) => (
              <motion.li
                key={committee.name}
                variants={staggerItem}
                className="surface-card flex items-center gap-3 p-4 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  <LucideIcon name={committee.icon} className="h-5 w-5" />
                </span>
                {committee.name}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      <Gallery
        limit={8}
        showFilters={false}
        title="Moments from campus"
        subtitle="A glimpse of events, activities and everyday life at PDKV."
      />

      <CtaBanner
        title="Be part of campus life at PDKV"
        description="Applications for the 2026–27 academic year are open across B.Tech, M.Tech and MBA programmes."
      />
    </>
  )
}
