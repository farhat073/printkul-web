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
                      <div className="h-1 w-0 group-hover:w-full transition-all duration-500 mt-2 rounded-full" style={{ background: 'linear-gradient(90deg, #662CE5, #D4116C, #EB652D)' }} />
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
              { text: "GoodDay", logo: "/client-logos/1-goodday-logo.png" },
              { text: "Aarafh Foods", logo: "/client-logos/aarafh-foods.png" },
              { text: "Alpine Inn", logo: "/client-logos/alpine-inn-pahalgam.png" },
              { text: "Aru Foods", logo: "/client-logos/aru-foods.png" },
              { text: "Auura Water", logo: "/client-logos/auura-water.png" },
              { text: "Cake Villa", logo: "/client-logos/cake-villa.png" },
              { text: "City Dental Care", logo: "/client-logos/city-dental-care.png" },
              { text: "Creme by Ahdoos", logo: "/client-logos/creme-by-ahdoos.png" },
              { text: "Dalal Sons", logo: "/client-logos/dalal-sons.png" },
              { text: "Deen Architects", logo: "/client-logos/deen-architects.png" },
              { text: "Elvaris", logo: "/client-logos/elvaris-logo.png" },
              { text: "Frukins", logo: "/client-logos/frukins.png" },
              { text: "Frulavour", logo: "/client-logos/frulavour.png" },
              { text: "Ghulab Jewellers", logo: "/client-logos/ghulab-jewellers.png" },
              { text: "Hamdan Foods", logo: "/client-logos/hamdan-foods.png" },
              { text: "Hermitage Hotel", logo: "/client-logos/hermitage-hotel.png" },
              { text: "Jiddah", logo: "/client-logos/jiddah.png" },
              { text: "Kashmir Box", logo: "/client-logos/kashmir-box.png" },
              { text: "Manchester Education", logo: "/client-logos/manchester-education.png" },
              { text: "New Shaheen", logo: "/client-logos/new-shaheen.png" },
              { text: "Pahalgam Divine", logo: "/client-logos/pahalgam-divine.png" },
              { text: "Qandi", logo: "/client-logos/qandi.png" },
              { text: "Raahat Mattress", logo: "/client-logos/raahat-mattress.png" },
              { text: "Royal Furniture", logo: "/client-logos/royal-furniture.png" },
              { text: "Safalta Agro", logo: "/client-logos/safalta-agro-logo.png" },
              { text: "Swift Homes", logo: "/client-logos/swift-homes.png" },
              { text: "Walltec Paints", logo: "/client-logos/walltec-paints.png" },
              { text: "Walltree Foods", logo: "/client-logos/walltree-foods.png" },
              { text: "Heeposh", logo: "/client-logos/heeposh.png" },
              { text: "i Bake Bakery", logo: "/client-logos/i-bake-bakery.png" },
              { text: "Kinzal", logo: "/client-logos/kinzal.png" },
              { text: "The Corner Cafe", logo: "/client-logos/the-corner-cafe.png" },
              { text: "Uprise", logo: "/client-logos/uprise.png" },
            ]} 
            speed="slow"
            variant="logo"
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
