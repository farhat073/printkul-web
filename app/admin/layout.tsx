import Link from "next/link"
import { Package, ShoppingCart, Image, Tag, FileText, Users, Settings, HelpCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single()

  const isAdmin = profile?.role === "admin"

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Package },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: FileText },
    { href: "/admin/banners", label: "Banners", icon: Image },
    { href: "/admin/deals", label: "Deals", icon: Tag },
    { href: "/admin/enquiries", label: "Enquiries", icon: ShoppingCart },
    { href: "/admin/content", label: "Site Content", icon: FileText },
    { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/media", label: "Media", icon: Image },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <div className="bg-[#1a1a2e] text-white sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber rounded-lg flex items-center justify-center">
                <span className="text-[#1a1a2e] font-bold text-xl">P</span>
              </div>
              <span className="font-heading text-xl font-bold">Printkul Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-white/70 hover:text-white">
                View Site →
              </Link>
              <span className="text-sm text-amber">Admin Panel</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-border min-h-[calc(100vh-72px)] sticky top-[72px] hidden lg:block">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}