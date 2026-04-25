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
      <div className="bg-white rounded-xl border border-[#e9ecef] overflow-hidden card-hover">
        <div className="relative aspect-square bg-[#f8f9fa] overflow-hidden">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]">
              <div className="w-16 h-16 bg-amber/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-amber/30">P</span>
              </div>
            </div>
          )}
          {showFeaturedBadge && product.is_featured && (
            <span className="absolute top-2.5 left-2.5 bg-amber text-white text-[10px] font-bold px-2 py-0.5 rounded">
              FEATURED
            </span>
          )}
        </div>
        <div className="p-3.5">
          <h3 className="font-medium text-[#0f1b2d] text-sm group-hover:text-amber transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          {product.short_desc && (
            <p className="text-xs text-[#adb5bd] mt-1 line-clamp-1">{product.short_desc}</p>
          )}
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-base font-bold text-[#0f1b2d]">₹{product.base_price}</span>
            {product.price_note && (
              <span className="text-[11px] text-[#adb5bd]">{product.price_note}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}