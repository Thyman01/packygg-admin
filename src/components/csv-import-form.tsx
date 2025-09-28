"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { supabase, Set, CreateCardData } from "@/lib/supabase"
import { parseCSV, convertCSVRowToCardData, getCSVPreview, CSVCardRow } from "@/lib/csv-parser"

interface CSVImportFormProps {
  onSuccess?: () => void
}

export function CSVImportForm({ onSuccess }: CSVImportFormProps) {
  const [sets, setSets] = useState<Set[]>([])
  const [selectedSetId, setSelectedSetId] = useState<string>("")
  const [csvContent, setCsvContent] = useState<string>("")
  const [csvPreview, setCsvPreview] = useState<CSVCardRow[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | 'warning' | null
    message: string
  }>({ type: null, message: '' })

  useEffect(() => {
    fetchSets()
  }, [])

  const fetchSets = async () => {
    try {
      const { data, error } = await supabase
        .from('sets')
        .select('*')
        .order('set_name', { ascending: true })

      if (error) {
        console.error('Error fetching sets:', error)
        return
      }

      setSets(data || [])
    } catch (error) {
      console.error('Error fetching sets:', error)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setImportStatus({
        type: 'error',
        message: 'Please select a CSV file'
      })
      return
    }

    setImportStatus({ type: null, message: '' })

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCsvContent(content)
      
      try {
        const preview = getCSVPreview(content, 5)
        setCsvPreview(preview)
        
        if (preview.length === 0) {
          setImportStatus({
            type: 'warning',
            message: 'No valid data found in CSV file'
          })
        } else {
          setImportStatus({
            type: 'success',
            message: `Found ${preview.length} preview rows. Ready to import.`
          })
        }
      } catch {
        setImportStatus({
          type: 'error',
          message: 'Error parsing CSV file. Please check the format.'
        })
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!selectedSetId || !csvContent) {
      setImportStatus({
        type: 'error',
        message: 'Please select a set and upload a CSV file'
      })
      return
    }

    setIsImporting(true)
    setImportStatus({ type: null, message: '' })

    try {
      const csvRows = parseCSV(csvContent)
      
      if (csvRows.length === 0) {
        setImportStatus({
          type: 'error',
          message: 'No valid data found in CSV file'
        })
        return
      }

      // Convert CSV rows to card data
      const cardData: CreateCardData[] = csvRows.map(row => 
        convertCSVRowToCardData(row, selectedSetId)
      )

      // Import cards in batches
      const batchSize = 50
      let importedCount = 0
      let errorCount = 0

      for (let i = 0; i < cardData.length; i += batchSize) {
        const batch = cardData.slice(i, i + batchSize)
        
        const { error } = await supabase
          .from('cards')
          .insert(batch)

        if (error) {
          console.error('Error importing batch:', error)
          errorCount += batch.length
        } else {
          importedCount += batch.length
        }
      }

      if (errorCount > 0) {
        setImportStatus({
          type: 'warning',
          message: `Imported ${importedCount} cards successfully. ${errorCount} cards failed to import.`
        })
      } else {
        setImportStatus({
          type: 'success',
          message: `Successfully imported ${importedCount} cards!`
        })
      }

      // Reset form
      setCsvContent("")
      setCsvPreview([])
      setSelectedSetId("")
      
      onSuccess?.()
    } catch (error) {
      console.error('Error importing cards:', error)
      setImportStatus({
        type: 'error',
        message: 'An error occurred during import. Please try again.'
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Cards from CSV
          </CardTitle>
          <CardDescription>
            Upload a CSV file to import cards into a selected set. The CSV should contain card data with proper headers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Set Selection */}
          <div className="space-y-2">
            <Label htmlFor="set-select">Select Set</Label>
            <Select value={selectedSetId} onValueChange={setSelectedSetId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a set to import cards into" />
              </SelectTrigger>
              <SelectContent>
                {sets.map((set) => (
                  <SelectItem key={set.id} value={set.id}>
                    {set.set_name} ({set.series})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isImporting}
            />
          </div>

          {/* Status Alert */}
          {importStatus.type && (
            <Alert variant={importStatus.type === 'error' ? 'destructive' : 'default'}>
              {importStatus.type === 'success' && <CheckCircle className="h-4 w-4" />}
              {importStatus.type === 'error' && <AlertCircle className="h-4 w-4" />}
              {importStatus.type === 'warning' && <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{importStatus.message}</AlertDescription>
            </Alert>
          )}

          {/* CSV Preview */}
          {csvPreview.length > 0 && (
            <div className="space-y-2">
              <Label>Preview (First 5 rows)</Label>
              <div className="border rounded-md max-h-64 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Card Name</th>
                      <th className="p-2 text-left">Card Number</th>
                      <th className="p-2 text-left">Rarity</th>
                      <th className="p-2 text-left">HP</th>
                      <th className="p-2 text-left">Variant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreview.map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{row['Card Name']}</td>
                        <td className="p-2">{row['Card Number']}</td>
                        <td className="p-2">
                          <Badge variant="secondary">{row['Rarity']}</Badge>
                        </td>
                        <td className="p-2">{row['HP'] || '-'}</td>
                        <td className="p-2">{row['Variant Type'] || 'base'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import Button */}
          <Button 
            onClick={handleImport}
            disabled={!selectedSetId || !csvContent || isImporting}
            className="w-full"
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Cards...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Cards
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CSV Format Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Required Columns:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>• Card ID</div>
              <div>• Card Name</div>
              <div>• Card Number</div>
              <div>• Rarity</div>
              <div>• Image URL</div>
              <div>• Set Name</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Optional Columns:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>• TCGPlayer URL</div>
              <div>• Cardmarket URL</div>
              <div>• USD Price</div>
              <div>• EUR Price</div>
              <div>• HP</div>
              <div>• Variant Type (→ player)</div>
              <div>• Variant ID (→ card_model)</div>
              <div>• Euro Price</div>
              <div>• Number</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
