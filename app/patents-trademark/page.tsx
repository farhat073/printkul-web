import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Patents & Trademark | Printkul",
  description: "Information about Printkul's patents, trademarks, and brand protection.",
}

export default function PatentsTrademarkPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-brand-slate text-white py-10 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Patents &amp; Trademark</h1>
          <p className="text-white/70 mt-3">Brand Protection Information</p>
        </div>
      </section>
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl prose prose-slate">
          <h2 className="font-heading text-xl font-bold mb-4">Trademarks</h2>
          <p className="text-muted-foreground mb-6">&ldquo;Printkul&rdquo; and &ldquo;Mintleaf Design &amp; Print&rdquo; are registered trademarks. Any unauthorized use of our trademarks is strictly prohibited and may result in legal action.</p>

          <h2 className="font-heading text-xl font-bold mb-4">Brand Guidelines</h2>
          <p className="text-muted-foreground mb-6">Our brand assets, including logos and brand marks, may not be used without prior written consent. For partnership or media inquiries, please contact us.</p>

          <h2 className="font-heading text-xl font-bold mb-4">Contact</h2>
          <p className="text-muted-foreground mb-6">For trademark-related inquiries, please email <a href="mailto:info@printkul.in" className="text-brand-accent hover:underline">info@printkul.in</a>.</p>
        </div>
      </section>
    </div>
  )
}
