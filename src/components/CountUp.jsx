import useCountUp from '../hooks/useCountUp'

/** Animated statistic value (the old `[data-target]` counters). */
export default function CountUp({ to, percent = false, className = '', as: Tag = 'span' }) {
  const [ref, text] = useCountUp(to, { percent })
  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  )
}
