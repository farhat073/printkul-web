"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, ArrowRight } from "lucide-react"

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Mintleaf+Design+%26+Print/@33.7272088,75.1474796,1141m/data=!3m1!1e3!4m12!1m2!2m1!1sDigital+printing+service!3m8!1s0x38e205815555556d:0x2de53c99d3898e59!8m2!3d33.7253298!4d75.1547479!9m1!1b1!15sChhEaWdpdGFsIHByaW50aW5nIHNlcnZpY2VaGiIYZGlnaXRhbCBwcmludGluZyBzZXJ2aWNlkgEYZGlnaXRhbF9wcmludGluZ19zZXJ2aWNl4AEA!16s%2Fg%2F11g8_3g7ml?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D"

interface Review {
  name: string
  text: string
  rating: number
  role: string
}

const reviews: Review[] = [
  { name: "Majid Yousuf", text: "The best professional one stop place in Anantnag for printing, designing and what not. They have got best and professional team who never let me down. We are their clients for 4 years now and they have always been exceptionally good.", rating: 5, role: "Business Owner" },
  { name: "Dr. Junaid Malik", text: "For me, Mintleaf turned out an excellent press in Anantnag after exploring multiple alternatives. The design cards I ordered came out with superb quality, good paper quality and vibrant colors.", rating: 5, role: "Medical Professional" },
  { name: "Muskaan Akbar", text: "We had an exceptional experience working with Mintleaf for our printing needs! They printed our visiting cards, labels, and tags and the quality was awesome. The quality of the print materials is truly premium.", rating: 5, role: "Entrepreneur" },
  { name: "Umar Gilkar", text: "Outstanding printing service. The accuracy, surface finish, and material strength exceeded my expectations. The seller maintained clear communication and delivered exactly as requested.", rating: 5, role: "Regular Customer" },
  { name: "Mudasir Javeed", text: "We partnered with Mintleaf to design and print our new menus for Old Town Cafe, and we couldn't be more impressed. The print quality is sharp, vibrant, and flawless.", rating: 5, role: "Cafe Owner" },
  { name: "Rayees Zahoor", text: "I used Mintleaf Design & Print for our wedding invitation cards, and I am absolutely thrilled with the results! The printing quality was top-notch; the colors were vibrant, and the card stock felt luxurious.", rating: 5, role: "Happy Groom" },
  { name: "Waseem Bhat", text: "Creative designs, Awesome ideas and On time Deliveries are the motto of Mintleaf Anantnag. Thanks for the lovely crafted stickers. Wishing you more Success!", rating: 5, role: "Brand Owner" },
  { name: "Dr Shahid Shafi", text: "If you are researching the best place to get your printing done in bulk, these are your guys! They did their best to ensure quality and on time delivery. These guys are professionals with good business ethics.", rating: 5, role: "Academic" },
  { name: "Zainab Suhail", text: "Had my Nikkah Nama customized and printed from Mintleaf design and print. I'm super happy with the work and the employees who helped. Special thumbs up to Aadil Ashraf for the excellent work. 11/10", rating: 5, role: "Happy Bride" },
]

function ReviewCard({ review, index, style, className = "" }: { review: Review; index: number; style?: React.CSSProperties; className?: string }) {
  return (
    <a
      href={GOOGLE_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-white rounded-b-2xl rounded-t-sm border border-border border-t-0 shadow-lg cursor-pointer group hover:shadow-xl transition-shadow ${className}`}
      style={style}
    >
      {/* Perforated tear edge */}
      <div className="flex justify-between px-3 pt-1.5 pb-0">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="w-[3px] h-[3px] rounded-full bg-brand-gray-dark/50" />
        ))}
      </div>

      <div className="p-5 md:p-7">
        {/* Stars + counter */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-0.5">
            {Array.from({ length: review.rating }).map((_, s) => (
              <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-[11px] font-mono text-muted-foreground/40 tracking-wider">
            {String(index + 1).padStart(2, '0')}/{String(reviews.length).padStart(2, '0')}
          </span>
        </div>

        {/* Review text */}
        <p className="text-brand-slate text-[15px] md:text-base leading-relaxed mb-5">
          &ldquo;{review.text}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <div className="w-9 h-9 bg-brand-slate rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {review.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-brand-slate">{review.name}</h4>
            <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
              {review.role}
              <span className="inline-block w-0.5 h-0.5 bg-muted-foreground/40 rounded-full" />
              <svg viewBox="0 0 24 24" className="w-3 h-3 inline" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Verified
            </p>
          </div>
          <span className="text-xs text-brand-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center gap-1">
            View <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </a>
  )
}

export function GoogleReviewsMarquee() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [isSliding, setIsSliding] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const printNext = useCallback(() => {
    if (isSliding) return
    const next = (currentIndex + 1) % reviews.length
    setNextIndex(next)

    // Small delay so the browser renders the next card at translateY(-100%) first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsSliding(true)

        // After slide animation completes (1.3s), swap
        setTimeout(() => {
          setCurrentIndex(next)
          setNextIndex(null)
          setIsSliding(false)
        }, 1300)
      })
    })
  }, [currentIndex, isSliding])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(printNext, 5000)
    return () => clearInterval(timer)
  }, [printNext, isPaused])

  return (
    <section className="py-12 md:py-24 relative overflow-hidden">
      {/* Halftone */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, #0F172A 0.8px, transparent 0.8px)`,
        backgroundSize: '16px 16px',
      }} />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 mb-5">
            <div className="w-2 h-2 rounded-full bg-[#00AEEF]" />
            <div className="w-2 h-2 rounded-full bg-[#EC008C]" />
            <div className="w-2 h-2 rounded-full bg-[#FFF200]" />
            <div className="w-2 h-2 rounded-full bg-[#1A1A1A]" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-brand-slate font-heading tracking-tight">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center mt-5">
            <div className="inline-flex items-center gap-2.5 bg-white px-4 py-2 rounded-full border border-border shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-bold text-sm text-brand-slate">Google Reviews</span>
              <div className="w-px h-4 bg-border mx-0.5" />
              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
                <div className="relative w-3.5 h-3.5">
                  <Star className="w-3.5 h-3.5 text-gray-200 absolute inset-0" />
                  <div className="overflow-hidden absolute inset-0" style={{ width: '80%' }}>
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>
              <span className="font-extrabold text-base text-brand-slate">4.8</span>
            </div>
          </div>
        </div>

        {/* Printer + Paper */}
        <div
          className="max-w-xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Printer SVG — realistic desktop printer */}
          <div className="relative z-30">
            <svg viewBox="0 0 500 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-lg">
              {/* Paper input tray (back, sticking up) */}
              <rect x="100" y="0" width="300" height="35" rx="3" fill="#334155" />
              <rect x="100" y="0" width="300" height="35" rx="3" stroke="#475569" strokeWidth="0.5" />
              {/* Paper sheets in tray */}
              <rect x="120" y="4" width="260" height="2" rx="1" fill="#94A3B8" opacity="0.3" />
              <rect x="118" y="8" width="264" height="2" rx="1" fill="#94A3B8" opacity="0.2" />
              <rect x="116" y="12" width="268" height="2" rx="1" fill="#94A3B8" opacity="0.15" />

              {/* Main printer body */}
              <rect x="30" y="30" width="440" height="90" rx="12" fill="#1E293B" />
              <rect x="30" y="30" width="440" height="90" rx="12" stroke="#334155" strokeWidth="0.5" />
              {/* Top surface — lighter for 3D depth */}
              <rect x="30" y="30" width="440" height="14" rx="12" fill="#263545" />

              {/* Left ventilation grills */}
              <rect x="48" y="54" width="20" height="1.5" rx="0.75" fill="#334155" />
              <rect x="48" y="59" width="20" height="1.5" rx="0.75" fill="#334155" />
              <rect x="48" y="64" width="20" height="1.5" rx="0.75" fill="#334155" />
              <rect x="48" y="69" width="20" height="1.5" rx="0.75" fill="#334155" />
              <rect x="48" y="74" width="20" height="1.5" rx="0.75" fill="#334155" />

              {/* Display panel */}
              <rect x="85" y="50" width="100" height="32" rx="5" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
              {/* Status LED */}
              <circle cx="100" cy="62" r="3" fill="#22C55E" opacity="0.9" />
              {/* LCD text lines */}
              <rect x="110" y="58" width="55" height="2.5" rx="1.25" fill="#22C55E" opacity="0.4" />
              <rect x="110" y="64" width="40" height="2" rx="1" fill="#22C55E" opacity="0.25" />
              <rect x="110" y="69" width="50" height="2" rx="1" fill="#22C55E" opacity="0.15" />

              {/* Brand text — PRINTKUL */}
              <text x="280" y="62" textAnchor="middle" fill="#94A3B8" fontSize="12" fontFamily="system-ui" fontWeight="800" letterSpacing="5">PRINTKUL</text>
              {/* Subtitle — a mintleaf initiative */}
              <text x="280" y="75" textAnchor="middle" fill="#64748B" fontSize="6.5" fontFamily="system-ui" fontWeight="500" letterSpacing="2" fontStyle="italic">a mintleaf initiative</text>

              {/* Control buttons */}
              <rect x="380" y="50" width="32" height="32" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
              {/* Power button icon */}
              <circle cx="396" cy="66" r="6" stroke="#6366F1" strokeWidth="1.5" fill="none" opacity="0.6" />
              <rect x="395" y="58" width="2" height="5" rx="1" fill="#6366F1" opacity="0.6" />

              {/* Additional buttons */}
              <circle cx="428" cy="56" r="5" fill="#0F172A" stroke="#475569" strokeWidth="0.5" />
              <circle cx="428" cy="72" r="5" fill="#0F172A" stroke="#475569" strokeWidth="0.5" />
              <circle cx="450" cy="56" r="5" fill="#0F172A" stroke="#475569" strokeWidth="0.5" />
              <circle cx="450" cy="72" r="5" fill="#0F172A" stroke="#475569" strokeWidth="0.5" />

              {/* CMYK ink indicators */}
              <rect x="86" y="90" width="8" height="14" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
              <rect x="88" y="96" width="4" height="6" rx="1" fill="#00AEEF" opacity="0.8" />
              <rect x="98" y="90" width="8" height="14" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
              <rect x="100" y="94" width="4" height="8" rx="1" fill="#EC008C" opacity="0.8" />
              <rect x="110" y="90" width="8" height="14" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
              <rect x="112" y="95" width="4" height="7" rx="1" fill="#FFF200" opacity="0.8" />
              <rect x="122" y="90" width="8" height="14" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
              <rect x="124" y="93" width="4" height="9" rx="1" fill="#475569" opacity="0.6" />

              {/* Right ventilation grills */}
              <rect x="432" y="90" width="25" height="1.5" rx="0.75" fill="#334155" />
              <rect x="432" y="95" width="25" height="1.5" rx="0.75" fill="#334155" />
              <rect x="432" y="100" width="25" height="1.5" rx="0.75" fill="#334155" />

              {/* Paper output slot */}
              <rect x="70" y="117" width="360" height="7" rx="3.5" fill="#0F172A" />
              {/* Slot inner shadow */}
              <rect x="85" y="118.5" width="330" height="4" rx="2" fill="#151f2e" />

              {/* Bottom edge / feet */}
              <rect x="60" y="120" width="30" height="4" rx="2" fill="#334155" />
              <rect x="410" y="120" width="30" height="4" rx="2" fill="#334155" />
            </svg>
          </div>

          {/* Paper output zone — tight against printer slot */}
          <div className="relative -mt-14 mx-8 md:mx-14 overflow-hidden" style={{ minHeight: '200px' }}>
            {/* Bottom layer: current review (already printed, sitting there) */}
            <div className="relative z-10">
              <ReviewCard review={reviews[currentIndex]} index={currentIndex} />
            </div>

            {/* Top layer: next review sliding down from inside the printer */}
            {nextIndex !== null && (
              <div
                className="absolute inset-x-0 top-0 z-20"
                style={{
                  transform: isSliding ? 'translateY(0)' : 'translateY(-100%)',
                  transition: isSliding ? 'transform 1.3s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                }}
              >
                <ReviewCard review={reviews[nextIndex]} index={nextIndex} />
              </div>
            )}
          </div>

          {/* Progress dots + CMYK strip */}
          <div className="flex items-center justify-between mt-6 px-1">
            <div className="flex gap-1.5">
              {reviews.map((_, idx) => (
                <div
                  key={idx}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: idx === currentIndex ? '20px' : '6px',
                    backgroundColor: idx === currentIndex
                      ? 'var(--color-brand-slate)'
                      : 'var(--color-brand-gray-dark)',
                  }}
                />
              ))}
            </div>
            <div className="flex gap-px rounded overflow-hidden opacity-30">
              <div className="w-3.5 h-1.5 bg-[#00AEEF]" />
              <div className="w-3.5 h-1.5 bg-[#EC008C]" />
              <div className="w-3.5 h-1.5 bg-[#FFF200]" />
              <div className="w-3.5 h-1.5 bg-[#1A1A1A]" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-14">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-border text-brand-slate font-bold rounded-xl hover:border-brand-accent hover:text-brand-accent transition-all shadow-sm hover:shadow-lg text-sm group"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            See All Reviews on Google
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
