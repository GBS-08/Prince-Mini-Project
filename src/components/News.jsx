import { motion } from 'framer-motion'
import { ArrowRight, BellRing } from 'lucide-react'
import { useNotices } from '@/hooks/useNotices'
import Button from './Button'
import SectionTitle from './SectionTitle'
import { NewsCard } from './cards'
import { staggerContainer } from './Reveal'

function NoticeSkeleton() {
  return (
    <li className="surface-card h-56 animate-pulse p-5">
      <span className="block h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
      <span className="mt-4 block h-5 w-3/4 rounded bg-slate-200 dark:bg-white/10" />
      <span className="mt-3 block h-3 w-1/2 rounded bg-slate-200 dark:bg-white/10" />
      <span className="mt-5 block h-3 w-full rounded bg-slate-200 dark:bg-white/10" />
      <span className="mt-2 block h-3 w-5/6 rounded bg-slate-200 dark:bg-white/10" />
    </li>
  )
}

export function News({ limit = 3 }) {
  const { notices, status } = useNotices()
  const visible = notices.slice(0, limit)

  return (
    <section className="bg-surface-muted py-16 dark:bg-surface-dark-muted/40 sm:py-20 lg:py-24">
      <div className="container">
        <SectionTitle
          eyebrow="Notice Board"
          title="News & Announcements"
          subtitle="Events, examinations and official notices published by the college."
        />

        {status === 'loading' ? (
          <ul className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit }).map((_, index) => (
              <NoticeSkeleton key={index} />
            ))}
          </ul>
        ) : visible.length ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((notice) => (
              <NewsCard key={notice.id} notice={notice} />
            ))}
          </motion.div>
        ) : (
          <div className="surface-card mx-auto mt-11 max-w-lg p-10 text-center">
            <BellRing className="mx-auto h-10 w-10 text-slate-300 dark:text-white/20" aria-hidden="true" />
            <p className="mt-4 text-sm prose-muted">
              No notices published right now. Please check the notice board again soon.
            </p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Button to="/news" variant="secondary" size="lg">
            View Notice Board
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default News
