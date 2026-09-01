import Reveal from '../../components/Reveal'
import { supportCards } from '../../data/home'
import { college } from '../../data/navigation'

export default function StudentSupport() {
  return (
    <section className="section-block relative overflow-hidden bg-[linear-gradient(140deg,#6a1177_0%,#4527a0_50%,#1565C0_100%)] text-white">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-[100px] h-[380px] w-[380px] rounded-full bg-white/[0.04]"
      />

      <div className="container-page relative z-[1]">
        <Reveal as="h2" className="section-title section-title-light mb-[14px]">
          Student Support
        </Reveal>
        <Reveal as="p" className="section-subtitle section-subtitle-light mb-11">
          We&apos;re here to help you every step of the way
        </Reveal>

        <div className="grid grid-cols-1 gap-[22px] min-[481px]:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(215px,1fr))]">
          {supportCards.map((card) => (
            <Reveal
              key={card.title}
              className="group rounded-[22px] border border-white/[0.18] bg-white/[0.11] px-[22px] py-7 text-center backdrop-blur-[14px] transition-all duration-[400ms] ease-soft hover:-translate-y-2 hover:scale-[1.02] hover:border-white/[0.32] hover:bg-white/20 hover:shadow-[0_18px_44px_rgba(0,0,0,0.22)]"
            >
              <div className="mx-auto mb-[15px] flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white/[0.18] text-[1.45rem] transition-all duration-[400ms] ease-bounce group-hover:scale-[1.2] group-hover:-rotate-[8deg] group-hover:bg-white/[0.32]">
                <i className={card.icon} aria-hidden="true" />
              </div>
              <h4 className="mb-2 font-heading text-base font-bold">{card.title}</h4>
              <p className="text-[clamp(0.80rem,1.15vw,0.88rem)] leading-[1.72] opacity-[0.82]">
                {card.lines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < card.lines.length - 1 && <br />}
                  </span>
                ))}
              </p>
              {card.mapLink && (
                <a
                  href={college.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex items-center gap-1.5 text-[0.85rem] font-bold text-mint no-underline transition-colors duration-[280ms] hover:text-white"
                >
                  <i className="fas fa-directions" aria-hidden="true" /> Get Directions
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
