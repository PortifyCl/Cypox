import { getToken } from '../utils/token'

function authHeaders() {
  const token = getToken()
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' }
}

async function apiFetch(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...authHeaders(), ...options.headers } })
  if (res.status === 401) {
    throw new Error('Session expirée. Reconnectez-vous.')
  }
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'API error')
  return data
}

// ── Prospects ──────────────────────────────────────────
export async function fetchProspects() {
  return apiFetch('/api/radsea/prospects')
}

export async function fetchProspect(id) {
  const all = await apiFetch('/api/radsea/prospects')
  const p = all.find((x) => String(x.id) === String(id))
  if (!p) throw new Error('Prospect introuvable')
  return p
}

export async function updateProspectStatut(id, statut) {
  return apiFetch('/api/radsea/prospects', {
    method: 'PATCH',
    body: JSON.stringify({ id, statut }),
  })
}

// ── Agents ─────────────────────────────────────────────
export async function fetchAgents() {
  return apiFetch('/api/radsea/agents')
}

// ── Stats (computed from prospects) ────────────────────
export async function fetchStats() {
  const prospects = await fetchProspects()

  const total = prospects.length
  if (total === 0) {
    return {
      totalProspects: 0,
      analysesEnCours: 0,
      propositionsEnvoyees: 0,
      tauxConversion: '0%',
      scoreMoyen: 0,
      secteursCouverts: 0,
      villesCouvertes: 0,
    }
  }

  const convertis = prospects.filter((p) => p.statut === 'Converti').length

  return {
    totalProspects: total,
    analysesEnCours: prospects.filter((p) => p.statut === 'En analyse').length,
    propositionsEnvoyees: prospects.filter((p) =>
      ['Proposition préparée', 'En attente validation', 'Contacté'].includes(p.statut),
    ).length,
    tauxConversion: `${Math.round((convertis / total) * 100)}%`,
    scoreMoyen: Math.round(prospects.reduce((s, p) => s + p.score, 0) / total),
    secteursCouverts: new Set(prospects.map((p) => p.secteur)).size,
    villesCouvertes: new Set(prospects.map((p) => p.ville)).size,
  }
}

// ── Audits ─────────────────────────────────────────────
export async function fetchAudits(limit = 20) {
  return apiFetch(`/api/radsea/audits?limit=${limit}`)
}

export async function fetchAudit(id) {
  const all = await apiFetch('/api/radsea/audits?limit=100')
  const a = all.find((x) => String(x.id) === String(id))
  if (!a) throw new Error('Audit introuvable')
  return a
}

export async function deleteAudit(id) {
  return apiFetch(`/api/radsea/audits?id=${id}`, { method: 'DELETE' })
}

export async function fetchAuditsByProspect(prospectId) {
  return apiFetch(`/api/radsea/audits?prospect_id=${prospectId}`)
}

// ── AI (Gemini via /api/ai) ────────────────────────────
async function callAI(action, prospect, audit = null) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ action, prospect, audit }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'AI error')
  return data.result
}

export async function generateEmail(prospect) {
  return callAI('email', prospect)
}

export async function analyzeProspect(prospect, audit = null) {
  return callAI('analyze', prospect, audit)
}

export async function scoreProspect(prospect, audit = null) {
  const raw = await callAI('score', prospect, audit)
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { raw }
  } catch {
    return { raw }
  }
}
