import { ExternalLink, Mail, Phone } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionTitle from '@/components/SectionTitle'
import Button from '@/components/Button'
import ContactSection from '@/components/ContactSection'
import ContactForm from '@/components/ContactForm'
import Reveal from '@/components/Reveal'
import { college } from '@/data/college'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'
import campusImage from '@/assets/campus-hero.jpg'

export default function Contact() {
  usePageMeta(pageSeo.contact)

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="We would love to hear from you"
        description={`${college.address.line1}, ${college.address.line2}. Our office is open ${college.officeHours}.`}
        image={campusImage}
      >
        <div className="flex flex-wrap gap-3">
          <Button href={college.primaryPhoneHref} variant="glass">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {college.phones[0]}
          </Button>
          <Button href={`mailto:${college.email}`} variant="glass">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email Us
          </Button>
        </div>
      </PageHero>

      <ContactSection background="white" />

      <section className="bg-surface-muted py-16 dark:bg-surface-dark-muted/40 sm:py-20">
        <div className="container">
          <SectionTitle
            eyebrow="Enquiry Form"
            title="Ask us anything"
            subtitle="Admissions, courses, hostel, transport or campus visits — send your question and we will respond."
          />

          <div className="mt-11 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <ContactForm />

            <Reveal direction="left" className="space-y-6">
              <div className="surface-card overflow-hidden">
                <iframe
                  src={college.mapEmbed}
                  title={`Map showing the location of ${college.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-[320px] w-full border-0 sm:h-[380px]"
                />
              </div>

              <div className="surface-card p-6">
                <h3 className="font-display text-lg font-bold">Visit the Campus</h3>
                <address className="mt-3 not-italic text-sm leading-relaxed prose-muted">
                  {college.name}
                  <br />
                  {college.address.line1}
                  <br />
                  {college.address.line2}
                  <br />
                  {college.address.state}, India
                </address>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-slate-700 dark:text-slate-200">Phone:</dt>
                    <dd className="prose-muted">{college.phones.join(' • ')}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-slate-700 dark:text-slate-200">Email:</dt>
                    <dd>
                      <a
                        href={`mailto:${college.email}`}
                        className="link-underline font-semibold text-brand-700 dark:text-brand-200"
                      >
                        {college.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-slate-700 dark:text-slate-200">
                      Office Hours:
                    </dt>
                    <dd className="prose-muted">{college.officeHours}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-slate-700 dark:text-slate-200">TNEA Code:</dt>
                    <dd className="prose-muted">{college.tneaCode}</dd>
                  </div>
                </dl>
                <Button
                  href={college.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  className="mt-5"
                >
                  Open in Google Maps
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
