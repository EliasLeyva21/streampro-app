import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('--- Diagnóstico de Arranque ---')
console.log('URL de Supabase configurada:', supabaseUrl ? 'SÍ' : 'NO')
console.log('Key de Supabase configurada:', supabaseAnonKey ? 'SÍ' : 'NO')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)