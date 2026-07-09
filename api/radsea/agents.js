import { authenticate } from '../_shared.js'

export default async function handler(req, res) {
  const supabase = authenticate(req, res)
  if (!supabase) return

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('id')
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
