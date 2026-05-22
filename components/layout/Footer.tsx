import Link from "next/link"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"

const storeLocations = [
  "Anantnag", "Srinagar", "Jammu", "Banihal", "Bandipora", "Baramulla",
  "Budgam", "Ganderbal", "Kulgam", "Kupwara", "Pulwama", "Shopian"
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-slate text-white">
      {/* ── Main Footer ── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-14 pb-10">

        {/* Row 1: Brand + Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-10 border-b border-white/10">
          {/* Brand Block */}
          <div className="md:col-span-5">
            <img src="/logo-white.png" alt="Printkul" className="h-9 w-auto brightness-0 invert mb-4" />
            <p className="text-white/60 text-sm leading-relaxed max-w-md mb-5">
              Kashmir&apos;s First Online Digital Printing Store. High-quality, reliable, and affordable online print solutions — powered by Mintleaf Design &amp; Print since 2016.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              <a href="https://www.instagram.com/printkul/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-all" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" /></svg>
              </a>
              <a href="https://www.facebook.com/mintleafdp/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </a>
              <a href="https://www.youtube.com/@Printkul" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-all" aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
              </a>
              <a href="https://share.google/udtVHRq6pDgZIOJgR" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-all" aria-label="Google">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </a>
            </div>
          </div>

          {/* Contact Block */}
          <div className="md:col-span-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919419091333" className="flex items-center gap-3 text-white/60 hover:text-brand-accent transition-colors text-sm group">
                  <Phone className="w-4 h-4 text-brand-accent group-hover:scale-110 transition-transform" />
                  +91-94190 91333
                </a>
              </li>
              <li>
                <a href="https://wa.me/919419091333" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-green-400 transition-colors text-sm group">
                  <MessageCircle className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a href="mailto:info@printkul.in" className="flex items-center gap-3 text-white/60 hover:text-brand-accent transition-colors text-sm group">
                  <Mail className="w-4 h-4 text-brand-accent group-hover:scale-110 transition-transform" />
                  info@printkul.in
                </a>
              </li>
            </ul>
          </div>

          {/* Certifications */}
          <div className="md:col-span-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Certified &amp; Trusted</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { src: "/certifications/iso-iaf.png", alt: "ISO IAF" },
                { src: "/certifications/msme.png", alt: "MSME" },
                { src: "/certifications/google-verified.png", alt: "Google Verified" },
                { src: "/certifications/zed.png", alt: "ZED" },
                { src: "/certifications/gem.png", alt: "GeM" },
                { src: "/certifications/10-years.png", alt: "10+ Years" },
              ].map((cert, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/10 transition-colors">
                  <img src={cert.src} alt={cert.alt} className="h-9 w-auto object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Link Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 pt-10 pb-10 border-b border-white/10">
          {/* Products */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Products</h3>
            <ul className="space-y-2">
              {[
                { label: "Visiting Cards", href: "/visiting-cards" },
                { label: "Signs & Marketing", href: "/signs-marketing" },
                { label: "Stationery", href: "/stationery" },
                { label: "Labels & Stickers", href: "/labels-stickers" },
                { label: "Photo Gifts", href: "/photo-gifts" },
                { label: "Deals & Offers", href: "/deals" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/50 hover:text-white text-sm transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "FAQs", href: "/faq" },
                { label: "My Account", href: "/account" },
                { label: "Order History", href: "/account/orders" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/50 hover:text-white text-sm transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Policies */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Our Policies</h3>
            <ul className="space-y-2">
              {[
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Delivery & Return Policy", href: "/delivery-return" },
                { label: "Copyright Matters", href: "/copyright" },
                { label: "Patents & Trademark", href: "/patents-trademark" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Refund Policy", href: "/refund" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/50 hover:text-white text-sm transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Find Stores */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">Find Stores</h3>
            <div className="flex flex-wrap gap-x-1 gap-y-0.5">
              {storeLocations.map((store, idx) => (
                <span key={store} className="text-white/50 text-sm">
                  {store}{idx < storeLocations.length - 1 && <span className="text-white/20 mx-1">·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-white/35 text-xs">&copy; {currentYear} Printkul (Mintleaf Design &amp; Print). All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-white/35 hover:text-white/60 text-xs transition-colors">Terms</Link>
              <Link href="/privacy" className="text-white/35 hover:text-white/60 text-xs transition-colors">Privacy</Link>
              <Link href="/delivery-return" className="text-white/35 hover:text-white/60 text-xs transition-colors">Returns</Link>
              <Link href="/copyright" className="text-white/35 hover:text-white/60 text-xs transition-colors">Copyright</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}