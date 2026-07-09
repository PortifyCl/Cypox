import { authenticate } from '../_shared.js'

export default async function handler(req, res) {
  const supabase = authenticate(req, res)
  if (!supabase) return

  if (req.method === 'GET') {
    const { prospect_id, limit } = req.query
    let query = supabase
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit || 20)
    if (prospect_id) {
      query = query.eq('prospect_id', prospect_id)
    }
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    const { error } = await supabase
      .from('audits')
      .delete()
      .eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
