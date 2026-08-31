import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function PageHero({ eyebrow, title, description, image, children }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-900 pb-14 pt-32 sm:pb-16 sm:pt-36">
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="eager"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      ) : null}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-950/95 via-brand-900/90 to-brand-800/80"
        aria-hidden="true"
      />

      <div className="container">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1 text-xs font-semibold text-white/60"
        >
          <Link to="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-white/85">{title}</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {eyebrow ? (
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-gold-300 ring-1 ring-inset ring-white/20">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-3 text-display-md font-extrabold text-white text-shadow-hero">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </motion.div>
      </div>
    </section>
  )
}

export default PageHero
