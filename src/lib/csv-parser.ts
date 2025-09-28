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
  return {
    card_id: row['Card ID'],
    set_id: setId,
    card_name: row['Card Name'],
    card_number: row['Card Number'],
    rarity: row['Rarity'],
    image_url: row['Image URL'],
    tcgplayer_url: row['TCGPlayer URL'] || undefined,
    cardmarket_url: row['Cardmarket URL'] || undefined,
    usd_price: parseFloat(row['USD Price']) || undefined,
    eur_price: parseFloat(row['EUR Price']) || undefined,
    hp: parseInt(row['HP']) || undefined,
    variant_type: row['Variant Type'] || undefined,
    variant_id: row['Variant ID'] || undefined,
    is_base_card: row['Is Base Card'].toLowerCase() === 'true',
    base_card_id: row['Base Card ID'] || undefined,
    variants_json: row['Variants (JSON)'] || undefined,
  }
}

export function validateCSVHeaders(headers: string[]): boolean {
  const requiredHeaders = [
    'Card ID',
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
