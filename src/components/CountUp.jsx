import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion'

function format(value, decimals) {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function CountUp({ value, duration = 1600, decimals = 0, suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReduced = usePrefersReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return undefined
    if (prefersReduced) {
      setDisplay(value)
      return undefined
    }

    let frame
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration, prefersReduced])

  const final = `${prefix}${format(value, decimals)}${suffix}`

  return (
    <span ref={ref}>
      {/* The true value is always in the accessibility tree and in the served HTML;
          the animated digits are decorative. */}
      <span className="sr-only">{final}</span>
      <span aria-hidden="true">
        {prefix}
        {format(display, decimals)}
        {suffix}
      </span>
    </span>
  )
}

export default CountUp
