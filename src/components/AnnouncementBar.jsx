import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import { announcements } from '@/data/announcements'
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion'

const STORAGE_KEY = 'pdkv-announcement-dismissed'
const ROTATE_MS = 6000

export function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) !== '1',
  )
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!visible || announcements.length <= 1) return undefined
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % announcements.length),
      ROTATE_MS,
    )
    return () => window.clearInterval(timer)
  }, [visible])

  if (!visible) return null

  const item = announcements[index]

  return (
    <div className="relative z-[60] bg-brand-950 text-white">
      <div className="container flex min-h-[44px] items-center justify-center gap-3 py-2 pr-10 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={item.id}
            initial={prefersReduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.8rem] font-medium sm:text-sm"
          >
            <span aria-hidden="true">{item.emoji}</span>
            <span>{item.message}</span>
            <Link
              to={item.to}
              className="link-underline inline-flex items-center gap-1 font-bold text-gold-300"
            >
              {item.linkLabel}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </motion.p>
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={() => {
          setVisible(false)
          sessionStorage.setItem(STORAGE_KEY, '1')
        }}
        className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export default AnnouncementBar
