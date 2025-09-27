"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Set } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Plus, Eye } from "lucide-react"
import { AddSetForm } from "./add-set-form"
import { EditSetForm } from "./edit-set-form"
import { supabase } from "@/lib/supabase"

interface SetsTableProps {
  onSetAdded?: () => void
  onSetUpdated?: () => void
  onSetDeleted?: () => void
}

export function SetsTable({ onSetAdded, onSetUpdated, onSetDeleted }: SetsTableProps) {
  const [sets, setSets] = useState<Set[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSet, setSelectedSet] = useState<Set | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const fetchSets = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('sets')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching sets:', error)
        return
      }

      setSets(data || [])
    } catch (error) {
      console.error('Error fetching sets:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSets()
  }, [])

  const handleDeleteSet = async (id: string) => {
    if (!confirm('Are you sure you want to delete this set?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('sets')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting set:', error)
        return
      }

      setSets(sets.filter(set => set.id !== id))
      onSetDeleted?.()
    } catch (error) {
      console.error('Error deleting set:', error)
    }
  }

  const handleSetAdded = () => {
    fetchSets()
    setIsAddDialogOpen(false)
    onSetAdded?.()
  }

  const handleSetUpdated = () => {
    fetchSets()
    setIsEditDialogOpen(false)
    setSelectedSet(null)
    onSetUpdated?.()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading sets...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Sets Management</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Set
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Set</DialogTitle>
              <DialogDescription>
                Create a new set for your collection.
              </DialogDescription>
            </DialogHeader>
            <AddSetForm onSuccess={handleSetAdded} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Set</TableHead>
                <TableHead>Series</TableHead>
                <TableHead>Cards</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No sets found. Create your first set to get started.
                  </TableCell>
                </TableRow>
              ) : (
                sets.map((set) => (
                  <TableRow key={set.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={set.logo_url} alt={set.set_name} />
                          <AvatarFallback>
                            {set.set_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{set.set_name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{set.series}</Badge>
                    </TableCell>
                    <TableCell>{set.card_amount}</TableCell>
                    <TableCell>{formatDate(set.release_date)}</TableCell>
                    <TableCell>{formatDate(set.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSet(set)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSet(set)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSet(set.id)}
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

        {/* View Set Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Set Details</DialogTitle>
              <DialogDescription>
                View details for {selectedSet?.set_name}
              </DialogDescription>
            </DialogHeader>
            {selectedSet && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedSet.logo_url} alt={selectedSet.set_name} />
                    <AvatarFallback>
                      {selectedSet.set_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedSet.set_name}</h3>
                    <Badge variant="secondary">{selectedSet.series}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Card Amount</label>
                    <p className="text-lg">{selectedSet.card_amount}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Release Date</label>
                    <p className="text-lg">{formatDate(selectedSet.release_date)}</p>
                  </div>
                </div>
                {selectedSet.background_url && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Background</label>
                    <div className="mt-2">
                      <Image 
                        src={selectedSet.background_url} 
                        alt="Set background" 
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
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

        {/* Edit Set Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Set</DialogTitle>
              <DialogDescription>
                Update the details for {selectedSet?.set_name}
              </DialogDescription>
            </DialogHeader>
            {selectedSet && (
              <EditSetForm set={selectedSet} onSuccess={handleSetUpdated} />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

