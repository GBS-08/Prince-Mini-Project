import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { college, navigation } from '../data/navigation'
import { useAuth } from '../context/AuthContext'
import useScrollState from '../hooks/useScrollState'
import useLockBodyScroll from '../hooks/useLockBodyScroll'

const NAV_LINK_BASE =
  "relative inline-flex items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full border-[1.5px] border-transparent px-4 py-[9px] font-body text-[clamp(0.78rem,0.95vw,0.88rem)] font-semibold transition-all duration-[450ms] ease-bounce before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-accent before:to-accent2 before:opacity-0 before:transition-opacity before:duration-[280ms] before:content-[''] hover:-translate-y-0.5 hover:text-white hover:shadow-[0_6px_20px_rgba(76,175,80,0.30)] hover:before:opacity-100 max-md:w-full max-md:justify-center max-md:px-5 max-md:py-3 max-md:text-[0.98rem]"

const AUTH_BTN =
  'inline-flex cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-full border-0 px-5 py-[9px] font-body text-[clamp(0.78rem,0.95vw,0.88rem)] font-bold tracking-[0.01em] text-white transition-all duration-[450ms] ease-bounce hover:-translate-y-0.5 hover:scale-[1.04] max-md:w-full max-md:justify-center'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { scrolled } = useScrollState()
  const { user, displayName, profile, openAuthModal, logout } = useAuth()
  const { pathname } = useLocation()
  const navRef = useRef(null)
  const buttonRef = useRef(null)

  useLockBodyScroll(open)

  const close = useCallback(() => setOpen(false), [])

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close on outside click and on Escape (keyboard accessible menu).
  useEffect(() => {
    if (!open) return undefined
    const onClick = (event) => {
      if (navRef.current?.contains(event.target)) return
      if (buttonRef.current?.contains(event.target)) return
      close()
    }
    const onKey = (event) => {
      if (event.key === 'Escape') {
        close()
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  return (
    <header
      className={`sticky top-0 z-[1000] animate-header-slide-down border-b backdrop-blur-[28px] backdrop-saturate-[180%] transition-all duration-[350ms] ${
        scrolled
          ? 'border-[rgba(26,35,126,0.10)] bg-white/[0.99] shadow-header-scrolled'
          : 'border-[rgba(26,35,126,0.07)] bg-white/[0.96] shadow-header'
      }`}
    >
      <div className="mx-auto flex h-header max-w-[1400px] items-center justify-between gap-5 px-7">
        {/* Brand */}
        <NavLink to="/" className="flex shrink-0 items-center gap-3.5 no-underline" aria-label={college.fullName}>
          <img
            src={college.logo}
            alt="PDKV Logo"
            width="62"
            height="62"
            className="h-[50px] w-[50px] shrink-0 rounded-full border-[2.5px] border-accent object-cover shadow-[0_0_0_4px_rgba(76,175,80,0.10),0_4px_16px_rgba(76,175,80,0.25)] transition-all duration-[450ms] ease-bounce hover:rotate-[10deg] hover:scale-[1.12] hover:border-accent2 hover:shadow-[0_0_0_6px_rgba(76,175,80,0.15),0_8px_28px_rgba(76,175,80,0.4)] sm:h-[62px] sm:w-[62px]"
          />
          <span className="hidden max-w-[240px] font-heading text-[0.88rem] font-bold leading-[1.35] text-gradient-brand sm:block lg:max-w-[310px] lg:text-[clamp(0.82rem,1.15vw,0.98rem)]">
            {college.fullName}
          </span>
        </NavLink>

        {/* Hamburger */}
        <button
          ref={buttonRef}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
          className="z-[1010] flex cursor-pointer flex-col gap-[5px] rounded-sm border-0 bg-transparent p-[9px] transition-colors duration-200 hover:bg-surface-subtle md:hidden"
        >
          <span
            className={`block h-0.5 w-6 rounded bg-primary transition-all duration-[350ms] ease-bounce ${
              open ? 'translate-x-[5px] translate-y-[5px] rotate-45 !bg-accent2' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded bg-primary transition-all duration-[350ms] ease-bounce ${
              open ? 'scale-x-0 opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded bg-primary transition-all duration-[350ms] ease-bounce ${
              open ? 'translate-x-[5px] -translate-y-[5px] -rotate-45 !bg-accent' : ''
            }`}
          />
        </button>

        {/* Navigation */}
        <nav
          id="site-nav"
          ref={navRef}
          aria-label="Main"
          className={`flex flex-wrap items-center gap-1 max-md:fixed max-md:left-0 max-md:right-0 max-md:top-header max-md:z-[999] max-md:flex-col max-md:items-stretch max-md:gap-2 max-md:border-b max-md:border-line max-md:bg-white/[0.99] max-md:px-5 max-md:py-[18px] max-md:shadow-[0_12px_36px_rgba(0,0,0,0.10)] max-md:backdrop-blur-[24px] max-md:transition-[transform,opacity] max-md:duration-[320ms] ${
            open ? 'max-md:translate-y-0 max-md:opacity-100' : 'max-md:-translate-y-[110%] max-md:opacity-0'
          }`}
          {...(!open ? { 'aria-hidden': undefined } : {})}
        >
          {navigation.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={close}
              tabIndex={open || typeof window === 'undefined' ? 0 : undefined}
              className={({ isActive }) =>
                `${NAV_LINK_BASE} animate-nav-item-in ${
                  isActive ? 'text-white shadow-[0_6px_20px_rgba(76,175,80,0.30)] before:opacity-100' : 'text-ink-muted'
                }`
              }
              style={{ animationDelay: `${0.08 + index * 0.06}s` }}
            >
              <i className={`${item.icon} relative z-[1] transition-transform duration-[250ms]`} aria-hidden="true" />
              <span className="relative z-[1]">{item.label}</span>
            </NavLink>
          ))}

          {user ? (
            <>
              <span className="inline-flex animate-chip-bounce items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-accent/[0.28] bg-gradient-to-br from-accent/10 to-accent2/10 px-4 py-[7px] text-[clamp(0.75rem,0.9vw,0.82rem)] font-bold text-accent-dark max-md:w-full max-md:justify-center">
                <i className="fas fa-user-circle" aria-hidden="true" /> {displayName}
                {profile?.regno ? ` · ${profile.regno}` : ''}
              </span>
              <button
                type="button"
                onClick={() => {
                  close()
                  logout()
                }}
                className={`${AUTH_BTN} animate-nav-item-in bg-gradient-to-br from-danger to-danger-dark hover:shadow-[0_8px_28px_rgba(244,67,54,0.38)]`}
                style={{ animationDelay: '0.5s' }}
              >
                <i className="fas fa-sign-out-alt" aria-hidden="true" /> Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                close()
                openAuthModal('login')
              }}
              className={`${AUTH_BTN} animate-nav-item-in bg-gradient-to-br from-primary to-primary-light hover:shadow-[0_8px_28px_rgba(26,35,126,0.38)]`}
              style={{ animationDelay: '0.5s' }}
            >
              <i className="fas fa-sign-in-alt" aria-hidden="true" /> Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
