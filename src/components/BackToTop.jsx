import useScrollState from '../hooks/useScrollState'

/** Floating "back to top" pill, revealed after 400px of scroll. */
export default function BackToTop() {
  const { past } = useScrollState()

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={past ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-7 right-7 z-[8888] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-0 bg-gradient-to-br from-primary to-primary-light text-[1.05rem] text-white shadow-[0_6px_24px_rgba(26,35,126,0.34)] transition-all duration-[400ms] ease-bounce hover:-translate-y-1 hover:scale-[1.12] hover:from-accent hover:to-accent-dark hover:shadow-[0_12px_32px_rgba(26,35,126,0.44)] ${
        past
          ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-5 scale-[0.8] opacity-0'
      }`}
    >
      <i className="fas fa-chevron-up" aria-hidden="true" />
    </button>
  )
}
