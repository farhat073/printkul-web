"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRight, Package, Zap, CheckCircle, Star, ChevronRight, Shield, Award } from "lucide-react"
import { ProductCard } from "@/components/customer/ProductCard"
import { Marquee } from "@/components/ui/Marquee"

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
}: HomePageClientProps) {
  const [currentBanner, setCurrentBanner] = useState(0)

  const heroImages = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=90", // High-end Abstract Color (Bespoke Vibe)
    "https://images.unsplash.com/photo-1634084462412-b5c67a501f6e?w=1600&q=90", // Premium Foil / Metallic Texture
    "https://images.unsplash.com/photo-1586075010633-de1580435163?w=1600&q=90", // Architectural Paper Stacks (Quality)
    "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1600&q=90"  // Minimalist Design & Print Tools
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  return (
    <div className="min-h-screen bg-white text-brand-slate">
      {/* ── 1. MINIMAL HERO ── */}
      <section className="relative w-full overflow-hidden bg-brand-gray">
        <div className="relative min-h-[85vh] flex items-center">
          {/* Background Images - Full Clarity */}
          <div className="absolute inset-0 z-0">
            {heroImages.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`Slide ${index + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentBanner ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          
          <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-12 relative z-20">
            <div className="max-w-xl bg-white/20 backdrop-blur-xl px-6 py-6 md:px-8 md:py-7 rounded-[1.5rem] border border-white/30 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)]">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-border rounded-full text-[9px] font-bold uppercase tracking-[0.2em] mb-4 text-brand-accent">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-accent"></span>
                </span>
                Kashmir&apos;s Digital Print Studio
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-brand-slate leading-tight mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-[#6B17D1] via-[#D71865] to-[#6B17D1] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">Crafting</span> <span className="italic text-brand-accent font-serif">Impressions</span><br />
                that last a lifetime.
              </h1>
              <p className="text-base md:text-lg text-brand-slate-light mb-8 max-w-md leading-relaxed font-medium">
                Premium printing solutions for brands who value precision. We deliver excellence from Srinagar to Srinagar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-accent transition-all shadow-xl hover:shadow-brand-accent/20 text-sm"
                >
                  Start Project
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white/60 text-brand-slate font-bold rounded-xl border border-white/50 backdrop-blur-sm hover:bg-white transition-all text-sm"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-12 right-12 z-20 flex gap-2">
            {heroImages.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentBanner(index)} 
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  index === currentBanner ? "bg-brand-slate w-8" : "bg-brand-slate/10 w-2 hover:bg-brand-slate/30"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. EXPLORE ALL CATEGORIES - Side Scroll */}
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
            
            <button className="absolute right-0 top-[80px] md:top-[90px] -translate-y-1/2 bg-white border border-border shadow-xl w-14 h-14 rounded-full flex items-center justify-center text-brand-slate hover:text-brand-accent hidden md:flex transition-all hover:scale-110 z-10 active:scale-95">
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. FEATURED / BEST SELLERS */}
      {featuredProducts.length > 0 && (
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/10 text-brand-accent rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
                  Our Bestsellers
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-brand-slate font-heading tracking-tight">
                  Customer Favorites
                </h2>
              </div>
              <Link href="/products" className="inline-flex items-center gap-2 text-base font-bold text-brand-primary hover:text-brand-accent transition-all group">
                Explore Full Catalog <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
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

      {/* 5. INTERACTIVE DARK RIBBON (Hybrid Option 2 & 3) */}
      <section className="bg-brand-slate py-5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          <div className="text-center mb-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">Certifications & Experience</span>
          </div>
          <div className="flex items-center justify-center gap-6 md:gap-14">
            {[
              { label: "10+ Years Experience", icon: Zap },
              { label: "ISO IAF Certified", icon: CheckCircle },
              { label: "MSME Registered", icon: Shield },
              { label: "Google Verified", icon: Star },
              { label: "ZED Certified", icon: Award },
              { label: "GeM Registered", icon: Package }
            ].map((item, idx) => (
              <div key={idx} className="group flex items-center gap-0 hover:gap-3 transition-all duration-500 ease-in-out cursor-default">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 group-hover:bg-brand-accent group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:-rotate-12 border border-white/5 group-hover:border-transparent">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 transition-all duration-500 whitespace-nowrap text-[11px] font-bold text-white tracking-tight uppercase">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 8a. PRODUCT SHOWCASE — Dynamic from DB categories */}
      {categories.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-brand-slate font-heading tracking-tight">Our Premium Range</h2>
              <p className="text-muted-foreground mt-4 text-xl max-w-2xl mx-auto italic">Crafted with precision, delivered with care. Explore our diverse printing solutions.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
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
      <section className="py-20 bg-white border-y border-border overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-[0.3em]">Trusted By Leading Organizations</h2>
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
      <section className="py-24 bg-brand-gray">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-slate font-heading tracking-tight">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
              <span className="font-bold text-xl text-brand-slate">Google Reviews</span>
              <div className="flex gap-1 ml-2">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="ml-1 font-extrabold text-2xl text-brand-slate">4.9</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: "Farhat Ahmad", text: "Excellent print quality and fast delivery. The visiting cards came out perfect with the gold foil finish. Highly recommended for businesses in Kashmir!", rating: 5 },
              { name: "Suhail Bhat", text: "Ordered custom standees for our exhibition. Colors were vibrant and exactly matching the proof. Great customer service via WhatsApp.", rating: 5 },
              { name: "Mehak Parray", text: "Best printing service in Kashmir! Die-cut stickers and brochures were top-notch quality. Will definitely order again from Printkul.", rating: 5 },
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-10 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-6 right-8 text-6xl text-brand-gray-dark font-serif opacity-50">&ldquo;</div>
                <div className="flex gap-1 mb-6">
                  {Array.from({length: review.rating}).map((_, s) => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-brand-slate/80 text-lg leading-relaxed mb-8 relative z-10">{review.text}</p>
                <div className="flex items-center gap-4 border-t border-border pt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-brand-slate">{review.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                      <img src="https://www.google.com/favicon.ico" alt="" className="w-3 h-3" /> Verified Google Review
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8d. FIND STORES - MARQUEE */}
      <section className="py-24 bg-brand-slate text-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-16 text-center">
           <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Presence Across J&K</h2>
           <p className="text-white/60">Delivering excellence to every district in the valley.</p>
        </div>
        <Marquee 
          items={["Anantnag","Srinagar","Jammu","Banihal","Bandipora","Baramulla","Budgam","Ganderbal","Kulgam","Kupwara","Pulwama","Shopian"]} 
          speed="normal"
          className="py-4 border-y border-white/5 bg-white/5"
          variant="pill"
        />
      </section>

      {/* 9. NEWSLETTER SIGNUP */}
      <section className="py-28 bg-brand-slate text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-brand-accent/10 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-brand-accent-light text-sm font-bold mb-8 uppercase tracking-[0.2em]">
            Limited Time Offer
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold font-heading mb-8 tracking-tight">Get 10% Off Your First Order</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">Sign up for our newsletter to receive exclusive deals, design tips, and new product announcements. Join thousands of happy customers.</p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 h-16 px-8 rounded-xl text-brand-slate bg-white focus:outline-none focus:ring-4 focus:ring-brand-accent/50 text-lg font-medium shadow-2xl"
              required
            />
            <button 
              type="submit" 
              className="h-16 px-10 bg-brand-accent text-white font-extrabold rounded-xl hover:bg-brand-accent-dark transition-all whitespace-nowrap shadow-2xl hover:scale-105 active:scale-95 text-lg"
            >
              Get Coupon Code
            </button>
          </form>
          
          <p className="text-white/60 text-base mt-12 font-medium">Or WhatsApp us at <a href="https://wa.me/919419091333" className="text-brand-accent-light hover:underline font-bold">+91-94190 91333</a></p>
        </div>
      </section>
    </div>
  )
}
