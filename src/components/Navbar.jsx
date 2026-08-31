import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react'
import { college } from '@/data/college'
import { primaryNav, secondaryNav } from '@/data/navigation'
import { useTheme } from '@/context/ThemeContext'
import Button from './Button'

export function Navbar({ transparentTop = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const moreRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setMoreOpen(false)
      }
    }
    const onClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) setMoreOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [])

  const overlayMode = transparentTop && !scrolled && !menuOpen

  const shellClass = overlayMode
    ? 'bg-transparent'
    : 'bg-white/92 shadow-soft backdrop-blur-xl dark:bg-surface-dark/92 dark:shadow-none dark:ring-1 dark:ring-white/10'

  const linkBase =
    'relative rounded-lg px-2.5 py-2 text-[0.82rem] font-semibold transition-colors duration-200 xl:text-sm'
  const linkTone = overlayMode
    ? 'text-white/85 hover:text-white'
    : 'text-slate-600 hover:text-brand-700 dark:text-slate-300 dark:hover:text-white'
  const activeTone = overlayMode ? 'text-white' : 'text-brand-700 dark:text-white'

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-smooth ${shellClass}`}>
      <nav className="container flex h-[72px] items-center justify-between gap-3" aria-label="Primary">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5"
          aria-label={`${college.name} — home`}
        >
          <img
            src={college.logo}
            alt=""
            width="40"
            height="40"
            className="h-10 w-10 shrink-0 rounded-full bg-white object-contain ring-1 ring-black/5"
          />
          <span className="min-w-0">
            <span
              className={`block truncate font-display text-[0.9rem] font-extrabold leading-tight ${
                overlayMode ? 'text-white' : 'text-slate-900 dark:text-white'
              }`}
            >
              Prince Dr K Vasudevan
            </span>
            <span
              className={`block truncate text-[0.68rem] font-semibold uppercase tracking-[0.13em] ${
                overlayMode ? 'text-white/70' : 'text-brand-600 dark:text-brand-300'
              }`}
            >
              College of Engineering &amp; Technology
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {primaryNav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeTone : linkTone} group`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute inset-x-2.5 -bottom-0.5 h-[2px] rounded-full bg-gold-gradient transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                      aria-hidden="true"
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
          <li className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              className={`${linkBase} ${linkTone} inline-flex items-center gap-1`}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              More
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence>
              {moreOpen ? (
                <motion.ul
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-elevated dark:border-white/10 dark:bg-surface-dark-muted"
                >
                  {secondaryNav.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                            isActive
                              ? 'bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-white'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </motion.ul>
              ) : null}
            </AnimatePresence>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
              overlayMode
                ? 'text-white/85 hover:bg-white/15 hover:text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
            }`}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <Button to="/admissions#apply" size="sm" className="hidden sm:inline-flex">
            Apply Now
          </Button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-xl lg:hidden ${
              overlayMode
                ? 'text-white hover:bg-white/15'
                : 'text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10'
            }`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden dark:border-white/10 dark:bg-surface-dark"
          >
            <ul className="container flex max-h-[calc(100vh-72px)] flex-col gap-1 overflow-y-auto py-4">
              {[...primaryNav, ...secondaryNav].map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.028, duration: 0.25 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex min-h-[48px] items-center rounded-xl px-4 text-[0.95rem] font-semibold transition-colors ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-white'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
              <li className="mt-2">
                <Button to="/admissions#apply" size="lg" className="w-full">
                  Apply Now
                </Button>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
