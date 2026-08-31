import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import PageHero from '@/components/PageHero'
import AboutSection from '@/components/AboutSection'
import SectionTitle from '@/components/SectionTitle'
import StatCard from '@/components/StatCard'
import Button from '@/components/Button'
import ContactSection from '@/components/ContactSection'
import CtaBanner from '@/components/CtaBanner'
import { aboutStats, college } from '@/data/college'
import { staggerContainer, staggerItem } from '@/components/Reveal'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'
import campusImage from '@/assets/campus-hero.jpg'

export default function About() {
  usePageMeta(pageSeo.about)

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Our legacy, values and vision"
        description="Founded in 2009 by Prince Educational Society, we have grown into a NAAC A+ accredited institution serving over 2,400 students across engineering and management disciplines."
        image={campusImage}
      >
        <Button href={college.website} target="_blank" rel="noopener noreferrer" variant="glass">
          Visit Official Website
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PageHero>

      <section className="bg-surface-muted py-16 dark:bg-surface-dark-muted/40 sm:py-20">
        <div className="container">
          <SectionTitle
            eyebrow="By the Numbers"
            title="An institution built to scale"
            subtitle="Our campus, faculty and student community continue to grow year after year."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {aboutStats.map((stat) => (
              <motion.div key={stat.label} variants={staggerItem}>
                <StatCard {...stat} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AboutSection />
      <ContactSection background="muted" />
      <CtaBanner />
    </>
  )
}
