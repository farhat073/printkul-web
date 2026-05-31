"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Edit2, Trash2, Eye, Package, LayoutGrid, List, Star, StarOff } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  slug: string
  short_desc?: string
  thumbnail_url?: string
  base_price: string
  price_note?: string
  is_active: boolean
  is_featured: boolean
  sort_order: number
  subcategory?: {
    name: string
    slug: string
    category?: { name: string; slug: string }
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null)
  const [filterCategory, setFilterCategory] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("id, name, slug").eq("is_active", true).order("sort_order")
    if (data) setCategories(data)
  }

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*, subcategory:subcategories(name, slug, category:categories(name, slug))")
      .order("sort_order")

    if (data) setProducts(data)
    setIsLoading(false)
  }

  async function toggleFeatured(product: Product) {
    const { error } = await supabase
      .from("products")
      .update({ is_featured: !product.is_featured })
      .eq("id", product.id)

    if (!error) {
      fetchProducts()
      toast.success(`${product.is_featured ? "Removed from" : "Added to"} featured`)
    }
  }

  async function toggleActive(product: Product) {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id)

    if (!error) {
      fetchProducts()
      toast.success(`${product.is_active ? "Deactivated" : "Activated"}`)
    }
  }

  async function deleteProduct(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return

    const { error } = await supabase.from("products").delete().eq("id", product.id)

    if (!error) {
      fetchProducts()
      toast.success("Product deleted")
    } else {
      toast.error("Failed to delete product")
    }
  }

  const filteredProducts = products.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterActive !== null && p.is_active !== filterActive) return false
    if (filterFeatured !== null && p.is_featured !== filterFeatured) return false
    if (filterCategory && p.subcategory?.category?.slug !== filterCategory) return false
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-slate">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} total · {filteredProducts.length} shown</p>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-9 px-3 border border-input rounded-lg bg-background text-sm max-w-[200px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <div className="flex gap-1.5">
          <Button variant={filterActive === null ? "secondary" : "outline"} onClick={() => setFilterActive(null)} size="sm">All</Button>
          <Button variant={filterActive === true ? "secondary" : "outline"} onClick={() => setFilterActive(true)} size="sm">Active</Button>
          <Button variant={filterActive === false ? "secondary" : "outline"} onClick={() => setFilterActive(false)} size="sm">Inactive</Button>
          <Button
            variant={filterFeatured === true ? "secondary" : "outline"}
            onClick={() => setFilterFeatured(filterFeatured ? null : true)}
            size="sm"
          >
            <Star className="w-3 h-3 mr-1" /> Featured
          </Button>
        </div>
        <div className="flex gap-1 ml-auto">
          <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-9 w-9" onClick={() => setViewMode("grid")}>
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Products — List View */}
      {viewMode === "list" && (
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/30">
                  <tr className="text-left text-xs font-medium text-muted-foreground">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3 hidden md:table-cell">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 hidden sm:table-cell">Featured</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            {product.thumbnail_url ? (
                              <img src={product.thumbnail_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-brand-slate truncate">{product.name}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {product.subcategory?.category?.name}
                          <span className="mx-1">›</span>
                          {product.subcategory?.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold">₹{product.base_price}</span>
                        {product.price_note && (
                          <span className="text-[10px] text-muted-foreground block">{product.price_note}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={product.is_active ? "default" : "secondary"} className="text-[10px]">
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <button onClick={() => toggleFeatured(product)}>
                          {product.is_featured ? (
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          ) : (
                            <StarOff className="w-4 h-4 text-muted-foreground/30 hover:text-amber-400 transition-colors" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/${product.subcategory?.category?.slug || ""}/${product.subcategory?.slug || ""}/${product.slug}`} className="flex items-center w-full">
                                <Eye className="w-4 h-4 mr-2" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/admin/products/${product.id}`} className="flex items-center w-full">
                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleActive(product)}>
                              {product.is_active ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteProduct(product)} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No products found</p>
                <Link href="/admin/products/new" className="text-sm text-brand-accent hover:underline mt-2 inline-block">
                  Add your first product
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Products — Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden border-border/50 group">
              <div className="aspect-square relative bg-muted">
                {product.thumbnail_url ? (
                  <img src={product.thumbnail_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-10 h-10 text-muted-foreground/20" />
                  </div>
                )}
                {product.is_featured && (
                  <div className="absolute top-2 left-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={product.is_active ? "default" : "secondary"} className="text-[9px]">
                    {product.is_active ? "Active" : "Off"}
                  </Badge>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Link href={`/admin/products/${product.id}`} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-brand-accent hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button onClick={() => deleteProduct(product)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-semibold text-brand-slate truncate">{product.name}</p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {product.subcategory?.category?.name} › {product.subcategory?.name}
                </p>
                <p className="text-sm font-bold mt-1.5">₹{product.base_price}</p>
              </CardContent>
            </Card>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Package className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}