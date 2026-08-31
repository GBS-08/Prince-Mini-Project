import { AlertCircle } from 'lucide-react'

const CONTROL =
  'w-full min-h-[46px] rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 disabled:bg-slate-50 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500'

function borderClass(error) {
  return error
    ? 'border-rose-400 dark:border-rose-500/60'
    : 'border-slate-200 dark:border-white/10'
}

export function Field({ label, htmlFor, required, error, hint, className = '', children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
        {required ? (
          <span className="ml-0.5 text-rose-500" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400"
        >
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs prose-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export function TextInput({ id, error, className = '', ...props }) {
  return (
    <input
      id={id}
      className={`${CONTROL} ${borderClass(error)} ${className}`}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
  )
}

export function SelectInput({ id, error, children, className = '', ...props }) {
  return (
    <select
      id={id}
      className={`${CONTROL} ${borderClass(error)} ${className}`}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    >
      {children}
    </select>
  )
}

export function TextArea({ id, error, className = '', ...props }) {
  return (
    <textarea
      id={id}
      className={`${CONTROL} resize-y ${borderClass(error)} ${className}`}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
  )
}

export function Checkbox({ id, label, error, ...props }) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-white/20 dark:bg-white/10"
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}
