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
  const waNumber = siteContent.find((s: any) => s.key === "whatsapp_number")?.value || "919876543210"
  const phone = siteContent.find((s: any) => s.key === "contact_phone")?.value || "+91 XXXXX XXXXX"
  const email = siteContent.find((s: any) => s.key === "contact_email")?.value || "hello@printkul.in"
  const address = siteContent.find((s: any) => s.key === "contact_address")?.value || "Your address here"

  const waUrl = `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Printkul! I have a question about your products.")}`

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-white/70 text-lg">
            We&apos;re here to help! Reach out via WhatsApp, phone, or email.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl border border-border p-8 text-center hover:shadow-lg hover:border-green-500/30 transition-all"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <MessageCircle className="w-8 h-8 text-green-600 group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
              <p className="text-muted-foreground text-sm">
                Quick responses, 7 days a week
              </p>
              <p className="text-amber font-medium mt-2">Chat now →</p>
            </a>

            {/* Phone */}
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="group bg-white rounded-xl border border-border p-8 text-center hover:shadow-lg hover:border-amber/30 transition-all"
            >
              <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber group-hover:text-white transition-colors">
                <Phone className="w-8 h-8 text-amber" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Phone</h3>
              <p className="text-muted-foreground text-sm">
                Mon-Sat, 10am - 7pm
              </p>
              <p className="text-amber font-medium mt-2">{phone}</p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="group bg-white rounded-xl border border-border p-8 text-center hover:shadow-lg hover:border-amber/30 transition-all"
            >
              <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber group-hover:text-white transition-colors">
                <Mail className="w-8 h-8 text-amber" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <p className="text-muted-foreground text-sm">
                We reply within 24 hours
              </p>
              <p className="text-amber font-medium mt-2">{email}</p>
            </a>

            {/* Address */}
            <div className="group bg-white rounded-xl border border-border p-8 text-center hover:shadow-lg hover:border-amber/30 transition-all">
              <div className="w-16 h-16 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-amber" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Office</h3>
              <p className="text-muted-foreground text-sm">
                Business hours only
              </p>
              <p className="text-amber font-medium mt-2">{address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Summary */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">
            Have questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            Check our frequently asked questions for quick answers.
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2d2d44] transition-colors"
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