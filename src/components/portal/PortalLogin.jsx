import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck } from 'lucide-react'
import Button from '../Button'
import { Field, TextInput } from '../FormField'

export function PortalLogin({
  title,
  subtitle,
  icon: Icon = ShieldCheck,
  onSubmit,
  loading,
  error,
}) {
  const [regno, setRegno] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ regno: regno.trim().toUpperCase(), password })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="surface-card mx-auto w-full max-w-md p-6 sm:p-8"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-brand">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-center font-display text-2xl font-extrabold">{title}</h2>
      <p className="mt-2 text-center text-sm prose-muted">{subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
        <Field label="Register Number" htmlFor="portal-regno" required>
          <TextInput
            id="portal-regno"
            value={regno}
            onChange={(event) => setRegno(event.target.value)}
            placeholder="e.g. 411621104001"
            autoComplete="username"
            className="uppercase"
            required
          />
        </Field>

        <Field label="Password" htmlFor="portal-password" required>
          <div className="relative">
            <TextInput
              id="portal-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-1 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-brand-700 dark:hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </Field>

        {error ? (
          <p
            role="alert"
            className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
          >
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Sign In
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs prose-muted">
        Credentials are issued by the college administration. Contact the office if you cannot sign
        in.
      </p>
    </motion.div>
  )
}

export default PortalLogin
