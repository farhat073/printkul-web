"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { Plus, Trash2, Loader2, ArrowLeft, X, Percent } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

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

interface PricingTier {
  qty: number
  discount: number // percentage
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
    moq: 1000,
    pricing_tiers: [
      { qty: 2000, discount: 6 },
      { qty: 3000, discount: 12 },
      { qty: 5000, discount: 18 },
      { qty: 10000, discount: 25 },
    ] as PricingTier[],
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
  const [specKey, setSpecKey] = useState("")
  const [specValue, setSpecValue] = useState("")
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: cats } = await supabase
        .from("categories")
        .select("*, subcategories(*)")
        .eq("is_active", true)
        .order("sort_order")

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
            moq: product.moq ?? 1000,
            pricing_tiers: product.pricing_tiers ?? [
              { qty: 2000, discount: 6 },
              { qty: 3000, discount: 12 },
              { qty: 5000, discount: 18 },
              { qty: 10000, discount: 25 },
            ],
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

          const { data: vars } = await supabase
            .from("product_variants")
            .select("*")
            .eq("product_id", params.id)
            .order("sort_order")

          if (vars) setVariants(vars)

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

  function addSpecification() {
    if (!specKey.trim()) return
    setFormData({
      ...formData,
      specifications: { ...formData.specifications, [specKey.trim()]: specValue.trim() },
    })
    setSpecKey("")
    setSpecValue("")
  }

  function removeSpecification(key: string) {
    const specs = { ...formData.specifications }
    delete specs[key]
    setFormData({ ...formData, specifications: specs })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      let productId = params.id

      const productData = {
        name: formData.name,
        slug: formData.slug,
        short_desc: formData.short_desc,
        description: formData.description,
        base_price: formData.base_price,
        price_note: formData.price_note,
        moq: formData.moq,
        pricing_tiers: formData.pricing_tiers,
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
      }

      if (isEditing) {
        await supabase.from("products").update(productData).eq("id", params.id)
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single()

        if (error) throw error
        productId = data.id
      }

      // Save variants
      if (productId) {
        await supabase.from("product_variants").delete().eq("product_id", productId)

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
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/products" className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-brand-slate">
            {isEditing ? "Edit Product" : "New Product"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isEditing ? "Update product details" : "Add a new product to your catalog"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g. Standard Matte Visiting Cards"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-xs">Slug</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="auto-generated"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={autoGenerateSlug}>
                    Auto
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_desc" className="text-xs">Short Description</Label>
              <Input
                id="short_desc"
                value={formData.short_desc}
                onChange={(e) => handleInputChange("short_desc", e.target.value)}
                placeholder="Shown on product cards (1 line)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                placeholder="Detailed product description..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Category & Pricing */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold">Category & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Category *</Label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full h-9 px-3 border border-input rounded-lg bg-background text-sm"
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
                <Label className="text-xs">Sub-category *</Label>
                <select
                  value={formData.subcategory_id}
                  onChange={(e) => handleInputChange("subcategory_id", e.target.value)}
                  className="w-full h-9 px-3 border border-input rounded-lg bg-background text-sm"
                >
                  <option value="">Select sub-category</option>
                  {subcategories.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base_price" className="text-xs">Base Price (₹) *</Label>
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
                <Label htmlFor="price_note" className="text-xs">Price Note</Label>
                <Input
                  id="price_note"
                  value={formData.price_note}
                  onChange={(e) => handleInputChange("price_note", e.target.value)}
                  placeholder="e.g., per 100 pcs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order" className="text-xs">Sort Order</Label>
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

        {/* MOQ & Bulk Pricing */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Percent className="w-4 h-4" />
              MOQ & Bulk Pricing Tiers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Minimum Order Quantity (MOQ) *</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.moq}
                  onChange={(e) => handleInputChange("moq", parseInt(e.target.value) || 1000)}
                  placeholder="1000"
                />
                <p className="text-[10px] text-muted-foreground">
                  Base price is for this quantity. Customers cannot order less.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Discount Tiers</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const lastQty = formData.pricing_tiers.length > 0
                      ? formData.pricing_tiers[formData.pricing_tiers.length - 1].qty
                      : formData.moq
                    handleInputChange("pricing_tiers", [
                      ...formData.pricing_tiers,
                      { qty: lastQty + 1000, discount: 0 },
                    ])
                  }}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Tier
                </Button>
              </div>

              {formData.pricing_tiers.length > 0 ? (
                <div className="space-y-2">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_1fr_40px] gap-3 px-3">
                    <span className="text-[10px] text-muted-foreground font-medium">Quantity (pcs)</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Discount (%)</span>
                    <span></span>
                  </div>
                  {/* Base tier (non-editable) */}
                  <div className="grid grid-cols-[1fr_1fr_40px] gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{formData.moq.toLocaleString("en-IN")} pcs</span>
                      <span className="text-[10px] text-muted-foreground ml-2">(base)</span>
                    </div>
                    <span className="text-sm text-muted-foreground flex items-center">0% — base rate</span>
                    <span></span>
                  </div>
                  {/* Editable tiers */}
                  {formData.pricing_tiers.map((tier, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_40px] gap-3 p-3 bg-muted/20 rounded-lg">
                      <Input
                        type="number"
                        min={formData.moq + 1}
                        value={tier.qty}
                        onChange={(e) => {
                          const newTiers = [...formData.pricing_tiers]
                          newTiers[index] = { ...newTiers[index], qty: parseInt(e.target.value) || 0 }
                          handleInputChange("pricing_tiers", newTiers)
                        }}
                        className="h-8 text-sm"
                      />
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={tier.discount}
                          onChange={(e) => {
                            const newTiers = [...formData.pricing_tiers]
                            newTiers[index] = { ...newTiers[index], discount: parseFloat(e.target.value) || 0 }
                            handleInputChange("pricing_tiers", newTiers)
                          }}
                          className="h-8 text-sm"
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          handleInputChange(
                            "pricing_tiers",
                            formData.pricing_tiers.filter((_, i) => i !== index)
                          )
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No bulk discount tiers. Add tiers to offer discounts at higher quantities.
                </p>
              )}

              {formData.pricing_tiers.length > 0 && formData.base_price && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-[10px] font-semibold text-emerald-700 mb-2">Preview</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{formData.moq.toLocaleString("en-IN")} pcs</span>
                      <span className="font-medium">₹{parseFloat(formData.base_price).toLocaleString("en-IN")} (₹{(parseFloat(formData.base_price) / formData.moq).toFixed(2)}/pc)</span>
                    </div>
                    {formData.pricing_tiers
                      .sort((a, b) => a.qty - b.qty)
                      .map((tier, i) => {
                        const basePP = parseFloat(formData.base_price) / formData.moq
                        const discPP = basePP * (1 - tier.discount / 100)
                        const total = Math.round(discPP * tier.qty)
                        return (
                          <div key={i} className="flex justify-between text-xs">
                            <span>{tier.qty.toLocaleString("en-IN")} pcs <span className="text-emerald-600">({tier.discount}% off)</span></span>
                            <span className="font-medium">₹{total.toLocaleString("en-IN")} (₹{discPP.toFixed(2)}/pc)</span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images — Cloudinary */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold">Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploader
              value={formData.thumbnail_url}
              onChange={(url) => handleInputChange("thumbnail_url", url)}
              folder="printkul/thumbnails"
              label="Thumbnail Image"
            />

            <ImageUploader
              value={formData.images}
              onChange={(urls) => handleInputChange("images", urls)}
              folder="printkul/products"
              multiple
              maxFiles={8}
              label="Gallery Images (up to 8)"
            />
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold">Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(formData.specifications).length > 0 && (
              <div className="space-y-2 mb-4">
                {Object.entries(formData.specifications).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg text-sm">
                    <span className="font-medium text-brand-slate">{key}:</span>
                    <span className="text-muted-foreground flex-1">{val}</span>
                    <button type="button" onClick={() => removeSpecification(key)} className="text-destructive hover:text-destructive/80">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                placeholder="Key (e.g. Paper Weight)"
                className="flex-1"
              />
              <Input
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                placeholder="Value (e.g. 350gsm)"
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-bold">Variants</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent>
            {variants.length > 0 ? (
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div
                    key={variant.id}
                    className="grid grid-cols-2 md:grid-cols-6 gap-3 p-4 bg-muted/30 rounded-xl"
                  >
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Finish</Label>
                      <Input
                        value={variant.finish}
                        onChange={(e) => updateVariant(index, "finish", e.target.value)}
                        placeholder="Glossy"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Size</Label>
                      <Input
                        value={variant.size}
                        onChange={(e) => updateVariant(index, "size", e.target.value)}
                        placeholder="A4"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Qty</Label>
                      <Input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) => updateVariant(index, "quantity", parseInt(e.target.value))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Price (₹)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, "price", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Active</Label>
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
                        className="h-8 w-8"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6 text-sm">
                No variants. Add variants for different finish, size, and quantity options.
              </p>
            )}
          </CardContent>
        </Card>

        {/* SEO */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold">SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">SEO Title</Label>
              <Input
                value={formData.seo_title}
                onChange={(e) => handleInputChange("seo_title", e.target.value)}
                placeholder="Page title for search engines"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">SEO Description</Label>
              <Textarea
                value={formData.seo_desc}
                onChange={(e) => handleInputChange("seo_desc", e.target.value)}
                rows={2}
                placeholder="Meta description for search engines"
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings & Submit */}
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-8 mb-6">
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
                <Label className="text-sm">Active</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                />
                <Label className="text-sm">Featured</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
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
          </CardContent>
        </Card>
      </form>
    </div>
  )
}