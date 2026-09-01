import HeroParticles from '../components/HeroParticles'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import useTilt from '../hooks/useTilt'
import usePageMeta from '../hooks/usePageMeta'
import {
  auditoriumFeatures,
  auditoriumSpecs,
  canteenCards,
  classroomCards,
  clubs,
  committees,
  facHeroStats,
  facQuickNav,
  hostelFeatures,
  sports,
  transportRoutes,
  transportStats,
} from '../data/facilities'

function ClubCard({ club, index }) {
  const tilt = useTilt()

  return (
    <Reveal delay={0.04 * (index + 1)}>
      <article
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="group relative h-full overflow-hidden rounded-[22px] border-t-[5px] bg-white px-6 py-7 shadow-md transition-all duration-[420ms] ease-soft hover:-translate-y-3 hover:scale-[1.015] hover:shadow-xl"
        style={{ borderTopColor: club.color, color: club.color }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[45px] -top-[45px] h-[130px] w-[130px] rounded-full bg-current opacity-[0.04] transition-all duration-[450ms] group-hover:scale-[2.8] group-hover:opacity-[0.065]"
        />
        <div
          className="relative mb-[18px] flex h-16 w-16 items-center justify-center rounded-[18px] text-[1.65rem] text-white transition-all duration-[400ms] ease-bounce group-hover:-translate-y-1 group-hover:-rotate-[7deg] group-hover:scale-[1.14]"
          style={{ background: club.gradient }}
        >
          <i className={club.icon} aria-hidden="true" />
        </div>
        <h3 className="relative mb-2.5 font-heading text-[1.08rem] font-bold text-primary">{club.title}</h3>
        <p className="relative mb-3.5 text-[0.88rem] leading-[1.65] text-ink-muted">{club.text}</p>
        <div className="relative flex flex-wrap gap-1.5">
          {club.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line bg-surface-subtle px-2.5 py-[3px] text-[0.73rem] font-bold text-ink-muted transition-all duration-[250ms] group-hover:border-accent/[0.26] group-hover:bg-accent/[0.09] group-hover:text-accent-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Reveal>
  )
}

function CanteenCard({ card }) {
  const tilt = useTilt()

  return (
    <Reveal>
      <article
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="group h-full rounded-[22px] border border-black/[0.04] bg-white px-7 py-9 text-center shadow-md transition-all duration-[420ms] ease-soft hover:-translate-y-3 hover:scale-[1.01] hover:shadow-xl"
      >
        <div
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-[1.75rem] text-white shadow-[0_8px_24px_rgba(76,175,80,0.32)] transition-all duration-[400ms] ease-bounce group-hover:-translate-y-[5px] group-hover:-rotate-[8deg] group-hover:scale-[1.16]"
          style={{ background: card.gradient }}
        >
          <i className={card.icon} aria-hidden="true" />
        </div>
        <h3 className="mb-3 font-heading text-[1.08rem] font-bold text-primary">{card.title}</h3>
        <p className="mb-4 text-[0.88rem] leading-[1.65] text-ink-muted">{card.text}</p>
        <ul className="flex list-none flex-col gap-2 text-left">
          {card.items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-[0.86rem] text-ink-body">
              <i className="fas fa-dot-circle text-[0.68rem] text-accent2" aria-hidden="true" /> {item}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  )
}

function ClassCard({ card }) {
  const tilt = useTilt()

  return (
    <Reveal>
      <article
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="group relative h-full overflow-hidden rounded-[22px] border border-black/[0.04] bg-white px-6 py-8 text-center shadow-md transition-all duration-[420ms] ease-soft hover:-translate-y-3 hover:shadow-xl"
      >
        <span
          aria-hidden="true"
          className="absolute right-[18px] top-3 bg-gradient-to-br from-accent/10 to-accent2/10 bg-clip-text font-heading text-[3rem] font-black text-transparent opacity-[0.55]"
        >
          {card.number}
        </span>
        <div
          className="mx-auto mb-[18px] flex h-[72px] w-[72px] items-center justify-center rounded-full text-[1.65rem] text-white shadow-[0_8px_24px_rgba(76,175,80,0.32)] transition-all duration-[400ms] ease-bounce group-hover:-translate-y-1 group-hover:-rotate-[8deg] group-hover:scale-[1.16]"
          style={{ background: card.gradient }}
        >
          <i className={card.icon} aria-hidden="true" />
        </div>
        <h3 className="mb-2.5 font-heading text-[1.04rem] font-bold text-primary">{card.title}</h3>
        <p className="text-[0.86rem] leading-[1.65] text-ink-muted">{card.text}</p>
      </article>
    </Reveal>
  )
}

export default function Facilities() {
  usePageMeta({
    title: 'Facilities - Prince Dr K Vasudevan College',
    description:
      'Explore world-class facilities at Prince Dr K Vasudevan College — hostel, sports, labs, canteen and more.',
  })

  return (
    <>
      {/* HERO */}
      <section className="page-hero-shimmer relative flex min-h-[clamp(370px,52vw,530px)] items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center bg-no-repeat text-center text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(6,10,46,0.90), rgba(26,35,126,0.76), rgba(40,100,50,0.52))',
          }}
        />
        <HeroParticles className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-30" />

        <div className="relative z-[2] max-w-[920px] px-6">
          <div className="mb-[18px] inline-flex animate-badge-pulse items-center gap-2 rounded-full border border-white/[0.22] bg-white/[0.13] px-[22px] py-2 text-[0.86rem] font-bold text-mint backdrop-blur-[14px]">
            <i className="fas fa-star" aria-hidden="true" /> World-Class Infrastructure
          </div>
          <h1 className="mb-3.5 animate-hero-title-in font-heading text-[clamp(2.2rem,5.5vw,3.8rem)] font-black tracking-[-0.02em] [text-shadow:0_4px_24px_rgba(0,0,0,0.42)]">
            <i className="fas fa-building" aria-hidden="true" /> Campus Facilities
          </h1>
          <p className="mb-8 animate-hero-title-in-delayed text-[clamp(0.93rem,1.75vw,1.12rem)] opacity-85">
            Everything you need to learn, grow and thrive in one place
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-[18px] max-[480px]:gap-2.5">
            {facHeroStats.map((stat) => (
              <div
                key={stat.label}
                className="min-w-[120px] rounded-[22px] border border-white/20 bg-white/[0.11] px-6 py-[18px] text-center backdrop-blur-[18px] transition-all duration-[400ms] ease-bounce hover:-translate-y-[7px] hover:scale-105 hover:bg-white/[0.22] hover:shadow-[0_14px_36px_rgba(0,0,0,0.22)] max-[480px]:px-4 max-[480px]:py-[13px]"
              >
                <span className="block font-heading text-[2rem] font-black text-mint [filter:drop-shadow(0_0_12px_rgba(165,243,176,0.40))] max-[480px]:text-[1.58rem]">
                  {stat.num}
                </span>
                <span className="text-[0.76rem] font-semibold opacity-80">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK NAV */}
      <nav
        aria-label="Facilities sections"
        className="sticky top-[var(--header-height)] z-[500] border-b border-line bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      >
        <div className="container-page">
          <div className="no-scrollbar flex gap-1 overflow-x-auto py-3">
            {facQuickNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex flex-shrink-0 items-center gap-[7px] whitespace-nowrap rounded-full border-[1.5px] border-transparent bg-surface-subtle px-5 py-2.5 text-[0.86rem] font-bold text-ink-muted no-underline transition-all duration-[350ms] ease-bounce hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-accent hover:to-accent2 hover:text-white hover:shadow-[0_6px_18px_rgba(76,175,80,0.28)]"
              >
                <i className={item.icon} aria-hidden="true" /> {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* CLUBS */}
      <section className="section-block bg-[linear-gradient(135deg,#f0f4f8_0%,#e8f4fd_100%)]" id="clubs">
        <div className="container-page">
          <SectionHeading
            gradient
            title={
              <>
                <i className="fas fa-users" aria-hidden="true" /> Clubs &amp; Committees
              </>
            }
            subtitle="Join a community, lead initiatives and build lifelong skills"
          />

          <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(275px,1fr))] gap-[22px] max-[480px]:grid-cols-1">
            {clubs.map((club, index) => (
              <ClubCard key={club.title} club={club} index={index} />
            ))}
          </div>

          <Reveal
            as="h3"
            className="mb-5 mt-12 flex items-center gap-2.5 font-heading text-[1.38rem] font-bold text-primary"
          >
            <i className="fas fa-sitemap" aria-hidden="true" /> Statutory Committees
          </Reveal>
          <Reveal className="flex flex-wrap gap-[11px]">
            {committees.map((item) => (
              <div
                key={item.label}
                className="group inline-flex items-center gap-2 rounded-full border-[1.5px] border-line bg-white px-[18px] py-2.5 text-[0.86rem] font-bold text-ink-body shadow-sm transition-all duration-[350ms] ease-bounce hover:-translate-y-[3px] hover:scale-105 hover:border-transparent hover:bg-gradient-to-br hover:from-primary hover:to-primary-light hover:text-white hover:shadow-[0_8px_22px_rgba(26,35,126,0.24)]"
              >
                <i
                  className={`${item.icon} text-accent2 transition-colors duration-[280ms] group-hover:text-mint`}
                  aria-hidden="true"
                />{' '}
                {item.label}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* HOSTEL */}
      <section className="section-block bg-white" id="hostel">
        <div className="container-page">
          <SectionHeading
            gradient
            title={
              <>
                <i className="fas fa-bed" aria-hidden="true" /> Hostel Facilities
              </>
            }
          />

          <div className="grid grid-cols-1 items-center gap-[52px] lg:grid-cols-2 lg:gap-[52px]">
            <Reveal className="group relative overflow-hidden rounded-xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Hostel"
                className="h-[300px] w-full object-cover transition-transform duration-[600ms] group-hover:scale-105 lg:h-[400px]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(26,35,126,0.88),transparent)] p-5">
                <span className="flex items-center gap-2 text-[0.88rem] font-bold text-white">
                  <i className="fas fa-home" aria-hidden="true" /> On-Campus Accommodation
                </span>
              </div>
            </Reveal>

            <Reveal>
              <h3 className="mb-3.5 font-heading text-[clamp(1.2rem,2.2vw,1.5rem)] font-bold text-primary">
                Safe &amp; Comfortable Living
              </h3>
              <p className="mb-6 text-[clamp(0.92rem,1.38vw,1rem)] leading-[1.82] text-ink-body">
                Our campus provides separate, secure hostel blocks for boys and girls with modern amenities, 24/7
                security, and a homely atmosphere to ensure students focus on their academics.
              </p>
              <div className="flex flex-col gap-[13px]">
                {hostelFeatures.map((feature) => (
                  <div key={feature.title} className="group flex items-start gap-3.5">
                    <i
                      className="fas fa-check-circle mt-0.5 flex-shrink-0 text-[1.08rem] text-accent transition-transform duration-[280ms] group-hover:-rotate-[5deg] group-hover:scale-125"
                      aria-hidden="true"
                    />
                    <div>
                      <strong className="mb-0.5 block text-[0.93rem] font-bold text-primary">{feature.title}</strong>
                      <span className="text-[0.83rem] text-ink-muted">{feature.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CANTEEN */}
      <section className="section-block bg-[linear-gradient(135deg,#f0f4f8_0%,#e8f4fd_100%)]" id="canteen">
        <div className="container-page">
          <SectionHeading
            gradient
            title={
              <>
                <i className="fas fa-utensils" aria-hidden="true" /> Canteen &amp; Dining
              </>
            }
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(278px,1fr))] gap-[26px] max-[480px]:grid-cols-1">
            {canteenCards.map((card) => (
              <CanteenCard key={card.title} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* SPORTS */}
      <section className="section-block bg-white" id="sports">
        <div className="container-page">
          <SectionHeading
            gradient
            title={
              <>
                <i className="fas fa-running" aria-hidden="true" /> Sports Complex
              </>
            }
            subtitle="World-class sporting facilities spread across 10 acres"
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(278px,1fr))] gap-[22px] max-[480px]:grid-cols-1">
            {sports.map((sport) => (
              <Reveal
                key={sport.title}
                as="article"
                className="group overflow-hidden rounded-[22px] border border-black/[0.04] bg-white shadow-md transition-all duration-[420ms] ease-soft hover:-translate-y-3 hover:shadow-xl"
              >
                <div className="h-[200px] overflow-hidden">
                  <img
                    src={sport.img}
                    alt={sport.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.09]"
                  />
                </div>
                <h3 className="flex items-center gap-2 px-[18px] pb-2 pt-4 font-heading text-[1rem] font-bold text-primary">
                  <i className={`${sport.icon} text-accent`} aria-hidden="true" /> {sport.title}
                </h3>
                <p className="px-[18px] pb-[18px] text-[0.86rem] leading-[1.65] text-ink-muted">{sport.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AUDITORIUM */}
      <section
        className="section-block relative overflow-hidden text-white"
        id="auditorium"
        style={{
          background: 'linear-gradient(140deg, #0d1555 0%, #1a237e 55%, #0d47a1 100%)',
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[110px] -top-[110px] h-[480px] w-[480px] rounded-full bg-white/[0.03]"
        />
        <div className="container-page relative z-[1]">
          <SectionHeading
            light
            title={
              <>
                <i className="fas fa-theater-masks" aria-hidden="true" /> Auditorium
              </>
            }
          />

          <div className="grid grid-cols-1 items-center gap-[52px] lg:grid-cols-2">
            <Reveal>
              <h3 className="mb-3.5 font-heading text-[clamp(1.2rem,2.2vw,1.48rem)] font-bold text-white">
                State-of-the-Art Seminar &amp; Event Venue
              </h3>
              <p className="mb-7 text-[0.94rem] leading-[1.82] text-white/[0.78]">
                Our grand auditorium is the cultural and academic heart of the campus — hosting convocations, seminars,
                cultural fests, guest lectures and award ceremonies throughout the year.
              </p>

              <div className="mb-7 grid grid-cols-2 gap-4">
                {auditoriumSpecs.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-md border border-white/[0.16] bg-white/[0.09] p-[18px] text-center backdrop-blur-[10px] transition-all duration-[350ms] ease-bounce hover:-translate-y-[5px] hover:border-white/[0.28] hover:bg-white/[0.18]"
                  >
                    <span className="block font-heading text-[1.75rem] font-black text-mint">{spec.num}</span>
                    <span className="text-[0.78rem] opacity-[0.78]">{spec.label}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                {auditoriumFeatures.map((feature) => (
                  <div key={feature.label} className="flex items-center gap-2 text-[0.86rem] text-white/[0.82]">
                    <i className={`${feature.icon} flex-shrink-0 text-mint`} aria-hidden="true" /> {feature.label}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="group overflow-hidden rounded-xl shadow-[0_26px_64px_rgba(0,0,0,0.42)]">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Auditorium"
                className="h-[300px] w-full object-cover transition-transform duration-[600ms] group-hover:scale-105 lg:h-[420px]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CLASSROOMS */}
      <section className="section-block bg-[linear-gradient(135deg,#f0f4f8_0%,#e8f4fd_100%)]" id="classrooms">
        <div className="container-page">
          <SectionHeading
            gradient
            title={
              <>
                <i className="fas fa-chalkboard" aria-hidden="true" /> Classrooms &amp; Labs
              </>
            }
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(255px,1fr))] gap-[22px] max-[480px]:grid-cols-1">
            {classroomCards.map((card) => (
              <ClassCard key={card.title} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPORT */}
      <section className="section-block bg-white" id="transport">
        <div className="container-page">
          <SectionHeading
            gradient
            title={
              <>
                <i className="fas fa-bus" aria-hidden="true" /> Transport Facilities
              </>
            }
          />

          <Reveal className="grid grid-cols-1 items-start gap-[52px] lg:grid-cols-2">
            <div>
              <p className="mb-6 text-[clamp(0.92rem,1.38vw,1rem)] leading-[1.82] text-ink-body">
                The college operates an extensive fleet of buses covering over 35 routes across Chennai and surrounding
                areas, ensuring safe and comfortable transportation for students and staff.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-4">
                {transportStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-[13px] rounded-md border border-primary/[0.11] bg-[linear-gradient(135deg,rgba(26,35,126,0.05),rgba(33,150,243,0.05))] p-[18px] transition-all duration-[350ms] ease-bounce hover:-translate-y-[5px] hover:shadow-md"
                  >
                    <i className={`${stat.icon} flex-shrink-0 text-[1.55rem] text-accent2`} aria-hidden="true" />
                    <div className="text-[0.8rem] text-ink-muted">
                      <span className="block font-heading text-[1.48rem] font-black text-primary">{stat.num}</span>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] bg-white p-7 shadow-md">
              <h4 className="mb-4 flex items-center gap-2 font-heading text-[0.98rem] font-bold text-primary">
                <i className="fas fa-map-pin" aria-hidden="true" /> Key Routes Served
              </h4>
              <div className="mb-4 flex flex-wrap gap-2">
                {transportRoutes.map((route) => (
                  <div
                    key={route}
                    className="inline-flex items-center gap-1.5 rounded-full border border-accent2/[0.18] bg-accent2/[0.07] px-[13px] py-1.5 text-[0.8rem] font-bold text-accent2-dark transition-all duration-[320ms] ease-bounce hover:-translate-y-0.5 hover:bg-accent2 hover:text-white"
                  >
                    <i className="fas fa-circle text-[0.48rem]" aria-hidden="true" /> {route}
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 rounded-sm border border-gold/20 bg-gold/[0.07] px-3.5 py-3 text-[0.82rem] text-[#795548]">
                <i className="fas fa-info-circle mt-0.5 flex-shrink-0 text-gold" aria-hidden="true" /> GPS-tracked buses
                with real-time tracking via the college app. Contact transport department for full route details.
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
