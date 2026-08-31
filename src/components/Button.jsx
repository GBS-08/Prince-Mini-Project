import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

const VARIANTS = {
  primary:
    'bg-brand-gradient text-white shadow-brand hover:shadow-elevated hover:-translate-y-0.5 focus-visible:ring-brand-500',
  secondary:
    'bg-white text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50 hover:-translate-y-0.5 dark:bg-white/10 dark:text-white dark:ring-white/20 dark:hover:bg-white/15',
  accent:
    'bg-gold-gradient text-white shadow-card hover:shadow-elevated hover:-translate-y-0.5 focus-visible:ring-gold-400',
  ghost:
    'text-brand-700 hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-white/10',
  glass:
    'bg-white/10 text-white ring-1 ring-inset ring-white/30 backdrop-blur-md hover:bg-white/20 hover:-translate-y-0.5',
  outline:
    'border border-slate-300 text-slate-700 hover:border-brand-400 hover:text-brand-700 dark:border-white/20 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-white',
}

const SIZES = {
  sm: 'min-h-[40px] px-4 text-sm gap-1.5',
  md: 'min-h-[44px] px-5 text-sm gap-2',
  lg: 'min-h-[52px] px-7 text-base gap-2.5',
}

const BASE =
  'inline-flex select-none items-center justify-center rounded-xl font-semibold transition-all duration-300 ease-smooth disabled:pointer-events-none disabled:opacity-60'

export const Button = forwardRef(function Button(
  { as, to, href, variant = 'primary', size = 'md', className = '', children, ...props },
  ref,
) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  const Component = as ?? 'button'
  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  )
})

export default Button
