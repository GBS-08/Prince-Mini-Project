import Reveal from '../../components/Reveal'
import CountUp from '../../components/CountUp'
import { recruiters } from '../../data/home'

const STAT_CARD =
  'rounded-lg border border-white/[0.16] bg-white/[0.09] px-[22px] py-7 text-center backdrop-blur-[14px] transition-all duration-[400ms] ease-bounce hover:-translate-y-[7px] hover:scale-[1.03] hover:border-white/[0.28] hover:bg-white/[0.17]'

export default function Placements() {
  return (
    <section className="section-block relative overflow-hidden bg-[linear-gradient(140deg,#0d1757_0%,#1a237e_45%,#0d47a1_100%)] text-white">
      <span
        aria-hidden="true"
        className="absolute -right-[90px] -top-[90px] h-[420px] w-[420px] rounded-full bg-white/[0.03]"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-[100px] -left-[65px] h-[320px] w-[320px] rounded-full bg-accent/[0.06]"
      />

      <div className="container-page relative z-[1]">
        <Reveal as="h2" className="section-title section-title-light mb-[14px]">
          Placement Highlights
        </Reveal>
        <Reveal as="p" className="section-subtitle section-subtitle-light mb-11">
          Our students are placed in top companies worldwide
        </Reveal>

        <div className="grid grid-cols-1 items-center gap-[38px] lg:grid-cols-2 lg:gap-[52px]">
          <Reveal className="flex flex-col gap-5">
            <div className={STAT_CARD}>
              <CountUp
                to={82.3}
                percent
                className="mb-[7px] block font-heading text-[clamp(2.8rem,6.5vw,4.4rem)] font-black text-mint [text-shadow:0_0_32px_rgba(165,243,176,0.38)]"
              />
              <p className="text-[clamp(0.80rem,1.15vw,0.92rem)] font-semibold opacity-[0.78]">
                Placement Rate 2024-25
              </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className={STAT_CARD}>
                <CountUp
                  to={8}
                  className="mb-[7px] block font-heading text-[clamp(2rem,3.8vw,3rem)] font-black text-mint [text-shadow:0_0_32px_rgba(165,243,176,0.38)]"
                />
                <p className="text-[clamp(0.80rem,1.15vw,0.92rem)] font-semibold opacity-[0.78]">Avg Package (LPA)</p>
              </div>
              <div className={STAT_CARD}>
                <CountUp
                  to={25}
                  className="mb-[7px] block font-heading text-[clamp(2rem,3.8vw,3rem)] font-black text-mint [text-shadow:0_0_32px_rgba(165,243,176,0.38)]"
                />
                <p className="text-[clamp(0.80rem,1.15vw,0.92rem)] font-semibold opacity-[0.78]">
                  Highest Package (LPA)
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <h3 className="mb-6 font-heading text-[clamp(1.1rem,1.9vw,1.38rem)] font-bold text-white/[0.92]">
              Top Recruiters
            </h3>
            <div className="grid max-w-[580px] grid-cols-[repeat(auto-fit,minmax(96px,1fr))] items-center gap-[18px] lg:max-w-none">
              {recruiters.map((recruiter) => (
                <img
                  key={recruiter.name}
                  src={recruiter.src}
                  alt={recruiter.name}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                  className="h-[42px] w-full object-contain opacity-80 [filter:brightness(0)_invert(1)] transition-all duration-[400ms] ease-bounce hover:-translate-y-1 hover:scale-[1.2] hover:opacity-100 hover:[filter:brightness(0)_invert(0.92)]"
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
