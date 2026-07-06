import { createContext, useContext, useState, useCallback } from 'react'

const RADSEA_USER = import.meta.env.VITE_RADSEA_USER || 'Cypox111'
const RADSEA_PASS = import.meta.env.VITE_RADSEA_PASS || 'Cypox11@11'
const STORAGE_KEY = 'radsea_auth'

const AuthContext = createContext(null)

export function RADSEAAuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch { return false }
  })

  const login = useCallback((user, pass) => {
    if (user === RADSEA_USER && pass === RADSEA_PASS) {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
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
