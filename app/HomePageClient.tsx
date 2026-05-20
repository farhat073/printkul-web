"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ArrowRight, Truck, Shield, MessageCircle, Package, Zap, Award, Star, Palette, UploadCloud, CheckCircle } from "lucide-react"
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
        <div className="relative h-[calc(100vh-108px)] min-h-[500px] flex items-center">
          
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
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white via-45% to-transparent" />
          
          <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 relative z-20 flex flex-col justify-center">
            <div className="max-w-3xl w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/10 text-brand-accent rounded-full text-sm font-bold mb-4 md:mb-6">
                <Zap className="w-4 h-4" />
                <span>India's Premium Print Partner</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-brand-slate leading-[1.05] mb-6 md:mb-8 font-heading tracking-tight">
                Design it.<br />
                <span className="text-brand-accent">Print it.</span><br />
                Love it.
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-8 md:mb-10 font-medium max-w-xl leading-relaxed">
                Premium custom print products for modern businesses. One-click WhatsApp ordering with fast pan-India delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-5 mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-4 bg-brand-primary text-white font-bold rounded hover:bg-black transition-colors text-base md:text-lg shadow-sm"
                >
                  Browse All Products
                </Link>
                <Link
                  href="/deals"
                  className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-4 bg-white text-brand-slate font-bold rounded hover:bg-brand-gray transition-colors text-base md:text-lg border border-border shadow-sm"
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

      {/* 4. HOW IT WORKS */}
      <section className="py-20 bg-brand-gray">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-slate font-heading">How It Works</h2>
            <p className="text-muted-foreground mt-3 text-lg">Your custom print journey in 3 simple steps</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-brand-accent/10 -translate-y-1/2 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
              {[
                { step: "1", icon: Package, title: "Choose a Product", desc: "Select from 2000+ premium quality products." },
                { step: "2", icon: Palette, title: "Customise Online", desc: "Use our studio to design or upload your own." },
                { step: "3", icon: Truck, title: "We Print & Deliver", desc: "Fast, reliable delivery straight to your door." },
              ].map((item, index) => (
                <div key={index} className="text-center bg-white p-8 rounded border-2 border-brand-gray hover:border-brand-accent/30 transition-colors shadow-sm hover:shadow-md">
                  <div className="w-20 h-20 mx-auto bg-brand-accent/5 rounded-full flex items-center justify-center mb-6 relative">
                    <item.icon className="w-10 h-10 text-brand-slate" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-brand-slate text-white rounded-full flex items-center justify-center font-bold font-heading shadow-md">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-brand-slate mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST BADGES ROW */}
      <section className="bg-brand-gray border-y border-border py-8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center md:justify-between flex-wrap gap-y-6 gap-x-12 opacity-80">
            {[
              "20+ Years of Printing",
              "2 Lakh+ Designs",
              "GST Invoice Available",
              "100% Satisfaction Guarantee",
              "Free Shipping Above ₹499",
              "COD Available"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2 font-semibold text-sm md:text-base text-brand-slate">
                <CheckCircle className="w-5 h-5 text-brand-accent" />
                <span className="whitespace-nowrap">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DESIGN SERVICES BANNER */}
      <section className="py-20 bg-brand-gray">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="bg-brand-slate rounded p-10 md:p-16 flex flex-col md:flex-row items-center justify-between text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 md:w-2/3 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Need a Logo?</h2>
              <p className="text-lg md:text-xl text-white/90 max-w-xl">
                Create a professional brand identity in minutes with our AI-powered Logo Maker. Free to try!
              </p>
            </div>
            <div className="relative z-10">
              <Link href="/design-services/logo-maker" className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-slate font-bold rounded hover:bg-brand-gray transition-colors shadow-lg hover:shadow-xl text-lg whitespace-nowrap">
                Try Free Logo Maker <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="py-20 bg-brand-gray">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-slate font-heading">Loved by Thousands</h2>
            <div className="flex items-center justify-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-6 h-6 fill-brand-accent text-brand-accent" />)}
              <span className="ml-2 font-bold text-lg text-brand-slate">4.9 / 5</span>
              <span className="text-muted-foreground ml-1">(12,450+ reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rahul S.", product: "Premium Visiting Cards", text: "The quality is simply unmatched. The raised foil adds such a premium touch to my business cards. Delivery was fast too." },
              { name: "Priya M.", product: "Custom Standee", text: "Ordered a roll-up banner for an exhibition. The colors were vibrant and exactly as per the proof. Very sturdy stand." },
              { name: "Amit K.", product: "Custom Stickers", text: "Best place for die-cut stickers! The vinyl is thick and the adhesive is very strong. Highly recommend Printkul." }
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-8 rounded shadow-sm hover:shadow-md transition-all border border-border">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-brand-accent text-brand-accent" />)}
                </div>
                <h4 className="font-bold text-lg text-brand-slate mb-1">{review.name}</h4>
                <p className="text-sm text-brand-accent font-semibold mb-4">Purchased: {review.product}</p>
                <p className="text-foreground/80 italic">"{review.text}"</p>
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

      {/* 9. NEWSLETTER SIGNUP */}
      <section className="py-24 bg-brand-slate text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">Get 20% Off Your First Order</h2>
          <p className="text-lg text-white/70 mb-10">Sign up for our newsletter to receive exclusive deals, design tips, and new product announcements.</p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 h-14 px-6 rounded text-brand-slate focus:outline-none focus:ring-4 focus:ring-brand-accent/30"
              required
            />
            <button 
              type="submit" 
              className="h-14 px-8 bg-brand-accent text-brand-primary font-bold rounded hover:bg-brand-accent-dark transition-colors whitespace-nowrap shadow-lg"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}