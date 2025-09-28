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

// Types for the cards table
export interface Card {
  id: string
  card_id: string
  set_id: string
  card_name: string
  card_number: string
  rarity: string
  image_url: string
  tcgplayer_url?: string
  cardmarket_url?: string
  usd_price?: number
  eur_price?: number
  hp?: number
  variant_type?: string
  variant_id?: string
  is_base_card: boolean
  base_card_id?: string
  variants_json?: string
  created_at: string
  updated_at: string
}

export interface CreateCardData {
  card_id: string
  set_id: string
  card_name: string
  card_number: string
  rarity: string
  image_url: string
  tcgplayer_url?: string
  cardmarket_url?: string
  usd_price?: number
  eur_price?: number
  hp?: number
  variant_type?: string
  variant_id?: string
  is_base_card: boolean
  base_card_id?: string
  variants_json?: string
}

export interface UpdateCardData extends Partial<CreateCardData> {
  id: string
}


