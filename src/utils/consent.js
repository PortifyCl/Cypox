const CONSENT_KEY = 'cypox_cookie_consent'

export function getConsent() {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value)
  } catch {
    // localStorage may be unavailable
  }
}
