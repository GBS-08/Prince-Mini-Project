/**
 * Shared page banner (`.page-hero`): background photo, gradient overlay,
 * animated title/subtitle and the diagonal shimmer sweep.
 * Each page passes its own image, overlay gradient, height and title scale.
 */
export default function PageHero({
  image,
  overlay,
  height = 'min-h-[clamp(220px,35vw,350px)]',
  title,
  subtitle,
  titleClassName = 'text-[clamp(2rem,5vw,3.2rem)] font-extrabold',
  subtitleClassName = 'text-[clamp(0.88rem,1.75vw,1.08rem)]',
  contentClassName = 'px-6 py-10',
  children,
  className = '',
}) {
  return (
    <section
      className={`page-hero-shimmer relative flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat text-center text-white ${height} ${className}`}
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className="absolute inset-0" style={{ background: overlay }} aria-hidden="true" />
      <div className={`relative z-[2] ${contentClassName}`}>
        <h1
          className={`mb-2.5 animate-hero-title-in font-heading tracking-[-0.02em] [text-shadow:0_4px_24px_rgba(0,0,0,0.42)] ${titleClassName}`}
        >
          {title}
        </h1>
        {subtitle && <p className={`animate-hero-title-in-delayed opacity-[0.82] ${subtitleClassName}`}>{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
