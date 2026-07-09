import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getToken, storeToken, removeToken, isAuthenticated as checkAuth } from '../utils/token'

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
  } catch {
    /* sessionStorage may be unavailable */
  }
}

export function RADSEAAuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => checkAuth())

  useEffect(() => {
    const interval = setInterval(() => {
      if (!checkAuth()) setAuthenticated(false)
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  const login = useCallback(async (user, pass) => {
    if (isLockedOut()) {
      return { ok: false, error: 'Trop de tentatives. Réessayez dans 5 minutes.' }
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pass }),
      })

      const data = await res.json()

      if (!res.ok) {
        const attempts = getAttempts() + 1
        setAttempts(attempts)

        if (attempts >= MAX_ATTEMPTS) {
          setLockoutUntil(Date.now() + LOCKOUT_DURATION_MS)
          return { ok: false, error: 'Compte temporairement verrouillé après 5 tentatives. Réessayez dans 5 minutes.' }
        }

        const remaining = MAX_ATTEMPTS - attempts
        return { ok: false, error: `${data.error || 'Identifiants incorrects'}. ${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.` }
      }

      clearAttempts()
      storeToken(data.token)
      setAuthenticated(true)
      return { ok: true }
    } catch {
      return { ok: false, error: 'Erreur réseau. Réessayez.' }
    }
  }, [])

  const logout = useCallback(() => {
    removeToken()
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
