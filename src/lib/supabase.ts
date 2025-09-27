import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the sets table
export interface Set {
  id: string
  set_name: string
  card_amount: number
  release_date: string
  logo_url: string
  background_url: string
  series: string
  created_at: string
}

export interface CreateSetData {
  set_name: string
  card_amount: number
  release_date: string
  logo_url: string
  background_url: string
  series: string
}

export interface UpdateSetData extends Partial<CreateSetData> {
  id: string
}

