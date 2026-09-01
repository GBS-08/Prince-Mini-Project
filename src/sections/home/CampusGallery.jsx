import { useCallback, useEffect, useState } from 'react'
import SectionHeading from '../../components/SectionHeading'
import Reveal from '../../components/Reveal'
import { supabase } from '../../services/supabase'
import { defaultGallery } from '../../data/home'
import fallbackImage from '../../assets/images/College_Image.png'

const MEDIA_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm', 'mov']
const VIDEO_EXTS = ['mp4', 'webm', 'mov']
const POLL_MS = 30000
const BUCKET = 'image_files'
const FOLDER = 'College_images'

const ext = (name = '') => name.split('.').pop().toLowerCase()

/** Campus media pulled live from Supabase storage, with a curated fallback set. */
export default function CampusGallery() {
  const [items, setItems] = useState(null) // null = loading

  const fetchMedia = useCallback(async () => {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(FOLDER, { limit: 50, sortBy: { column: 'created_at', order: 'desc' } })

    if (error) throw error

    return (data || [])
      .filter((file) => MEDIA_EXTS.includes(ext(file.name)))
      .map((file) => {
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${file.name}`)
        return {
          url: publicUrl,
          name: file.name,
          isVideo: VIDEO_EXTS.includes(ext(file.name)),
          alt: `Campus - ${file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')}`,
        }
      })
  }, [])

  useEffect(() => {
    let active = true
    let interval

    const load = async () => {
      try {
        const media = await fetchMedia()
        if (!active) return
        setItems(media.length ? media : defaultGallery.map((g) => ({ url: g.url, alt: g.alt, isVideo: false })))

        interval = window.setInterval(async () => {
          try {
            const next = await fetchMedia()
            if (!active || !next.length) return
            setItems((current) => (current && current.length === next.length ? current : next))
          } catch {
            /* transient network error — keep showing what we have */
          }
        }, POLL_MS)
      } catch (error) {
        console.error('Gallery load error:', error)
        if (active) setItems(defaultGallery.map((g) => ({ url: g.url, alt: g.alt, isVideo: false })))
      }
    }

    load()
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [fetchMedia])

  return (
    <section className="section-block bg-white">
      <div className="container-page">
        <SectionHeading
          title="Campus Gallery"
          subtitle="Live from our campus — images & videos updated automatically"
          largeGap
        />

        <div className="grid grid-cols-2 gap-2.5 min-[480px]:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] min-[480px]:gap-[18px] md:grid-cols-[repeat(auto-fill,minmax(272px,1fr))]">
          {items === null
            ? Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton aspect-[4/3] rounded-md" />)
            : items.map((item, i) => (
                <Reveal
                  key={item.url}
                  delay={Math.min(i, 11) * 0.04}
                  className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[18px] shadow-md transition-all duration-[400ms] ease-soft after:absolute after:inset-0 after:rounded-[18px] after:bg-[linear-gradient(180deg,transparent_60%,rgba(26,35,126,0.45)_100%)] after:opacity-0 after:transition-opacity after:duration-[350ms] after:content-[''] hover:z-[1] hover:scale-[1.04] hover:shadow-xl hover:after:opacity-100"
                >
                  {item.isVideo ? (
                    <>
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="block h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.09]"
                      >
                        <source src={item.url} />
                      </video>
                      <span className="absolute bottom-2.5 right-2.5 z-[2] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/[0.18] bg-black/[0.58] text-[0.96rem] text-white backdrop-blur-[6px] transition-transform duration-[280ms] group-hover:scale-[1.16]">
                        <i className="fas fa-play-circle" aria-hidden="true" />
                      </span>
                    </>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.alt}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage
                      }}
                      className="block h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.09]"
                    />
                  )}
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  )
}
