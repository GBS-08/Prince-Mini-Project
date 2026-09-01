import { Link } from 'react-router-dom'
import { college, navigation, socialLinks } from '../data/navigation'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#060c3a_0%,#111e6e_45%,#0a2d70_100%)] px-6 pb-9 pt-14 text-center text-white/85">
      {/* Decorative glows (matched to .site-footer::before / ::after) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[100px] -top-[120px] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(76,175,80,0.08),transparent_70%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-[60px] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(33,150,243,0.07),transparent_70%)]"
      />

      <div className="relative z-[1] mx-auto max-w-[1200px]">
        <div className="mb-5 flex items-center justify-center gap-4">
          <img
            src={college.logo}
            alt="PDKV"
            width="54"
            height="54"
            loading="lazy"
            className="h-[54px] w-[54px] rounded-full border-[2.5px] border-accent object-cover shadow-[0_0_0_5px_rgba(76,175,80,0.12),0_4px_16px_rgba(76,175,80,0.25)] transition-all duration-[450ms] ease-bounce hover:rotate-[8deg] hover:scale-[1.12] hover:border-accent2"
          />
          <div>
            <p className="text-left font-heading text-base font-bold text-white">{college.name}</p>
            <p className="text-left text-[0.8rem] text-white/55">{college.suffix}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap justify-center gap-2.5">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-[0.95rem] text-white/65 no-underline transition-all duration-[450ms] ease-bounce hover:-translate-y-1 hover:scale-[1.14] hover:border-white/35 hover:bg-white/20 hover:text-white hover:shadow-[0_6px_16px_rgba(0,0,0,0.3)]"
            >
              <i className={social.icon} aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="mx-auto my-[18px] h-[3px] w-16 rounded bg-gradient-to-r from-accent to-accent2" />

        <nav aria-label="Footer" className="mb-[18px] flex flex-wrap justify-center gap-1.5">
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="inline-block rounded-full border border-white/[0.09] px-3.5 py-[5px] text-[0.84rem] font-medium text-white/60 transition-all duration-[450ms] ease-bounce hover:-translate-y-0.5 hover:border-white/[0.22] hover:bg-white/[0.11] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="mb-[5px] text-[clamp(0.74rem,1.1vw,0.82rem)] text-white/40">
          &copy; 2026 {college.fullName} &nbsp;|&nbsp; TNEA Code: {college.tneaCode}
        </p>
        <p className="text-[clamp(0.72rem,1vw,0.78rem)] text-white/[0.28]">{college.address}</p>
      </div>
    </footer>
  )
}
