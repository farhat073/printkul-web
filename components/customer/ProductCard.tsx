import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

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
      <div className="relative rounded-2xl overflow-hidden border border-border/40 hover:border-brand-accent/20 transition-all duration-500 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-2 aspect-[3/4]">
        {/* Full-bleed image */}
        {product.thumbnail_url ? (
          <img
            src={product.thumbnail_url}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out scale-110 md:scale-100 md:group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-gray to-border/20">
            <div className="w-20 h-20 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-brand-slate/15 tracking-tight">PK</span>
            </div>
          </div>
        )}

        {/* Badges — always visible */}
        {showFeaturedBadge && product.is_featured && (
          <div className="absolute top-3 left-3 z-20">
            <span className="text-white text-[9px] md:text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg tracking-widest" style={{ background: 'linear-gradient(90deg, #662CE5, #D4116C, #EB652D)' }}>
              BESTSELLER
            </span>
          </div>
        )}

        {/* Default: Name pill at the bottom (Desktop only) */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3 hidden md:block transition-opacity duration-300 md:group-hover:opacity-0">
          <div className="inline-flex items-center max-w-full">
            <span className="bg-white/90 backdrop-blur-md text-brand-slate text-[11px] md:text-[13px] font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg truncate">
              {product.name}
            </span>
          </div>
        </div>

        {/* Hover: Full details overlay (Default on mobile, Hover on desktop) */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Details panel */}
          <div className="relative p-4 md:p-5 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <h3 className="font-bold text-white text-[13px] md:text-[15px] line-clamp-2 leading-snug tracking-tight mb-1.5">
              {product.name}
            </h3>
            {product.short_desc && (
              <p className="text-[11px] md:text-xs text-white/70 line-clamp-1 font-medium mb-3">
                {product.short_desc}
              </p>
            )}

            <div className="flex items-end justify-between">
              <div>
                <span className="text-[9px] md:text-[10px] font-semibold text-white/50 uppercase tracking-wider block mb-0.5">Starting at</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg md:text-xl font-extrabold text-white tracking-tight">₹{product.base_price}</span>
                  {product.price_note && (
                    <span className="text-[10px] font-semibold text-white/60">{product.price_note}</span>
                  )}
                </div>
              </div>

              <div className="w-9 h-9 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-brand-accent transition-colors duration-300 flex-shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}