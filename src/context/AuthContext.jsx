import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, errorMessage } from '../services/supabase'
import { useToast } from './ToastContext'

const AuthContext = createContext(null)

/**
 * Global site auth (the passwordless e-mail OTP flow from the original
 * `shared.js`). Exposes the current Supabase user, their row in
 * `login_information`, and helpers to open the auth modal / sign out.
 *
 * The Student and Teacher portals keep their own register-number + password
 * sign-in; this context only powers the header account chip and the notice
 * board registration auto-fill, exactly as before.
 */
export function AuthProvider({ children }) {
  const { showToast } = useToast()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' })

  const loadProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfile(null)
      return
    }
    try {
      const { data } = await supabase.from('login_information').select('*').eq('id', currentUser.id).maybeSingle()
      setProfile(data || {})
    } catch {
      setProfile({})
    }
  }, [])

  useEffect(() => {
    let active = true

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return
        const sessionUser = data?.session?.user ?? null
        setUser(sessionUser)
        return loadProfile(sessionUser)
      })
      .catch((error) => console.warn('Auth session error:', errorMessage(error)))
      .finally(() => active && setLoading(false))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null
      setUser(sessionUser)
      loadProfile(sessionUser)
    })

    return () => {
      active = false
      subscription?.unsubscribe()
    }
  }, [loadProfile])

  const openAuthModal = useCallback((mode = 'login') => setAuthModal({ open: true, mode }), [])
  const closeAuthModal = useCallback(() => setAuthModal((s) => ({ ...s, open: false })), [])

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      showToast('Signed out successfully.', 'info')
    } catch (error) {
      showToast(`Sign-out error: ${errorMessage(error)}`, 'error')
    }
  }, [showToast])

  /** Upsert the signed-in user into `login_information` (post-OTP). */
  const saveLoginInformation = useCallback(async (authUser, signupData) => {
    const payload = { id: authUser.id, email: authUser.email }

    const { data: existing } = await supabase
      .from('login_information')
      .select('id, name, phone, gender, regno')
      .eq('id', authUser.id)
      .maybeSingle()

    if (existing) {
      if (signupData) {
        await supabase
          .from('login_information')
          .update({
            name: signupData.name,
            phone: signupData.phone,
            gender: signupData.gender,
            regno: signupData.regno || existing.regno || '',
          })
          .eq('id', authUser.id)
      }
      setProfile({ ...existing, ...payload, ...(signupData || {}) })
      return
    }

    const insertPayload = signupData
      ? {
          ...payload,
          name: signupData.name,
          phone: signupData.phone,
          gender: signupData.gender,
          regno: signupData.regno || '',
        }
      : payload

    const { data: inserted } = await supabase
      .from('login_information')
      .upsert(insertPayload, { onConflict: 'id' })
      .select()
      .maybeSingle()

    setProfile(inserted || insertPayload)
  }, [])

  const displayName = useMemo(() => {
    if (!user) return ''
    return profile?.name || user.email?.split('@')[0] || 'Account'
  }, [user, profile])

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      displayName,
      authModal,
      openAuthModal,
      closeAuthModal,
      logout,
      saveLoginInformation,
      setUser,
    }),
    [user, profile, loading, displayName, authModal, openAuthModal, closeAuthModal, logout, saveLoginInformation],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
