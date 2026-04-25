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
import { MoreHorizontal, Plus, Edit2, Trash2, Tag } from "lucide-react"
import { toast } from "sonner"

interface Deal {
  id: string
  title: string
  description?: string
  badge_text?: string
  image_url?: string
  product_id?: string
  is_active: boolean
  sort_order: number
  starts_at?: string
  ends_at?: string
}

interface Product {
  id: string
  name: string
}

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    badge_text: "",
    image_url: "",
    product_id: "",
    is_active: true,
    sort_order: 0,
    starts_at: "",
    ends_at: "",
  })
  const supabase = createClient()

  useEffect(() => {
    fetchDeals()
    fetchProducts()
  }, [])

  async function fetchDeals() {
    const { data } = await supabase
      .from("deals")
      .select("*")
      .order("sort_order")

    if (data) setDeals(data)
    setIsLoading(false)
  }

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("id, name")
      .eq("is_active", true)
      .order("name")

    if (data) setProducts(data)
  }

  function openDialog(deal?: Deal) {
    if (deal) {
      setEditingDeal(deal)
      setFormData({
        title: deal.title,
        description: deal.description || "",
        badge_text: deal.badge_text || "",
        image_url: deal.image_url || "",
        product_id: deal.product_id || "",
        is_active: deal.is_active,
        sort_order: deal.sort_order,
        starts_at: deal.starts_at ? deal.starts_at.split("T")[0] : "",
        ends_at: deal.ends_at ? deal.ends_at.split("T")[0] : "",
      })
    } else {
      setEditingDeal(null)
      setFormData({
        title: "",
        description: "",
        badge_text: "",
        image_url: "",
        product_id: "",
        is_active: true,
        sort_order: deals.length,
        starts_at: "",
        ends_at: "",
      })
    }
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const data = {
      ...formData,
      product_id: formData.product_id || null,
      starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
      ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
    }

    if (editingDeal) {
      const { error } = await supabase.from("deals").update(data).eq("id", editingDeal.id)
      if (!error) {
        toast.success("Deal updated")
        fetchDeals()
        setIsDialogOpen(false)
      }
    } else {
      const { error } = await supabase.from("deals").insert(data)
      if (!error) {
        toast.success("Deal created")
        fetchDeals()
        setIsDialogOpen(false)
      }
    }
  }

  async function deleteDeal(deal: Deal) {
    if (!confirm(`Delete "${deal.title}"?`)) return

    const { error } = await supabase.from("deals").delete().eq("id", deal.id)
    if (!error) {
      toast.success("Deal deleted")
      fetchDeals()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Deals</h1>
          <p className="text-muted-foreground">{deals.length} deals</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <Card key={deal.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {deal.badge_text && (
                    <Badge className="bg-amber text-white mb-2">{deal.badge_text}</Badge>
                  )}
                  <h3 className="font-semibold text-lg">{deal.title}</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openDialog(deal)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteDeal(deal)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {deal.description && (
                <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>
              )}
              {deal.starts_at && (
                <p className="text-xs text-muted-foreground">
                  Valid: {new Date(deal.starts_at).toLocaleDateString()} - {new Date(deal.ends_at!).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {deals.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Tag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No deals yet</p>
            <Button onClick={() => openDialog()} className="mt-4">
              Create your first deal
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingDeal ? "Edit Deal" : "New Deal"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Badge Text</Label>
              <Input
                value={formData.badge_text}
                onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                placeholder="e.g., 20% OFF"
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Product (optional)</Label>
              <select
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              >
                <option value="">No specific product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.starts_at}
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.ends_at}
                  onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <Button type="submit" className="w-full">
              {editingDeal ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}