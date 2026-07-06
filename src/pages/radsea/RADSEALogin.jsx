import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useRADSEAAuth } from '../../contexts/RADSEAAuth'

const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 60

export default function RADSEALogin() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockout, setLockout] = useState(0)
  const { login } = useRADSEAAuth()
  const navigate = useNavigate()

  const isLocked = lockout > 0

  const startLockout = useCallback(() => {
    setLockout(LOCKOUT_DURATION)
    const interval = setInterval(() => {
      setLockout(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setAttempts(0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLocked) return

    setLoading(true)
    setError(false)

    setTimeout(() => {
      if (login(user, pass)) {
        navigate('/radsea/dashboard')
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        setError(true)
        setLoading(false)
        if (newAttempts >= MAX_ATTEMPTS) startLockout()
      }
    }, 500)
  }

  return (
    <div className="h-screen w-full flex items-center justify-center p-8 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300"/>

      <div className="glass-container w-full max-w-[420px] rounded-[40px] p-10 shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <img src="/Logo.webp" alt="CYPOX" className="h-10 w-auto mb-1" />
          <span className="text-[11px] text-gray-400 uppercase tracking-[0.25em] font-semibold">RADSEA</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wider">Identifiant</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              disabled={isLocked}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-gray-400 focus:shadow-soft transition-all disabled:opacity-40"
              placeholder="Entrez votre identifiant"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-semibold mb-1.5 uppercase tracking-wider">Mot de passe</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              disabled={isLocked}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:border-gray-400 focus:shadow-soft transition-all disabled:opacity-40"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          {isLocked && (
            <p className="text-red-500 text-xs text-center font-medium">
              Trop de tentatives. Réessayez dans {lockout}s.
            </p>
          )}

          {error && !isLocked && (
            <p className="text-red-500 text-xs text-center font-medium">
              Identifiants incorrects — {MAX_ATTEMPTS - attempts} tentative(s) restante(s)
            </p>
          )}

          <button
            type="submit"
            disabled={loading || isLocked || !user || !pass}
            className="w-full bg-gray-900 text-white font-semibold text-sm py-3.5 rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-40 min-h-[48px]"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLocked ? `Verrouillé ${lockout}s` : 'Connexion'}
          </button>
        </form>
      </div>
    </div>
  )
}
