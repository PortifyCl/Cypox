import { useState, useEffect } from 'react'

const CONSENT_KEY = 'cypox_cookie_consent'

export function getConsent() {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(CONSENT_KEY) } catch { return null }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = getConsent()
    if (!consent) setVisible(true)
  }, [])

  const handleAccept = () => {
    try { localStorage.setItem(CONSENT_KEY, 'accepted') } catch {}
    setVisible(false)
    window.dispatchEvent(new Event('cookie-consent'))
  }

  const handleDecline = () => {
    try { localStorage.setItem(CONSENT_KEY, 'declined') } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] p-4 sm:p-6" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }} role="dialog" aria-modal="true" aria-label="Consentement cookies">
      <div className="max-w-4xl mx-auto bg-white border border-cypox-border rounded-2xl shadow-2xl shadow-black/10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex-1">
          <p className="text-cypox-black font-medium text-sm mb-1">Ce site utilise des cookies</p>
          <p className="text-cypox-gray text-xs leading-relaxed">
            Google Analytics mesure l'audience uniquement après votre consentement. Aucun cookie de tracking n'est déposé sans votre accord.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-5 py-2.5 min-h-[44px] flex items-center text-sm font-medium text-cypox-gray hover:text-cypox-black transition-colors rounded-full border border-cypox-border hover:border-cypox-black"
          >
            Refuser
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 min-h-[44px] flex items-center text-sm font-bold text-white bg-cypox-black hover:bg-cypox-accent-hover transition-colors rounded-full"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
