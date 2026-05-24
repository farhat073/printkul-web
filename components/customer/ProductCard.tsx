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
      <div className="bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-2 flex flex-col h-full border border-border/40 hover:border-brand-accent/20">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-brand-gray overflow-hidden">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-gray to-border/20">
              <div className="w-20 h-20 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-brand-slate/15 tracking-tight">PK</span>
              </div>
            </div>
          )}
          
          {/* Subtle gradient overlay at bottom for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          {showFeaturedBadge && product.is_featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-brand-accent/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg tracking-wide">
                BESTSELLER
              </span>
            </div>
          )}

          {/* Hover action button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl text-brand-slate group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-brand-slate text-[15px] group-hover:text-brand-accent transition-colors duration-300 line-clamp-2 leading-snug tracking-tight">
            {product.name}
          </h3>
          {product.short_desc && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-1 font-medium leading-relaxed">
              {product.short_desc}
            </p>
          )}
          
          <div className="mt-auto pt-4 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider block mb-0.5">Starting at</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-brand-slate tracking-tight">₹{product.base_price}</span>
                {product.price_note && (
                  <span className="text-[10px] font-semibold text-muted-foreground">{product.price_note}</span>
                )}
              </div>
            </div>
            
            <span className="text-[11px] font-bold text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}