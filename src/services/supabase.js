import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client.
 *
 * Credentials come from Vite environment variables (see `.env.example`):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *
 * Only the *anon* (publishable) key may ever appear in frontend code — it is
 * safe to expose because row level security governs what it can read/write.
 * A service-role key must never be used here.
 *
 * The literals below are the values that already shipped publicly with the
 * pre-React site; they are kept purely as a fallback so an unconfigured
 * environment still renders instead of crashing.
 */
const PUBLIC_FALLBACK_URL = 'https://zsuonqltlodkzrqlhsnm.supabase.co'
const PUBLIC_FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdW9ucWx0bG9ka3pycWxoc25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODUwNzAsImV4cCI6MjA4OTE2MTA3MH0.Ea8xTDxxp6GaDfUNuByjkQaUcFxJPrdO1VrzG06cTH4'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || PUBLIC_FALLBACK_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || PUBLIC_FALLBACK_ANON_KEY

if (import.meta.env.DEV && !import.meta.env.VITE_SUPABASE_URL) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — falling back to the public project credentials. Copy .env.example to .env to configure them.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/** Public URL for an object inside a Supabase storage bucket. */
export function publicUrl(bucket, path) {
  const {
    data: { publicUrl: url },
  } = supabase.storage.from(bucket).getPublicUrl(path)
  return url
}

/** Normalises a Supabase/network error into a user-facing message. */
export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback
  return error.message || error.error_description || fallback
}
