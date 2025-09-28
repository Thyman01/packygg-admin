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

// Types for the cards table (matching actual Drizzle schema)
export interface Card {
  id: string
  set_id: string
  name: string
  slug: string
  image: string
  rarity: string
  hp: string
  tcg_player: string
  card_market: string
  number: string
  euro_price: string
  usd_price: string
  created_at: string
  updated_at: string
}

export interface CreateCardData {
  set_id: string
  name: string
  slug: string
  image: string
  rarity: string
  hp: string
  tcg_player: string
  card_market: string
  number: string
  euro_price: string
  usd_price: string
}

export interface UpdateCardData extends Partial<CreateCardData> {
  id: string
}

// Helper functions for cards operations
export const cardsApi = {
  // Get all cards with set information
  async getCards(filters?: {
    setId?: string
    search?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
  }) {
    let query = supabase
      .from('cards')
      .select(`
        *,
        sets!inner(set_name, series)
      `)

    if (filters?.setId) {
      query = query.eq('set_id', filters.setId)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,number.ilike.%${filters.search}%,rarity.ilike.%${filters.search}%`)
    }

    if (filters?.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.sortDirection === 'asc' })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Get cards by set ID
  async getCardsBySet(setId: string) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('set_id', setId)
      .order('number', { ascending: true })

    if (error) throw error
    return data
  },

  // Create a new card
  async createCard(cardData: CreateCardData) {
    const { data, error } = await supabase
      .from('cards')
      .insert([cardData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update a card
  async updateCard(id: string, updates: Partial<CreateCardData>) {
    const { data, error } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a card
  async deleteCard(id: string) {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get card statistics
  async getCardStats() {
    const { data, error } = await supabase
      .from('cards')
      .select('id, rarity, euro_price, usd_price')

    if (error) throw error

    const stats = {
      total: data.length,
      byRarity: {} as Record<string, number>,
      totalValueEUR: 0,
      totalValueUSD: 0,
    }

    data.forEach(card => {
      // Count by rarity
      stats.byRarity[card.rarity] = (stats.byRarity[card.rarity] || 0) + 1

      // Sum values
      const eurPrice = parseFloat(card.euro_price)
      const usdPrice = parseFloat(card.usd_price)
      
      if (!isNaN(eurPrice)) stats.totalValueEUR += eurPrice
      if (!isNaN(usdPrice)) stats.totalValueUSD += usdPrice
    })

    return stats
  }
}


