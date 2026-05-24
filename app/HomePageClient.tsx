"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Star, ChevronRight, ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { ProductCard } from "@/components/customer/ProductCard"
import { Marquee } from "@/components/ui/Marquee"
import { HeroCarousel } from "@/components/customer/HeroCarousel"

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

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const input = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement | null
    const phone = input?.value
    
    if (phone) {
      toast.success("Connecting you to our WhatsApp...")
      window.open(`https://wa.me/919419091333?text=Hi Printkul! I would like to claim my 10% discount coupon code. My number is ${phone}`, '_blank')
      if (input) input.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-white text-brand-slate">
      {/* ── 1. FLIPKART-STYLE HERO CAROUSEL ── */}
      <HeroCarousel banners={banners} />

      {/* 2. EXPLORE ALL CATEGORIES — Side Scroll */}
      <section className="py-10 md:py-16 bg-brand-gray border-b border-border">
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
        <section className="py-12 md:py-20 lg:py-28 bg-white">
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
        <section className="py-12 md:py-24 bg-white">
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
      <section className="py-12 md:py-20 bg-white border-y border-border overflow-hidden">
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
      <section className="py-12 md:py-24 bg-brand-gray">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-brand-slate font-heading tracking-tight">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
              <span className="font-bold text-xl text-brand-slate">Google Reviews</span>
              <div className="flex gap-1 ml-2">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="ml-1 font-extrabold text-2xl text-brand-slate">4.9</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              { name: "Majid Yousuf", text: "The best professional one stop place in Anantnag for printing, designing and what not. They have got best and professional team who never let me down. We are their clients for 4 years now and they have always been exceptionally good.", rating: 5 },
              { name: "Dr. Junaid Malik", text: "For me, Mintleaf turned out an excellent press in Anantnag after exploring multiple alternatives. The design cards I ordered came out with superb quality, good paper quality and vibrant colors. Proofing process was also great.", rating: 5 },
              { name: "Muskaan Akbar", text: "We had an exceptional experience working with Mintleaf for our printing needs! They printed our visiting cards, labels, and tags and the quality was awesome. The quality of the print materials is truly premium.", rating: 5 },
              { name: "Umar Gilkar", text: "Outstanding printing service. The accuracy, surface finish, and material strength exceeded my expectations. The seller maintained clear communication and delivered exactly as requested.", rating: 5 },
              { name: "Mudasir Javeed", text: "We partnered with Mintleaf to design and print our new menus for Old Town Cafe, and we couldn't be more impressed. The print quality is sharp, vibrant, and flawless. Every element exceeded our expectations.", rating: 5 },
              { name: "Rayees Zahoor", text: "I used Mintleaf Design & Print for our wedding invitation cards, and I am absolutely thrilled with the results! The printing quality was top-notch; the colors were vibrant, and the card stock felt luxurious.", rating: 5 },
              { name: "Waseem Bhat", text: "Creative designs, Awesome ideas and On time Deliveries are the motto of Mintleaf Anantnag. Thanks for the lovely crafted stickers. Wishing you more Success!", rating: 5 },
              { name: "Dr Shahid Shafi", text: "If you are researching the best place to get your printing done in bulk, these are your guys! They did their best to ensure quality and on time delivery. These guys are professionals with good business ethics.", rating: 5 },
              { name: "Zainab Suhail", text: "Had my Nikkah Nama customized and printed from Mintleaf design and print. I'm super happy with the work and the employees who helped. Special thumbs up to Aadil Ashraf for the excellent work. 11/10", rating: 5 },
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-5 md:p-8 rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-5 right-6 text-5xl text-brand-gray-dark font-serif opacity-50">&ldquo;</div>
                <div className="flex gap-1 mb-4">
                  {Array.from({length: review.rating}).map((_, s) => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  {review.rating < 5 && Array.from({length: 5 - review.rating}).map((_, s) => <Star key={`e-${s}`} className="w-4 h-4 text-gray-200" />)}
                </div>
                <p className="text-brand-slate/80 text-[15px] leading-relaxed mb-6 relative z-10 line-clamp-4">{review.text}</p>
                <div className="flex items-center gap-3 border-t border-border pt-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-slate">{review.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                      <img src="https://www.google.com/favicon.ico" alt="" className="w-3 h-3" /> Verified Google Review
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href="https://maps.app.goo.gl/8TMkK3zKH6c2QjE69"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-border text-brand-slate font-bold rounded-xl hover:border-brand-accent hover:text-brand-accent transition-all shadow-sm hover:shadow-lg text-sm"
            >
              <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
              See All Reviews on Google
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 8d. FIND STORES - MARQUEE */}
      <section className="py-12 md:py-24 bg-[#2B3539] text-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mb-16 text-center">
           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">Our Presence Across J&K</h2>
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
      <section className="py-16 md:py-28 text-white relative overflow-hidden" style={{ backgroundColor: '#2B3539' }}>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/5 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-sm font-bold mb-6 md:mb-8 uppercase tracking-[0.2em]">
            Limited Time Offer
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-extrabold font-heading mb-4 md:mb-8 tracking-tight">Get 10% Off Your First Order</h2>
          <p className="text-base md:text-xl text-white/70 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">Drop your WhatsApp number and we&apos;ll send your exclusive 10% coupon code instantly. Join thousands of happy customers.</p>
          
          <form className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-2xl mx-auto" onSubmit={handleWhatsAppSubmit}>
            <input 
              type="tel" 
              placeholder="Enter your WhatsApp number" 
              className="flex-1 h-14 md:h-16 px-6 md:px-8 rounded-xl text-brand-slate bg-white focus:outline-none focus:ring-4 focus:ring-white/30 text-base md:text-lg font-medium shadow-2xl"
              pattern="[+]?[0-9]{10,15}"
              minLength={10}
              maxLength={15}
              required
            />
            <button 
              type="submit" 
              className="h-14 md:h-16 px-8 md:px-10 bg-[#25D366] text-white font-extrabold rounded-xl hover:bg-[#20bd5a] transition-all whitespace-nowrap shadow-2xl hover:scale-105 active:scale-95 text-base md:text-lg"
            >
              Get Coupon Code
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
