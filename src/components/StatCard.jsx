import CountUp from './CountUp'

const TONES = {
  brand: 'from-brand-500/15 to-brand-700/5 text-brand-700 dark:text-brand-200',
  gold: 'from-gold-400/20 to-gold-600/5 text-gold-600 dark:text-gold-300',
  leaf: 'from-leaf-400/20 to-leaf-600/5 text-leaf-600 dark:text-leaf-300',
  sky: 'from-sky-400/20 to-sky-700/5 text-sky-600 dark:text-sky-400',
}

export function StatCard({ value, suffix = '', decimals = 0, label, tone = 'brand', icon: Icon }) {
  return (
    <div className="surface-card group flex flex-col gap-2 p-5 transition-transform duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card sm:p-6">
      {Icon ? (
        <span
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${TONES[tone]}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      ) : null}
      <p className="font-display text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
        <CountUp value={value} suffix={suffix} decimals={decimals} />
      </p>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  )
}

export default StatCard
