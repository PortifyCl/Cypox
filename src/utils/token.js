const TOKEN_KEY = 'radsea_token'
const TOKEN_EXPIRY_MS = 8 * 60 * 60 * 1000 // 8 hours

export function storeToken(token) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* sessionStorage may be unavailable */
  }
}

export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function removeToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    /* sessionStorage may be unavailable */
  }
}

export function isAuthenticated() {
  const token = getToken()
  if (!token) return false
  try {
    const parts = token.split('.')
    if (parts.length !== 3) { removeToken(); return false }
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
    const payload = JSON.parse(atob(padded))
    return payload.exp * 1000 > Date.now()
  } catch {
    removeToken()
    return false
  }
}
