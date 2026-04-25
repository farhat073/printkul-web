import Link from "next/link"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-heading text-xl font-bold">Printkul</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Quality custom print products for every business. Order via WhatsApp — fast delivery across India.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber/80 transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber/80 transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" /></svg>
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber/80 transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Products</h3>
            <ul className="space-y-2.5">
              <li><Link href="/visiting-cards" className="text-white/60 hover:text-amber transition-colors text-sm">Visiting Cards</Link></li>
              <li><Link href="/signs-marketing" className="text-white/60 hover:text-amber transition-colors text-sm">Signs & Marketing</Link></li>
              <li><Link href="/stationery" className="text-white/60 hover:text-amber transition-colors text-sm">Stationery</Link></li>
              <li><Link href="/labels-stickers" className="text-white/60 hover:text-amber transition-colors text-sm">Labels & Stickers</Link></li>
              <li><Link href="/photo-gifts" className="text-white/60 hover:text-amber transition-colors text-sm">Photo Gifts</Link></li>
              <li><Link href="/deals" className="text-white/60 hover:text-amber transition-colors text-sm">Deals & Offers</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-white/60 hover:text-amber transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-amber transition-colors text-sm">Contact</Link></li>
              <li><Link href="/faq" className="text-white/60 hover:text-amber transition-colors text-sm">FAQs</Link></li>
              <li><Link href="/account" className="text-white/60 hover:text-amber transition-colors text-sm">My Account</Link></li>
              <li><Link href="/account/orders" className="text-white/60 hover:text-amber transition-colors text-sm">Order History</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/80 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">hello@printkul.in</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">Your address here</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-amber mt-0.5 flex-shrink-0" />
                <a href="https://wa.me/919876543210" className="text-white/60 hover:text-amber text-sm transition-colors">WhatsApp Support</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-sm">© {currentYear} Printkul. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="text-white/40 hover:text-white/70 text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-white/40 hover:text-white/70 text-sm transition-colors">Terms of Service</Link>
              <Link href="/refund" className="text-white/40 hover:text-white/70 text-sm transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}