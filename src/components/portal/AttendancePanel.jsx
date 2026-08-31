import { useMemo } from 'react'
import { CalendarX2, CheckCircle2, TriangleAlert } from 'lucide-react'
import { computeAttendance, formatDate } from '@/lib/portal'
import { PortalEmpty, PortalSection } from './PortalShell'

function Donut({ value }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(value, 100) / 100)
  const stroke = value >= 75 ? '#4caf50' : value >= 65 ? '#ff9800' : '#f43f5e'

  return (
    <svg viewBox="0 0 140 140" className="h-36 w-36" role="img" aria-label={`${value}% attendance`}>
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        strokeWidth="14"
        className="stroke-slate-200 dark:stroke-white/10"
      />
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        strokeWidth="14"
        stroke={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
        className="transition-[stroke-dashoffset] duration-1000 ease-smooth"
      />
      <text
        x="70"
        y="66"
        textAnchor="middle"
        className="fill-slate-900 font-display text-[1.6rem] font-extrabold dark:fill-white"
      >
        {value}%
      </text>
      <text
        x="70"
        y="86"
        textAnchor="middle"
        className="fill-slate-500 text-[0.7rem] font-bold uppercase tracking-wider dark:fill-slate-400"
      >
        Present
      </text>
    </svg>
  )
}

export function AttendancePanel({ records, stored, icon }) {
  const summary = useMemo(() => computeAttendance(records ?? [], stored), [records, stored])

  if (!summary.hasData) {
    return (
      <PortalSection title="Attendance" icon={icon}>
        <PortalEmpty
          icon={CalendarX2}
          title="Attendance Not Updated Yet"
          description="Your teacher hasn't recorded any sessions yet. Check back after classes begin."
        />
      </PortalSection>
    )
  }

  const { presentPct, absentPct, workingDays, effectivePresent, effectiveAbsent } = summary
  const good = presentPct >= 75

  return (
    <PortalSection title="Attendance" icon={icon}>
      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex justify-center">
          <Donut value={presentPct} />
        </div>

        <dl className="grid grid-cols-2 gap-3">
          {[
            ['Working Days', workingDays],
            ['Present (days)', effectivePresent.toFixed(2)],
            ['Absent (days)', effectiveAbsent.toFixed(2)],
            ['Absent %', `${absentPct}%`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-3.5 dark:bg-white/5">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {label}
              </dt>
              <dd className="mt-1 font-display text-xl font-extrabold text-slate-900 dark:text-white">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div
        className={`mt-5 flex items-start gap-3 rounded-xl p-4 text-sm font-semibold ${
          good
            ? 'bg-leaf-50 text-leaf-700 dark:bg-leaf-500/10 dark:text-leaf-300'
            : 'bg-gold-50 text-gold-700 dark:bg-gold-500/10 dark:text-gold-300'
        }`}
      >
        {good ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <p>
          {good
            ? 'Good standing! Your attendance meets the 75% requirement.'
            : `Low attendance. You need ${summary.neededDays} more consecutive full-day attendances to reach 75%.`}
        </p>
      </div>

      {summary.periodStats.length ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <caption className="sr-only">Day-wise attendance record</caption>
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:text-slate-400">
                <th scope="col" className="py-2.5">Date</th>
                <th scope="col" className="py-2.5">Present</th>
                <th scope="col" className="py-2.5">Absent</th>
                <th scope="col" className="py-2.5">Periods</th>
                <th scope="col" className="py-2.5">Day %</th>
              </tr>
            </thead>
            <tbody>
              {summary.periodStats
                .slice()
                .reverse()
                .slice(0, 15)
                .map((day) => {
                  const percentage = day.total ? (day.present / day.total) * 100 : 0
                  return (
                    <tr
                      key={day.date}
                      className="border-b border-slate-100 last:border-0 dark:border-white/5"
                    >
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-white">
                        {formatDate(day.date)}
                      </td>
                      <td className="py-2.5 text-leaf-600 dark:text-leaf-400">{day.present}</td>
                      <td className="py-2.5 text-rose-600 dark:text-rose-400">{day.absent}</td>
                      <td className="py-2.5 prose-muted">{day.total}</td>
                      <td className="py-2.5 font-bold">{percentage.toFixed(0)}%</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      ) : null}
    </PortalSection>
  )
}

export default AttendancePanel
