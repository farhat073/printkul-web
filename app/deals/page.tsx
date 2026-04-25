import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export const revalidate = 60

export default async function DealsPage() {
  const supabase = await createClient()

  const { data: deals } = await supabase
    .from("deals")
    .select(`
      *,
      product:products(*, subcategory:subcategories(*, category:categories(slug)))
    `)
    .eq("is_active", true)
    .lte("starts_at", new Date().toISOString())
    .gte("ends_at", new Date().toISOString())
    .order("sort_order")

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-amber to-amber-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Hot Deals & Offers
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Save big on quality print products. Limited time offers, grab them before they expire!
          </p>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {deals && deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deals.map((deal) => {
                const product = deal.product
                const href = product
                  ? `/${product.subcategory?.category?.slug}/${product.subcategory?.slug}/${product.slug}`
                  : "#"

                return (
                  <Link
                    key={deal.id}
                    href={href}
                    className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-amber/30 transition-all"
                  >
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44]">
                      {deal.image_url ? (
                        <img
                          src={deal.image_url}
                          alt={deal.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🏷️
                        </div>
                      )}
                      {deal.badge_text && (
                        <Badge className="absolute top-4 left-4 bg-amber text-white">
                          {deal.badge_text}
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-bold mb-2 group-hover:text-amber transition-colors">
                        {deal.title}
                      </h3>
                      {deal.description && (
                        <p className="text-muted-foreground text-sm mb-4">
                          {deal.description}
                        </p>
                      )}
                      {product && (
                        <p className="text-sm text-amber font-medium">
                          View Product →
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No active deals at the moment.</p>
              <Link href="/products" className="text-amber hover:underline mt-4 inline-block">
                Browse all products →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}