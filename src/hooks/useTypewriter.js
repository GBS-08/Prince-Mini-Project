import { useEffect, useState } from 'react'

/**
 * Types / deletes an array of phrases, mirroring the hero typewriter timings
 * from the original Home.js (52ms per char, 24ms per delete, 1.2s lead-in).
 */
export default function useTypewriter(phrases, { typeMs = 52, deleteMs = 24, startDelay = 1200 } = {}) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (!phrases.length) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(phrases[0])
      return undefined
    }

    let phraseIdx = 0
    let charIdx = 0
    let deleting = false
    let pauseTicks = 0
    let timer = 0
    let cancelled = false

    const tick = () => {
      if (cancelled) return
      const phrase = phrases[phraseIdx]

      if (pauseTicks > 0) {
        pauseTicks -= 1
        timer = window.setTimeout(tick, 60)
        return
      }

      if (!deleting) {
        setText(phrase.slice(0, charIdx))
        charIdx += 1
        if (charIdx > phrase.length) {
          pauseTicks = 28
          deleting = true
        }
        timer = window.setTimeout(tick, typeMs)
      } else {
        setText(phrase.slice(0, charIdx))
        charIdx -= 1
        if (charIdx < 0) {
          deleting = false
          phraseIdx = (phraseIdx + 1) % phrases.length
          charIdx = 0
          pauseTicks = 8
        }
        timer = window.setTimeout(tick, deleteMs)
      }
    }

    timer = window.setTimeout(tick, startDelay)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [phrases, typeMs, deleteMs, startDelay])

  return text
}
