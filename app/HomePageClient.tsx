"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ArrowRight, Truck, Shield, MessageCircle, Package, Zap, Award, Star, Palette, UploadCloud, CheckCircle, MapPin } from "lucide-react"
import { ProductCard } from "@/components/customer/ProductCard"
import { CategoryTile } from "@/components/customer/CategoryTile"

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

export function HomePageClient({
  categories,
  featuredProducts,
  banners,
  deals,
}: HomePageClientProps) {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isVisible, setIsVisible] = useState<Set<string>>(new Set())

  const heroImages = [
    "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&q=80",
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80",
    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1200&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % heroImages.length)
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + heroImages.length) % heroImages.length)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white text-brand-slate">
      {/* 1. HERO BANNER */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="relative min-h-[calc(100vh-108px)] py-8 md:py-20 flex items-center">
          
          {/* Background Images - Subtle Opacity */}
          <div className="absolute inset-0 z-0">
            {heroImages.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`Premium Printing ${index + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentBanner ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          
          {/* Overlay removed as requested */}
          
          <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 relative z-20 flex flex-col justify-center">
            <div className="max-w-3xl w-full bg-white/40 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/50 shadow-xl">
              <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1 md:px-4 md:py-1.5 bg-brand-accent/20 text-brand-accent rounded-full text-xs md:text-sm font-bold mb-3 md:mb-6">
                <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Kashmir&apos;s First Online Digital Printing Store</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand-slate leading-[1.1] mb-3 md:mb-6 font-heading tracking-tight drop-shadow-md">
                Best Quality<br />
                <span className="text-brand-accent drop-shadow-sm">Products.</span><br />
                <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-orange bg-clip-text text-transparent drop-shadow-sm">Easy Printing.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-800 mb-4 md:mb-8 font-semibold max-w-xl leading-snug md:leading-relaxed drop-shadow-sm">
                Professional printing for businesses & individuals. High-quality, reliable, and affordable — with fast delivery across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-5 mt-1 md:mt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 bg-brand-primary text-white font-bold rounded hover:bg-black transition-colors text-sm sm:text-base md:text-lg shadow-sm"
                >
                  Browse All Products
                </Link>
                <Link
                  href="/deals"
                  className="inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 bg-white text-brand-slate font-bold rounded hover:bg-brand-gray transition-colors text-sm sm:text-base md:text-lg border border-border shadow-sm"
                >
                  View Deals
                </Link>
              </div>
            </div>
          </div>
          
          {/* Carousel Indicators - Refined for White Background */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {heroImages.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentBanner(index)} 
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentBanner ? "bg-brand-accent w-12" : "bg-brand-gray-dark w-2.5 hover:bg-brand-accent/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. EXPLORE ALL CATEGORIES (CIRCULAR SLIDER) */}
      <section className="py-16 bg-brand-gray border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-brand-slate font-heading">Explore all categories</h2>
              <p className="text-muted-foreground mt-2">Find exactly what you need for your brand</p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="flex overflow-x-auto gap-6 md:gap-10 pb-6 snap-x snap-mandatory hide-scrollbar">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="flex flex-col items-center gap-5 min-w-[130px] md:min-w-[160px] snap-start group/cat"
                >
                  <div className="w-[130px] h-[130px] md:w-[160px] md:h-[160px] rounded-full bg-white flex items-center justify-center p-0.5 transition-all duration-300 group-hover/cat:ring-4 group-hover/cat:ring-brand-accent/10 border border-border shadow-sm group-hover/cat:shadow-md group-hover/cat:border-brand-accent overflow-hidden">
                    {category.banner_url ? (
                      <img 
                        src={category.banner_url} 
                        alt={category.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-brand-gray flex items-center justify-center">
                        <Package className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-center text-brand-slate group-hover:text-brand-accent transition-colors line-clamp-2 max-w-[140px]">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
            
            <button className="absolute right-0 top-[80px] md:top-[90px] -translate-y-1/2 bg-white border border-border shadow-xl w-14 h-14 rounded-full flex items-center justify-center text-brand-slate hover:text-brand-accent hidden md:flex transition-all hover:scale-110 z-10 active:scale-95">
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. FEATURED / BEST SELLERS */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-brand-gray">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-slate font-heading flex items-center gap-3">
                  Best Sellers <span className="text-xs bg-brand-accent text-white px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm">Most Popular</span>
                </h2>
              </div>
              <Link href="/products" className="hidden sm:flex items-center gap-1 text-base font-semibold text-brand-accent hover:text-brand-accent-dark transition-colors">
                View All <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory hide-scrollbar">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <div
                  key={product.id}
                  className="min-w-[280px] sm:min-w-[320px] snap-start"
                >
                  <ProductCard
                    product={{
                      ...product,
                      category_slug: product.subcategory?.category?.slug || "",
                      subcategory_slug: product.subcategory?.slug || "",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* 5. TRUST BADGES ROW */}
      <section className="bg-white border-y border-border py-8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center md:justify-between flex-wrap gap-y-6 gap-x-12 opacity-80">
            {[
              "10+ Years of Printing",
              "ISO IAF Certified",
              "MSME Registered",
              "Google Verified",
              "ZED Certified",
              "GeM Registered"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2 font-semibold text-sm md:text-base text-brand-slate">
                <CheckCircle className="w-5 h-5 text-brand-primary" />
                <span className="whitespace-nowrap">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 8. TRENDING PRODUCTS */}
      {featuredProducts.length > 4 && (
        <section className="py-20 bg-brand-gray">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-brand-slate font-heading mb-10 text-center">Trending Right Now</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.slice(4, 8).map((product, index) => (
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

      {/* 8a. PRODUCT SHOWCASE */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-slate font-heading">Our Product Range</h2>
            <p className="text-muted-foreground mt-3 text-lg">Premium quality printing for every need</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Visiting Cards", img: "/products/visiting-cards.png", href: "/visiting-cards" },
              { name: "Banners & Standees", img: "/products/banners-standees.png", href: "/signs-marketing" },
              { name: "Flyers & Brochures", img: "/products/flyers-brochures.png", href: "/stationery" },
              { name: "Stickers & Labels", img: "/products/stickers-labels.png", href: "/labels-stickers" },
              { name: "Stationery", img: "/products/stationery.png", href: "/stationery" },
              { name: "Photo Gifts", img: "/products/photo-gifts.png", href: "/photo-gifts" },
            ].map((product, idx) => (
              <Link key={idx} href={product.href} className="group relative rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all">
                <div className="aspect-square overflow-hidden">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                  <h3 className="text-white font-bold text-lg md:text-xl">{product.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8b. BRANDS THAT TRUST US */}
      <section className="py-14 bg-brand-gray border-y border-border overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <h2 className="text-center text-xl md:text-2xl font-bold text-brand-slate font-heading mb-8">Brands That Trust Us</h2>
          <div className="flex items-center justify-center flex-wrap gap-8 md:gap-14 opacity-60 hover:opacity-80 transition-opacity">
            {["Government of J&K", "JKSSB", "Tourism Dept", "JKEDI", "University of Kashmir", "NIT Srinagar", "IUST", "SKIMS"].map((brand, idx) => (
              <div key={idx} className="text-brand-slate font-bold text-sm md:text-base whitespace-nowrap tracking-wide uppercase">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8c. GOOGLE REVIEWS */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-slate font-heading">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span className="font-bold text-lg text-brand-slate">Google Reviews</span>
              <div className="flex gap-0.5 ml-2">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="ml-1 font-bold text-brand-slate">4.9</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Farhat Ahmad", text: "Excellent print quality and fast delivery. The visiting cards came out perfect with the gold foil finish. Highly recommended for businesses in Kashmir!", rating: 5 },
              { name: "Suhail Bhat", text: "Ordered custom standees for our exhibition. Colors were vibrant and exactly matching the proof. Great customer service via WhatsApp.", rating: 5 },
              { name: "Mehak Parray", text: "Best printing service in Kashmir! Die-cut stickers and brochures were top-notch quality. Will definitely order again from Printkul.", rating: 5 },
            ].map((review, idx) => (
              <div key={idx} className="bg-brand-gray p-8 rounded-xl border border-border hover:shadow-md transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({length: review.rating}).map((_, s) => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-foreground/80 italic mb-4">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-slate">{review.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <img src="https://www.google.com/favicon.ico" alt="" className="w-3 h-3" /> Google Review
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="https://share.google/udtVHRq6pDgZIOJgR" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:text-brand-accent transition-colors">
              See all reviews on Google <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 8d. FIND STORES */}
      <section className="py-14 bg-brand-gray border-y border-border">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <h2 className="text-center text-xl md:text-2xl font-bold text-brand-slate font-heading mb-8">Find Your Nearest Store</h2>
          <div className="flex items-center justify-center flex-wrap gap-3 md:gap-4">
            {["Anantnag","Srinagar","Jammu","Banihal","Bandipora","Baramulla","Budgam","Ganderbal","Kulgam","Kupwara","Pulwama","Shopian"].map((loc, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-border rounded-full text-sm font-medium text-brand-slate hover:border-brand-primary hover:text-brand-primary transition-colors cursor-default">
                <MapPin className="w-3.5 h-3.5" />
                {loc}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER SIGNUP */}
      <section className="py-24 bg-brand-slate text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">Get 10% Off Your First Online Order</h2>
          <p className="text-lg text-white/70 mb-10">Sign up for our newsletter to receive exclusive deals, design tips, and new product announcements. Or message us directly on WhatsApp!</p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 h-14 px-6 rounded-lg text-brand-slate focus:outline-none focus:ring-4 focus:ring-brand-accent/30"
              required
            />
            <button 
              type="submit" 
              className="h-14 px-8 bg-brand-accent text-white font-bold rounded-lg hover:bg-brand-accent-dark transition-colors whitespace-nowrap shadow-lg"
            >
              Subscribe Now
            </button>
          </form>
          
          <p className="text-white/40 text-sm mt-6">Or WhatsApp us at +91-94190 91333</p>
        </div>
      </section>
    </div>
  )
}