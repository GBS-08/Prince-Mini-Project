import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Clock, ExternalLink, MapPin, Users } from 'lucide-react'
import { LucideIcon } from './icons'
import SmartImage from './SmartImage'
import { staggerItem } from './Reveal'

const TONE_STYLES = {
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200',
  gold: 'bg-gold-50 text-gold-600 dark:bg-gold-900/30 dark:text-gold-300',
  leaf: 'bg-leaf-50 text-leaf-600 dark:bg-leaf-900/30 dark:text-leaf-300',
  sky: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300',
}

export function toneClass(tone) {
  return TONE_STYLES[tone] ?? TONE_STYLES.brand
}

export { LucideIcon }

export function ProgramCard({ program, onSelect }) {
  return (
    <motion.article
      variants={staggerItem}
      className="surface-card group flex h-full flex-col overflow-hidden transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:shadow-elevated"
    >
      <SmartImage
        src={program.image}
        alt={`${program.shortTitle} programme`}
        wrapperClassName="aspect-[16/10] w-full"
        className="h-full w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col p-5">
        <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          {program.badge} • {program.duration}
        </span>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-slate-900 dark:text-white">
          {program.shortTitle}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed prose-muted">{program.summary}</p>
        <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            <dt className="sr-only">Seats</dt>
            <dd>{program.seats} Seats</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <dt className="sr-only">Duration</dt>
            <dd>{program.duration}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => onSelect(program)}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 dark:bg-white/5 dark:text-brand-200 dark:hover:bg-white/10"
        >
          Learn More
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  )
}

export function DepartmentCard({ department }) {
  return (
    <motion.article
      variants={staggerItem}
      className="surface-card group flex h-full flex-col overflow-hidden transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:shadow-elevated"
    >
      <div className="relative">
        <SmartImage
          src={department.image}
          alt={`${department.name} department`}
          wrapperClassName="aspect-[16/9] w-full"
          className="h-full w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-brand-700 shadow-soft backdrop-blur dark:bg-surface-dark/90 dark:text-brand-200">
          <LucideIcon name={department.icon} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[0.7rem] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
          {department.level} • {department.duration}
        </span>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-slate-900 dark:text-white">
          {department.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed prose-muted">{department.summary}</p>
        {department.focus.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {department.focus.map((topic) => (
              <li
                key={topic}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.7rem] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300"
              >
                {topic}
              </li>
            ))}
          </ul>
        ) : null}
        <a
          href={department.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 dark:bg-white/5 dark:text-brand-200 dark:hover:bg-white/10"
        >
          View Department
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  )
}

export function FacilityCard({ facility }) {
  return (
    <motion.article
      variants={staggerItem}
      className="surface-card group relative h-full overflow-hidden p-6 transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:shadow-elevated"
    >
      {facility.count ? (
        <span className="absolute right-5 top-5 font-display text-3xl font-extrabold text-slate-100 transition-colors group-hover:text-brand-100 dark:text-white/5 dark:group-hover:text-white/10">
          {facility.count}
        </span>
      ) : null}
      <span
        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${toneClass(facility.tone)}`}
      >
        <LucideIcon name={facility.icon} className="h-6 w-6" />
      </span>
      <h3 className="relative mt-4 font-display text-lg font-bold text-slate-900 dark:text-white">
        {facility.name}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed prose-muted">{facility.description}</p>
      {facility.points ? (
        <ul className="relative mt-4 space-y-1.5">
          {facility.points.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm prose-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      ) : null}
      {facility.tags ? (
        <ul className="relative mt-4 flex flex-wrap gap-1.5">
          {facility.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.7rem] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </motion.article>
  )
}

export function NewsCard({ notice, action }) {
  return (
    <motion.article
      variants={staggerItem}
      className="surface-card group flex h-full flex-col overflow-hidden transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:shadow-elevated"
    >
      <span
        className={`h-1.5 w-full ${
          notice.tone === 'leaf'
            ? 'bg-leaf-400'
            : notice.tone === 'rose'
              ? 'bg-rose-500'
              : 'bg-sky-500'
        }`}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider ${toneClass(notice.tone)}`}
          >
            <span aria-hidden="true">{notice.emoji}</span>
            {notice.typeLabel}
          </span>
          {notice.registrationCount != null ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[0.7rem] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
              <Users className="h-3 w-3" aria-hidden="true" />
              {notice.registrationCount} Registered
            </span>
          ) : null}
        </div>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-slate-900 dark:text-white">
          {notice.title}
        </h3>
        <dl className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <dt className="sr-only">Date</dt>
            <dd>{notice.dateLabel}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <dt className="sr-only">Time</dt>
            <dd>{notice.time || 'All Day'}</dd>
          </div>
        </dl>
        {notice.description ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed prose-muted">{notice.description}</p>
        ) : (
          <div className="flex-1" />
        )}
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </motion.article>
  )
}

export function EventCard({ event, action }) {
  return (
    <motion.article
      variants={staggerItem}
      className="surface-card flex h-full flex-col gap-3 p-5 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-gradient text-white">
          <span className="font-display text-xl font-extrabold leading-none">{event.day}</span>
          <span className="text-[0.65rem] font-bold uppercase tracking-wider">{event.month}</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold leading-snug text-slate-900 dark:text-white">
            {event.title}
          </h3>
          <dl className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <dt className="sr-only">Time</dt>
              <dd>{event.time || 'All Day'}</dd>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <dt className="sr-only">Location</dt>
              <dd>{event.location}</dd>
            </div>
          </dl>
        </div>
      </div>
      {event.description ? (
        <p className="flex-1 text-sm leading-relaxed prose-muted">{event.description}</p>
      ) : (
        <div className="flex-1" />
      )}
      {action}
    </motion.article>
  )
}

export function CampusCard({ item }) {
  return (
    <motion.article
      variants={staggerItem}
      className="group relative h-full overflow-hidden rounded-2xl"
    >
      <SmartImage
        src={item.image}
        alt={item.title}
        wrapperClassName="aspect-[4/3] w-full"
        className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-110"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-950/92 via-brand-950/40 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="inline-flex rounded-full bg-gold-gradient px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-white">
          {item.tag}
        </span>
        <h3 className="mt-2.5 font-display text-lg font-bold text-white">{item.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-white/75">{item.description}</p>
      </div>
    </motion.article>
  )
}

export function LinkCard({ to, title, description, icon }) {
  return (
    <Link
      to={to}
      className="surface-card group flex items-start gap-4 p-5 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card"
    >
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
        <LucideIcon name={icon} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-display text-base font-bold text-slate-900 dark:text-white">
          {title}
          <ArrowUpRight
            className="h-4 w-4 text-brand-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
        <span className="mt-1 block text-sm leading-relaxed prose-muted">{description}</span>
      </span>
    </Link>
  )
}
