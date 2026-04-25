"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Variant {
  id: string
  name: string
  finish: string
  size: string
  quantity: number
  price: string
  is_active: boolean
  sort_order: number
}

export default function ProductFormPage() {
  const params = useParams()
  const router = useRouter()
  const isEditing = params.id !== "new"

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    short_desc: "",
    description: "",
    base_price: "",
    price_note: "",
    thumbnail_url: "",
    images: [] as string[],
    specifications: {} as Record<string, string>,
    is_active: true,
    is_featured: false,
    sort_order: 0,
    seo_title: "",
    seo_desc: "",
    subcategory_id: "",
  })

  const [variants, setVariants] = useState<Variant[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      // Fetch categories
      const { data: cats } = await supabase
        .from("categories")
        .select("*, subcategories(*)")
        .eq("is_active", true)
        .order("name")

      if (cats) setCategories(cats)

      if (isEditing) {
        const { data: product } = await supabase
          .from("products")
          .select("*")
          .eq("id", params.id)
          .single()

        if (product) {
          setFormData({
            name: product.name || "",
            slug: product.slug || "",
            short_desc: product.short_desc || "",
            description: product.description || "",
            base_price: product.base_price || "",
            price_note: product.price_note || "",
            thumbnail_url: product.thumbnail_url || "",
            images: product.images || [],
            specifications: product.specifications || {},
            is_active: product.is_active ?? true,
            is_featured: product.is_featured ?? false,
            sort_order: product.sort_order ?? 0,
            seo_title: product.seo_title || "",
            seo_desc: product.seo_desc || "",
            subcategory_id: product.subcategory_id || "",
          })

          // Fetch variants
          const { data: vars } = await supabase
            .from("product_variants")
            .select("*")
            .eq("product_id", params.id)
            .order("sort_order")

          if (vars) setVariants(vars)

          // Set selected category
          const cat = cats?.find((c) =>
            c.subcategories?.some((s: any) => s.id === product.subcategory_id)
          )
          if (cat) {
            setSelectedCategoryId(cat.id)
            setSubcategories(cat.subcategories || [])
          }
        }
      }

      setIsLoading(false)
    }

    fetchData()
  }, [params.id, isEditing])

  function handleCategoryChange(categoryId: string) {
    setSelectedCategoryId(categoryId)
    const category = categories.find((c) => c.id === categoryId)
    setSubcategories(category?.subcategories || [])
    setFormData({ ...formData, subcategory_id: "" })
  }

  function handleInputChange(field: string, value: any) {
    setFormData({ ...formData, [field]: value })
  }

  function addVariant() {
    setVariants([
      ...variants,
      {
        id: crypto.randomUUID(),
        name: "",
        finish: "",
        size: "",
        quantity: 100,
        price: "",
        is_active: true,
        sort_order: variants.length,
      },
    ])
  }

  function updateVariant(index: number, field: string, value: any) {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index))
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
    setIsSaving(true)

    try {
      let productId = params.id

      if (isEditing) {
        await supabase
          .from("products")
          .update({
            name: formData.name,
            slug: formData.slug,
            short_desc: formData.short_desc,
            description: formData.description,
            base_price: formData.base_price,
            price_note: formData.price_note,
            thumbnail_url: formData.thumbnail_url,
            images: formData.images,
            specifications: formData.specifications,
            is_active: formData.is_active,
            is_featured: formData.is_featured,
            sort_order: formData.sort_order,
            seo_title: formData.seo_title,
            seo_desc: formData.seo_desc,
            subcategory_id: formData.subcategory_id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", params.id)
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert({
            name: formData.name,
            slug: formData.slug,
            short_desc: formData.short_desc,
            description: formData.description,
            base_price: formData.base_price,
            price_note: formData.price_note,
            thumbnail_url: formData.thumbnail_url,
            images: formData.images,
            specifications: formData.specifications,
            is_active: formData.is_active,
            is_featured: formData.is_featured,
            sort_order: formData.sort_order,
            seo_title: formData.seo_title,
            seo_desc: formData.seo_desc,
            subcategory_id: formData.subcategory_id,
          })
          .select()
          .single()

        if (error) throw error
        productId = data.id
      }

      // Save variants
      if (productId) {
        // Delete existing variants
        await supabase.from("product_variants").delete().eq("product_id", productId)

        // Insert new variants
        const variantsToInsert = variants.map((v, i) => ({
          product_id: productId,
          name: v.name || `${formData.name} - ${v.quantity} pcs`,
          finish: v.finish,
          size: v.size,
          quantity: v.quantity,
          price: v.price,
          is_active: v.is_active,
          sort_order: i,
        }))

        if (variantsToInsert.length > 0) {
          await supabase.from("product_variants").insert(variantsToInsert)
        }
      }

      toast.success(isEditing ? "Product updated" : "Product created")
      router.push("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error("Failed to save product")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-8">
        {isEditing ? "Edit Product" : "New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={autoGenerateSlug}>
                    Auto
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_desc">Short Description</Label>
              <Input
                id="short_desc"
                value={formData.short_desc}
                onChange={(e) => handleInputChange("short_desc", e.target.value)}
                placeholder="Shown on product cards"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Category & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Category & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Sub-category *</Label>
                <select
                  value={formData.subcategory_id}
                  onChange={(e) => handleInputChange("subcategory_id", e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                >
                  <option value="">Select sub-category</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base_price">Base Price (₹) *</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => handleInputChange("base_price", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_note">Price Note</Label>
                <Input
                  id="price_note"
                  value={formData.price_note}
                  onChange={(e) => handleInputChange("price_note", e.target.value)}
                  placeholder="e.g., per 100 pcs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => handleInputChange("sort_order", parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input
                id="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={(e) => handleInputChange("thumbnail_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Product Variants</CardTitle>
            <Button type="button" variant="outline" onClick={addVariant}>
              <Plus className="w-4 h-4 mr-2" />
              Add Variant
            </Button>
          </CardHeader>
          <CardContent>
            {variants.length > 0 ? (
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div
                    key={variant.id}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="space-y-2">
                      <Label className="text-xs">Finish</Label>
                      <Input
                        value={variant.finish}
                        onChange={(e) => updateVariant(index, "finish", e.target.value)}
                        placeholder="Glossy"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Size</Label>
                      <Input
                        value={variant.size}
                        onChange={(e) => updateVariant(index, "size", e.target.value)}
                        placeholder="A4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) => updateVariant(index, "quantity", parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Price (₹)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, "price", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Active</Label>
                      <Switch
                        checked={variant.is_active}
                        onCheckedChange={(checked) => updateVariant(index, "is_active", checked)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No variants yet. Add variants to define different finish, size, and quantity options.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
                <Label>Active</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                />
                <Label>Featured</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              isEditing ? "Update Product" : "Create Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}