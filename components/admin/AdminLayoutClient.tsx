"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image,
  Tag,
  MessageSquare,
  FileText,
  HelpCircle,
  Users,
  ImagePlus,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/deals", label: "Deals", icon: Tag },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/content", label: "Site Content", icon: FileText },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/media", label: "Media Library", icon: ImagePlus },
]

function NavLink({ item, isActive, onClick }: { item: typeof navItems[0]; isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-brand-slate text-white shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-white" : ""}`} />
      <span>{item.label}</span>
      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
    </Link>
  )
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  // Breadcrumb
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }))

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-50 bg-brand-slate border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white" style={{ background: 'linear-gradient(135deg, #662CE5, #D4116C, #EB652D)' }}>
                P
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-bold text-base">Printkul</span>
                <span className="text-white/40 text-xs ml-1.5">Admin</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              View Site <ExternalLink className="w-3 h-3" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ── Sidebar (Desktop) ── */}
        <aside className="hidden lg:block w-60 min-h-[calc(100vh-64px)] sticky top-16 bg-white border-r border-border/50">
          <nav className="p-3 space-y-1">
            <p className="px-4 py-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
              Navigation
            </p>
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
            ))}
          </nav>
        </aside>

        {/* ── Mobile Sidebar Overlay ── */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white z-50 shadow-2xl lg:hidden overflow-y-auto">
              <nav className="p-3 space-y-1">
                <p className="px-4 py-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
                  Navigation
                </p>
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={isActive(item.href)}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </nav>
            </aside>
          </>
        )}

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          {breadcrumbs.length > 1 && (
            <div className="px-6 py-3 border-b border-border/50 bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {breadcrumbs.map((crumb, i) => (
                  <span key={crumb.href} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight className="w-3 h-3" />}
                    {i === breadcrumbs.length - 1 ? (
                      <span className="font-medium text-foreground">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-foreground transition-colors">
                        {crumb.label}
                      </Link>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}
