import Link from "next/link"

interface ProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    short_desc?: string
    thumbnail_url?: string
    base_price: string
    price_note?: string
    is_featured?: boolean
    category_slug: string
    subcategory_slug: string
  }
  showFeaturedBadge?: boolean
}

export function ProductCard({ product, showFeaturedBadge = true }: ProductCardProps) {
  const href = `/${product.category_slug}/${product.subcategory_slug}/${product.slug}`

  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded border border-border overflow-hidden card-hover">
        <div className="relative aspect-square bg-brand-gray overflow-hidden">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-gray to-border">
              <div className="w-16 h-16 bg-brand-accent/5 rounded flex items-center justify-center">
                <span className="text-2xl font-bold text-brand-slate/30">P</span>
              </div>
            </div>
          )}
          {showFeaturedBadge && product.is_featured && (
            <span className="absolute top-2.5 left-2.5 bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              FEATURED
            </span>
          )}
        </div>
        <div className="p-3.5">
          <h3 className="font-semibold text-brand-slate text-sm group-hover:text-brand-accent transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          {product.short_desc && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.short_desc}</p>
          )}
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-base font-bold text-brand-slate">₹{product.base_price}</span>
            {product.price_note && (
              <span className="text-[11px] text-muted-foreground">{product.price_note}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}