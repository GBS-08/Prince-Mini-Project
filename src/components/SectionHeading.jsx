import Reveal from './Reveal'

/**
 * Centred section heading: title, optional subtitle and the gradient underline.
 * Matches `.section-title` / `.section-subtitle` / `.title-underline`.
 */
export default function SectionHeading({
  title,
  subtitle,
  light = false,
  gradient = false,
  largeGap = false,
  className = '',
}) {
  return (
    <div className={className}>
      <Reveal
        as="h2"
        className={`section-title ${light ? 'section-title-light' : ''} ${gradient ? 'section-title-grad' : ''} mb-[14px]`}
      >
        {title}
      </Reveal>
      {subtitle && (
        <Reveal as="p" className={`section-subtitle ${light ? 'section-subtitle-light' : ''} mb-11`}>
          {subtitle}
        </Reveal>
      )}
      <Reveal className={`title-underline mt-2.5 ${largeGap ? 'mb-[52px]' : 'mb-[38px]'}`} />
    </div>
  )
}
