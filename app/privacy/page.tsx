import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Printkul",
  description: "Printkul's privacy policy. Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-brand-slate text-white py-10 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-white/70 mt-3">Last updated: May 2026</p>
        </div>
      </section>
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl prose prose-slate">
          <h2 className="font-heading text-xl font-bold mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-6">We collect information you provide directly, such as your name, phone number, and email address when you place an order or contact us. We do not store payment card information.</p>

          <h2 className="font-heading text-xl font-bold mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-6">Your information is used to process orders, communicate about your purchases, and improve our services. We do not sell your personal information to third parties.</p>

          <h2 className="font-heading text-xl font-bold mb-4">3. Data Security</h2>
          <p className="text-muted-foreground mb-6">We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

          <h2 className="font-heading text-xl font-bold mb-4">4. Cookies</h2>
          <p className="text-muted-foreground mb-6">We use cookies and local storage to improve your browsing experience and save your cart items. You can control cookie settings through your browser.</p>

          <h2 className="font-heading text-xl font-bold mb-4">5. Contact Us</h2>
          <p className="text-muted-foreground mb-6">For privacy-related inquiries, email us at <a href="mailto:info@printkul.in" className="text-brand-accent hover:underline">info@printkul.in</a>.</p>
        </div>
      </section>
    </div>
  )
}
