import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nzsxqmkhbzwpxjwwysnq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3hxbWtoYnp3cHhqd3d5c25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTQ1OTUsImV4cCI6MjA5MTg5MDU5NX0.FJ-lpZ-k-Dv2cTwzeyWB21rVCWM2GHJs-8M60xnX7AI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('--- Diagnóstico de Arranque ---')
console.log('URL de Supabase configurada:', supabaseUrl ? 'SÍ' : 'NO')
console.log('Key de Supabase configurada:', supabaseAnonKey ? 'SÍ' : 'NO')