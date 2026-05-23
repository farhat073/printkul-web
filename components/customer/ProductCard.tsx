import Link from "next/link"
import { ArrowUpRight, ShoppingCart } from "lucide-react"

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
      <div className="bg-white rounded-xl border border-border/60 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square bg-brand-gray overflow-hidden">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-gray to-border/40">
              <div className="w-16 h-16 bg-brand-accent/5 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-brand-slate/20">PK</span>
              </div>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {showFeaturedBadge && product.is_featured && (
              <span className="bg-brand-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm">
                BESTSELLER
              </span>
            )}
          </div>

          {/* Hover Overlay Action */}
          <div className="absolute inset-0 bg-brand-slate/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white text-brand-slate p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-2">
             <h3 className="font-bold text-brand-slate text-base group-hover:text-brand-accent transition-colors line-clamp-2 leading-tight tracking-tight">
              {product.name}
            </h3>
            {product.short_desc && (
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1 font-medium italic opacity-80">
                {product.short_desc}
              </p>
            )}
          </div>
          
          <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-brand-slate">₹{product.base_price}</span>
                {product.price_note && (
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{product.price_note}</span>
                )}
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-brand-gray flex items-center justify-center text-brand-slate group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}