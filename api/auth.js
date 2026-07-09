import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

const RADSEA_USER = process.env.RADSEA_USER
const RADSEA_PASS = process.env.RADSEA_PASS
const TOKEN_EXPIRY_MS = 8 * 60 * 60 * 1000 // 8 hours

function getSecret() {
  return createHmac('sha256', 'cypox-radsea').update(RADSEA_PASS || '').digest('hex')
}

function base64url(str) {
  return Buffer.from(str).toString('base64url')
}

function sign(header, payload, secret) {
  const data = `${base64url(header)}.${base64url(payload)}`
  const sig = createHmac('sha256', secret).update(data).digest('base64url')
  return `${data}.${sig}`
}

function verify(token, secret) {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, payload, sig] = parts
  const expected = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  } catch {
    return null
  }
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString())
  } catch {
    return null
  }
}

export function createToken() {
  const now = Date.now()
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    sub: 'radsea',
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + TOKEN_EXPIRY_MS) / 1000),
  }
  return sign(header, payload, getSecret())
}

export function verifyToken(token) {
  return verify(token, getSecret())
}

export function validateCredentials(user, pass) {
  try {
    const userMatch = timingSafeEqual(Buffer.from(user || ''), Buffer.from(RADSEA_USER || ''))
    const passMatch = timingSafeEqual(Buffer.from(pass || ''), Buffer.from(RADSEA_PASS || ''))
    return userMatch && passMatch
  } catch {
    return false
  }
}
