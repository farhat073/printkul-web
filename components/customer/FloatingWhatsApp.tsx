"use client"

import { MessageCircle } from "lucide-react"

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919876543210?text=Hi%20Printkul!%20I%20have%20a%20question%20about%20your%20products."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-[#25d366] rounded-full animate-ping opacity-20" />
        <div className="relative w-14 h-14 bg-[#25d366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#1da851] hover:shadow-xl hover:scale-105 transition-all duration-300">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-[#212529] text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          Chat with us
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#212529]" />
        </div>
      </div>
    </a>
  )
}