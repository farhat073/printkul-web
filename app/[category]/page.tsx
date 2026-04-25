import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ProductCard } from "@/components/customer/ProductCard"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

export const revalidate = 300

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("name, seo_title, seo_desc")
    .eq("slug", categorySlug)
    .single()

  if (!category) return { title: "Category Not Found" }

  return {
    title: category.seo_title || `${category.name} | Printkul`,
    description: category.seo_desc || `Shop ${category.name} at Printkul. Quality print products with WhatsApp ordering.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("*, subcategories(*)")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .single()

  if (!category) notFound()

  const { data: products } = await supabase
    .from("products")
    .select("*, subcategory:subcategories(*, category:categories(slug))")
    .eq("subcategory.category_id", category.id)
    .eq("is_active", true)
    .order("sort_order")

  const featuredProducts = products?.filter((p) => p.is_featured) || []

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{category.name}</span>
          </nav>

          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/70 text-lg max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-xl font-semibold mb-6">Browse by Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.subcategories?.map((sub: any) => (
                <Link
                  key={sub.id}
                  href={`/${categorySlug}/${sub.slug}`}
                  className="group bg-white rounded-lg border border-border p-4 hover:border-amber/30 hover:shadow-md transition-all"
                >
                  <h3 className="font-medium text-[#1a1a2e] group-hover:text-amber transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">View products →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl font-bold">Featured in {category.name}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    category_slug: categorySlug,
                    subcategory_slug: product.subcategory?.slug || "",
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      {products && products.length > 0 && (
        <section className="py-16 bg-[#faf8f5]">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold mb-8">All {category.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    category_slug: categorySlug,
                    subcategory_slug: product.subcategory?.slug || "",
                  }}
                  showFeaturedBadge={false}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}