"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, FolderTree, Eye, EyeOff, GripVertical } from "lucide-react"
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
  seo_title?: string
  seo_desc?: string
  subcategories?: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
  slug: string
  description?: string
  banner_url?: string
  is_active: boolean
  sort_order: number
  seo_title?: string
  seo_desc?: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [newSubName, setNewSubName] = useState("")
  const [addingSubTo, setAddingSubTo] = useState<string | null>(null)

  // Subcategory edit
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null)
  const [isSubDialogOpen, setIsSubDialogOpen] = useState(false)
  const [subFormData, setSubFormData] = useState({
    name: "",
    slug: "",
    description: "",
    banner_url: "",
    is_active: true,
    sort_order: 0,
    seo_title: "",
    seo_desc: "",
  })

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    banner_url: "",
    icon_url: "",
    is_active: true,
    sort_order: 0,
    seo_title: "",
    seo_desc: "",
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

    if (data) {
      data.forEach((cat: Category) => {
        if (cat.subcategories) {
          cat.subcategories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        }
      })
      setCategories(data)
    }
    setIsLoading(false)
  }

  function toggleExpand(categoryId: string) {
    const next = new Set(expandedCategories)
    if (next.has(categoryId)) next.delete(categoryId)
    else next.add(categoryId)
    setExpandedCategories(next)
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
        seo_title: category.seo_title || "",
        seo_desc: category.seo_desc || "",
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
        seo_title: "",
        seo_desc: "",
      })
    }
    setIsDialogOpen(true)
  }

  function autoGenerateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (editingCategory) {
      const { error } = await supabase
        .from("categories")
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq("id", editingCategory.id)

      if (!error) {
        toast.success("Category updated")
        fetchCategories()
        setIsDialogOpen(false)
      } else {
        toast.error(error.message)
      }
    } else {
      const { error } = await supabase.from("categories").insert(formData)

      if (!error) {
        toast.success("Category created")
        fetchCategories()
        setIsDialogOpen(false)
      } else {
        toast.error(error.message)
      }
    }
  }

  async function deleteCategory(category: Category) {
    if (!confirm(`Delete "${category.name}"? All sub-categories and products under it will also be deleted.`)) return

    const { error } = await supabase.from("categories").delete().eq("id", category.id)

    if (!error) {
      toast.success("Category deleted")
      fetchCategories()
    } else {
      toast.error(error.message)
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

  // ── Subcategory CRUD ──
  async function addSubcategory(categoryId: string) {
    if (!newSubName.trim()) return
    const slug = autoGenerateSlug(newSubName)
    const cat = categories.find(c => c.id === categoryId)
    const sortOrder = cat?.subcategories?.length || 0

    const { error } = await supabase.from("subcategories").insert({
      category_id: categoryId,
      name: newSubName.trim(),
      slug,
      is_active: true,
      sort_order: sortOrder,
    })

    if (!error) {
      toast.success("Subcategory added")
      setNewSubName("")
      setAddingSubTo(null)
      fetchCategories()
    } else {
      toast.error(error.message)
    }
  }

  function openSubDialog(sub: Subcategory) {
    setEditingSub(sub)
    setSubFormData({
      name: sub.name,
      slug: sub.slug,
      description: sub.description || "",
      banner_url: sub.banner_url || "",
      is_active: sub.is_active,
      sort_order: sub.sort_order,
      seo_title: sub.seo_title || "",
      seo_desc: sub.seo_desc || "",
    })
    setIsSubDialogOpen(true)
  }

  async function handleSubSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingSub) return

    const { error } = await supabase
      .from("subcategories")
      .update({ ...subFormData, updated_at: new Date().toISOString() })
      .eq("id", editingSub.id)

    if (!error) {
      toast.success("Subcategory updated")
      fetchCategories()
      setIsSubDialogOpen(false)
    } else {
      toast.error(error.message)
    }
  }

  async function deleteSubcategory(sub: Subcategory) {
    if (!confirm(`Delete "${sub.name}"?`)) return
    const { error } = await supabase.from("subcategories").delete().eq("id", sub.id)
    if (!error) {
      toast.success("Subcategory deleted")
      fetchCategories()
    }
  }

  async function toggleSubActive(sub: Subcategory) {
    const { error } = await supabase
      .from("subcategories")
      .update({ is_active: !sub.is_active })
      .eq("id", sub.id)
    if (!error) fetchCategories()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-slate">Categories</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categories · {categories.reduce((a, c) => a + (c.subcategories?.length || 0), 0)} subcategories</p>
        </div>
        <Button size="sm" onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-1" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id)
          const subCount = category.subcategories?.length || 0
          return (
            <Card key={category.id} className={`border-border/50 transition-shadow ${isExpanded ? "shadow-md" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      {category.banner_url && (
                        <img src={category.banner_url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-brand-slate truncate">{category.name}</h3>
                        <p className="text-[11px] text-muted-foreground">/{category.slug}</p>
                      </div>
                      <Badge variant={category.is_active ? "default" : "secondary"} className="text-[9px] flex-shrink-0">
                        {category.is_active ? "Active" : "Off"}
                      </Badge>
                    </div>
                    {category.description && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{category.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDialog(category)}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActive(category)}>
                      {category.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteCategory(category)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* Subcategories toggle */}
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-brand-slate transition-colors mt-3 font-medium"
                >
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <FolderTree className="w-3.5 h-3.5" />
                  {subCount} sub-categories
                </button>

                {/* Expanded Subcategories */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
                    {category.subcategories?.map((sub, i) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] text-muted-foreground font-mono w-5 text-center">{i + 1}</span>
                          <span className="text-sm font-medium truncate">{sub.name}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => toggleSubActive(sub)}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                              sub.is_active
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {sub.is_active ? "Active" : "Off"}
                          </button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openSubDialog(sub)}>
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteSubcategory(sub)}>
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Add Subcategory */}
                    {addingSubTo === category.id ? (
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          placeholder="Subcategory name..."
                          className="h-8 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); addSubcategory(category.id) }
                            if (e.key === "Escape") { setAddingSubTo(null); setNewSubName("") }
                          }}
                        />
                        <Button size="sm" className="h-8" onClick={() => addSubcategory(category.id)}>Add</Button>
                        <Button size="sm" variant="ghost" className="h-8" onClick={() => { setAddingSubTo(null); setNewSubName("") }}>✕</Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setAddingSubTo(category.id); setNewSubName("") }}
                        className="flex items-center gap-1.5 text-xs text-brand-accent hover:text-brand-accent/80 transition-colors mt-2 font-medium"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Subcategory
                      </button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {categories.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <FolderTree className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground mb-3">No categories yet</p>
            <Button onClick={() => openDialog()}>Add your first category</Button>
          </CardContent>
        </Card>
      )}

      {/* Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingCategory ? "Edit Category" : "New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Slug</Label>
                <div className="flex gap-1.5">
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData({ ...formData, slug: autoGenerateSlug(formData.name) })}>
                    Auto
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <ImageUploader
              value={formData.banner_url}
              onChange={(url) => setFormData({ ...formData, banner_url: url as string })}
              folder="printkul/categories"
              label="Banner Image"
            />

            <ImageUploader
              value={formData.icon_url}
              onChange={(url) => setFormData({ ...formData, icon_url: url as string })}
              folder="printkul/icons"
              label="Icon Image"
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">SEO Title</Label>
                <Input
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Sort Order</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">SEO Description</Label>
              <Textarea
                value={formData.seo_desc}
                onChange={(e) => setFormData({ ...formData, seo_desc: e.target.value })}
                rows={2}
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
              <Label htmlFor="is_active" className="text-sm">Active</Label>
            </div>
            <Button type="submit" className="w-full">
              {editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Subcategory Edit Dialog */}
      <Dialog open={isSubDialogOpen} onOpenChange={setIsSubDialogOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Subcategory</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name *</Label>
                <Input
                  value={subFormData.name}
                  onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Slug</Label>
                <Input
                  value={subFormData.slug}
                  onChange={(e) => setSubFormData({ ...subFormData, slug: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={subFormData.description}
                onChange={(e) => setSubFormData({ ...subFormData, description: e.target.value })}
                rows={2}
              />
            </div>

            <ImageUploader
              value={subFormData.banner_url}
              onChange={(url) => setSubFormData({ ...subFormData, banner_url: url as string })}
              folder="printkul/subcategories"
              label="Banner Image"
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">SEO Title</Label>
                <Input
                  value={subFormData.seo_title}
                  onChange={(e) => setSubFormData({ ...subFormData, seo_title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Sort Order</Label>
                <Input
                  type="number"
                  value={subFormData.sort_order}
                  onChange={(e) => setSubFormData({ ...subFormData, sort_order: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">SEO Description</Label>
              <Textarea
                value={subFormData.seo_desc}
                onChange={(e) => setSubFormData({ ...subFormData, seo_desc: e.target.value })}
                rows={2}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={subFormData.is_active}
                onChange={(e) => setSubFormData({ ...subFormData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label className="text-sm">Active</Label>
            </div>
            <Button type="submit" className="w-full">Update Subcategory</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}