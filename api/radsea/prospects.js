import { authenticate } from '../_shared.js'

export default async function handler(req, res) {
  const supabase = authenticate(req, res)
  if (!supabase) return

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('score', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'PATCH') {
    const { id, statut } = req.body
    if (!id || !statut) return res.status(400).json({ error: 'id and statut required' })
    const { error } = await supabase
      .from('prospects')
      .update({ statut, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
