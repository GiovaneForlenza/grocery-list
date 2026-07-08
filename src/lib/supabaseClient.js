import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Supabase: variáveis de ambiente ausentes. Confira o arquivo .env (VITE_SUPABASE_URL / VITE_SUPABASE_KEY).'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
