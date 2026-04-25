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
import { MoreHorizontal, Plus, Edit2, Trash2, FolderPlus } from "lucide-react"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  banner_url?: string
  icon_url?: string
  is_active: boolean
  sort_order: number
  subcategories?: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
  slug: string
  is_active: boolean
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    banner_url: "",
    icon_url: "",
    is_active: true,
    sort_order: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*, subcategories(*)")
      .order("sort_order")

    if (data) setCategories(data)
    setIsLoading(false)
  }

  function openDialog(category?: Category) {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        banner_url: category.banner_url || "",
        icon_url: category.icon_url || "",
        is_active: category.is_active,
        sort_order: category.sort_order,
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: "",
        slug: "",
        description: "",
        banner_url: "",
        icon_url: "",
        is_active: true,
        sort_order: categories.length,
      })
    }
    setIsDialogOpen(true)
  }

  function autoGenerateSlug() {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setFormData({ ...formData, slug })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (editingCategory) {
      const { error } = await supabase
        .from("categories")
        .update(formData)
        .eq("id", editingCategory.id)

      if (!error) {
        toast.success("Category updated")
        fetchCategories()
        setIsDialogOpen(false)
      }
    } else {
      const { error } = await supabase.from("categories").insert(formData)

      if (!error) {
        toast.success("Category created")
        fetchCategories()
        setIsDialogOpen(false)
      }
    }
  }

  async function deleteCategory(category: Category) {
    if (!confirm(`Delete "${category.name}"? All sub-categories will also be deleted.`)) return

    const { error } = await supabase.from("categories").delete().eq("id", category.id)

    if (!error) {
      toast.success("Category deleted")
      fetchCategories()
    }
  }

  async function toggleActive(category: Category) {
    const { error } = await supabase
      .from("categories")
      .update({ is_active: !category.is_active })
      .eq("id", category.id)

    if (!error) {
      fetchCategories()
      toast.success(`${category.is_active ? "Deactivated" : "Activated"}`)
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
          <h1 className="font-heading text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">{categories.length} categories</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{category.slug}</p>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FolderPlus className="w-4 h-4" />
                    {category.subcategories?.length || 0} sub-categories
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(category)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteCategory(category)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No categories yet</p>
            <Button onClick={() => openDialog()} className="mt-4">
              Add your first category
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingCategory ? "Edit Category" : "New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                <Button type="button" variant="outline" onClick={autoGenerateSlug}>
                  Auto
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Banner URL</Label>
              <Input
                value={formData.banner_url}
                onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Icon URL</Label>
              <Input
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              />
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
              {editingCategory ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}