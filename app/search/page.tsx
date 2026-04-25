"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ProductCard } from "@/components/customer/ProductCard"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

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

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchInput, setSearchInput] = useState(query)
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)

      const { data } = await supabase
        .from("products")
        .select("*, subcategory:subcategories(*, category:categories(slug))")
        .ilike("name", `%${query}%`)
        .eq("is_active", true)
        .limit(20)

      if (data) {
        setResults(data)
      }

      setIsLoading(false)
    }

    search()
  }, [query])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const url = new URL(window.location.href)
    url.searchParams.set("q", searchInput)
    window.location.href = url.toString()
  }

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold mb-6">Search Products</h1>
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products..."
                className="pl-12 h-12 text-lg"
              />
            </div>
          </form>
          {query && (
            <p className="text-white/60 mt-4">
              Showing results for &quot;{query}&quot; — {results.length} products found
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-amber border-t-transparent rounded-full" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {results.map((product, index) => (
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
          ) : query ? (
            <div className="text-center py-16">
              <X className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-heading text-xl font-semibold mb-2">No results found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn&apos;t find any products matching &quot;{query}&quot;
              </p>
              <Link
                href="/products"
                className="text-amber hover:underline"
              >
                Browse all products
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber border-t-transparent rounded-full" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}