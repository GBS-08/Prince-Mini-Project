import { motion } from 'framer-motion'
import { ArrowLeft, Compass, Home } from 'lucide-react'
import Button from '@/components/Button'
import { LinkCard } from '@/components/cards'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'

const SUGGESTIONS = [
  { to: '/academics', title: 'Academic Programs', description: 'B.Tech, M.Tech and MBA courses', icon: 'GraduationCap' },
  { to: '/admissions', title: 'Admissions', description: 'Eligibility, process and apply online', icon: 'FileText' },
  { to: '/placements', title: 'Placements', description: 'Recruiters and placement support', icon: 'Briefcase' },
  { to: '/contact', title: 'Contact Us', description: 'Reach the college office', icon: 'Phone' },
]

export default function NotFound() {
  usePageMeta(pageSeo.notFound)

  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden bg-brand-950 py-24">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_25%,rgba(57,73,171,0.4),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(255,152,0,0.2),transparent_50%)]"
        aria-hidden="true"
      />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-gold-300 ring-1 ring-inset ring-white/20">
            <Compass className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="mt-6 font-display text-[5rem] font-extrabold leading-none text-white/15 sm:text-[7rem]">
            404
          </p>
          <h1 className="-mt-6 text-display-sm font-extrabold text-white sm:-mt-10">
            This page could not be found
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/70">
            The page you are looking for may have moved or no longer exists. Try one of the links
            below, or head back to the homepage.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/" size="lg">
              <Home className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Go Back
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2"
        >
          {SUGGESTIONS.map((item) => (
            <LinkCard key={item.to} {...item} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
