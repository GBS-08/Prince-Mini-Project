import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function PortalSection({ title, icon: Icon, action, children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`surface-card p-5 sm:p-6 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-bold">
          {Icon ? (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
          ) : null}
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </motion.section>
  )
}

export function PortalEmpty({ icon: Icon, title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
      {Icon ? (
        <Icon className="mx-auto h-10 w-10 text-slate-300 dark:text-white/20" aria-hidden="true" />
      ) : null}
      <p className="mt-4 font-display text-base font-bold">{title}</p>
      {description ? <p className="mt-1.5 text-sm prose-muted">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

export function PortalLoading({ label = 'Loading your portal…' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600" aria-hidden="true" />
      <p className="text-sm font-semibold prose-muted">{label}</p>
    </div>
  )
}

export function InfoItem({ icon: Icon, label, value, href }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 dark:bg-white/5">
      {Icon ? (
        <Icon
          className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300"
          aria-hidden="true"
        />
      ) : null}
      <div className="min-w-0">
        <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </dt>
        <dd className="mt-0.5 break-words text-sm font-semibold text-slate-800 dark:text-white">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-brand-700 dark:text-brand-200"
            >
              {value}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  )
}

export default PortalSection
