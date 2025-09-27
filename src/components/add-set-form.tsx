"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase, CreateSetData } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  set_name: z.string().min(1, "Set name is required").max(100, "Set name must be less than 100 characters"),
  card_amount: z.coerce.number().min(1, "Card amount must be at least 1").max(10000, "Card amount must be less than 10,000"),
  release_date: z.string().min(1, "Release date is required"),
  logo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  background_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  series: z.string().min(1, "Series is required").max(50, "Series must be less than 50 characters"),
})

interface AddSetFormProps {
  onSuccess: () => void
}

export function AddSetForm({ onSuccess }: AddSetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      set_name: "",
      card_amount: 0,
      release_date: "",
      logo_url: "",
      background_url: "",
      series: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const setData: CreateSetData = {
        set_name: values.set_name,
        card_amount: values.card_amount,
        release_date: values.release_date,
        logo_url: values.logo_url || "",
        background_url: values.background_url || "",
        series: values.series,
      }

      const { error } = await supabase
        .from('sets')
        .insert([setData])

      if (error) {
        console.error('Error creating set:', error)
        return
      }

      form.reset()
      onSuccess()
    } catch (error) {
      console.error('Error creating set:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="set_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Set Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter set name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="series"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Series</FormLabel>
                <FormControl>
                  <Input placeholder="Enter series name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="card_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter number of cards" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="release_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input 
                  type="url" 
                  placeholder="https://example.com/logo.png" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Optional: URL to the set's logo image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="background_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background URL</FormLabel>
              <FormControl>
                <Input 
                  type="url" 
                  placeholder="https://example.com/background.png" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Optional: URL to the set's background image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Set"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

