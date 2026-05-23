import { createClient } from "@/lib/supabase/server"
import { Award, MapPin, Users, Clock, Shield, Printer, CheckCircle } from "lucide-react"

export const revalidate = 3600

export default async function AboutPage() {
  const supabase = await createClient()

  const { data: siteContentArr } = await supabase
    .from("site_content")
    .select("key, value")
    .in("key", ["about_hero_title", "about_body", "footer_about_blurb"])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-brand-slate text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-brand-accent/10 to-brand-orange/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-semibold mb-6">
            <Award className="w-4 h-4" />
            <span>Since 2016 • Mintleaf Design & Print</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            About <span className="bg-gradient-to-r from-brand-accent to-brand-orange bg-clip-text text-transparent">Printkul</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Kashmir&apos;s First Online Digital Printing Store — powered by the creative expertise of Mintleaf Design & Print.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-slate mb-6">
                  easy printing solutions
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Printkul is a modern online printing service powered by the creative expertise of Mintleaf Design & Print established in 2016. We provide high-quality, reliable, and affordable online print solutions for businesses, startups, and individuals looking to bring their ideas to life with ease.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our easy-to-use online platform allows you to order custom printed materials such as business cards, flyers, brochures, banners, and marketing collateral with just a few clicks. Using premium materials, advanced printing technology, and strict quality control, we ensure professional results and consistent print quality every time.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  At Printkul, we combine fast turnaround times, competitive pricing, and doorstep delivery to make professional printing simple and accessible. Whether you need everyday business stationery or impactful promotional prints, Printkul is your trusted partner for online printing solutions that elevate your brand.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: "Quality First", desc: "Premium materials & strict QC" },
                  { icon: Printer, title: "Advanced Tech", desc: "Latest printing technology" },
                  { icon: Clock, title: "Fast Turnaround", desc: "Quick delivery to your door" },
                  { icon: Users, title: "Expert Team", desc: "10+ years of experience" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-brand-gray p-5 rounded-xl border border-border text-center hover:shadow-md hover:border-brand-primary/20 transition-all">
                    <div className="w-12 h-12 mx-auto mb-3 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <h4 className="font-semibold text-sm text-brand-slate mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-brand-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10+", label: "Years of Printing" },
              { number: "2000+", label: "Products Available" },
              { number: "3", label: "Store Locations" },
              { number: "24h", label: "Avg Response Time" },
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-slate mb-3">Find Your Nearest Store</h2>
            <p className="text-muted-foreground">Visit us at any of our 3 locations across Jammu & Kashmir</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { city: "Anantnag", address: "11, Janglat Mandi, Near GMC Anantnag-192101 Kashmir", badge: "Headquarters" },
              { city: "Srinagar", address: "113, Illahi Bagh, Srinagar 190001 Kashmir", badge: "Branch Office" },
              { city: "Jammu", address: "Karta By-Pass Road, Channi Himat-180015 Jammu", badge: "Branch Office" },
            ].map((store, idx) => (
              <div key={idx} className="bg-white border border-border rounded-xl p-6 hover:shadow-lg hover:border-brand-primary/20 transition-all group">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-brand-slate">{store.city}</h3>
                    <span className="text-xs bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full font-semibold">{store.badge}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{store.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-brand-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-slate mb-3">Certified & Trusted</h2>
            <p className="text-muted-foreground">Recognized by industry-leading certification bodies</p>
          </div>
          <div className="flex items-center justify-center flex-wrap gap-8 md:gap-12">
            {[
              { src: "/certifications/iso-iaf.png", alt: "ISO IAF Certified" },
              { src: "/certifications/msme.png", alt: "MSME Registered" },
              { src: "/certifications/google-verified.png", alt: "Google Verified" },
              { src: "/certifications/zed.png", alt: "ZED Certified" },
              { src: "/certifications/gem.png", alt: "GeM Registered" },
              { src: "/certifications/10-years.png", alt: "10+ Years" },
            ].map((cert, idx) => (
              <div key={idx} className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-all flex items-center justify-center h-24 w-32">
                <img src={cert.src} alt={cert.alt} className="max-h-16 max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-slate mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Browse our products and order via WhatsApp. It&apos;s that simple! Professional printing for businesses & individuals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919419091333"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border-2 border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-colors font-semibold"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}