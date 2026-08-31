import { useState } from 'react'
import fallbackImage from '@/assets/campus-hero-sm.jpg'

export function SmartImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  fallback = fallbackImage,
  loading = 'lazy',
  ...props
}) {
  const [status, setStatus] = useState('loading')
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <span className={`relative block overflow-hidden ${wrapperClassName}`}>
      {status === 'loading' ? (
        <span
          className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-white/10"
          aria-hidden="true"
        />
      ) : null}
      <img
        src={currentSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={() => {
          if (currentSrc !== fallback) {
            setCurrentSrc(fallback)
          } else {
            setStatus('loaded')
          }
        }}
        className={`${className} ${status === 'loading' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        {...props}
      />
    </span>
  )
}

export default SmartImage
