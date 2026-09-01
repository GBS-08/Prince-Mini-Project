import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import CountUp from '../components/CountUp'
import useTilt from '../hooks/useTilt'
import usePageMeta from '../hooks/usePageMeta'
import {
  aboutHighlights,
  aboutParagraphs,
  aboutStats,
  contactCards,
  MAP_EMBED_SRC,
  missionPoints,
  visionText,
} from '../data/about'

const STAT_ICON_TONE = {
  green: 'bg-gradient-to-br from-accent to-accent-dark shadow-[0_6px_18px_rgba(76,175,80,0.32)]',
  blue: 'bg-gradient-to-br from-accent2 to-accent2-dark shadow-[0_6px_18px_rgba(33,150,243,0.32)]',
  gold: 'bg-gradient-to-br from-gold to-gold-dark shadow-[0_6px_18px_rgba(255,152,0,0.32)]',
  teal: 'bg-gradient-to-br from-teal to-teal-dark shadow-[0_6px_18px_rgba(0,150,136,0.32)]',
}

function StatCard({ stat }) {
  const tilt = useTilt()

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="group relative overflow-hidden rounded-[22px] border border-black/[0.04] bg-white px-5 py-[26px] text-center shadow-md transition-all duration-[400ms] ease-bounce before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[3px] before:origin-left before:scale-x-0 before:bg-gradient-to-r before:from-accent before:to-accent2 before:transition-transform before:duration-[350ms] before:content-[''] hover:-translate-y-2.5 hover:scale-[1.03] hover:shadow-xl hover:before:scale-x-100"
    >
      <div
        className={`mx-auto mb-3.5 flex h-[60px] w-[60px] items-center justify-center rounded-full text-[1.45rem] text-white transition-all duration-[400ms] ease-bounce group-hover:-translate-y-[3px] group-hover:scale-[1.14] group-hover:-rotate-[8deg] ${STAT_ICON_TONE[stat.tone]}`}
      >
        <i className={stat.icon} aria-hidden="true" />
      </div>
      <CountUp
        to={stat.value}
        className="mb-1 block font-heading text-[clamp(1.75rem,2.8vw,2.35rem)] font-black leading-none text-primary"
      />
      <div className="text-[clamp(0.75rem,1.15vw,0.86rem)] font-semibold text-ink-muted">{stat.label}</div>
    </div>
  )
}

export default function About() {
  usePageMeta({
    title: 'About Us - Prince Dr K Vasudevan College',
    description: "Learn about Prince Dr K Vasudevan College's history, vision, mission and contact information.",
  })

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        overlay="linear-gradient(135deg, rgba(13,21,85,0.92), rgba(26,35,126,0.72), rgba(59,130,246,0.45))"
        height="h-[clamp(210px,32vw,320px)]"
        contentClassName="px-6"
        title={
          <>
            <i className="fas fa-info-circle" aria-hidden="true" /> About Us
          </>
        }
        subtitle="Learn about our institution's legacy, values, and vision"
      />

      {/* WHO WE ARE */}
      <section className="section-block bg-[linear-gradient(135deg,#f0f4f8_0%,#e8f4fd_100%)]">
        <div className="container-page">
          <div className="grid grid-cols-1 items-start gap-11 lg:grid-cols-[1.2fr_0.8fr] lg:gap-[62px]">
            <Reveal>
              <h2 className="section-title mb-[14px] !text-left">Who We Are</h2>
              <div className="title-underline !mx-0 mb-[38px] mt-2.5" />

              {aboutParagraphs.map((para) => (
                <p key={para.id} className="mb-4 text-[clamp(0.93rem,1.35vw,1.03rem)] leading-[1.82] text-ink-body">
                  {para.content}
                </p>
              ))}

              <ul className="mt-6 flex list-none flex-col gap-[11px] p-0">
                {aboutHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-[11px] rounded-xl border-l-[3px] border-accent bg-accent/[0.06] px-4 py-2.5 text-[0.93rem] font-semibold text-ink-body transition-all duration-300 hover:translate-x-[5px] hover:bg-accent/[0.12]"
                  >
                    <i className="fas fa-check-circle shrink-0 text-[1.05rem] text-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://www.princedrkvasudevan.com"
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-primary mt-6"
              >
                <i className="fas fa-external-link-alt" /> Visit Official Website
              </a>
            </Reveal>

            <Reveal className="grid grid-cols-2 gap-[18px] md:grid-cols-4 lg:sticky lg:top-[108px] lg:grid-cols-2">
              {aboutStats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="section-block bg-white">
        <div className="container-page">
          <SectionHeading title="Vision & Mission" gradient largeGap />

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            <Reveal className="group relative overflow-hidden rounded-lg border-t-[5px] border-accent bg-white px-8 py-10 shadow-md transition-all duration-[450ms] ease-soft before:absolute before:-right-20 before:-top-20 before:h-[200px] before:w-[200px] before:rounded-full before:bg-accent/[0.04] before:transition-transform before:duration-500 before:content-[''] hover:-translate-y-2.5 hover:scale-[1.01] hover:shadow-xl hover:before:scale-[2.2]">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[18px] bg-gradient-to-br from-accent to-accent-dark text-[1.55rem] text-white shadow-[0_6px_18px_rgba(76,175,80,0.30)] transition-all duration-[400ms] ease-bounce group-hover:-translate-y-1 group-hover:scale-[1.12] group-hover:-rotate-[7deg]">
                <i className="fas fa-eye" aria-hidden="true" />
              </div>
              <h3 className="mb-3.5 font-heading text-[clamp(1.1rem,1.95vw,1.28rem)] font-bold text-primary">
                Our Vision
              </h3>
              <p className="text-[clamp(0.86rem,1.35vw,0.96rem)] leading-[1.82] text-ink-body">{visionText}</p>
            </Reveal>

            <Reveal className="group relative overflow-hidden rounded-lg border-t-[5px] border-accent2 bg-white px-8 py-10 shadow-md transition-all duration-[450ms] ease-soft before:absolute before:-right-20 before:-top-20 before:h-[200px] before:w-[200px] before:rounded-full before:bg-accent2/[0.04] before:transition-transform before:duration-500 before:content-[''] hover:-translate-y-2.5 hover:scale-[1.01] hover:shadow-xl hover:before:scale-[2.2]">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[18px] bg-gradient-to-br from-accent2 to-accent2-dark text-[1.55rem] text-white shadow-[0_6px_18px_rgba(33,150,243,0.28)] transition-all duration-[400ms] ease-bounce group-hover:-translate-y-1 group-hover:scale-[1.12] group-hover:-rotate-[7deg]">
                <i className="fas fa-bullseye" aria-hidden="true" />
              </div>
              <h3 className="mb-3.5 font-heading text-[clamp(1.1rem,1.95vw,1.28rem)] font-bold text-primary">
                Our Mission
              </h3>
              <ul className="list-none p-0 text-[clamp(0.86rem,1.35vw,0.96rem)] leading-[1.82] text-ink-body">
                {missionPoints.map((point) => (
                  <li
                    key={point}
                    className="mb-[9px] flex items-start gap-[9px] rounded-lg px-2.5 py-1.5 transition-colors duration-[250ms] before:mt-0.5 before:shrink-0 before:text-[0.88rem] before:text-accent2 before:content-['▸'] hover:bg-accent2/5"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section-block relative overflow-hidden bg-[linear-gradient(135deg,#0d1555_0%,#1a237e_55%,#0d47a1_100%)] text-white">
        <span
          aria-hidden="true"
          className="absolute -right-[110px] -top-[110px] h-[480px] w-[480px] rounded-full bg-white/[0.03]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-20 -left-[60px] h-[300px] w-[300px] rounded-full bg-accent/[0.05]"
        />

        <div className="container-page relative z-[1]">
          <Reveal as="h2" className="section-title section-title-light mb-[14px]">
            Contact Information
          </Reveal>
          <Reveal className="title-underline mb-[38px] mt-2.5" />
          <Reveal as="p" className="section-subtitle section-subtitle-light mb-11 mt-5">
            We&apos;d love to hear from you
          </Reveal>

          <div className="grid grid-cols-1 gap-[22px] min-[481px]:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
            {contactCards.map((card) => (
              <Reveal
                key={card.title}
                className="group rounded-[22px] border border-white/[0.16] bg-white/[0.09] px-6 py-[30px] text-center backdrop-blur-[14px] transition-all duration-[400ms] ease-soft hover:-translate-y-2 hover:scale-[1.02] hover:border-white/[0.28] hover:bg-white/[0.18] hover:shadow-[0_18px_44px_rgba(0,0,0,0.22)]"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.13] text-[1.55rem] text-mint transition-all duration-[400ms] ease-bounce group-hover:scale-[1.14] group-hover:-rotate-[8deg] group-hover:bg-white/[0.24]">
                  <i className={card.icon} aria-hidden="true" />
                </div>
                <h4 className="mb-2.5 font-heading text-[1.04rem] font-bold text-white">{card.title}</h4>
                <p className="mb-3.5 text-[clamp(0.82rem,1.25vw,0.90rem)] leading-[1.72] opacity-[0.78]">
                  {card.lines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < card.lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
                <a
                  href={card.link.href}
                  {...(card.link.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="inline-flex items-center gap-1.5 text-[0.86rem] font-bold text-mint no-underline transition-colors duration-[280ms] hover:text-white"
                >
                  <i className={card.link.icon} aria-hidden="true" /> {card.link.label}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="block w-full overflow-hidden">
        <iframe
          src={MAP_EMBED_SRC}
          width="100%"
          height="380"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="College Map"
        />
      </section>
    </>
  )
}
