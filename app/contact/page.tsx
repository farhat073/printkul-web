import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react"

export const revalidate = 3600

export default async function ContactPage() {
  const supabase = await createClient()

  const { data: siteContentArr } = await supabase
    .from("site_content")
    .select("key, value")
    .in("key", ["whatsapp_number", "contact_phone", "contact_email", "contact_address"])

  const siteContent = siteContentArr || []
  const waNumber = siteContent.find((s: any) => s.key === "whatsapp_number")?.value || "919419091333"
  const phone = siteContent.find((s: any) => s.key === "contact_phone")?.value || "+91-94190 91333"
  const email = siteContent.find((s: any) => s.key === "contact_email")?.value || "info@printkul.in"

  const waUrl = `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Printkul! I have a question about your products.")}`

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-brand-slate text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-brand-accent/10 to-brand-orange/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Contact <span className="bg-gradient-to-r from-brand-accent to-brand-orange bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            We&apos;re always happy to hear from you. Whether you have a question, need help with your order, or just want to say hi — drop us a WhatsApp message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl border border-border p-8 text-center hover:shadow-lg hover:border-green-500/30 transition-all"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <MessageCircle className="w-8 h-8 text-green-600 group-hover:text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-brand-slate">WhatsApp</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Quick responses, 7 days a week
              </p>
              <p className="text-brand-primary font-semibold">{phone}</p>
              <p className="text-brand-accent font-medium mt-2 text-sm">Chat now →</p>
            </a>

            {/* Phone */}
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="group bg-white rounded-xl border border-border p-8 text-center hover:shadow-lg hover:border-brand-primary/30 transition-all"
            >
              <div className="w-16 h-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <Phone className="w-8 h-8 text-brand-primary group-hover:text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-brand-slate">Phone</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Mon-Sat, 10am - 7pm
              </p>
              <p className="text-brand-primary font-semibold">{phone}</p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="group bg-white rounded-xl border border-border p-8 text-center hover:shadow-lg hover:border-brand-accent/30 transition-all"
            >
              <div className="w-16 h-16 bg-brand-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                <Mail className="w-8 h-8 text-brand-accent group-hover:text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-brand-slate">Email</h3>
              <p className="text-muted-foreground text-sm mb-3">
                We reply within 24 hours
              </p>
              <p className="text-brand-primary font-semibold">{email}</p>
            </a>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-16 bg-brand-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-slate mb-3">
              Find Your Nearest Store
            </h2>
            <p className="text-muted-foreground">Visit us at any of our 3 locations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                city: "Anantnag",
                address: "11, Janglat Mandi, Near GMC Anantnag-192101 Kashmir",
                badge: "Headquarters",
              },
              {
                city: "Srinagar",
                address: "113, Illahi Bagh, Srinagar 190001 Kashmir",
                badge: "Branch Office",
              },
              {
                city: "Jammu",
                address: "Karta By-Pass Road, Channi Himat-180015 Jammu",
                badge: "Branch Office",
              },
            ].map((store, idx) => (
              <div key={idx} className="bg-white border border-border rounded-xl p-6 hover:shadow-lg hover:border-brand-primary/20 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
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

      {/* FAQ Summary */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-slate mb-4">
            Have questions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Check our frequently asked questions for quick answers.
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors font-semibold shadow-sm"
          >
            View FAQs
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}