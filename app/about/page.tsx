import { createClient } from "@/lib/supabase/server"

export const revalidate = 3600

export default async function AboutPage() {
  const supabase = await createClient()

  const { data: siteContentArr } = await supabase
    .from("site_content")
    .select("key, value")
    .in("key", ["about_hero_title", "about_body", "footer_about_blurb"])

  const siteContent = siteContentArr || []
  const heroTitle = siteContent.find((s: any) => s.key === "about_hero_title")?.value || "About Printkul"
  const aboutBody = siteContent.find((s: any) => s.key === "about_body")?.value || `
    <p>Printkul is your trusted partner for custom print products in India. We specialize in visiting cards, marketing materials, stationery, and more — all available with simple WhatsApp ordering.</p>
    <p>Our mission is to make quality printing accessible to every business, big or small. With competitive prices, fast turnaround, and Pan-India delivery, we&apos;ve helped thousands of businesses make a lasting impression.</p>
    <h3>Why Choose Us?</h3>
    <ul>
      <li>Premium quality materials</li>
      <li>Competitive pricing</li>
      <li>Fast turnaround times</li>
      <li>Pan-India delivery</li>
      <li>Simple WhatsApp ordering</li>
    </ul>
  `
  const footerBlurb = siteContent?.find((s: any) => s.key === "footer_about_blurb")?.value || "Quality print products. One WhatsApp away."

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {heroTitle}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Your trusted partner for quality print products since 2020
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: aboutBody }}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "5000+", label: "Happy Customers" },
              { number: "100+", label: "Products" },
              { number: "50+", label: "Cities Served" },
              { number: "24h", label: "Avg Response" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold text-amber mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-6">
            Browse our products and order via WhatsApp. It&apos;s that simple!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="px-6 py-3 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d44] transition-colors"
            >
              Browse Products
            </a>
            <a
              href="/contact"
              className="px-6 py-3 border border-[#1a1a2e] rounded-lg hover:bg-[#1a1a2e] hover:text-white transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}