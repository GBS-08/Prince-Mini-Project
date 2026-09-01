import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 90

/** Drifting white specks over the home hero (canvas port of Home.js initParticles). */
export default function HeroParticles({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let frame = 0
    let resizeTimer = 0

    const resize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    const spawn = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.2,
      a: Math.random() * 0.6 + 0.2,
    })

    resize()
    let particles = Array.from({ length: PARTICLE_COUNT }, spawn)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      particles = particles.map((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.a})`
        ctx.fill()
        const next = { ...p, x: p.x + p.vx, y: p.y + p.vy }
        if (next.x < -5 || next.x > width + 5 || next.y < -5 || next.y > height + 5) return spawn()
        return next
      })
      frame = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 120)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
