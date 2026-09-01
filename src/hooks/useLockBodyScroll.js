import { useEffect } from 'react'

/** Prevents background scrolling while a modal / mobile menu is open. */
export default function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}
