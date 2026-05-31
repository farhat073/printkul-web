"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  MessageSquare,
  FolderTree,
  Image,
  Tag,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
} from "lucide-react"
import Link from "next/link"

interface Stats {
  totalProducts: number
  totalCategories: number
  totalSubcategories: number
  totalEnquiries: number
  newEnquiriesToday: number
  activeBanners: number
  activeDeals: number
}

const statusColors: Record<string, string> = {
  initiated: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  converted: "bg-emerald-100 text-emerald-700",
  closed: "bg-gray-100 text-gray-500",
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    totalEnquiries: 0,
    newEnquiriesToday: 0,
    activeBanners: 0,
    activeDeals: 0,
  })
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      const [
        productsCount,
        categoriesCount,
        subcategoriesCount,
        enquiriesCount,
        bannersCount,
        dealsCount,
        todayEnquiries,
        recentEnquiriesData,
      ] = await Promise.all([
        supabase.from("products").select("id", { count: "exact" }).eq("is_active", true),
        supabase.from("categories").select("id", { count: "exact" }).eq("is_active", true),
        supabase.from("subcategories").select("id", { count: "exact" }).eq("is_active", true),
        supabase.from("enquiries").select("id", { count: "exact" }),
        supabase.from("banners").select("id", { count: "exact" }).eq("is_active", true),
        supabase.from("deals").select("id", { count: "exact" }).eq("is_active", true),
        supabase
          .from("enquiries")
          .select("id", { count: "exact" })
          .gte("created_at", new Date().toISOString().split("T")[0]),
        supabase
          .from("enquiries")
          .select("*, product:products(name), variant:product_variants(name)")
          .order("created_at", { ascending: false })
          .limit(5),
      ])

      setStats({
        totalProducts: productsCount.count || 0,
        totalCategories: categoriesCount.count || 0,
        totalSubcategories: subcategoriesCount.count || 0,
        totalEnquiries: enquiriesCount.count || 0,
        newEnquiriesToday: todayEnquiries.count || 0,
        activeBanners: bannersCount.count || 0,
        activeDeals: dealsCount.count || 0,
      })

      if (recentEnquiriesData.data) {
        setRecentEnquiries(recentEnquiriesData.data)
      }

      setIsLoading(false)
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  const statCards = [
    { label: "Products", value: stats.totalProducts, icon: Package, color: "bg-indigo-50 text-indigo-600", href: "/admin/products" },
    { label: "Categories", value: stats.totalCategories, icon: FolderTree, color: "bg-violet-50 text-violet-600", href: "/admin/categories" },
    { label: "Subcategories", value: stats.totalSubcategories, icon: FolderTree, color: "bg-fuchsia-50 text-fuchsia-600", href: "/admin/categories" },
    { label: "Enquiries", value: stats.totalEnquiries, icon: MessageSquare, color: "bg-blue-50 text-blue-600", href: "/admin/enquiries" },
    { label: "Today", value: stats.newEnquiriesToday, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600", href: "/admin/enquiries" },
    { label: "Banners", value: stats.activeBanners, icon: Image, color: "bg-amber-50 text-amber-600", href: "/admin/banners" },
    { label: "Deals", value: stats.activeDeals, icon: Tag, color: "bg-rose-50 text-rose-600", href: "/admin/deals" },
  ]

  const quickActions = [
    { label: "Add Product", href: "/admin/products/new", icon: Plus, desc: "Create a new product listing" },
    { label: "Manage Categories", href: "/admin/categories", icon: FolderTree, desc: "Add or edit categories" },
    { label: "Upload Media", href: "/admin/media", icon: Image, desc: "Upload images to Cloudinary" },
    { label: "View Enquiries", href: "/admin/enquiries", icon: MessageSquare, desc: "Check customer enquiries" },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-slate tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/50">
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-brand-slate">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardContent className="p-5">
            <h2 className="font-bold text-sm text-brand-slate mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-slate/5 flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
                    <action.icon className="w-4 h-4 text-brand-slate group-hover:text-brand-accent transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-slate">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Enquiries */}
        <Card className="lg:col-span-2 border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-brand-slate">Recent Enquiries</h2>
              <Link href="/admin/enquiries" className="text-xs font-medium text-brand-accent hover:underline">
                View all →
              </Link>
            </div>
            {recentEnquiries.length > 0 ? (
              <div className="space-y-3">
                {recentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-brand-slate/10 flex items-center justify-center text-xs font-bold text-brand-slate flex-shrink-0">
                        {enquiry.customer_name?.charAt(0) || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-brand-slate truncate">{enquiry.customer_name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {enquiry.product?.name || "General enquiry"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(enquiry.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <Badge className={`text-[10px] ${statusColors[enquiry.status] || "bg-gray-100 text-gray-500"}`}>
                        {enquiry.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No enquiries yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}