import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | Printkul",
  description: "Terms and conditions governing the use of Printkul's website and services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-brand-slate text-white py-10 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Terms &amp; Conditions</h1>
          <p className="text-white/70 mt-3">Last updated: May 2026</p>
        </div>
      </section>
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl prose prose-slate">
          <h2 className="font-heading text-xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-6">By accessing and using Printkul&apos;s website and services, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our services.</p>

          <h2 className="font-heading text-xl font-bold mb-4">2. Services</h2>
          <p className="text-muted-foreground mb-6">Printkul provides custom printing products and services. All orders are subject to availability and confirmation of the order price. We reserve the right to refuse any order for any reason.</p>

          <h2 className="font-heading text-xl font-bold mb-4">3. Pricing &amp; Payment</h2>
          <p className="text-muted-foreground mb-6">Prices displayed on the website are indicative and exclude GST. Final pricing is confirmed during the WhatsApp ordering process. Payment terms will be communicated at the time of order confirmation.</p>

          <h2 className="font-heading text-xl font-bold mb-4">4. Order Cancellation</h2>
          <p className="text-muted-foreground mb-6">Orders may be cancelled before production begins. Once production has started, cancellation may not be possible. Please contact us via WhatsApp for cancellation requests.</p>

          <h2 className="font-heading text-xl font-bold mb-4">5. Intellectual Property</h2>
          <p className="text-muted-foreground mb-6">All content on this website, including logos, images, and text, is the property of Printkul / Mintleaf Design &amp; Print and is protected by intellectual property laws.</p>

          <h2 className="font-heading text-xl font-bold mb-4">6. Contact</h2>
          <p className="text-muted-foreground mb-6">For any questions regarding these terms, please contact us at <a href="mailto:info@printkul.in" className="text-brand-accent hover:underline">info@printkul.in</a> or via WhatsApp at +91-94190 91333.</p>
        </div>
      </section>
    </div>
  )
}
