import Link from "next/link"
import { Phone, Mail, MessageCircle, Instagram, Facebook, Youtube, ExternalLink } from "lucide-react"

// Simple inline SVG icons for Google and Twitter/X
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full">
      {/* ── Certifications Trust Badges ── */}
      <div className="bg-white py-10 md:py-12 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 text-center mb-8">Certified & Trusted</h3>
          <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
            {[
              { label: "10+ Years", src: "/certifications/10-years.png" },
              { label: "ISO IAF Certified", src: "/certifications/iso-iaf.png" },
              { label: "MSME Registered", src: "/certifications/msme.png" },
              { label: "Google Verified", src: "/certifications/google-verified.png" },
              { label: "ZED Certified", src: "/certifications/zed.png" },
              { label: "GeM Registered", src: "/certifications/gem.png" }
            ].map((item, idx) => (
              <div key={idx} className="group flex flex-col items-center gap-2">
                <div className="h-10 md:h-12 w-16 md:w-20 flex items-center justify-center">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="max-h-full max-w-full object-contain opacity-60 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0"
                  />
                </div>
                <span className="text-[8px] font-bold text-black/40 group-hover:text-black/80 uppercase tracking-wider transition-colors duration-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#2B3539' }} className="text-white">
        {/* ── Main Footer ── */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12 pt-12 md:pt-16 pb-10 md:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block">
              <img src="/logo-color.png" alt="Printkul" className="h-8 w-auto" />
            </Link>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Kashmir&apos;s First Online Digital Printing Store. Crafting professional solutions with precision since 2016.
            </p>
            <div className="flex items-center gap-5">
              <a href="https://instagram.com/printkul" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com/mintleafdp" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@Printkul" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-red-500/80 hover:text-white transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/printkul" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all">
                <TwitterXIcon className="w-4 h-4" />
              </a>
              <a href="https://g.page/printkul" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all">
                <GoogleIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Group */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Solutions</h3>
              <ul className="space-y-3">
                {[
                  { label: "Visiting Cards", href: "/visiting-cards" },
                  { label: "Signs & Marketing", href: "/signs-banners" },
                  { label: "Stationery", href: "/stationery" },
                  { label: "Labels & Stickers", href: "/labels-stickers" },
                  { label: "Photo Gifts", href: "/gifts-photo-products" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/50 hover:text-white text-[15px] transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Company</h3>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Our Story", href: "/about#story" },
                  { label: "Careers", href: "/careers" },
                  { label: "FAQs", href: "/faq" },
                  { label: "Contact Us", href: "/contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/50 hover:text-white text-[15px] transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Support</h3>
              <div className="space-y-4">
                <a href="tel:+919419091333" className="flex items-center gap-3 text-white/50 hover:text-white transition-all group">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[15px] font-medium">+91-94190 91333</span>
                </a>
                <a href="https://wa.me/919419091333" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/50 hover:text-green-400 transition-all group">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[15px] font-medium">WhatsApp Support</span>
                </a>
                <a href="mailto:info@printkul.in" className="flex items-center gap-3 text-white/50 hover:text-white transition-all group">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[15px] font-medium">info@printkul.in</span>
                </a>
              </div>
            </div>
            
            <div className="pt-4">
              <Link href="/faq" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white text-sm font-bold rounded-lg hover:bg-white/20 transition-all">
                Help Center <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ── Our Policies ── */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-4">Our Policies</h3>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/terms" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">Terms & Conditions</Link>
            <span className="text-white/15">|</span>
            <Link href="/delivery-return" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">Delivery & Return Policy</Link>
            <span className="text-white/15">|</span>
            <Link href="/copyright" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">Copyright Matters</Link>
            <span className="text-white/15">|</span>
            <Link href="/patents-trademark" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">Patents & Trademark</Link>
          </div>
        </div>
      </div>

      {/* ── Copyright Bar ── */}
      <div className="border-t border-white/10" style={{ backgroundColor: '#232D30' }}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] font-medium text-white/40">
            &copy; {currentYear} Printkul — Mintleaf Design & Print. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-[13px] font-bold text-white/30">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link href="/delivery-return" className="hover:text-white/70 transition-colors">Returns</Link>
          </div>
        </div>
      </div>
      </div>
    </footer>
  )
}
