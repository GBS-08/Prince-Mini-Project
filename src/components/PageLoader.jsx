import { college } from '@/data/college'

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 py-24">
      <img
        src={college.logo}
        alt=""
        width="56"
        height="56"
        className="h-14 w-14 animate-pulse rounded-full bg-white object-contain ring-1 ring-black/5"
      />
      <span className="h-1 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <span className="block h-full w-1/3 animate-[marquee_1.2s_linear_infinite] rounded-full bg-brand-gradient" />
      </span>
      <p className="text-sm font-semibold prose-muted">{label}</p>
    </div>
  )
}

export default PageLoader
