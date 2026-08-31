import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { galleryCategories } from '@/data/campusLife'
import { useGalleryMedia } from '@/hooks/useGalleryMedia'
import SectionTitle from './SectionTitle'
import SmartImage from './SmartImage'
import { staggerContainer, staggerItem } from './Reveal'

function Lightbox({ items, index, onClose, onNavigate }) {
  const item = items[index]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/92 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Close image viewer"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onNavigate(-1)
        }}
        className="absolute left-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>

      <motion.figure
        key={item.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[85svh] w-full max-w-4xl"
      >
        {item.isVideo ? (
          <video
            src={item.url}
            controls
            autoPlay
            loop
            playsInline
            className="max-h-[78svh] w-full rounded-2xl bg-black object-contain"
          />
        ) : (
          <img
            src={item.url}
            alt={item.alt}
            className="max-h-[78svh] w-full rounded-2xl object-contain"
          />
        )}
        <figcaption className="mt-3 text-center text-sm text-white/70">
          {item.alt} — {index + 1} of {items.length}
        </figcaption>
      </motion.figure>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onNavigate(1)
        }}
        className="absolute right-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>
    </motion.div>
  )
}

export function Gallery({
  limit,
  showFilters = true,
  title = 'Campus Gallery',
  subtitle = 'Images and videos from across our 65-acre campus — updated automatically.',
  background = 'muted',
}) {
  const { items, status } = useGalleryMedia()
  const [category, setCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const availableCategories = useMemo(() => {
    const present = new Set(items.map((item) => item.category))
    return galleryCategories.filter((name) => name === 'All' || present.has(name))
  }, [items])

  const filtered = useMemo(() => {
    const list = category === 'All' ? items : items.filter((item) => item.category === category)
    return limit ? list.slice(0, limit) : list
  }, [items, category, limit])

  const bgClass =
    background === 'white'
      ? 'bg-white dark:bg-surface-dark'
      : 'bg-surface-muted dark:bg-surface-dark-muted/40'

  const navigate = (direction) => {
    setLightboxIndex((current) => {
      if (current == null) return current
      return (current + direction + filtered.length) % filtered.length
    })
  }

  return (
    <section className={`${bgClass} py-16 sm:py-20 lg:py-24`}>
      <div className="container">
        <SectionTitle eyebrow="Gallery" title={title} subtitle={subtitle} />

        {showFilters && availableCategories.length > 2 ? (
          <div className="mt-9 flex flex-wrap justify-center gap-2">
            {availableCategories.map((name) => {
              const active = category === name
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategory(name)}
                  aria-pressed={active}
                  className={`min-h-[44px] rounded-xl px-4 text-sm font-bold transition-all duration-300 ${
                    active
                      ? 'bg-brand-gradient text-white shadow-brand'
                      : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:text-brand-700 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10 dark:hover:text-white'
                  }`}
                >
                  {name}
                </button>
              )
            })}
          </div>
        ) : null}

        {status === 'loading' ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <li
                key={index}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200 dark:bg-white/5"
              />
            ))}
          </ul>
        ) : filtered.length === 0 ? (
          <p className="mt-10 text-center text-sm prose-muted">
            No media available in this category yet.
          </p>
        ) : (
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {filtered.map((item, index) => (
              <motion.li key={item.id} variants={staggerItem}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative block w-full overflow-hidden rounded-2xl focus-visible:ring-offset-4"
                  aria-label={`View ${item.alt}`}
                >
                  {item.isVideo ? (
                    <video
                      src={item.url}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
                    />
                  ) : (
                    <SmartImage
                      src={item.url}
                      alt={item.alt}
                      wrapperClassName="aspect-[4/3] w-full"
                      className="h-full w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
                    />
                  )}
                  <span
                    className="absolute inset-0 bg-brand-950/0 transition-colors duration-300 group-hover:bg-brand-950/35"
                    aria-hidden="true"
                  />
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex != null ? (
          <Lightbox
            items={filtered}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={navigate}
          />
        ) : null}
      </AnimatePresence>
    </section>
  )
}

export default Gallery
