import { useEffect, useMemo, useState } from 'react'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { supabase, errorMessage } from '../services/supabase'
import usePageMeta from '../hooks/usePageMeta'
import collegeImage from '../assets/images/College_Image.png'

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : null

/**
 * Full-page view of the same `ads` rows that power the floating widget on the
 * home page — useful when a visitor dismisses the widget or arrives from a
 * campaign link.
 */
export default function Ads() {
  usePageMeta({
    title: 'Announcements & Offers - Prince Dr K Vasudevan College',
    description:
      'Current announcements, offers and campaigns from Prince Dr K Vasudevan College of Engineering & Technology.',
  })

  const [ads, setAds] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    supabase
      .from('ads')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .then(({ data, error: loadError }) => {
        if (!active) return
        if (loadError) {
          setError(errorMessage(loadError))
          setStatus('error')
          return
        }
        setAds(data || [])
        setStatus('ready')
      })

    return () => {
      active = false
    }
  }, [])

  /** Same window filter the floating widget applies. */
  const visible = useMemo(() => {
    const now = new Date()
    return ads.filter((ad) => {
      if (ad.ends_at && new Date(ad.ends_at) < now) return false
      if (ad.starts_at && new Date(ad.starts_at) > now) return false
      return true
    })
  }, [ads])

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        overlay="linear-gradient(135deg, rgba(13,21,85,0.92), rgba(26,35,126,0.72), rgba(255,152,0,0.35))"
        height="min-h-[clamp(210px,32vw,320px)]"
        contentClassName="px-6"
        title={
          <>
            <i className="fas fa-bullhorn" aria-hidden="true" /> Announcements
          </>
        }
        subtitle="Current offers, campaigns and highlights from the campus"
      />

      <section className="section-block bg-[linear-gradient(135deg,#f0f4f8_0%,#e8f4fd_100%)]">
        <div className="container-page">
          <SectionHeading
            gradient
            title="What's New"
            subtitle="The same announcements shown in the floating card on our home page"
          />

          {status === 'loading' && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(285px,1fr))] gap-[26px]">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={`skeleton-${index}`} className="overflow-hidden rounded-[22px] bg-white shadow-md">
                  <div className="skeleton h-[180px] w-full" />
                  <div className="flex flex-col gap-3 p-[22px]">
                    <div className="skeleton h-5 w-3/4 rounded-md" />
                    <div className="skeleton h-3 w-full rounded-md" />
                    <div className="skeleton h-3 w-5/6 rounded-md" />
                    <div className="skeleton mt-2 h-10 w-40 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-lg border border-danger/20 bg-danger/[0.06] px-6 py-10 text-center">
              <div className="mb-3 text-[2.5rem]" aria-hidden="true">
                ⚠️
              </div>
              <p className="font-semibold text-ink-body">Could not load announcements right now.</p>
              <p className="mt-1 text-[0.85rem] text-ink-muted">{error}</p>
            </div>
          )}

          {status === 'ready' && visible.length === 0 && (
            <div className="rounded-lg border border-line bg-white px-6 py-14 text-center shadow-sm">
              <div className="mb-3 animate-float-y text-[3rem]" aria-hidden="true">
                📭
              </div>
              <p className="font-heading text-[1.05rem] font-bold text-primary">No active announcements</p>
              <p className="mt-1.5 text-[0.88rem] text-ink-muted">
                Check back soon — new offers and campus campaigns appear here as soon as they go live.
              </p>
            </div>
          )}

          {status === 'ready' && visible.length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(285px,1fr))] gap-[26px]">
              {visible.map((ad, index) => (
                <Reveal
                  key={ad.id}
                  as="article"
                  delay={index * 0.06}
                  className="group flex flex-col overflow-hidden rounded-[22px] bg-white shadow-md transition-all duration-[420ms] ease-soft hover:-translate-y-[14px] hover:scale-[1.02] hover:shadow-[0_28px_62px_rgba(26,35,126,0.16)]"
                >
                  <div className="relative h-[180px] overflow-hidden max-[480px]:h-[155px]">
                    <img
                      src={ad.image_url || collegeImage}
                      alt={ad.title || 'Advertisement'}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = collegeImage
                      }}
                      className="h-full w-full object-cover transition-transform duration-[600ms] ease-smooth group-hover:scale-110"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-primary/85 px-3 py-1 text-[0.72rem] font-bold text-white backdrop-blur-[6px]">
                      <i className="fas fa-bullhorn" aria-hidden="true" /> Ad
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-[22px]">
                    <h3 className="mb-2 font-heading text-[1.05rem] font-bold leading-snug text-primary">{ad.title}</h3>
                    {ad.description && (
                      <p className="mb-3.5 flex-1 text-[0.86rem] leading-[1.65] text-ink-muted">{ad.description}</p>
                    )}

                    {formatDate(ad.ends_at) && (
                      <p className="mb-3 text-[0.78rem] font-semibold text-gold-dark">
                        <i className="fas fa-clock" aria-hidden="true" /> Valid until {formatDate(ad.ends_at)}
                      </p>
                    )}

                    {ad.link_url && (
                      <a
                        href={ad.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-full justify-center"
                      >
                        {ad.button_text || 'Learn More'} <i className="fas fa-arrow-right" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
