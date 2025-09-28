"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, Set } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Eye,
  Trash2,
  Package
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface CardsTableProps {
  onCardDeleted?: () => void
}

type SortField = 'name' | 'number' | 'rarity' | 'hp' | 'euro_price' | 'usd_price' | 'created_at'
type SortDirection = 'asc' | 'desc'

export function CardsTable({ onCardDeleted }: CardsTableProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [sets, setSets] = useState<Set[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSet, setSelectedSet] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('cards')
        .select(`
          *,
          sets!inner(set_name, series)
        `)

      // Apply set filter
      if (selectedSet !== "all") {
        query = query.eq('set_id', selectedSet)
      }

      // Apply search filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,number.ilike.%${searchTerm}%,rarity.ilike.%${searchTerm}%`)
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === 'asc' })

      const { data, error } = await query

      if (error) {
        console.error('Error fetching cards:', error)
        return
      }

      setCards(data || [])
    } catch (error) {
      console.error('Error fetching cards:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedSet, searchTerm, sortField, sortDirection])

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

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  useEffect(() => {
    fetchSets()
  }, [])

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting card:', error)
        return
      }

      setCards(cards.filter(card => card.id !== id))
      onCardDeleted?.()
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return isNaN(numPrice) ? price : `$${numPrice.toFixed(2)}`
  }

  const formatEuroPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return isNaN(numPrice) ? price : `€${numPrice.toFixed(2)}`
  }

  const getRarityColor = (rarity: string) => {
    const rarityLower = rarity.toLowerCase()
    if (rarityLower.includes('common')) return 'bg-gray-100 text-gray-800'
    if (rarityLower.includes('uncommon')) return 'bg-green-100 text-green-800'
    if (rarityLower.includes('rare')) return 'bg-blue-100 text-blue-800'
    if (rarityLower.includes('holo')) return 'bg-purple-100 text-purple-800'
    if (rarityLower.includes('ex')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <UICard>
        <CardHeader>
          <CardTitle>Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading cards...</div>
          </div>
        </CardContent>
      </UICard>
    )
  }

  return (
    <UICard>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Cards Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cards by name, number, or rarity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedSet} onValueChange={setSelectedSet}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sets</SelectItem>
              {sets.map((set) => (
                <SelectItem key={set.id} value={set.id}>
                  {set.set_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Card</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('number')}
                >
                  <div className="flex items-center gap-1">
                    Number {getSortIcon('number')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('rarity')}
                >
                  <div className="flex items-center gap-1">
                    Rarity {getSortIcon('rarity')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('hp')}
                >
                  <div className="flex items-center gap-1">
                    HP {getSortIcon('hp')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('euro_price')}
                >
                  <div className="flex items-center gap-1">
                    Euro Price {getSortIcon('euro_price')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('usd_price')}
                >
                  <div className="flex items-center gap-1">
                    USD Price {getSortIcon('usd_price')}
                  </div>
                </TableHead>
                <TableHead>Set</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No cards found. Import some cards to get started.
                  </TableCell>
                </TableRow>
              ) : (
                cards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={card.image} alt={card.name} />
                          <AvatarFallback>
                            {card.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{card.name}</div>
                          <div className="text-sm text-muted-foreground">{card.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{card.number}</TableCell>
                    <TableCell>
                      <Badge className={getRarityColor(card.rarity)}>
                        {card.rarity}
                      </Badge>
                    </TableCell>
                    <TableCell>{card.hp}</TableCell>
                    <TableCell>{formatEuroPrice(card.euro_price)}</TableCell>
                    <TableCell>{formatPrice(card.usd_price)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {(card as Card & { sets?: { set_name: string; series: string } }).sets?.set_name || 'Unknown Set'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCard(card)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* View Card Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Card Details</DialogTitle>
              <DialogDescription>
                View details for {selectedCard?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedCard && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedCard.image} alt={selectedCard.name} />
                    <AvatarFallback>
                      {selectedCard.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCard.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCard.slug}</p>
                    <Badge className={getRarityColor(selectedCard.rarity)}>
                      {selectedCard.rarity}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Card Number</label>
                    <p className="text-lg font-mono">{selectedCard.number}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">HP</label>
                    <p className="text-lg">{selectedCard.hp}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Euro Price</label>
                    <p className="text-lg">{formatEuroPrice(selectedCard.euro_price)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">USD Price</label>
                    <p className="text-lg">{formatPrice(selectedCard.usd_price)}</p>
                  </div>
                </div>
                {selectedCard.tcg_player && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">TCGPlayer URL</label>
                    <p className="text-sm break-all">
                      <a href={selectedCard.tcg_player} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedCard.tcg_player}
                      </a>
                    </p>
                  </div>
                )}
                {selectedCard.card_market && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cardmarket URL</label>
                    <p className="text-sm break-all">
                      <a href={selectedCard.card_market} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedCard.card_market}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </UICard>
  )
}
