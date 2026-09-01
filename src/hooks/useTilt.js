import { useCallback, useRef } from 'react'

/**
 * Subtle pointer tilt used by the fact / quick-link / stat cards.
 * Returns handlers to spread onto the card element.
 */
export default function useTilt(strength = 4) {
  const ref = useRef(null)

  const onMouseMove = useCallback(
    (event) => {
      const card = ref.current
      if (!card) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const rect = card.getBoundingClientRect()
      const dx = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)
      const dy = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)
      card.style.transition = 'transform 0.12s ease'
      card.style.transform = `translateY(-10px) rotateX(${-dy * strength}deg) rotateY(${dx * strength}deg) scale(1.02)`
    },
    [strength],
  )

  const onMouseLeave = useCallback(() => {
    const card = ref.current
    if (!card) return
    card.style.transition = 'transform 0.55s cubic-bezier(0.34,1.2,0.64,1)'
    card.style.transform = ''
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
