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
import { MoreHorizontal, Plus, Edit2, Trash2, Eye, Package } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  slug: string
  short_desc?: string
  thumbnail_url?: string
  base_price: string
  is_active: boolean
  is_featured: boolean
  sort_order: number
  subcategory?: {
    name: string
    category?: { name: string }
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [filterFeatured, setFilterFeatured] = useState<boolean | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    let query = supabase
      .from("products")
      .select("*, subcategory:subcategories(name, category:categories(name))")
      .order("sort_order")

    if (filterActive !== null) {
      query = query.eq("is_active", filterActive)
    }
    if (filterFeatured !== null) {
      query = query.eq("is_featured", filterFeatured)
    }

    const { data } = await query
    if (data) {
      setProducts(data)
    }
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">{products.length} products total</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Button
            variant={filterActive === null ? "secondary" : "outline"}
            onClick={() => setFilterActive(null)}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterActive === true ? "secondary" : "outline"}
            onClick={() => setFilterActive(true)}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={filterActive === false ? "secondary" : "outline"}
            onClick={() => setFilterActive(false)}
            size="sm"
          >
            Inactive
          </Button>
          <Button
            variant={filterFeatured === true ? "secondary" : "outline"}
            onClick={() => setFilterFeatured(filterFeatured ? null : true)}
            size="sm"
          >
            Featured Only
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr className="text-left text-sm">
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Featured</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {product.thumbnail_url ? (
                            <img
                              src={product.thumbnail_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {product.subcategory?.category?.name} / {product.subcategory?.name}
                    </td>
                    <td className="px-6 py-4">₹{product.base_price}</td>
                    <td className="px-6 py-4">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeatured(product)}
                        className={`text-sm ${product.is_featured ? "text-amber font-medium" : "text-muted-foreground"}`}
                      >
                        {product.is_featured ? "★ Featured" : "☆ Not featured"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/${product.subcategory?.category?.name.toLowerCase().replace(/\s+/g, '-')}/${product.subcategory?.name.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`} className="flex items-center w-full">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/admin/products/${product.id}`} className="flex items-center w-full">
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleActive(product)}
                          >
                            {product.is_active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteProduct(product)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
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
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No products found</p>
              <Link href="/admin/products/new" className="text-amber hover:underline mt-2 inline-block">
                Add your first product
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}