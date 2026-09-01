import { useMemo } from 'react'
import PortalPending from './PortalPending'

const R = 54
const CIRC = 2 * Math.PI * R

function StatBox({ value, label, icon, iconBg, iconColor, cardBg, sub }) {
  return (
    <div className="sp-glass st-att-stat" style={{ background: cardBg }}>
      <div className="st-att-stat-ico" style={{ background: iconBg, color: iconColor }}>
        <i className={icon} aria-hidden="true" />
      </div>
      <span className="st-att-num" style={{ color: iconColor }}>
        {value}
      </span>
      <span className="st-att-lbl">{label}</span>
      {sub && (
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: iconColor, opacity: 0.75, marginTop: 2 }}>
          {sub}
        </span>
      )}
    </div>
  )
}

/**
 * Attendance card — the daily-average calculation engine from Student.js:
 * each working day contributes `presentPeriods / totalPeriods`, and the final
 * percentage is the mean of those daily values across all working days.
 */
export default function StudentAttendance({ info, records }) {
  const stats = useMemo(() => {
    const byDate = {}
    records.forEach((r) => {
      const date = (r.session_date || '').split('T')[0]
      if (!date) return
      if (!byDate[date]) byDate[date] = { present: 0, absent: 0, total: 0 }
      byDate[date].total += 1
      if (r.status === 'present') byDate[date].present += 1
      else byDate[date].absent += 1
    })

    const workingDates = Object.keys(byDate).sort()
    const D = workingDates.length

    let sumP = 0
    let sumA = 0
    let totalPeriods = 0
    let presentPeriods = 0
    let absentPeriods = 0

    workingDates.forEach((date) => {
      const day = byDate[date]
      sumP += day.total > 0 ? day.present / day.total : 0
      sumA += day.total > 0 ? day.absent / day.total : 0
      totalPeriods += day.total
      presentPeriods += day.present
      absentPeriods += day.absent
    })

    const hasRecords = records.length > 0
    const storedTotal = info?.total_days || 0
    const storedPresent = info?.present_days || 0

    const presentPct = hasRecords
      ? D > 0
        ? (sumP / D) * 100
        : 0
      : storedTotal > 0
        ? (storedPresent / storedTotal) * 100
        : 0
    const absentPct = hasRecords
      ? D > 0
        ? (sumA / D) * 100
        : 0
      : storedTotal > 0
        ? ((storedTotal - storedPresent) / storedTotal) * 100
        : 0

    const todayISO = new Date().toISOString().split('T')[0]
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 6)
    const cutoffISO = cutoff.toISOString().split('T')[0]

    const last7 = workingDates
      .filter((d) => d >= cutoffISO && d <= todayISO)
      .map((d) => {
        const day = byDate[d]
        return {
          date: d,
          present: day.present,
          total: day.total,
          pct: day.total > 0 ? Number(((day.present / day.total) * 100).toFixed(0)) : 0,
        }
      })

    return {
      D: hasRecords ? D : storedTotal,
      P: hasRecords ? sumP : storedPresent,
      A: hasRecords ? sumA : Math.max(0, storedTotal - storedPresent),
      sumP,
      totalPeriods,
      presentPeriods,
      absentPeriods,
      workingDays: D,
      pNum: parseFloat(presentPct.toFixed(1)),
      aNum: parseFloat(absentPct.toFixed(1)),
      last7,
      cutoffISO,
      todayISO,
    }
  }, [info, records])

  if (!info && records.length === 0) {
    return (
      <PortalPending
        icon="fas fa-calendar-times"
        bg="rgba(59,130,246,0.12)"
        color="#93c5fd"
        title="Attendance Not Updated Yet"
        subtitle="Your teacher hasn't recorded any sessions yet. Check back after classes begin."
      />
    )
  }

  const { pNum, aNum, D, P, A } = stats
  const color = pNum >= 75 ? 'var(--sp-green)' : pNum >= 65 ? 'var(--sp-gold)' : 'var(--sp-red)'
  const dashoff = CIRC * (1 - Math.min(pNum, 100) / 100)

  let warnClass = 'saw-good'
  let warning = '✅ Good standing! Attendance meets the 75% requirement.'
  if (pNum < 65) {
    warnClass = 'saw-bad'
    warning = '🚨 Critical attendance! Immediate improvement required to avoid debarment.'
  } else if (pNum < 75) {
    warnClass = 'saw-mid'
    const need = Math.max(0, Math.ceil((0.75 * stats.workingDays - stats.sumP) / 0.25))
    warning = `⚠️ Low attendance! Need ${need} more consecutive full-day attendances to reach 75%.`
  }

  const absentSessions = records.filter((r) => r.status === 'absent')

  return (
    <div className="sp-glass st-att-card">
      <div className="st-att-heading">
        <i className="fas fa-calendar-check" aria-hidden="true" /> Attendance Record
      </div>

      <div className="st-att-body">
        <div className="st-donut-wrap">
          <svg viewBox="0 0 124 124" className="st-donut-svg" aria-hidden="true">
            <circle cx="62" cy="62" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <circle
              cx="62"
              cy="62"
              r={R}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRC.toFixed(2)}
              strokeDashoffset={dashoff.toFixed(2)}
              style={{
                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.2,0.64,1)',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
                filter: `drop-shadow(0 0 7px ${color})`,
              }}
            />
          </svg>
          <div className="st-donut-center">
            <span className="st-donut-pct" style={{ color }}>
              {pNum.toFixed(1)}%
            </span>
            <span className="st-donut-lbl">Attendance</span>
          </div>
        </div>

        <div className="st-att-stats">
          <StatBox
            value={Number(P).toFixed(2)}
            label="Present Days"
            icon="fas fa-check"
            iconBg="rgba(16,185,129,0.14)"
            iconColor="var(--sp-green)"
            cardBg="rgba(16,185,129,0.1)"
            sub={`${pNum.toFixed(1)}%`}
          />
          <StatBox
            value={Number(A).toFixed(2)}
            label="Absent Days"
            icon="fas fa-times"
            iconBg="rgba(244,63,94,0.14)"
            iconColor="var(--sp-red)"
            cardBg="rgba(244,63,94,0.1)"
            sub={`${aNum.toFixed(1)}%`}
          />
          <StatBox
            value={D}
            label="Working Days"
            icon="fas fa-calendar-alt"
            iconBg="rgba(59,130,246,0.14)"
            iconColor="#93c5fd"
            cardBg="rgba(59,130,246,0.1)"
            sub="Total"
          />
        </div>
      </div>

      <div className="st-att-periods">
        <span className="st-att-periods-lbl">
          <i className="fas fa-clock" style={{ color: 'var(--sp-cyan)' }} aria-hidden="true" /> Periods:
        </span>
        <span style={{ color: 'var(--sp-green)', fontWeight: 700 }}>
          <i className="fas fa-check-circle" aria-hidden="true" /> {stats.presentPeriods} Present
        </span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
        <span style={{ color: 'var(--sp-red)', fontWeight: 700 }}>
          <i className="fas fa-times-circle" aria-hidden="true" /> {stats.absentPeriods} Absent
        </span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
        <span style={{ color: '#93c5fd', fontWeight: 700 }}>
          <i className="fas fa-list" aria-hidden="true" /> {stats.totalPeriods} Total
        </span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
        <span style={{ color: 'var(--sp-muted)', fontWeight: 700 }}>
          <i className="fas fa-calendar" aria-hidden="true" /> {stats.workingDays} Working Days
        </span>
      </div>

      <div className={`st-att-warn ${warnClass}`}>{warning}</div>

      {stats.last7.length > 0 && (
        <div className="st-day-stats">
          <div className="st-abs-title" style={{ marginBottom: 10 }}>
            <i className="fas fa-chart-bar" aria-hidden="true" /> Daily Attendance — Last 7 Days
            <span style={{ marginLeft: 8, fontSize: '0.68rem', opacity: 0.65, fontWeight: 600 }}>
              ({stats.cutoffISO} to {stats.todayISO})
            </span>
          </div>
          <div className="st-day-grid">
            {stats.last7.map((day) => {
              const dayColor = day.pct >= 75 ? 'var(--sp-green)' : day.pct >= 50 ? 'var(--sp-gold)' : 'var(--sp-red)'
              const isToday = day.date === stats.todayISO
              const dateStr = new Date(`${day.date}T00:00:00`).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
              })
              return (
                <div
                  key={day.date}
                  className="st-day-card"
                  style={
                    isToday ? { border: '1px solid var(--sp-cyan)', background: 'rgba(0,245,212,0.06)' } : undefined
                  }
                >
                  <div
                    className="st-day-date"
                    style={isToday ? { color: 'var(--sp-cyan)', fontWeight: 900 } : undefined}
                  >
                    {dateStr}
                    {isToday && (
                      <>
                        <br />
                        <span style={{ fontSize: '0.55rem', color: 'var(--sp-cyan)' }}>TODAY</span>
                      </>
                    )}
                  </div>
                  <div className="st-day-bar-wrap">
                    <div className="st-day-bar" style={{ height: `${day.pct}%`, background: dayColor }} />
                  </div>
                  <div className="st-day-pct" style={{ color: dayColor }}>
                    {day.pct}%
                  </div>
                  <div className="st-day-sub">
                    {day.present}/{day.total} periods
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {absentSessions.length > 0 && (
        <div className="st-abs-wrap">
          <div className="st-abs-title">
            <i className="fas fa-times-circle" aria-hidden="true" /> Absent Sessions ({absentSessions.length})
          </div>
          <div className="st-abs-chips">
            {absentSessions.map((r, index) => {
              const raw = (r.session_date || '').split('T')[0]
              const dateStr = raw
                ? new Date(`${raw}T00:00:00`).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: '2-digit',
                  })
                : '—'
              return (
                <span className="st-abs-chip" key={`${raw}-${r.period}-${index}`}>
                  <i className="fas fa-calendar-times" aria-hidden="true" />
                  {dateStr}
                  {r.period ? ` · P${r.period}` : ''}
                  {r.subject_name ? ` · ${r.subject_name}` : ''}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
