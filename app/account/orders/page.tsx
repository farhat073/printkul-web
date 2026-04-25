"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

interface Enquiry {
  id: string
  created_at: string
  status: string
  quantity: number
  customer_name: string
  customer_phone: string
  product: {
    name: string
    slug: string
  }
  variant: {
    name: string
    price: string
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Enquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("enquiries")
        .select(`
          *,
          product:products(name, slug),
          variant:product_variants(name, price)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data) {
        setOrders(data)
      }
      setIsLoading(false)
    }

    fetchOrders()
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
        <Loader2 className="w-8 h-8 animate-spin text-amber" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-[#faf8f5]">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t placed any orders via WhatsApp yet.
              </p>
              <Link href="/products">
                <button className="px-6 py-2 bg-amber text-white rounded-lg hover:bg-amber-dark transition-colors">
                  Browse Products
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{order.product?.name || "Product"}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.variant?.name} · {order.quantity} pcs · ₹{order.variant?.price}
                          </p>
                        </div>
                        <Badge className={statusColors[order.status] || "bg-gray-100"}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{new Date(order.created_at).toLocaleDateString("en-IN")}</span>
                        <span>Name: {order.customer_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                      <a
                        href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-green-600"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}