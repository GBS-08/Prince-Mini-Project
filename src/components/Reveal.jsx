import { cloneElement, isValidElement } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

/**
 * Fade-and-rise reveal used across every page (the old `.animate-fade-up`).
 * Renders `as` (default <div>) or clones a single child element so no extra
 * wrapper node is introduced into grid/flex layouts.
 *
 * `baseClass` / `visibleClass` let the dark student & teacher portals reuse the
 * same observer with their own `.sp-up` / `.tc-up` skins.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  immediate = false,
  asChild = false,
  baseClass = 'reveal',
  visibleClass = 'is-visible',
  style,
  ...rest
}) {
  const [ref, visible] = useScrollReveal({ immediate })

  const revealClass = `${baseClass} ${visible ? visibleClass : ''} ${className}`.trim()
  const revealStyle = delay ? { transitionDelay: `${delay}s`, ...style } : style

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ref,
      className: `${revealClass} ${children.props.className || ''}`.trim(),
      style: { ...revealStyle, ...children.props.style },
    })
  }

  return (
    <Tag ref={ref} className={revealClass} style={revealStyle} {...rest}>
      {children}
    </Tag>
  )
}
