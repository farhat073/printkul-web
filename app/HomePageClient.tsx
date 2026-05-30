"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react"
import { ProductCard } from "@/components/customer/ProductCard"
import { Marquee } from "@/components/ui/Marquee"
import { HeroCarousel } from "@/components/customer/HeroCarousel"
import { GoogleReviewsMarquee } from "@/components/customer/GoogleReviewsMarquee"

interface Banner {
  id: string
  title: string
  subtitle?: string
  image_url: string
  cta_text?: string
  cta_url?: string
}

interface Category {
  id: string
  slug: string
  name: string
  description?: string
  banner_url?: string
  icon_url?: string
  subcategories?: { id: string; slug: string; name: string }[]
}

interface Product {
  id: string
  slug: string
  name: string
  short_desc?: string
  thumbnail_url?: string
  base_price: string
  price_note?: string
  is_featured?: boolean
  subcategory?: {
    slug: string
    category?: { slug: string }
  }
}

interface Deal {
  id: string
  title: string
  description?: string
  badge_text?: string
  image_url?: string
  product?: Product
}

interface HomePageClientProps {
  categories: Category[]
  featuredProducts: Product[]
  banners: Banner[]
  deals: Deal[]
}

export function HomePageClient({ categories = [], featuredProducts = [], banners = [], deals = [] }: HomePageClientProps) {
  const categoryScrollRef = useRef<HTMLDivElement>(null)

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const { scrollLeft, clientWidth } = categoryScrollRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      categoryScrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }


  return (
    <div className="min-h-screen text-brand-slate bg-white">
      {/* ── 1. FLIPKART-STYLE HERO CAROUSEL ── */}
      <HeroCarousel banners={banners} />

      {/* 2. EXPLORE ALL CATEGORIES — Side Scroll */}
      <section className="py-10 md:py-16">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-slate font-heading">Explore all categories</h2>
              <p className="text-muted-foreground mt-2">Find exactly what you need for your brand</p>
            </div>
          </div>
          
          <div className="relative group">
            <button 
              onClick={() => scrollCategories('left')}
              className="absolute left-0 top-[80px] md:top-[90px] -translate-x-1/2 -translate-y-1/2 bg-white border border-border shadow-xl w-14 h-14 rounded-full items-center justify-center text-brand-slate hover:text-brand-accent hidden md:flex transition-all hover:scale-110 z-10 active:scale-95 opacity-0 group-hover:opacity-100"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-7 h-7 -ml-1" />
            </button>

            <div 
              ref={categoryScrollRef}
              className="flex overflow-x-auto gap-6 md:gap-10 pb-6 snap-x snap-mandatory hide-scrollbar"
            >
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="flex flex-col items-center gap-5 min-w-[130px] md:min-w-[160px] snap-start group/cat"
                >
                  <div className="w-[130px] h-[130px] md:w-[160px] md:h-[160px] rounded-full bg-white flex items-center justify-center p-0.5 transition-all duration-300 group-hover/cat:ring-4 group-hover/cat:ring-brand-accent/10 border border-border shadow-sm group-hover/cat:shadow-md group-hover/cat:border-brand-accent overflow-hidden">
                    <img 
                        src={`/categories/${category.slug}.png`}
                        alt={category.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (category.banner_url) {
                            target.src = category.banner_url
                          }
                        }}
                      />
                  </div>
                  <h3 className="font-bold text-base text-center text-brand-slate group-hover:text-brand-accent transition-colors line-clamp-2 max-w-[1400px]">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
            
            <button 
              onClick={() => scrollCategories('right')}
              className="absolute right-0 top-[80px] md:top-[90px] translate-x-1/2 -translate-y-1/2 bg-white border border-border shadow-xl w-14 h-14 rounded-full items-center justify-center text-brand-slate hover:text-brand-accent hidden md:flex transition-all hover:scale-110 z-10 active:scale-95 opacity-0 group-hover:opacity-100"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-7 h-7 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. FEATURED / BEST SELLERS */}
      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/10 text-brand-accent rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
                  Our Bestsellers
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-brand-slate font-heading tracking-tight">
                  Customer Favorites
                </h2>
              </div>
              <Link href="/products" className="inline-flex items-center gap-2 text-base font-bold text-brand-primary hover:text-brand-accent transition-all group">
                Explore Full Catalog <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 lg:gap-10">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    category_slug: product.subcategory?.category?.slug || "",
                    subcategory_slug: product.subcategory?.slug || "",
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8a. PRODUCT SHOWCASE — Dynamic from DB categories */}
      {categories.length > 0 && (
        <section className="py-12 md:py-24">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-brand-slate font-heading tracking-tight">Our Premium Range</h2>
              <p className="text-muted-foreground mt-4 text-xl max-w-2xl mx-auto">Crafted with precision, delivered with care. Explore our diverse printing solutions.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
              {categories.slice(0, 6).map((cat) => (
                <Link key={cat.id} href={`/${cat.slug}`} className="group relative rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={`/categories/${cat.slug}.png`}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (cat.banner_url) target.src = cat.banner_url
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-slate/90 via-brand-slate/20 to-transparent flex items-end p-6 md:p-8">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-bold text-xl md:text-2xl">{cat.name}</h3>
                      <div className="h-1 w-0 group-hover:w-full bg-brand-accent transition-all duration-500 mt-2 rounded-full" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8b. BRANDS THAT TRUST US - MARQUEE */}
      <section className="py-12 md:py-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-sm md:text-base font-bold text-brand-slate/50 uppercase tracking-[0.3em]">Trusted By Leading Organizations</h2>
          </div>
          <Marquee 
            items={[
              "Government of J&K", 
              "JKSSB", 
              "Tourism Dept", 
              "JKEDI", 
              "University of Kashmir", 
              "NIT Srinagar", 
              "IUST", 
              "SKIMS", 
              "HDFC Bank",
              "Khyber Resorts",
              "Private Schools", 
              "Hotels Association"
            ]} 
            speed="slow"
            variant="text"
          />
        </div>
      </section>

      {/* 8c. GOOGLE REVIEWS */}
      <GoogleReviewsMarquee />

      {/* 8d. FIND STORES - MARQUEE */}
      <section className="py-12 md:py-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-16 text-center">
           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-brand-slate">Our Presence Across J&K</h2>
           <p className="text-brand-slate/50">Delivering excellence to every district in the valley.</p>
        </div>
        <Marquee 
          items={["Anantnag","Srinagar","Jammu","Banihal","Bandipora","Baramulla","Budgam","Ganderbal","Kulgam","Kupwara","Pulwama","Shopian"]} 
          speed="normal"
          className="py-4"
          variant="pill"
        />
      </section>
    </div>
  )
}
