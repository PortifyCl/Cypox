import { useState, useEffect } from 'react'
import { getConsent, setConsent } from '../utils/consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => getConsent() === null)

  useEffect(() => {
    const onConsent = () => setVisible(false)
    window.addEventListener('cookie-consent', onConsent)
    return () => window.removeEventListener('cookie-consent', onConsent)
  }, [])

  const handleAccept = () => {
    setConsent('accepted')
    setVisible(false)
    window.dispatchEvent(new Event('cookie-consent'))
  }

  const handleDecline = () => {
    setConsent('declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9998] p-4 sm:p-6"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      role="dialog"
      aria-modal="true"
      aria-label="Consentement cookies"
    >
      <div className="max-w-4xl mx-auto bg-white border border-cypox-border rounded-2xl shadow-2xl shadow-black/10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex-1">
          <p className="text-cypox-black font-medium text-sm mb-1">Ce site utilise des cookies</p>
          <p className="text-cypox-gray text-xs leading-relaxed">
            Google Analytics mesure l&apos;audience uniquement après votre consentement. Aucun cookie de tracking
            n&apos;est déposé sans votre accord.
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
