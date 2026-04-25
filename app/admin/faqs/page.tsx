"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Edit2, Trash2, HelpCircle } from "lucide-react"
import { toast } from "sonner"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  sort_order: number
  is_active: boolean
}

const categoryOptions = [
  { value: "general", label: "General" },
  { value: "ordering", label: "Ordering & Payment" },
  { value: "delivery", label: "Delivery" },
  { value: "products", label: "Products" },
]

const categoryLabels: Record<string, string> = {
  general: "General",
  ordering: "Ordering & Payment",
  delivery: "Delivery",
  products: "Products",
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
    sort_order: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    fetchFaqs()
  }, [])

  async function fetchFaqs() {
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order")

    if (data) setFaqs(data)
    setIsLoading(false)
  }

  function openDialog(faq?: FAQ) {
    if (faq) {
      setEditingFaq(faq)
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        sort_order: faq.sort_order,
      })
    } else {
      setEditingFaq(null)
      setFormData({
        question: "",
        answer: "",
        category: "general",
        sort_order: faqs.length,
      })
    }
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const data = {
      ...formData,
      is_active: true,
    }

    if (editingFaq) {
      const { error } = await supabase.from("faqs").update(data).eq("id", editingFaq.id)
      if (!error) {
        toast.success("FAQ updated")
        fetchFaqs()
        setIsDialogOpen(false)
      }
    } else {
      const { error } = await supabase.from("faqs").insert(data)
      if (!error) {
        toast.success("FAQ created")
        fetchFaqs()
        setIsDialogOpen(false)
      }
    }
  }

  async function deleteFaq(faq: FAQ) {
    if (!confirm(`Delete this FAQ?`)) return

    const { error } = await supabase.from("faqs").delete().eq("id", faq.id)
    if (!error) {
      toast.success("FAQ deleted")
      fetchFaqs()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber border-t-transparent rounded-full" />
      </div>
    )
  }

  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = []
    acc[faq.category].push(faq)
    return acc
  }, {} as Record<string, FAQ[]>)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">FAQs</h1>
          <p className="text-muted-foreground">{faqs.length} FAQs</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
        <Card key={category} className="mb-6">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Badge variant="outline">{categoryLabels[category] || category}</Badge>
              <span className="text-sm font-normal text-muted-foreground">
                {categoryFaqs.length} questions
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryFaqs.map((faq) => (
              <div
                key={faq.id}
                className="p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium mb-2">{faq.question}</p>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(faq)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteFaq(faq)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {faqs.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No FAQs yet</p>
            <Button onClick={() => openDialog()} className="mt-4">
              Add your first FAQ
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingFaq ? "Edit FAQ" : "New FAQ"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Question *</Label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Answer *</Label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background resize-none"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              />
            </div>
            <Button type="submit" className="w-full">
              {editingFaq ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}