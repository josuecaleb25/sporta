import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Faltan SUPABASE_URL o SUPABASE_ANON_KEY en el .env')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function initDb() {
  const { error } = await supabase.from('products').select('id').limit(1)
  if (error) throw new Error('No se pudo conectar a Supabase: ' + error.message)
}

export default supabase
