import { ArrowRight, Phone } from 'lucide-react'
import { college } from '@/data/college'
import Button from './Button'
import Reveal from './Reveal'

export function CtaBanner({
  title = 'Ready to begin your engineering journey?',
  description = 'Applications for the 2026–27 academic year are open. Apply online or talk to our admissions team today.',
  primaryLabel = 'Apply Now',
  primaryTo = '/admissions#apply',
}) {
  return (
    <section className="bg-white py-14 dark:bg-surface-dark sm:py-16">
      <div className="container">
        <Reveal className="relative isolate overflow-hidden rounded-3xl bg-brand-gradient px-6 py-12 text-center shadow-brand sm:px-10 sm:py-14">
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.16),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(255,152,0,0.22),transparent_45%)]"
            aria-hidden="true"
          />
          <h2 className="mx-auto max-w-2xl text-display-sm font-extrabold text-white">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to={primaryTo} variant="accent" size="lg">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href={college.primaryPhoneHref} variant="glass" size="lg">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {college.phones[0]}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default CtaBanner
