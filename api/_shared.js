import { createClient } from '@supabase/supabase-js'
import { verifyToken } from './auth.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export function getServiceClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export function authenticate(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Non autorisé' })
    return null
  }
  const token = authHeader.slice(7)
  const payload = verifyToken(token)
  if (!payload || payload.exp * 1000 < Date.now()) {
    res.status(401).json({ error: 'Session expirée' })
    return null
  }
  return getServiceClient()
}
