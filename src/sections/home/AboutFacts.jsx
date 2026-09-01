import Reveal from '../../components/Reveal'
import SectionHeading from '../../components/SectionHeading'
import useTilt from '../../hooks/useTilt'
import { facts } from '../../data/home'

const ICON_TONE = {
  green: 'bg-gradient-to-br from-accent to-accent-dark shadow-[0_8px_24px_rgba(76,175,80,0.32)]',
  blue: 'bg-gradient-to-br from-accent2 to-accent2-dark shadow-[0_8px_24px_rgba(33,150,243,0.32)]',
  gold: 'bg-gradient-to-br from-gold to-gold-dark shadow-[0_8px_24px_rgba(255,152,0,0.32)]',
  teal: 'bg-gradient-to-br from-teal to-teal-dark shadow-[0_8px_24px_rgba(0,150,136,0.32)]',
}

function FactCard({ fact }) {
  const tilt = useTilt()

  return (
    <Reveal asChild>
      <article
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="group relative overflow-hidden rounded-lg border-b-4 border-transparent bg-white px-[26px] py-[clamp(28px,4vw,40px)] text-center shadow-md transition-all duration-[450ms] ease-soft before:absolute before:left-0 before:right-0 before:top-0 before:h-[3px] before:scale-x-0 before:bg-[linear-gradient(90deg,transparent,rgba(76,175,80,0.3),transparent)] before:transition-transform before:duration-[400ms] before:content-[''] hover:-translate-y-3 hover:scale-[1.02] hover:border-b-accent2 hover:shadow-xl hover:before:scale-x-100"
      >
        <div
          className={`mx-auto mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-full text-[1.9rem] text-white transition-all duration-[400ms] ease-bounce group-hover:-translate-y-1 group-hover:scale-[1.16] group-hover:-rotate-[8deg] ${ICON_TONE[fact.tone]}`}
        >
          <i className={fact.icon} aria-hidden="true" />
        </div>
        <h3 className="mb-[9px] font-heading text-[clamp(1rem,1.75vw,1.18rem)] font-bold text-primary">{fact.title}</h3>
        <p className="text-[clamp(0.84rem,1.2vw,0.93rem)] leading-[1.65] text-ink-muted">{fact.text}</p>
      </article>
    </Reveal>
  )
}

export default function AboutFacts() {
  return (
    <section id="about-section" className="section-block bg-[linear-gradient(135deg,#f0f4f8_0%,#e3f2fd_100%)]">
      <div className="container-page">
        <SectionHeading title="About Our Institution" largeGap />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[26px]">
          {facts.map((fact) => (
            <FactCard key={fact.title} fact={fact} />
          ))}
        </div>
      </div>
    </section>
  )
}
