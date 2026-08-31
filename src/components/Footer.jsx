import { Link } from 'react-router-dom'
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from 'lucide-react'
import { college } from '@/data/college'
import { footerNav } from '@/data/navigation'

const SOCIAL_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  globe: Globe,
}

export function Footer() {
  return (
    <footer className="bg-brand-950 text-slate-300">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6 lg:py-16">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={college.logo}
              alt=""
              width="48"
              height="48"
              loading="lazy"
              className="h-12 w-12 rounded-full bg-white object-contain"
            />
            <span>
              <span className="block font-display text-base font-extrabold text-white">
                {college.shortName}
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-brand-300">
                of Engineering &amp; Technology
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            NAAC A+ accredited institution affiliated to Anna University and approved by AICTE,
            offering engineering and management programmes on a 65-acre campus in Ponmar, Chennai.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {college.social.map((item) => {
              const Icon = SOCIAL_ICONS[item.icon] ?? Globe
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition hover:-translate-y-0.5 hover:bg-white/15 hover:text-white"
                    aria-label={`${college.shortName} on ${item.label}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        {footerNav.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
              {group.heading}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={`${group.heading}-${link.label}`}>
                  <Link
                    to={link.to}
                    className="link-underline inline-block text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <address className="not-italic">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              <span>
                {college.address.line1}
                <br />
                {college.address.line2}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              <span className="flex flex-col">
                {college.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                    className="transition-colors hover:text-white"
                  >
                    {phone}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              <a
                href={`mailto:${college.email}`}
                className="break-all transition-colors hover:text-white"
              >
                {college.email}
              </a>
            </li>
          </ul>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {college.name}. All Rights Reserved.
          </p>
          <p>TNEA Code: {college.tneaCode}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
