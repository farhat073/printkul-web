"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ProductCard } from "@/components/customer/ProductCard"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  slug: string
  name: string
  short_desc?: string
  thumbnail_url?: string
  base_price: string
  is_featured?: boolean
  subcategory?: {
    slug: string
    category?: { slug: string }
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("name")

      if (categoriesData) {
        setCategories(categoriesData)
      }

      const { data: productsData } = await supabase
        .from("products")
        .select("*, subcategory:subcategories(*, category:categories(slug))")
        .eq("is_active", true)
        .order("name")

      if (productsData) {
        setProducts(productsData)
        setFilteredProducts(productsData)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter((p) => p.subcategory?.category?.slug === selectedCategory))
    } else {
      setFilteredProducts(products)
    }
  }, [selectedCategory, products])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            All Products
          </h1>
          <p className="text-white/70">
            Browse our complete range of print products
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-white sticky top-[140px] z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                !selectedCategory
                  ? "bg-[#1a1a2e] text-white"
                  : "bg-muted hover:bg-amber/10 hover:text-amber"
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name.toLowerCase().replace(/\s+/g, '-'))}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.name.toLowerCase().replace(/\s+/g, '-')
                    ? "bg-[#1a1a2e] text-white"
                    : "bg-muted hover:bg-amber/10 hover:text-amber"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <ProductCard
                  product={{
                    ...product,
                    category_slug: product.subcategory?.category?.slug || "",
                    subcategory_slug: product.subcategory?.slug || "",
                  }}
                />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}