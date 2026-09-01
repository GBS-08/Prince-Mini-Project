import { useEffect, useRef, useState } from 'react'

const DURATION = 1800

/**
 * Eased count-up animation, started the first time the element is in view.
 * Reproduces `animateCounter()` from the original shared.js (including the
 * en-IN thousands separators, 2-decimal handling and the `%` suffix).
 */
export default function useCountUp(target, { percent = false, duration = DURATION } = {}) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)
  const startedRef = useRef(false)

  const isDecimal = String(target).includes('.')

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setValue(Number(target))
      return undefined
    }

    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || startedRef.current) return
          startedRef.current = true
          observer.unobserve(entry.target)

          const start = performance.now()
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Number(target) * eased)
            if (progress < 1) frame = requestAnimationFrame(tick)
            else setValue(Number(target))
          }
          frame = requestAnimationFrame(tick)
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, duration])

  const rounded = isDecimal ? parseFloat(value.toFixed(2)) : Math.floor(value)
  const text = (isDecimal ? rounded.toFixed(2) : rounded.toLocaleString('en-IN')) + (percent ? '%' : '')

  return [ref, text]
}
