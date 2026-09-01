import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PageHero from '../components/PageHero'
import Modal from '../components/Modal'
import { supabase, errorMessage } from '../services/supabase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import usePageMeta from '../hooks/usePageMeta'

const TYPE_CONFIG = {
  event: { emoji: '🎉', label: 'Event', color: '#4CAF50', badgeClass: 'badge-green' },
  exam: { emoji: '📝', label: 'Exam', color: '#F44336', badgeClass: 'badge-red' },
  notice: { emoji: '📢', label: 'Notice', color: '#2196F3', badgeClass: 'badge-blue' },
}

const FILTERS = [
  { type: 'all', icon: 'fas fa-border-all', label: 'All' },
  { type: 'event', icon: 'fas fa-calendar-check', label: 'Events' },
  { type: 'exam', icon: 'fas fa-file-alt', label: 'Exams' },
  { type: 'notice', icon: 'fas fa-bullhorn', label: 'Notices' },
]

const ACTION_BUTTON = {
  register: 'bg-gradient-to-br from-accent to-accent-dark text-white shadow-[0_4px_14px_rgba(76,175,80,0.30)]',
  view: 'bg-gradient-to-br from-accent2 to-accent2-dark text-white shadow-[0_4px_14px_rgba(33,150,243,0.28)]',
  registered: 'bg-gradient-to-br from-[#FF9800] to-[#e65100] text-white',
  signin: 'bg-gradient-to-br from-[#9C27B0] to-[#6A1B9A] text-white shadow-[0_4px_14px_rgba(156,39,176,0.28)]',
}

const formatDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

const registrationsOf = (notice) => (Array.isArray(notice?.registrations) ? notice.registrations : [])

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-black/[0.04] bg-white shadow-md">
      <div className="skeleton h-[5px] w-full" />
      <div className="flex flex-col gap-3 px-5 py-[22px]">
        <div className="skeleton h-5 w-24 rounded-full" />
        <div className="skeleton h-5 w-4/5 rounded-md" />
        <div className="skeleton h-3.5 w-2/5 rounded-md" />
        <div className="skeleton h-3 w-full rounded-md" />
        <div className="skeleton h-3 w-11/12 rounded-md" />
        <div className="skeleton mt-2 h-[42px] w-full rounded-sm" />
      </div>
    </div>
  )
}

export default function NoticeBoard() {
  usePageMeta({
    title: 'Notice Board - Prince Dr K Vasudevan College',
    description: 'Latest notices, events and exam announcements from Prince Dr K Vasudevan College.',
  })

  const { user, profile, displayName, openAuthModal } = useAuth()
  const { showToast } = useToast()

  const [notices, setNotices] = useState([])
  const [status, setStatus] = useState('loading')
  const [filter, setFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [activeNotice, setActiveNotice] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', regno: '', year: '' })
  const autoFilled = useRef(false)

  const loadNotices = useCallback(async () => {
    const { data, error } = await supabase.from('notices_informations').select('*').order('date', { ascending: true })

    if (error) {
      setStatus('error')
      showToast(`Failed to load notices: ${errorMessage(error)}`, 'error')
      return
    }
    setNotices(data || [])
    setStatus('ready')
  }, [showToast])

  useEffect(() => {
    loadNotices()
  }, [loadNotices])

  /** Live updates — same `notices_informations` channel as the original page. */
  useEffect(() => {
    const channel = supabase
      .channel('nb-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices_informations' }, loadNotices)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadNotices])

  /** Debounced search, matching the original 250 ms delay. */
  useEffect(() => {
    const id = window.setTimeout(() => setSearch(searchInput.trim()), 250)
    return () => window.clearTimeout(id)
  }, [searchInput])

  const visible = useMemo(() => {
    let list = filter === 'all' ? notices : notices.filter((n) => n.type === filter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (n) =>
          (n.title || '').toLowerCase().includes(q) ||
          (n.description || '').toLowerCase().includes(q) ||
          (n.type || '').toLowerCase().includes(q),
      )
    }
    return list
  }, [notices, filter, search])

  const openRegister = (notice) => {
    const regs = registrationsOf(notice)
    if (user && regs.some((r) => r.email === user.email)) {
      showToast('You are already registered for this event!', 'info')
      return
    }
    if (user && profile) {
      autoFilled.current = true
      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        regno: profile.regno || '',
        year: profile.year || '',
      })
    } else {
      autoFilled.current = false
      setForm({ name: '', phone: '', regno: '', year: '' })
    }
    setActiveNotice(notice)
  }

  const handleAction = (notice) => {
    if (notice.type === 'notice') {
      showToast(`${notice.title}: ${notice.description || 'No additional details.'}`, 'info', 8000)
      return
    }
    openRegister(notice)
  }

  const submitRegistration = async (event) => {
    event.preventDefault()
    const notice = activeNotice
    if (!notice) return

    const name = form.name.trim()
    const phone = form.phone.trim()
    const regno = form.regno.trim().toUpperCase()
    const year = form.year.trim()

    if (!name || !phone || !regno) {
      showToast('Please fill Name, Phone and Register Number.', 'warning')
      return
    }

    const email = user ? user.email : `${regno}@guest.pdkv`
    const regs = registrationsOf(notice)

    if (regs.some((r) => r.email === email || r.regno === regno)) {
      showToast('You are already registered for this event!', 'warning')
      return
    }

    setSubmitting(true)

    // Access control: the register number must exist in student or teacher credentials.
    const [studentCred, teacherCred] = await Promise.all([
      supabase.from('student_credentials').select('register_no').eq('register_no', regno).maybeSingle(),
      supabase.from('teacher_credentials').select('register_no').eq('register_no', regno).maybeSingle(),
    ])

    if ((!studentCred.data && !teacherCred.data) || studentCred.error || teacherCred.error) {
      setSubmitting(false)
      showToast('You have no access to register this event or program.', 'error')
      return
    }

    const updated = [...regs, { name, phone, regno, year, email, registered_at: new Date().toISOString() }]

    const { error } = await supabase.from('notices_informations').update({ registrations: updated }).eq('id', notice.id)

    setSubmitting(false)

    if (error) {
      showToast(`Registration failed: ${errorMessage(error)}`, 'error')
      return
    }

    showToast(`Successfully registered for "${notice.title}"! 🎉`, 'success')
    setActiveNotice(null)
    loadNotices()
  }

  const activeRegs = registrationsOf(activeNotice)

  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        overlay="linear-gradient(135deg, rgba(8,10,55,0.92), rgba(100,120,234,0.68))"
        height="min-h-[clamp(220px,35vw,350px)]"
        title={
          <>
            <i className="fas fa-bell inline-block origin-top animate-nb-bell" aria-hidden="true" /> Notice Board
          </>
        }
        subtitle="Stay updated with college events, exams & announcements"
        subtitleClassName="text-[clamp(0.88rem,1.75vw,1.08rem)] mb-6"
      >
        <div className="flex animate-fade-in-up flex-wrap items-center justify-center gap-2.5">
          {user && (
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/[0.38] bg-accent/[0.22] px-[18px] py-2 text-[0.88rem] font-bold text-mint">
              👋 Hi, {displayName}!
            </span>
          )}
        </div>
      </PageHero>

      <section className="section-block bg-[linear-gradient(135deg,#f0f4f8,#e8f4fd)]">
        <div className="container-page">
          {/* Search */}
          <div className="group relative mx-auto mb-8 max-w-[440px]">
            <i
              className="fas fa-search pointer-events-none absolute left-[17px] top-1/2 -translate-y-1/2 text-[0.98rem] text-ink-muted transition-colors duration-[280ms] group-focus-within:text-accent"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search notices"
              placeholder="Search notices, events, exams…"
              className="w-full rounded-full border-2 border-line bg-white py-[13px] pl-12 pr-5 font-body text-[0.93rem] text-ink-body shadow-sm outline-none transition-all duration-[320ms] focus:-translate-y-0.5 focus:border-accent focus:shadow-[0_0_0_4px_rgba(76,175,80,0.12),0_2px_8px_rgba(0,0,0,0.07)]"
            />
          </div>

          {/* Filters */}
          <div
            className="mb-10 flex flex-wrap justify-center gap-2.5 max-md:gap-2"
            role="group"
            aria-label="Filter notices"
          >
            {FILTERS.map((item) => {
              const isActive = filter === item.type
              return (
                <button
                  key={item.type}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter(item.type)}
                  className={`inline-flex cursor-pointer items-center gap-[7px] rounded-full border-2 px-[22px] py-2.5 font-body text-[0.88rem] font-bold transition-all duration-[350ms] ease-bounce hover:-translate-y-[3px] hover:scale-[1.06] hover:border-transparent hover:bg-gradient-to-br hover:from-primary hover:to-primary-light hover:text-white hover:shadow-[0_8px_24px_rgba(26,35,126,0.28)] ${
                    isActive
                      ? '-translate-y-[3px] scale-[1.06] border-transparent bg-gradient-to-br from-primary to-primary-light text-white shadow-[0_8px_24px_rgba(26,35,126,0.28)]'
                      : 'border-line bg-white text-ink-body'
                  }`}
                >
                  <i className={item.icon} aria-hidden="true" /> {item.label}
                </button>
              )
            })}
          </div>

          {/* Notices */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(315px,1fr))] gap-[22px] max-md:grid-cols-1">
            {status === 'loading' &&
              Array.from({ length: 6 }, (_, index) => <SkeletonCard key={`skeleton-${index}`} />)}

            {status === 'error' && (
              <div className="col-span-full animate-fade-in-up px-[22px] py-20 text-center text-ink-muted">
                <div className="mb-4 block animate-empty-float text-[3.5rem]">⚠️</div>
                <p className="text-[1.08rem]">Could not load notices right now.</p>
                <button type="button" className="btn btn-outline mt-4" onClick={loadNotices}>
                  <i className="fas fa-redo" /> Try Again
                </button>
              </div>
            )}

            {status === 'ready' && visible.length === 0 && (
              <div className="col-span-full animate-fade-in-up px-[22px] py-20 text-center text-ink-muted">
                <div className="mb-4 block animate-empty-float text-[3.5rem]">📭</div>
                <p className="text-[1.08rem]">
                  No{' '}
                  {search ? (
                    <>
                      results for &quot;<strong>{search}</strong>&quot;
                    </>
                  ) : (
                    `${filter === 'all' ? '' : `${filter} `}notices found`
                  )}
                  .
                </p>
              </div>
            )}

            {status === 'ready' &&
              visible.map((notice, index) => {
                const cfg = TYPE_CONFIG[notice.type] || TYPE_CONFIG.notice
                const regs = registrationsOf(notice)
                const isRegistered = user && regs.some((r) => r.email === user.email)

                return (
                  <article
                    key={notice.id}
                    style={{ animationDelay: `${0.04 + index * 0.06}s` }}
                    className="group flex animate-card-reveal flex-col overflow-hidden rounded-[22px] border border-black/[0.04] bg-white shadow-md transition-all duration-[420ms] ease-soft hover:-translate-y-[9px] hover:scale-[1.015] hover:border-accent/[0.12] hover:shadow-[0_26px_56px_rgba(0,0,0,0.13)]"
                  >
                    <div
                      className="h-[5px] w-full transition-[height] duration-[280ms] group-hover:h-[7px]"
                      style={{ background: cfg.color }}
                    />
                    <div className="flex flex-1 flex-col px-5 py-[22px]">
                      <div className="mb-[11px] flex flex-wrap items-center justify-between gap-2">
                        <span className={`badge ${cfg.badgeClass}`}>
                          {cfg.emoji} {cfg.label}
                        </span>
                        {notice.type !== 'notice' && (
                          <span className="animate-count-pulse rounded-full border border-accent/[0.22] bg-accent/[0.09] px-2.5 py-[3px] text-[0.76rem] font-bold text-accent-dark">
                            <i className="fas fa-users" aria-hidden="true" /> {regs.length} Registered
                          </span>
                        )}
                      </div>

                      <h3 className="my-2 font-heading text-[clamp(0.98rem,1.55vw,1.08rem)] font-bold leading-[1.35] text-primary">
                        {notice.title}
                      </h3>

                      <div className="mb-3 flex flex-wrap gap-3 text-[0.8rem] text-ink-muted">
                        <span className="flex items-center gap-[5px]">
                          <i className="fas fa-calendar" aria-hidden="true" /> {formatDate(notice.date)}
                        </span>
                        <span className="flex items-center gap-[5px]">
                          <i className="fas fa-clock" aria-hidden="true" /> {notice.time || 'All Day'}
                        </span>
                      </div>

                      <p className="mb-4 line-clamp-3 flex-1 text-[clamp(0.83rem,1.25vw,0.9rem)] leading-[1.68] text-ink-body">
                        {notice.description || ''}
                      </p>

                      {notice.type === 'notice' ? (
                        <button
                          type="button"
                          onClick={() => handleAction(notice)}
                          className={`flex w-full cursor-pointer items-center justify-center gap-[7px] rounded-sm border-none p-[11px] font-body text-[0.88rem] font-bold transition-all duration-[350ms] ease-bounce hover:-translate-y-[3px] hover:scale-[1.02] ${ACTION_BUTTON.view}`}
                        >
                          <i className="fas fa-eye" /> View Details
                        </button>
                      ) : isRegistered ? (
                        <button
                          type="button"
                          disabled
                          className={`flex w-full items-center justify-center gap-[7px] rounded-sm border-none p-[11px] font-body text-[0.88rem] font-bold opacity-[0.62] ${ACTION_BUTTON.registered}`}
                        >
                          <i className="fas fa-check-circle" /> Registered!
                        </button>
                      ) : user ? (
                        <button
                          type="button"
                          onClick={() => handleAction(notice)}
                          className={`flex w-full cursor-pointer items-center justify-center gap-[7px] rounded-sm border-none p-[11px] font-body text-[0.88rem] font-bold transition-all duration-[350ms] ease-bounce hover:-translate-y-[3px] hover:scale-[1.02] ${ACTION_BUTTON.register}`}
                        >
                          <i className="fas fa-clipboard-check" /> Register Now
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openAuthModal('login')}
                          className={`flex w-full cursor-pointer items-center justify-center gap-[7px] rounded-sm border-none p-[11px] font-body text-[0.88rem] font-bold transition-all duration-[350ms] ease-bounce hover:-translate-y-[3px] hover:scale-[1.02] ${ACTION_BUTTON.signin}`}
                        >
                          <i className="fas fa-sign-in-alt" /> Sign In to Register
                        </button>
                      )}
                    </div>
                  </article>
                )
              })}
          </div>
        </div>
      </section>

      {/* REGISTER MODAL */}
      <Modal
        open={Boolean(activeNotice)}
        onClose={() => setActiveNotice(null)}
        title={activeNotice?.title || 'Register for Event'}
      >
        <p className="mb-4 rounded-sm bg-surface-subtle px-3.5 py-2.5 text-[0.86rem] leading-[1.72] text-ink-muted">
          📅 {activeNotice?.date || '—'} {activeNotice?.time ? `⏰ ${activeNotice.time}` : ''} | 👥 {activeRegs.length}{' '}
          already registered
        </p>

        {autoFilled.current && (
          <div className="mb-4 rounded-sm border border-accent/[0.22] bg-accent/[0.08] px-3.5 py-2.5 text-[0.83rem] font-semibold text-accent-dark">
            ✅ Details auto-filled from your profile. You can edit if needed.
          </div>
        )}

        <form onSubmit={submitRegistration} noValidate>
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
            { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 99999 99999' },
            { key: 'regno', label: 'Register Number', type: 'text', placeholder: 'e.g. 22CS101' },
            { key: 'year', label: 'Year', type: 'text', placeholder: 'e.g. 2nd Year' },
          ].map((field) => (
            <div className="form-group" key={field.key}>
              <label className="form-label" htmlFor={`reg-${field.key}`}>
                {field.label}
              </label>
              <input
                id={`reg-${field.key}`}
                type={field.type}
                className="form-input"
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                required
              />
            </div>
          ))}

          <button type="submit" className="btn btn-primary mt-2 w-full justify-center" disabled={submitting}>
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Registering…
              </>
            ) : (
              <>
                <i className="fas fa-check-circle" /> Confirm Registration
              </>
            )}
          </button>
        </form>
      </Modal>
    </>
  )
}
