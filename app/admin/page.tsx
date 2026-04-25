"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, MessageSquare, TrendingUp, Image, Tag, Users } from "lucide-react"
import Link from "next/link"

interface Stats {
  totalProducts: number
  totalEnquiries: number
  newEnquiriesToday: number
  activeBanners: number
  activeDeals: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
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
        enquiriesCount,
        bannersCount,
        dealsCount,
        todayEnquiries,
        recentEnquiriesData,
      ] = await Promise.all([
        supabase.from("products").select("id", { count: "exact" }).eq("is_active", true),
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

  const statusColors: Record<string, string> = {
    initiated: "bg-yellow-100 text-yellow-800",
    contacted: "bg-blue-100 text-blue-800",
    converted: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-amber" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Enquiries</p>
                  <p className="text-2xl font-bold">{stats.totalEnquiries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold">{stats.newEnquiriesToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Image className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Banners</p>
                  <p className="text-2xl font-bold">{stats.activeBanners}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Deals</p>
                  <p className="text-2xl font-bold">{stats.activeDeals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Enquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/admin/products/new"
                className="block p-3 bg-amber/10 rounded-lg hover:bg-amber/20 transition-colors"
              >
                <Package className="w-5 h-5 text-amber mb-2" />
                <span className="font-medium">Add Product</span>
              </Link>
              <Link
                href="/admin/banners"
                className="block p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Image className="w-5 h-5 text-blue-600 mb-2" />
                <span className="font-medium">Manage Banners</span>
              </Link>
              <Link
                href="/admin/enquiries"
                className="block p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-green-600 mb-2" />
                <span className="font-medium">View Enquiries</span>
              </Link>
              <Link
                href="/admin/media"
                className="block p-3 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Image className="w-5 h-5 text-purple-600 mb-2" />
                <span className="font-medium">Upload Images</span>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Enquiries */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">Recent Enquiries</CardTitle>
              <Link href="/admin/enquiries" className="text-sm text-amber hover:underline">
                View all →
              </Link>
            </CardHeader>
            <CardContent>
              {recentEnquiries.length > 0 ? (
                <div className="space-y-4">
                  {recentEnquiries.map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{enquiry.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {enquiry.product?.name} · {enquiry.variant?.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(enquiry.created_at).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <Badge className={statusColors[enquiry.status] || "bg-gray-100"}>
                        {enquiry.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No enquiries yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}