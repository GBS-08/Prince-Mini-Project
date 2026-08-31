import { motion } from 'framer-motion'
import { CheckCircle2, FileText, Phone } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionTitle from '@/components/SectionTitle'
import Button from '@/components/Button'
import AdmissionForm from '@/components/AdmissionForm'
import AdmissionStatus from '@/components/AdmissionStatus'
import CtaBanner from '@/components/CtaBanner'
import { LucideIcon } from '@/components/cards'
import Reveal, { staggerContainer, staggerItem } from '@/components/Reveal'
import { admissionSteps, eligibility, requiredDocuments } from '@/data/admissions'
import { college } from '@/data/college'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'
import campusImage from '@/assets/campus-hero.jpg'

export default function Admissions() {
  usePageMeta(pageSeo.admissions)

  return (
    <>
      <PageHero
        eyebrow="Admissions 2026 – 27"
        title="Apply to PDKV College"
        description={`Admissions to B.Tech, M.Tech and MBA programmes are open. Apply through TNEA counselling (Code ${college.tneaCode}), TANCET or the management quota.`}
        image={campusImage}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="#apply">
            Start Application
            <FileText className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button href={college.primaryPhoneHref} variant="glass">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {college.phones[0]}
          </Button>
        </div>
      </PageHero>

      {/* Admission timeline */}
      <section className="bg-white py-16 dark:bg-surface-dark sm:py-20">
        <div className="container">
          <SectionTitle
            eyebrow="How to Apply"
            title="Your admission journey in five steps"
            subtitle="From checking eligibility to confirming your seat — here is exactly what to expect."
          />

          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
          >
            <span
              className="absolute left-0 right-0 top-7 hidden h-0.5 bg-gradient-to-r from-brand-100 via-brand-300 to-brand-100 dark:from-white/5 dark:via-white/20 dark:to-white/5 lg:block"
              aria-hidden="true"
            />
            {admissionSteps.map((item) => (
              <motion.li
                key={item.step}
                variants={staggerItem}
                className="surface-card relative z-10 p-6 text-center"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-brand">
                  <LucideIcon name={item.icon} className="h-6 w-6" />
                </span>
                <span className="mt-4 block font-display text-xs font-extrabold uppercase tracking-[0.16em] text-gold-600 dark:text-gold-400">
                  Step {item.step}
                </span>
                <h3 className="mt-1 font-display text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed prose-muted">{item.description}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* Eligibility + documents */}
      <section className="bg-surface-muted py-16 dark:bg-surface-dark-muted/40 sm:py-20">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
            <div>
              <SectionTitle
                align="left"
                eyebrow="Eligibility"
                title="Who can apply"
                subtitle="Requirements differ by programme level. Check the criteria that apply to you."
              />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="mt-8 grid gap-5 sm:grid-cols-2"
              >
                {eligibility.map((item) => (
                  <motion.article
                    key={item.programme}
                    variants={staggerItem}
                    className="surface-card p-6"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                      <LucideIcon name={item.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold">{item.programme}</h3>
                    <ul className="mt-3 space-y-2">
                      {item.requirements.map((requirement) => (
                        <li key={requirement} className="flex gap-2.5 text-sm leading-relaxed prose-muted">
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-leaf-500"
                            aria-hidden="true"
                          />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </motion.div>
            </div>

            <Reveal direction="left" className="surface-card p-6 sm:p-8 lg:sticky lg:top-28">
              <h3 className="font-display text-lg font-bold">Documents Required</h3>
              <p className="mt-2 text-sm prose-muted">
                Keep originals and two sets of photocopies ready for verification.
              </p>
              <ul className="mt-5 space-y-3">
                {requiredDocuments.map((document) => (
                  <li key={document} className="flex gap-3 text-sm leading-relaxed">
                    <FileText
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300"
                      aria-hidden="true"
                    />
                    <span className="prose-muted">{document}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-brand-50 p-4 text-sm dark:bg-brand-900/30">
                <p className="font-semibold text-brand-800 dark:text-brand-100">
                  Admissions Office
                </p>
                <p className="mt-1 prose-muted">{college.officeHours}</p>
                <a
                  href={`mailto:${college.email}`}
                  className="link-underline mt-1 inline-block font-semibold text-brand-700 dark:text-brand-200"
                >
                  {college.email}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="scroll-mt-24 bg-white py-16 dark:bg-surface-dark sm:py-20">
        <div className="container">
          <SectionTitle
            eyebrow="Online Application"
            title="Apply now in four simple steps"
            subtitle="Fill in your personal, academic and course preference details. Fields marked with * are required."
          />
          <div className="mt-12">
            <AdmissionForm />
          </div>
        </div>
      </section>

      {/* Status lookup */}
      <section className="bg-surface-muted py-16 dark:bg-surface-dark-muted/40 sm:py-20">
        <div className="container">
          <SectionTitle
            eyebrow="Track Application"
            title="Already applied?"
            subtitle="Check the status of an application you submitted earlier."
          />
          <div className="mt-10">
            <AdmissionStatus />
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
