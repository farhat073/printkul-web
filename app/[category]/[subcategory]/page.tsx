import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ProductCard } from "@/components/customer/ProductCard"
import { ChevronRight } from "lucide-react"

export const revalidate = 300

interface SubcategoryPageProps {
  params: Promise<{ category: string; subcategory: string }>
}

export async function generateMetadata({ params }: SubcategoryPageProps) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params
  const supabase = await createClient()

  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("name, seo_title, seo_desc, category:categories(name)")
    .eq("slug", subcategorySlug)
    .single()

  if (!subcategory) return { title: "Not Found" }

  return {
    title: subcategory.seo_title || `${subcategory.name} | Printkul`,
    description: subcategory.seo_desc || `Shop ${subcategory.name} at Printkul. Quality print products with WhatsApp ordering.`,
  }
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params
  const supabase = await createClient()

  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("*, category:categories(slug, name)")
    .eq("slug", subcategorySlug)
    .eq("is_active", true)
    .single()

  if (!subcategory) notFound()

  const { data: products } = await supabase
    .from("products")
    .select("*, subcategory:subcategories(*, category:categories(slug))")
    .eq("subcategory_id", subcategory.id)
    .eq("is_active", true)
    .order("sort_order")

  const uniqueFinishes = [...new Set(products?.flatMap((p) =>
    p.variants?.map((v: any) => v.finish) || []
  ) || [])].filter(Boolean)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] text-white py-12">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${categorySlug}`} className="hover:text-white">{subcategory.category?.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{subcategory.name}</span>
          </nav>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">{subcategory.name}</h1>
          {subcategory.description && (
            <p className="text-white/70 mt-2 max-w-2xl">{subcategory.description}</p>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-white sticky top-[140px] z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filter by:</span>
            {uniqueFinishes.slice(0, 6).map((finish) => (
              <button
                key={finish}
                className="px-4 py-1.5 bg-muted rounded-full text-sm hover:bg-amber/10 hover:text-amber transition-colors whitespace-nowrap"
              >
                {finish}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products?.map((product, index) => (
              <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <ProductCard
                  product={{
                    ...product,
                    category_slug: categorySlug,
                    subcategory_slug: subcategorySlug,
                  }}
                />
              </div>
            ))}
          </div>

          {(!products || products.length === 0) && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products found in this category.</p>
              <Link href="/products" className="text-amber hover:underline mt-2 inline-block">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}