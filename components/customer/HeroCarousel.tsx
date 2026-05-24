"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselBanner {
  id: string
  title: string
  subtitle?: string
  image_url: string
  cta_text?: string
  cta_url?: string
}

interface HeroCarouselProps {
  banners: CarouselBanner[]
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Fallback banners if none from DB
  const fallbackBanners: CarouselBanner[] = [
    {
      id: "fb-1",
      title: "Premium Visiting Cards",
      image_url: "/banners/visiting-cards.png",
      cta_url: "/visiting-cards",
    },
    {
      id: "fb-2",
      title: "Custom Stickers & Labels",
      image_url: "/banners/stickers-labels.png",
      cta_url: "/labels-stickers",
    },
    {
      id: "fb-3",
      title: "Marketing Materials",
      image_url: "/banners/marketing-materials.png",
      cta_url: "/marketing-materials",
    },
    {
      id: "fb-4",
      title: "Wedding Invitations",
      image_url: "/banners/wedding-invitations.png",
      cta_url: "/visiting-cards",
    },
    {
      id: "fb-5",
      title: "Signs & Banners",
      image_url: "/banners/signs-banners.png",
      cta_url: "/signs-banners",
    },
    {
      id: "fb-6",
      title: "Personalized Gifts",
      image_url: "/banners/corporate-gifts.png",
      cta_url: "/gifts-photo-products",
    },
  ]

  const displayBanners = banners.length > 0 ? banners : fallbackBanners

  // Calculate number of pages based on cards visible
  // On mobile: 1 card, tablet: 2 cards, desktop: 3 cards visible
  const getCardsPerView = useCallback(() => {
    if (typeof window === "undefined") return 2
    if (window.innerWidth < 1024) return 1
    return 2
  }, [])

  const [cardsPerView, setCardsPerView] = useState(3)

  useEffect(() => {
    setCardsPerView(getCardsPerView())
    const handleResize = () => setCardsPerView(getCardsPerView())
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [getCardsPerView])

  const totalPages = Math.ceil(displayBanners.length / cardsPerView)

  const scrollToPage = useCallback(
    (page: number) => {
      if (!scrollRef.current) return
      const container = scrollRef.current
      const cardWidth = container.scrollWidth / displayBanners.length
      const targetScroll = page * cardsPerView * cardWidth
      container.scrollTo({ left: targetScroll, behavior: "smooth" })
      setCurrentPage(page)
    },
    [cardsPerView, displayBanners.length]
  )

  // Auto-play
  useEffect(() => {
    if (isHovered || displayBanners.length <= cardsPerView) return

    autoPlayRef.current = setInterval(() => {
      setCurrentPage((prev) => {
        const next = (prev + 1) % totalPages
        scrollToPage(next)
        return next
      })
    }, 4000)

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isHovered, totalPages, cardsPerView, displayBanners.length, scrollToPage])

  // Sync dots with scroll position
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const cardWidth = container.scrollWidth / displayBanners.length
    const scrollLeft = container.scrollLeft
    const page = Math.round(scrollLeft / (cardWidth * cardsPerView))
    setCurrentPage(Math.min(page, totalPages - 1))
  }, [cardsPerView, displayBanners.length, totalPages])

  const goNext = () => {
    const next = (currentPage + 1) % totalPages
    scrollToPage(next)
  }

  const goPrev = () => {
    const prev = currentPage === 0 ? totalPages - 1 : currentPage - 1
    scrollToPage(prev)
  }

  if (displayBanners.length === 0) return null

  return (
    <section
      className="hero-carousel-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hero-carousel-container">
        {/* Arrow Left */}
        {displayBanners.length > cardsPerView && (
          <button
            onClick={goPrev}
            className="hero-carousel-arrow hero-carousel-arrow-left"
            aria-label="Previous slides"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Cards Track */}
        <div
          ref={scrollRef}
          className="hero-carousel-track"
          onScroll={handleScroll}
        >
          {displayBanners.map((banner) => {
            const CardWrapper = banner.cta_url ? Link : "div"
            const wrapperProps = banner.cta_url
              ? { href: banner.cta_url }
              : {}

            return (
              <CardWrapper
                key={banner.id}
                {...(wrapperProps as any)}
                className="hero-carousel-card"
              >
                <img
                  src={banner.image_url}
                  alt={banner.title || "Promotional banner"}
                  className="hero-carousel-card-img"
                  loading="lazy"
                />
              </CardWrapper>
            )
          })}
        </div>

        {/* Arrow Right */}
        {displayBanners.length > cardsPerView && (
          <button
            onClick={goNext}
            className="hero-carousel-arrow hero-carousel-arrow-right"
            aria-label="Next slides"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dot Indicators - Flipkart style */}
      {totalPages > 1 && (
        <div className="hero-carousel-dots">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToPage(idx)}
              className={`hero-carousel-dot ${
                idx === currentPage
                  ? "hero-carousel-dot-active"
                  : ""
              }`}
              aria-label={`Go to slide group ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
