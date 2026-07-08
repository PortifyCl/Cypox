import { createContext, useContext, useState, useCallback } from 'react'

const RADSEA_USER = import.meta.env.VITE_RADSEA_USER
const RADSEA_PASS = import.meta.env.VITE_RADSEA_PASS
const STORAGE_KEY = 'radsea_auth'
const ATTEMPTS_KEY = 'radsea_login_attempts'
const LOCKOUT_KEY = 'radsea_lockout_until'

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 5 * 60 * 1000 // 5 minutes

const AuthContext = createContext(null)

function getAttempts() {
  try {
    return parseInt(sessionStorage.getItem(ATTEMPTS_KEY) || '0', 10)
  } catch {
    return 0
  }
}

function setAttempts(n) {
  try {
    sessionStorage.setItem(ATTEMPTS_KEY, String(n))
  } catch {
    /* sessionStorage may be unavailable */
  }
}

function getLockoutUntil() {
  try {
    return parseInt(sessionStorage.getItem(LOCKOUT_KEY) || '0', 10)
  } catch {
    return 0
  }
}

function setLockoutUntil(ts) {
  try {
    sessionStorage.setItem(LOCKOUT_KEY, String(ts))
  } catch {
    /* sessionStorage may be unavailable */
  }
}

function isLockedOut() {
  return Date.now() < getLockoutUntil()
}

function clearAttempts() {
  try {
    sessionStorage.removeItem(ATTEMPTS_KEY)
    sessionStorage.removeItem(LOCKOUT_KEY)
  } catch {}
}

export function RADSEAAuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  const login = useCallback((user, pass) => {
    if (isLockedOut()) {
      return { ok: false, error: 'Trop de tentatives. Réessayez dans 5 minutes.' }
    }

    if (user === RADSEA_USER && pass === RADSEA_PASS) {
      clearAttempts()
      sessionStorage.setItem(STORAGE_KEY, '1')
      setAuthenticated(true)
      return { ok: true }
    }

    const attempts = getAttempts() + 1
    setAttempts(attempts)

    if (attempts >= MAX_ATTEMPTS) {
      setLockoutUntil(Date.now() + LOCKOUT_DURATION_MS)
      return { ok: false, error: 'Compte temporairement verrouillé après 5 tentatives. Réessayez dans 5 minutes.' }
    }

    const remaining = MAX_ATTEMPTS - attempts
    return { ok: false, error: `Identifiants incorrects. ${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.` }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    clearAttempts()
    setAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useRADSEAAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useRADSEAAuth must be used within RADSEAAuthProvider')
  return ctx
}
