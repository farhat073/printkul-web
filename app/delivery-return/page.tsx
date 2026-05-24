import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Delivery & Return Policy | Printkul",
  description: "Printkul delivery timelines, shipping information, and return/exchange policy for all print products.",
}

export default function DeliveryReturnPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-brand-slate text-white py-10 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Delivery &amp; Return Policy</h1>
          <p className="text-white/70 mt-3">Last updated: May 2026</p>
        </div>
      </section>
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl prose prose-slate">
          <h2 className="font-heading text-xl font-bold mb-4">Delivery Timelines</h2>
          <p className="text-muted-foreground mb-6">Standard delivery takes 7–14 business days depending on your location. We deliver across India, with faster delivery within Jammu &amp; Kashmir.</p>

          <h2 className="font-heading text-xl font-bold mb-4">Shipping Charges</h2>
          <p className="text-muted-foreground mb-6">Shipping charges are calculated based on order weight and destination. Orders above ₹5,000 may qualify for free delivery. Final shipping costs are confirmed during the WhatsApp ordering process.</p>

          <h2 className="font-heading text-xl font-bold mb-4">Returns &amp; Exchanges</h2>
          <p className="text-muted-foreground mb-6">Since all our products are custom-made, we generally do not accept returns. However, if you receive a defective or incorrect product, please contact us within 48 hours of delivery with photos of the issue.</p>

          <h2 className="font-heading text-xl font-bold mb-4">Damaged Products</h2>
          <p className="text-muted-foreground mb-6">In case of damage during transit, we will replace the product at no additional cost. Please report damage within 48 hours of receiving the package.</p>

          <h2 className="font-heading text-xl font-bold mb-4">Contact</h2>
          <p className="text-muted-foreground mb-6">For delivery inquiries, reach us on WhatsApp at +91-94190 91333 or email <a href="mailto:info@printkul.in" className="text-brand-accent hover:underline">info@printkul.in</a>.</p>
        </div>
      </section>
    </div>
  )
}
