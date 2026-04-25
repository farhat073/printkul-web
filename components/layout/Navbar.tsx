"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Menu, X, Search, User, ChevronDown, ChevronRight, ChevronLeft, Phone, LogOut, LayoutDashboard, HelpCircle, ShoppingCart } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Category {
  id: string
  slug: string
  name: string
  subcategories?: Subcategory[]
}

interface Subcategory {
  id: string
  slug: string
  name: string
  category_id: string
}

import { mockCategories } from "@/lib/data/mock"

export function Navbar() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null)
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollNav = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await supabase
          .from("categories")
          .select("*, subcategories(*)")
          .eq("is_active", true)
          .order("sort_order")
        
        if (data && data.length > 0) {
          setCategories(data)
        } else {
          setCategories(mockCategories as any)
        }
      } catch (error) {
        setCategories(mockCategories as any)
      }
    }

    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()
        if (profile?.role === "admin") setIsAdmin(true)
      }
      setIsLoading(false)
    }

    fetchCategories()
    fetchUser()
  }, [])

  const handleMegaMenuEnter = useCallback((categoryId: string) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current)
    setActiveMegaMenu(categoryId)
  }, [])

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => setActiveMegaMenu(null), 150)
  }, [])

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100)
  }

  const getColumns = (subcategories: Subcategory[]) => {
    const cols: Subcategory[][] = [[], [], []]
    subcategories.forEach((sub, i) => cols[i % 3].push(sub))
    return cols.filter(col => col.length > 0)
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── TIER 1: Top Utility Bar ── */}
      <div className="bg-[#1a1a1a] text-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-amber" />
              <span className="text-white/70">Need help?</span>
              <a href="https://wa.me/919876543210" className="text-white font-medium hover:text-amber transition-colors">
                WhatsApp Support
              </a>
            </div>
            <div className="hidden md:flex items-center gap-4 text-white/70">
              <span>Pan-India Delivery</span>
              <span className="text-white/30">|</span>
              <span>Quality Guaranteed</span>
              <span className="text-white/30">|</span>
              <span>No Minimum Order</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIER 2: Logo + Search + Actions ── */}
      <div className="bg-white border-b border-[#e9ecef]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4 lg:gap-8">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#f1f3f5] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-[#1a1a1a]" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 bg-amber rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg leading-none">P</span>
              </div>
              <span className="font-heading text-xl lg:text-2xl font-bold text-[#1a1a1a] tracking-tight">
                Printkul
              </span>
            </Link>

            {/* Search bar – desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <form action="/search" method="get" className="w-full flex">
                <input
                  type="search"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search visiting cards, banners, stationery..."
                  className="flex-1 h-10 px-4 rounded-l-lg border border-[#dee2e6] border-r-0 bg-[#f8f9fa] text-sm text-[#212529] focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber focus:bg-white transition-all placeholder:text-[#adb5bd]"
                />
                <button
                  type="submit"
                  className="h-10 px-5 bg-amber text-white rounded-r-lg hover:bg-amber-dark transition-colors flex items-center gap-1.5 text-sm font-medium"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden lg:inline">Search</span>
                </button>
              </form>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Mobile search toggle */}
              <button
                onClick={handleSearchToggle}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#f1f3f5] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-[#1a1a1a]" />
              </button>

              {/* Help */}
              <Link
                href="/faq"
                className="hidden lg:flex items-center gap-1.5 px-3 h-10 rounded-lg text-sm text-[#6c757d] hover:bg-[#f1f3f5] hover:text-[#1a1a1a] transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help</span>
              </Link>

              {/* Account */}
              {!isLoading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-3 h-10 rounded-lg hover:bg-[#f1f3f5] transition-colors">
                      <div className="w-7 h-7 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="hidden lg:block text-sm text-[#495057]">Account</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                        {isAdmin && <p className="text-xs text-amber font-medium">Admin</p>}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/account" className="flex items-center gap-2 w-full">
                          <User className="w-4 h-4" /> My Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/account/orders" className="flex items-center gap-2 w-full">
                          <Phone className="w-4 h-4" /> My Orders
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Link href="/admin" className="flex items-center gap-2 text-amber w-full">
                              <LayoutDashboard className="w-4 h-4" /> Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => { await supabase.auth.signOut(); window.location.href = "/" }}
                        className="flex items-center gap-2 text-red-600 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 h-10 rounded-lg text-sm text-[#495057] hover:bg-[#f1f3f5] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Account</span>
                  </Link>
                )
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center gap-1.5 px-3 h-10 rounded-lg text-sm text-[#495057] hover:bg-[#f1f3f5] transition-colors relative"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="absolute top-1.5 right-1.5 lg:right-2 w-4 h-4 bg-amber text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
              </Link>

              {/* Start Designing CTA */}
              <Link
                href="/design-studio"
                className="hidden md:flex items-center justify-center h-10 px-4 ml-2 bg-amber text-white text-sm font-semibold rounded-lg hover:bg-amber-dark transition-colors shadow-sm"
              >
                Start Designing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIER 3: Category Navigation Bar ── */}
      <nav className="hidden lg:block bg-white border-b border-[#e9ecef] shadow-sm relative z-40">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative group/nav">
          
          {/* Left Scroll Arrow */}
          <button 
            onClick={() => scrollNav("left")} 
            className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-white via-white to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/nav:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <div className="w-7 h-7 bg-white shadow-md border border-[#e9ecef] rounded-full flex items-center justify-center text-[#1a1a1a] hover:text-amber">
              <ChevronLeft className="w-4 h-4" />
            </div>
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex items-center h-11 gap-0 overflow-x-auto hide-scrollbar"
          >
            {/* View All */}
            <Link
              href="/products"
              className="flex items-center gap-1 px-4 h-full text-sm font-semibold text-[#1a1a1a] hover:text-amber transition-colors border-r border-[#e9ecef] flex-shrink-0"
            >
              <Menu className="w-3.5 h-3.5" />
              All Products
            </Link>

            {/* Dynamic category links */}
            {categories.map((category) => (
              <div
                key={category.id}
                className="h-full flex-shrink-0"
                onMouseEnter={() => handleMegaMenuEnter(category.id)}
                onMouseLeave={handleMegaMenuLeave}
              >
                <Link
                  href={`/${category.slug}`}
                  className={`flex items-center gap-1 px-3.5 h-full text-sm transition-colors whitespace-nowrap ${
                    activeMegaMenu === category.id
                      ? "text-amber"
                      : "text-[#495057] hover:text-amber"
                  }`}
                >
                  {category.name}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  )}
                </Link>

                {/* Mega-menu dropdown */}
                {activeMegaMenu === category.id && category.subcategories && category.subcategories.length > 0 && (
                  <div
                    className="absolute top-full left-4 right-4 bg-white shadow-xl border border-[#e9ecef] rounded-b-lg mega-menu-enter z-50 overflow-hidden"
                    onMouseEnter={() => handleMegaMenuEnter(category.id)}
                    onMouseLeave={handleMegaMenuLeave}
                  >
                    <div className="p-6">
                      <div className="flex gap-8 flex-wrap">
                        {getColumns(category.subcategories).map((column, colIndex) => (
                          <div key={colIndex} className="flex-1 min-w-[180px] max-w-[250px]">
                            {column.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/${category.slug}/${sub.slug}`}
                                className="block py-1.5 text-sm text-[#6c757d] hover:text-amber transition-colors whitespace-normal"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-[#f1f3f5]">
                        <Link
                          href={`/${category.slug}`}
                          className="text-sm font-medium text-amber hover:text-amber-dark transition-colors inline-flex items-center gap-1"
                        >
                          View all {category.name} <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Static links */}
            <div className="flex items-center h-full ml-auto pl-4 flex-shrink-0">
              <Link
                href="/deals"
                className="flex items-center gap-1 px-3.5 h-full text-sm font-semibold text-amber hover:text-amber-dark transition-colors"
              >
                Deals
              </Link>
              <Link href="/about" className="flex items-center px-3.5 h-full text-sm text-[#495057] hover:text-amber transition-colors">
                About
              </Link>
              <Link href="/contact" className="flex items-center px-3.5 h-full text-sm text-[#495057] hover:text-amber transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Right Scroll Arrow */}
          <button 
            onClick={() => scrollNav("right")} 
            className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-white via-white to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/nav:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <div className="w-7 h-7 bg-white shadow-md border border-[#e9ecef] rounded-full flex items-center justify-center text-[#1a1a1a] hover:text-amber">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile search ── */}
      {isSearchOpen && (
        <div className="md:hidden bg-white border-b border-[#e9ecef] animate-slide-down">
          <div className="px-4 py-3">
            <form action="/search" method="get" className="flex gap-2">
              <input
                ref={searchInputRef}
                type="search"
                name="q"
                placeholder="Search products..."
                className="flex-1 h-10 px-4 border border-[#dee2e6] rounded-lg text-sm text-[#212529] focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber bg-[#f8f9fa]"
                autoFocus
              />
              <button
                type="submit"
                className="h-10 px-4 bg-amber text-white rounded-lg hover:bg-amber-dark transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Mobile slide-out menu ── */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 w-[300px] h-full bg-white z-50 lg:hidden animate-slide-in-left overflow-y-auto">
            {/* Drawer header */}
            <div className="flex items-center justify-between p-4 border-b border-[#e9ecef] bg-[#1a1a1a]">
              <span className="font-heading text-lg font-bold text-white">Printkul</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2">
              <Link
                href="/"
                className="block px-4 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-[#f8f9fa] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {categories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center">
                    <Link
                      href={`/${category.slug}`}
                      className="flex-1 px-4 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-[#f8f9fa] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <button
                        onClick={() => setExpandedMobileCategory(
                          expandedMobileCategory === category.id ? null : category.id
                        )}
                        className="px-4 py-3 text-[#adb5bd] hover:text-[#1a1a1a] transition-colors"
                      >
                        <ChevronRight className={`w-4 h-4 transition-transform ${expandedMobileCategory === category.id ? "rotate-90" : ""}`} />
                      </button>
                    )}
                  </div>
                  {expandedMobileCategory === category.id && category.subcategories && (
                    <div className="bg-[#f8f9fa] border-y border-[#e9ecef]">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/${category.slug}/${sub.slug}`}
                          className="block px-8 py-2.5 text-sm text-[#6c757d] hover:text-amber transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="border-t border-[#e9ecef] mt-2 pt-2">
                <Link href="/deals" className="block px-4 py-3 text-sm font-semibold text-amber" onClick={() => setIsMenuOpen(false)}>
                  Deals & Offers
                </Link>
                <Link href="/about" className="block px-4 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-[#f8f9fa]" onClick={() => setIsMenuOpen(false)}>
                  About Us
                </Link>
                <Link href="/contact" className="block px-4 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-[#f8f9fa]" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
                <Link href="/faq" className="block px-4 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-[#f8f9fa]" onClick={() => setIsMenuOpen(false)}>
                  FAQs
                </Link>
              </div>

              <div className="border-t border-[#e9ecef] mt-2 pt-2 px-4 pb-4">
                {user ? (
                  <div className="space-y-2">
                    <Link href="/account" className="block py-2 text-sm text-[#1a1a1a] font-medium" onClick={() => setIsMenuOpen(false)}>My Account</Link>
                    {isAdmin && (
                      <Link href="/admin" className="block py-2 text-sm text-amber font-medium" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full mt-2 py-2.5 text-center text-sm font-medium bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2d2d2d] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}