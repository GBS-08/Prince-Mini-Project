import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { fallbackGallery } from '@/data/campusLife'

const MEDIA_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm', 'mov']
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov']
const BUCKET = 'image_files'
const FOLDER = 'College_images'

function getExtension(name) {
  return name.split('.').pop()?.toLowerCase() ?? ''
}

function toTitle(name) {
  return name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
}

export function useGalleryMedia() {
  const [items, setItems] = useState(() =>
    fallbackGallery.map((item) => ({ ...item, isVideo: false, id: item.url })),
  )
  const [status, setStatus] = useState(supabase ? 'loading' : 'ready')

  useEffect(() => {
    if (!supabase) return undefined
    let cancelled = false

    async function load() {
      try {
        const { data, error } = await supabase.storage
          .from(BUCKET)
          .list(FOLDER, { limit: 60, sortBy: { column: 'created_at', order: 'desc' } })

        if (error) throw error
        if (cancelled) return

        const media = (data ?? [])
          .filter((file) => MEDIA_EXTENSIONS.includes(getExtension(file.name)))
          .map((file) => {
            const {
              data: { publicUrl },
            } = supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${file.name}`)
            return {
              id: file.name,
              url: publicUrl,
              alt: `Campus — ${toTitle(file.name)}`,
              category: 'Campus',
              isVideo: VIDEO_EXTENSIONS.includes(getExtension(file.name)),
            }
          })

        if (media.length) setItems(media)
      } catch (error) {
        if (import.meta.env.DEV) console.warn('[gallery] falling back to static media', error)
      } finally {
        if (!cancelled) setStatus('ready')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { items, status }
}
