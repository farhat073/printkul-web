"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Phone, MessageCircle, Download, Search, Calendar } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Enquiry {
  id: string
  created_at: string
  status: string
  quantity: number
  customer_name: string
  customer_phone: string
  message?: string
  product?: { name: string; slug: string }
  variant?: { name: string; price: string }
}

const statusColors: Record<string, string> = {
  initiated: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  converted: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
}

const statusOptions = ["initiated", "contacted", "converted", "closed"]

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchEnquiries()
  }, [filterStatus])

  async function fetchEnquiries() {
    let query = supabase
      .from("enquiries")
      .select("*, product:products(name, slug), variant:product_variants(name, price)")
      .order("created_at", { ascending: false })

    if (filterStatus) {
      query = query.eq("status", filterStatus)
    }

    const { data } = await query
    if (data) setEnquiries(data)
    setIsLoading(false)
  }

  async function updateStatus(enquiry: Enquiry, newStatus: string) {
    const { error } = await supabase
      .from("enquiries")
      .update({ status: newStatus })
      .eq("id", enquiry.id)

    if (!error) {
      fetchEnquiries()
      toast.success(`Status updated to ${newStatus}`)
    }
  }

  async function exportCSV() {
    const headers = ["Date", "Customer Name", "Phone", "Product", "Variant", "Quantity", "Status"]
    const rows = enquiries.map((e) => [
      new Date(e.created_at).toLocaleDateString(),
      e.customer_name,
      e.customer_phone,
      e.product?.name || "",
      e.variant?.name || "",
      e.quantity,
      e.status,
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `enquiries-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const filteredEnquiries = enquiries.filter((e) =>
    !searchQuery ||
    e.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.customer_phone.includes(searchQuery)
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Enquiries</h1>
          <p className="text-muted-foreground">{enquiries.length} total</p>
        </div>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === null ? "secondary" : "outline"}
            onClick={() => setFilterStatus(null)}
            size="sm"
          >
            All
          </Button>
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "secondary" : "outline"}
              onClick={() => setFilterStatus(status)}
              size="sm"
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr className="text-left text-sm">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Qty</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(enquiry.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{enquiry.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{enquiry.customer_phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{enquiry.product?.name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{enquiry.variant?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{enquiry.quantity} pcs</p>
                      <p className="text-xs text-muted-foreground">₹{enquiry.variant?.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[enquiry.status]}>
                        {enquiry.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${enquiry.customer_phone.replace(/\D/g, "")}`}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/${enquiry.customer_phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-green-600"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {statusOptions
                              .filter((s) => s !== enquiry.status)
                              .map((status) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => updateStatus(enquiry, status)}
                                  className="capitalize"
                                >
                                  Mark as {status}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEnquiries.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No enquiries found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}