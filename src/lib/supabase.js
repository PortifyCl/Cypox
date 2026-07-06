import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dipjcbcudxghqugfqjde.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ayjW07X5XRH3lA2ZVSoCdQ_jLzAzNwc'

export const supabase = createClient(supabaseUrl, supabaseKey)
