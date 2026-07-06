import { supabase } from './supabase'

// ── Prospects ──────────────────────────────────────────
export async function fetchProspects() {
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .order('score', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchProspect(id) {
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateProspectStatut(id, statut) {
  const { error } = await supabase
    .from('prospects')
    .update({ statut, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

// ── Agents ─────────────────────────────────────────────
export async function fetchAgents() {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('id')
  if (error) throw error
  return data
}

// ── Stats (computed from prospects) ────────────────────
export async function fetchStats() {
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select('statut, score, secteur, ville')
  if (error) throw error

  const total = prospects.length
  const convertis = prospects.filter(p => p.statut === 'Converti').length

  return {
    totalProspects: total,
    analysesEnCours: prospects.filter(p => p.statut === 'En analyse').length,
    propositionsEnvoyees: prospects.filter(p =>
      ['Proposition préparée', 'En attente validation', 'Contacté'].includes(p.statut)
    ).length,
    tauxConversion: `${Math.round((convertis / total) * 100)}%`,
    scoreMoyen: Math.round(prospects.reduce((s, p) => s + p.score, 0) / total),
    secteursCouverts: new Set(prospects.map(p => p.secteur)).size,
    villesCouvertes: new Set(prospects.map(p => p.ville)).size,
  }
}

// ── Audits ─────────────────────────────────────────────
export async function fetchAudits(limit = 20) {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function fetchAudit(id) {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function deleteAudit(id) {
  const { error } = await supabase
    .from('audits')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function fetchAuditsByProspect(prospectId) {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('prospect_id', prospectId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ── AI (Gemini via /api/ai) ────────────────────────────
async function callAI(action, prospect, audit = null) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
