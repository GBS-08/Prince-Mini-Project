import { useEffect, useRef, useState } from 'react'

/**
 * Adds the `is-visible` state to an element once it scrolls into the viewport.
 * Mirrors the IntersectionObserver reveal used by the original `shared.js`.
 */
export default function useScrollReveal({
  threshold = 0.07,
  rootMargin = '0px 0px -24px 0px',
  immediate = false,
} = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(immediate)

  useEffect(() => {
    if (immediate) {
      setVisible(true)
      return undefined
    }
    const node = ref.current
    if (!node) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, immediate])

  return [ref, visible]
}
