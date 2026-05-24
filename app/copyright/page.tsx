import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Copyright Matters | Printkul",
  description: "Information about copyright and intellectual property matters at Printkul.",
}

export default function CopyrightPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-brand-slate text-white py-10 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Copyright Matters</h1>
          <p className="text-white/70 mt-3">Intellectual Property Information</p>
        </div>
      </section>
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl prose prose-slate">
          <h2 className="font-heading text-xl font-bold mb-4">Copyright Policy</h2>
          <p className="text-muted-foreground mb-6">All content on the Printkul website — including text, images, graphics, logos, and software — is the property of Mintleaf Design &amp; Print and is protected by Indian and international copyright laws.</p>

          <h2 className="font-heading text-xl font-bold mb-4">Customer Designs</h2>
          <p className="text-muted-foreground mb-6">When you submit your designs for printing, you confirm that you own or have the legal right to use all elements in your design. Printkul is not responsible for any copyright infringement in customer-submitted designs.</p>

          <h2 className="font-heading text-xl font-bold mb-4">Prohibited Use</h2>
          <p className="text-muted-foreground mb-6">You may not reproduce, distribute, or create derivative works from any content on this website without our prior written consent.</p>

          <h2 className="font-heading text-xl font-bold mb-4">Reporting Infringement</h2>
          <p className="text-muted-foreground mb-6">If you believe your copyrighted work has been used without permission, please contact us at <a href="mailto:info@printkul.in" className="text-brand-accent hover:underline">info@printkul.in</a> with details of the alleged infringement.</p>
        </div>
      </section>
    </div>
  )
}
