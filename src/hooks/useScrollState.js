import { useEffect, useState } from 'react'

/** Tracks vertical scroll offset and the document scroll progress (0-100). */
export default function useScrollState(threshold = 60) {
  const [state, setState] = useState({ scrolled: false, progress: 0, past: false })

  useEffect(() => {
    let frame = 0

    const read = () => {
      const y = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setState({
        scrolled: y > threshold,
        progress: docHeight > 0 ? (y / docHeight) * 100 : 0,
        past: y > 400,
      })
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [threshold])

  return state
}
