import { Clock, Globe, Mail, MapPin, Navigation, Phone } from 'lucide-react'
import { college } from '@/data/college'
import SectionTitle from './SectionTitle'
import { staggerContainer, staggerItem } from './Reveal'
import { motion } from 'framer-motion'

const contactCards = [
  {
    title: 'Phone',
    icon: Phone,
    lines: college.phones,
    action: { label: 'Call Now', href: college.primaryPhoneHref },
  },
  {
    title: 'Email',
    icon: Mail,
    lines: [college.email],
    action: { label: 'Send Email', href: `mailto:${college.email}` },
  },
  {
    title: 'Office Hours',
    icon: Clock,
    lines: ['Mon – Sat', '9:00 AM – 5:00 PM'],
  },
  {
    title: 'Location',
    icon: MapPin,
    lines: [college.address.line1, college.address.line2],
    action: { label: 'Get Directions', href: college.mapsLink, external: true },
  },
  {
    title: 'Website',
    icon: Globe,
    lines: [college.websiteLabel, `TNEA Code: ${college.tneaCode}`],
    action: { label: 'Visit Site', href: college.website, external: true },
  },
]

export function ContactSection({ background = 'white' }) {
  const bgClass =
    background === 'white'
      ? 'bg-white dark:bg-surface-dark'
      : 'bg-surface-muted dark:bg-surface-dark-muted/40'

  return (
    <section className={`${bgClass} py-16 sm:py-20 lg:py-24`}>
      <div className="container">
        <SectionTitle
          eyebrow="Get in Touch"
          title="Student Support & Enquiries"
          subtitle="We're here to help you at every step — from admissions to campus life."
        />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {contactCards.map((card) => {
            const Icon = card.icon
            return (
              <motion.li
                key={card.title}
                variants={staggerItem}
                className="surface-card flex h-full flex-col p-6 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold">{card.title}</h3>
                <div className="mt-2 flex-1 space-y-0.5 text-sm prose-muted">
                  {card.lines.map((line) => (
                    <p key={line} className="break-words">
                      {line}
                    </p>
                  ))}
                </div>
                {card.action ? (
                  <a
                    href={card.action.href}
                    target={card.action.external ? '_blank' : undefined}
                    rel={card.action.external ? 'noopener noreferrer' : undefined}
                    className="mt-4 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-xl bg-slate-50 px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 dark:bg-white/5 dark:text-brand-200 dark:hover:bg-white/10"
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    {card.action.label}
                  </a>
                ) : null}
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}

export default ContactSection
