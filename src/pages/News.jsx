import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BellRing, RefreshCw, Search, TriangleAlert } from 'lucide-react'
import PageHero from '@/components/PageHero'
import Button from '@/components/Button'
import CtaBanner from '@/components/CtaBanner'
import EventRegisterModal from '@/components/EventRegisterModal'
import { NewsCard } from '@/components/cards'
import { staggerContainer } from '@/components/Reveal'
import { TextInput } from '@/components/FormField'
import { useNotices } from '@/hooks/useNotices'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pageSeo } from '@/lib/seo'
import campusImage from '@/assets/campus-hero.jpg'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'event', label: 'Events' },
  { id: 'exam', label: 'Exams' },
  { id: 'notice', label: 'Notices' },
]

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

export default function News() {
  usePageMeta(pageSeo.news)

  const { notices, status, error, reload } = useNotices()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [activeNotice, setActiveNotice] = useState(null)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return notices.filter((notice) => {
      const matchesFilter = filter === 'all' || notice.type === filter
      if (!matchesFilter) return false
      if (!term) return true
      return [notice.title, notice.description, notice.location]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term))
    })
  }, [notices, filter, query])

  const counts = useMemo(
    () => ({
      all: notices.length,
      event: notices.filter((notice) => notice.type === 'event').length,
      exam: notices.filter((notice) => notice.type === 'exam').length,
      notice: notices.filter((notice) => notice.type === 'notice').length,
    }),
    [notices],
  )

  return (
    <>
      <PageHero
        eyebrow="Notice Board"
        title="News, events & announcements"
        description="Official notices, upcoming events and examination announcements — updated live from the college notice board."
        image={campusImage}
      />

      <section className="bg-surface-muted py-14 dark:bg-surface-dark-muted/40 sm:py-16">
        <div className="container">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => {
                const active = filter === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    aria-pressed={active}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-bold transition-all duration-300 ${
                      active
                        ? 'bg-brand-gradient text-white shadow-brand'
                        : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:text-brand-700 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.68rem] ${
                        active ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10'
                      }`}
                    >
                      {counts[item.id]}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2 lg:w-80">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <TextInput
                  id="notice-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search notices…"
                  aria-label="Search notices"
                  className="pl-10"
                />
              </div>
              <button
                type="button"
                onClick={reload}
                className="inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-inset ring-slate-200 transition-colors hover:text-brand-700 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10 dark:hover:text-white"
                aria-label="Refresh notices"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-10" aria-live="polite">
            {status === 'loading' ? (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <NoticeSkeleton key={index} />
                ))}
              </ul>
            ) : status === 'error' || status === 'unavailable' ? (
              <div className="surface-card mx-auto max-w-lg p-10 text-center">
                <TriangleAlert
                  className="mx-auto h-10 w-10 text-gold-500"
                  aria-hidden="true"
                />
                <p className="mt-4 text-sm prose-muted">
                  {status === 'unavailable'
                    ? 'The notice board is temporarily unavailable. Please try again later.'
                    : `Unable to load notices. ${error ?? ''}`}
                </p>
                <Button variant="outline" onClick={reload} className="mt-5">
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Try Again
                </Button>
              </div>
            ) : filtered.length ? (
              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((notice) => (
                  <NewsCard
                    key={notice.id}
                    notice={notice}
                    action={
                      notice.type !== 'notice' && notice.isUpcoming ? (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => setActiveNotice(notice)}
                        >
                          Register Now
                        </Button>
                      ) : null
                    }
                  />
                ))}
              </motion.ul>
            ) : (
              <div className="surface-card mx-auto max-w-lg p-10 text-center">
                <BellRing
                  className="mx-auto h-10 w-10 text-slate-300 dark:text-white/20"
                  aria-hidden="true"
                />
                <p className="mt-4 text-sm prose-muted">
                  No notices match your search. Try a different filter or keyword.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {activeNotice ? (
        <EventRegisterModal
          notice={activeNotice}
          onClose={() => setActiveNotice(null)}
          onRegistered={reload}
        />
      ) : null}

      <CtaBanner />
    </>
  )
}
