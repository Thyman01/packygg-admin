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
  // Map CSV fields to actual Drizzle schema columns
  const cardData: CreateCardData = {
    set_id: setId,
    name: row['Card Name'] || '',
    slug: generateSlug(row['Card Name'] || row['Card Number'] || ''),
    image: row['Image URL'] || '',
    rarity: row['Rarity'] || '',
    hp: row['HP'] || '',
    tcg_player: row['TCGPlayer URL'] || '',
    card_market: row['Cardmarket URL'] || '',
    number: row['Card Number'] || '',
    euro_price: row['EUR Price'] || '',
    usd_price: row['USD Price'] || '',
  }

  return cardData
}

// Helper function to generate a slug from card name
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
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
