import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../services/supabase'
import fallbackImage from '../assets/images/College_Image.png'

const ROTATE_INTERVAL = 6000
const SHOW_DELAY = 1200
const SESSION_KEY = 'pdkv_ads_dismissed'

/**
 * Floating promotional card fed by the Supabase `ads` table.
 * Home page only — rotates every 6s, pauses on hover, and collapses to a
 * gift-icon launcher once dismissed for the session.
 */
export default function FloatingAds() {
  const [ads, setAds] = useState([])
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [launcher, setLauncher] = useState(false)
  const [paused, setPaused] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    let showTimer

    const load = async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })

      if (error || !mounted.current) return

      const now = new Date()
      const active = (data || []).filter((ad) => {
        if (ad.ends_at && new Date(ad.ends_at) < now) return false
        if (ad.starts_at && new Date(ad.starts_at) > now) return false
        return true
      })

      if (!active.length) return
      setAds(active)

      if (sessionStorage.getItem(SESSION_KEY) === '1') {
        setLauncher(true)
      } else {
        showTimer = window.setTimeout(() => mounted.current && setVisible(true), SHOW_DELAY)
      }
    }

    load()
    return () => window.clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    if (!visible || paused || ads.length <= 1) return undefined
    const id = window.setInterval(() => setIndex((i) => (i + 1) % ads.length), ROTATE_INTERVAL)
    return () => window.clearInterval(id)
  }, [visible, paused, ads.length])

  const dismiss = useCallback(() => {
    setVisible(false)
    sessionStorage.setItem(SESSION_KEY, '1')
    setLauncher(true)
  }, [])

  const reopen = useCallback(() => {
    setLauncher(false)
    setVisible(true)
  }, [])

  const ad = ads[index]
  const openLink = useCallback(() => {
    if (ad?.link_url) window.location.href = ad.link_url
  }, [ad])

  if (!ads.length) return null

  return (
    <>
      <div
        className={`fixed right-[18px] top-[15%] z-[7000] w-[min(320px,calc(100vw-32px))] -translate-y-1/2 transition-[transform,opacity] duration-[550ms] ease-soft max-md:bottom-[86px] max-md:right-1/2 max-md:top-auto max-md:w-[min(260px,calc(100vw-32px))] max-md:translate-x-1/2 max-md:translate-y-0 ${
          visible
            ? 'pointer-events-auto translate-x-0 opacity-100 max-md:translate-y-0'
            : 'pointer-events-none translate-x-[120%] opacity-0 max-md:translate-x-1/2 max-md:translate-y-[120%]'
        }`}
        aria-hidden={!visible}
      >
        <div
          className="relative animate-ads-float overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_18px_48px_rgba(26,35,126,0.22),0_4px_14px_rgba(0,0,0,0.10)] transition-[box-shadow,transform] duration-[350ms] ease-bounce hover:scale-[1.02] hover:[animation-play-state:paused] hover:shadow-[0_24px_60px_rgba(26,35,126,0.30),0_6px_18px_rgba(0,0,0,0.14)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span className="absolute left-2 top-2 z-[3] rounded-full border border-white/[0.18] bg-[rgba(8,10,28,0.55)] px-[9px] py-[3px] text-[0.62rem] font-extrabold uppercase tracking-[0.08em] text-mint backdrop-blur-[6px]">
            <i className="fas fa-bullhorn" aria-hidden="true" /> Ad
          </span>

          <button
            type="button"
            aria-label="Close ad"
            title="Close"
            onClick={dismiss}
            className="absolute right-2 top-2 z-[3] flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-[rgba(8,10,28,0.55)] text-[0.85rem] text-white backdrop-blur-[6px] transition-all duration-[280ms] ease-bounce hover:rotate-90 hover:scale-[1.12] hover:bg-danger"
          >
            <i className="fas fa-times" aria-hidden="true" />
          </button>

          <div className="group relative aspect-[16/9] w-full cursor-pointer overflow-hidden" onClick={openLink}>
            <img
              src={ad?.image_url || fallbackImage}
              alt={ad?.title || 'Advertisement'}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = fallbackImage
              }}
              className="h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.08]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(13,21,85,0.55)_100%)]"
            />
          </div>

          <div className="px-4 pb-4 pt-3.5">
            <button
              type="button"
              onClick={openLink}
              className="mb-1.5 block cursor-pointer border-0 bg-transparent p-0 text-left font-heading text-[0.96rem] font-extrabold leading-[1.3] text-primary"
            >
              {ad?.title}
            </button>
            <p className="mb-3 line-clamp-3 text-[0.80rem] leading-[1.55] text-ink-muted">{ad?.description}</p>
            <button
              type="button"
              onClick={openLink}
              className="group/cta flex w-full cursor-pointer items-center justify-center gap-[7px] rounded-full border-0 bg-gradient-to-br from-accent to-accent-dark p-2.5 font-body text-[0.85rem] font-bold text-white shadow-[0_4px_14px_rgba(76,175,80,0.30)] transition-all duration-[320ms] ease-bounce hover:-translate-y-0.5 hover:scale-[1.02] hover:from-accent-dark hover:to-accent hover:shadow-[0_8px_22px_rgba(76,175,80,0.42)]"
            >
              <span>{ad?.button_text || 'Learn More'}</span>
              <i
                className="fas fa-arrow-right transition-transform duration-[250ms] group-hover/cta:translate-x-[3px]"
                aria-hidden="true"
              />
            </button>

            {ads.length > 1 && (
              <div className="mt-2.5 flex justify-center gap-[5px]">
                {ads.map((item, i) => (
                  <button
                    key={item.id ?? i}
                    type="button"
                    aria-label={`Show ad ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 cursor-pointer rounded-full border-0 transition-all duration-300 ${
                      i === index ? 'w-4 bg-accent' : 'w-1.5 bg-line'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Show offers"
        title="Show offers"
        onClick={reopen}
        tabIndex={launcher ? 0 : -1}
        className={`fixed bottom-24 right-[22px] z-[6999] flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full border-0 bg-gradient-to-br from-primary to-primary-light text-[1.2rem] text-white shadow-[0_8px_24px_rgba(26,35,126,0.36)] transition-all duration-[400ms] ease-bounce hover:scale-110 max-md:bottom-[86px] max-md:right-4 ${
          launcher
            ? 'pointer-events-auto animate-ads-launcher-pulse scale-100 opacity-100'
            : 'pointer-events-none scale-[0.6] opacity-0'
        }`}
      >
        <i className="fas fa-gift" aria-hidden="true" />
      </button>
    </>
  )
}
