import { CreateCardData } from './supabase'

// CSV Import types
export interface CSVCardRow {
  'Card ID': string
  'Set Name': string
  'Card Name': string
  'Card Number': string
  'Rarity': string
  'Image URL': string
  'TCGPlayer URL': string
  'Cardmarket URL': string
  'USD Price': string
  'EUR Price': string
  'HP': string
  'Variant Type': string
  'Variant ID': string
  'Is Base Card': string
  'Base Card ID': string
  'Variants (JSON)': string
  'Created At': string
  'Updated At': string
}

export function parseCSV(csvText: string): CSVCardRow[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''))
  const rows: CSVCardRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length !== headers.length) continue

    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row as unknown as CSVCardRow)
  }

  return rows
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

export function convertCSVRowToCardData(row: CSVCardRow, setId: string): CreateCardData {
  // Only include fields that exist in the actual database schema
  const cardData: CreateCardData = {
    set_id: setId,
    card_name: row['Card Name'],
    card_number: row['Card Number'],
    rarity: row['Rarity'],
    image_url: row['Image URL'],
  }

  // Add optional fields only if they have values (all as strings since DB uses text type)
  if (row['TCGPlayer URL'] && row['TCGPlayer URL'].trim()) {
    cardData.tcgplayer_url = row['TCGPlayer URL']
  }
  
  if (row['Cardmarket URL'] && row['Cardmarket URL'].trim()) {
    cardData.cardmarket_url = row['Cardmarket URL']
  }
  
  if (row['USD Price'] && row['USD Price'].trim()) {
    cardData.usd_price = row['USD Price']
  }
  
  if (row['EUR Price'] && row['EUR Price'].trim()) {
    cardData.eur_price = row['EUR Price']
  }
  
  if (row['HP'] && row['HP'].trim()) {
    cardData.hp = row['HP']
  }

  // Map CSV fields to actual database columns
  // Note: These fields might not exist in your CSV, but we'll handle them if they do
  if (row['Variant Type'] && row['Variant Type'].trim()) {
    // Map Variant Type to player field if that makes sense for your data
    cardData.player = row['Variant Type']
  }
  
  if (row['Variant ID'] && row['Variant ID'].trim()) {
    // Map Variant ID to card_model field if that makes sense for your data
    cardData.card_model = row['Variant ID']
  }
  
  if (row['Card Number'] && row['Card Number'].trim()) {
    // Use card_number for the number field as well if needed
    cardData.number = row['Card Number']
  }

  return cardData
}

export function validateCSVHeaders(headers: string[]): boolean {
  const requiredHeaders = [
    'Set Name', 
    'Card Name',
    'Card Number',
    'Rarity',
    'Image URL'
  ]
  
  return requiredHeaders.every(header => headers.includes(header))
}

export function getCSVPreview(csvText: string, maxRows: number = 5): CSVCardRow[] {
  const allRows = parseCSV(csvText)
  return allRows.slice(0, maxRows)
}
