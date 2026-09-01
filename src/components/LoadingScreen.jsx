/** Full-viewport loader shown while a lazily-loaded route chunk downloads. */
export default function LoadingScreen({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 bg-surface-light py-24">
      <div className="spinner" role="status" aria-live="polite" />
      <p className="text-[0.9rem] font-semibold text-ink-muted">{label}</p>
    </div>
  )
}
