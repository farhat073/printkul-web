"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Marquee } from "../ui/Marquee"

const defaultAnnouncements = [
  "Kashmir's First Online Digital Printing Store",
  "Free Delivery on Orders Above ₹5000",
  "Professional Visiting Cards Starting at ₹199",
  "Premium Quality Banners & Standees Available",
  "Fast Delivery Across J&K and Rest of India",
  "Contact us on WhatsApp for Custom Requirements: +91-94190 91333",
]

export function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<string[]>(defaultAnnouncements)

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("site_content")
          .select("value")
          .eq("key", "announcement_bar_text")
          .maybeSingle()
        
        if (data?.value) {
          // Support pipe-separated values for multiple announcements
          const items = data.value.split("|").map((s: string) => s.trim()).filter(Boolean)
          if (items.length > 0) setAnnouncements(items)
        }
      } catch {
        // Silently fallback to defaults
      }
    }
    fetchAnnouncements()
  }, [])

  return (
    <div style={{ backgroundColor: '#2B3539' }} className="text-white py-2 border-b border-white/10 overflow-hidden">
      <Marquee 
        items={announcements} 
        speed="normal" 
        className="py-0"
        variant="announcement"
      />
    </div>
  )
}
