import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applySeo } from '@/lib/seo'

export function usePageMeta(meta) {
  const { pathname } = useLocation()

  useEffect(() => {
    applySeo({ ...meta, path: pathname })
  }, [meta, pathname])
}
