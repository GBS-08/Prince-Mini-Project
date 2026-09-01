import useScrollState from '../hooks/useScrollState'

/** Thin animated gradient progress bar pinned to the top of the viewport. */
export default function ScrollProgressBar() {
  const { progress } = useScrollState()

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[9999] h-[3px] animate-progress-shimmer bg-[linear-gradient(90deg,#4CAF50,#2196F3,#4CAF50)] bg-[length:200%_auto] shadow-[0_0_10px_rgba(76,175,80,0.6)] transition-[width] duration-[80ms] ease-linear"
      style={{ width: `${progress}%` }}
    />
  )
}
