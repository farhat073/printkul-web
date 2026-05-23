import { Marquee } from "../ui/Marquee"

export function AnnouncementBar() {
  const announcements = [
    "Kashmir's First Online Digital Printing Store",
    "Free Delivery on Orders Above ₹5000",
    "Professional Visiting Cards Starting at ₹199",
    "Premium Quality Banners & Standees Available",
    "Fast Delivery Across J&K and Rest of India",
    "Contact us on WhatsApp for Custom Requirements: +91-94190 91333",
  ]

  return (
    <div className="bg-brand-slate text-white py-2 border-b border-white/5 overflow-hidden">
      <Marquee 
        items={announcements} 
        speed="normal" 
        className="py-0"
        variant="text"
      />
    </div>
  )
}
