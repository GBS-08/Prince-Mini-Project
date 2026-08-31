import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, ChevronDown, GraduationCap, Sparkles } from 'lucide-react'
import heroImage from '@/assets/campus-hero.jpg'
import heroImageSmall from '@/assets/campus-hero-sm.jpg'
import { college, heroPhrases, heroStats } from '@/data/college'
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion'
import Button from './Button'
import CountUp from './CountUp'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

function useTypewriter(phrases, enabled) {
  const [text, setText] = useState(phrases[0])

  useEffect(() => {
    if (!enabled) {
      setText(phrases[0])
      return undefined
    }

    let phraseIndex = 0
    let charIndex = 0
    let deleting = false
    let timeout

    const tick = () => {
      const phrase = phrases[phraseIndex]
      if (!deleting) {
        charIndex += 1
        setText(phrase.slice(0, charIndex))
        if (charIndex >= phrase.length) {
          deleting = true
          timeout = window.setTimeout(tick, 2200)
          return
        }
        timeout = window.setTimeout(tick, 45)
      } else {
        charIndex -= 1
        setText(phrase.slice(0, charIndex))
        if (charIndex <= 0) {
          deleting = false
          phraseIndex = (phraseIndex + 1) % phrases.length
          timeout = window.setTimeout(tick, 320)
          return
        }
        timeout = window.setTimeout(tick, 22)
      }
    }

    setText('')
    timeout = window.setTimeout(tick, 900)
    return () => window.clearTimeout(timeout)
  }, [phrases, enabled])

  return text
}

export function Hero() {
  const prefersReduced = usePrefersReducedMotion()
  const typed = useTypewriter(heroPhrases, !prefersReduced)

  return (
    <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32">
      <picture className="absolute inset-0 -z-20">
        <source media="(max-width: 640px)" srcSet={heroImageSmall} />
        <img
          src={heroImage}
          alt={`${college.name} main campus building`}
          className="h-full w-full object-cover"
          // Spread keeps the lowercase DOM attribute React 18 expects (React 19
          // renamed it to fetchPriority); either way the browser gets fetchpriority="high".
          {...{ fetchpriority: 'high' }}
          loading="eager"
          decoding="async"
          width="1408"
          height="768"
        />
      </picture>
      <div className="absolute inset-0 -z-10 bg-hero-veil" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-surface-muted to-transparent dark:from-surface-dark"
        aria-hidden="true"
      />

      <div className="container">
        <motion.div variants={container} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-gold-300 ring-1 ring-inset ring-white/20 backdrop-blur-sm"
          >
            <Award className="h-4 w-4" aria-hidden="true" />
            NAAC A+ Accredited Institution
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-5 text-display-lg font-extrabold text-white text-shadow-hero"
          >
            Empowering Minds.
            <span className="mt-1 block bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              Building the Future.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 max-w-2xl font-display text-lg font-semibold text-white/90 sm:text-xl"
          >
            {college.name}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-3 min-h-[3.25rem] max-w-2xl text-base leading-relaxed text-white/75 sm:min-h-[2rem] sm:text-lg"
            aria-live="polite"
          >
            {typed}
            {prefersReduced ? null : (
              <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-gold-400 align-middle" />
            )}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Button to="/academics" size="lg">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
              Explore Programs
            </Button>
            <Button to="/admissions#apply" variant="glass" size="lg">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Apply Now
            </Button>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/10 p-4 text-center ring-1 ring-inset ring-white/15 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-extrabold text-white sm:text-3xl">
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals ?? 0}
                    />
                  </span>
                  <span className="mt-1 block text-[0.7rem] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-5 left-1/2 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/25 backdrop-blur transition hover:bg-white/20 lg:inline-flex"
        aria-label="Scroll to about section"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  )
}

export default Hero
