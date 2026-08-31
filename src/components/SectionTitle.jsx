import { motion } from 'framer-motion'

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'dark',
  as: Heading = 'h2',
  className = '',
}) {
  const alignment =
    align === 'left' ? 'items-start text-left' : 'items-center text-center mx-auto'
  const titleColor = tone === 'light' ? 'text-white' : 'text-slate-900 dark:text-white'
  const subtitleColor =
    tone === 'light' ? 'text-white/75' : 'text-slate-600 dark:text-slate-400'
  const eyebrowColor =
    tone === 'light'
      ? 'text-gold-300 bg-white/10 ring-white/20'
      : 'text-brand-700 bg-brand-50 ring-brand-100 dark:text-brand-200 dark:bg-brand-900/40 dark:ring-white/10'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`flex max-w-3xl flex-col gap-3 ${alignment} ${className}`}
    >
      {eyebrow ? (
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ring-1 ring-inset ${eyebrowColor}`}
        >
          {eyebrow}
        </span>
      ) : null}
      <Heading className={`text-display-sm ${titleColor}`}>{title}</Heading>
      <span
        className={`h-1 w-16 rounded-full bg-gold-gradient ${align === 'left' ? '' : 'mx-auto'}`}
        aria-hidden="true"
      />
      {subtitle ? <p className={`text-base leading-relaxed ${subtitleColor}`}>{subtitle}</p> : null}
    </motion.div>
  )
}

export default SectionTitle
