import { Link } from 'react-router-dom'
import HeroParticles from '../../components/HeroParticles'
import CountUp from '../../components/CountUp'
import useTypewriter from '../../hooks/useTypewriter'
import { heroPhrases, heroStats } from '../../data/home'
import campusImage from '../../assets/images/College_Image.png'

/** Full-bleed home hero: panning campus photo, orbs, particles, typewriter, stats. */
export default function Hero() {
  const typed = useTypewriter(heroPhrases)

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden text-center text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-hero-pan bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${campusImage})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(155deg,rgba(6,10,46,0.88)_0%,rgba(26,35,126,0.72)_40%,rgba(40,100,50,0.48)_100%)]"
      />

      <HeroParticles className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-35" />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[100px] -top-[120px] z-[1] h-[520px] w-[520px] animate-orb-1 rounded-full bg-[radial-gradient(circle,#4CAF50,transparent)] opacity-[0.14] blur-[70px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[90px] -left-[60px] z-[1] h-[360px] w-[360px] animate-orb-2 rounded-full bg-[radial-gradient(circle,#2196F3,transparent)] opacity-[0.14] blur-[70px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[14%] top-[40%] z-[1] h-[260px] w-[260px] animate-orb-3 rounded-full bg-[radial-gradient(circle,#FF9800,transparent)] opacity-10 blur-[70px]"
      />

      <div className="relative z-[2] max-w-[920px] px-6 pb-20 pt-[100px]">
        <p className="mb-7 inline-flex animate-badge-in items-center gap-2 rounded-full border border-white/[0.22] bg-white/[0.12] px-5 py-2 text-[clamp(0.74rem,1.1vw,0.86rem)] font-bold tracking-[0.04em] text-mint backdrop-blur-[14px]">
          <i className="fas fa-award" aria-hidden="true" /> NAAC A+ Accredited Institution
        </p>

        <h1 className="mb-5 animate-hero-title-in font-heading text-[clamp(2.1rem,6vw,4.4rem)] font-black leading-[1.1] tracking-[-0.02em] [text-shadow:0_4px_28px_rgba(0,0,0,0.40)]">
          Prince Dr K Vasudevan
          <br />
          <span className="animate-gradient-shift bg-[linear-gradient(90deg,#81c784,#64b5f6,#a5f3b0,#64b5f6)] bg-[length:200%_auto] bg-clip-text text-transparent">
            College of Engineering
          </span>
          <br />
          &amp; Technology
        </h1>

        <p
          className="mb-[38px] min-h-[1.8em] animate-hero-title-in-delayed text-[clamp(0.92rem,1.75vw,1.15rem)] tracking-[0.02em] opacity-[0.88]"
          aria-live="polite"
        >
          {typed}
          <span className="typed-cursor" />
        </p>

        <div className="mb-[60px] flex animate-hero-title-in-late flex-wrap justify-center gap-3.5 max-[480px]:flex-col max-[480px]:items-center">
          <Link to="/courses" className="btn btn-primary">
            <i className="fas fa-book-open" /> Explore Courses
          </Link>
          <Link to="/about" className="btn-glass">
            <i className="fas fa-info-circle" /> Learn More
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-[18px] max-[480px]:gap-2.5">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="relative min-w-[128px] overflow-hidden rounded-[22px] border border-white/20 bg-white/[0.11] px-[26px] py-5 backdrop-blur-[18px] transition-all duration-[400ms] ease-bounce before:pointer-events-none before:absolute before:inset-0 before:rounded-[22px] before:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent)] before:content-[''] hover:-translate-y-[7px] hover:scale-[1.04] hover:border-white/35 hover:bg-white/20 hover:shadow-[0_14px_36px_rgba(0,0,0,0.25)] max-[480px]:px-[18px] max-[480px]:py-[15px]"
            >
              <CountUp
                to={stat.value}
                percent={stat.percent}
                className="mb-1.5 block font-heading text-[clamp(1.75rem,3.8vw,2.5rem)] font-black leading-none text-mint [filter:drop-shadow(0_0_14px_rgba(165,243,176,0.45))]"
              />
              <span className="block text-[clamp(0.70rem,1.05vw,0.80rem)] font-semibold tracking-[0.02em] opacity-[0.82]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#about-section"
        aria-label="Scroll down"
        className="absolute bottom-[30px] left-1/2 z-[3] flex h-[46px] w-[46px] -translate-x-1/2 animate-bounce-ball items-center justify-center rounded-full border-[1.5px] border-white/[0.28] bg-white/[0.14] text-[1.1rem] text-white/75 no-underline backdrop-blur-[8px] transition-all duration-[350ms] ease-bounce hover:border-white/50 hover:bg-white/[0.28] hover:text-white"
      >
        <i className="fas fa-chevron-down" aria-hidden="true" />
      </a>
    </section>
  )
}
