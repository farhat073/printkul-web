import Link from "next/link"
import { Phone, Mail, MessageCircle, Instagram, Facebook, Youtube, ExternalLink } from "lucide-react"


export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white text-brand-slate border-t border-border">
      {/* ── Main Footer ── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-12 pt-20 pb-16">
        {/* Certifications Trust Badges */}
        <div className="mb-14 pb-10 border-b border-border">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50 text-center mb-8">Certified & Trusted</h3>
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
                <img
                  src={item.src}
                  alt={item.label}
                  className="h-8 md:h-10 w-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
                <span className="text-[8px] font-bold text-muted-foreground/40 group-hover:text-brand-slate uppercase tracking-wider transition-colors duration-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block">
              <img src="/logo-color.png" alt="Printkul" className="h-8 w-auto" />
            </Link>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Kashmir&apos;s First Online Digital Printing Store. Crafting professional solutions with precision since 2016.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://instagram.com/printkul" target="_blank" rel="noopener" className="text-muted-foreground hover:text-brand-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/mintleafdp" target="_blank" rel="noopener" className="text-muted-foreground hover:text-brand-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@Printkul" target="_blank" rel="noopener" className="text-muted-foreground hover:text-red-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Group */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-slate">Solutions</h3>
              <ul className="space-y-4">
                {[
                  { label: "Visiting Cards", href: "/visiting-cards" },
                  { label: "Signs & Marketing", href: "/signs-marketing" },
                  { label: "Stationery", href: "/stationery" },
                  { label: "Labels & Stickers", href: "/labels-stickers" },
                  { label: "Photo Gifts", href: "/photo-gifts" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-brand-primary text-[15px] transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-slate">Company</h3>
              <ul className="space-y-4">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Our Story", href: "/about#story" },
                  { label: "Careers", href: "/careers" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-brand-primary text-[15px] transition-colors font-medium">
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
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-slate">Support</h3>
              <div className="space-y-4">
                <a href="tel:+919419091333" className="flex items-center gap-3 text-muted-foreground hover:text-brand-primary transition-all group">
                  <div className="w-8 h-8 rounded-full bg-brand-gray flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[15px] font-medium">+91-94190 91333</span>
                </a>
                <a href="https://wa.me/919419091333" target="_blank" rel="noopener" className="flex items-center gap-3 text-muted-foreground hover:text-green-600 transition-all group">
                  <div className="w-8 h-8 rounded-full bg-brand-gray flex items-center justify-center group-hover:bg-green-50 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[15px] font-medium">WhatsApp Support</span>
                </a>
                <a href="mailto:info@printkul.in" className="flex items-center gap-3 text-muted-foreground hover:text-brand-primary transition-all group">
                  <div className="w-8 h-8 rounded-full bg-brand-gray flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[15px] font-medium">info@printkul.in</span>
                </a>
              </div>
            </div>
            
            <div className="pt-4">
              <Link href="/faq" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-slate text-white text-sm font-bold rounded-lg hover:bg-brand-primary transition-all shadow-sm">
                Help Center <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ── Copyright Bar ── */}
      <div className="bg-brand-gray py-6">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] font-medium text-muted-foreground">
            &copy; {currentYear} Printkul. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-[13px] font-bold text-muted-foreground/60">
            <Link href="/privacy" className="hover:text-brand-slate transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-slate transition-colors">Terms</Link>
            <Link href="/delivery-return" className="hover:text-brand-slate transition-colors">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
