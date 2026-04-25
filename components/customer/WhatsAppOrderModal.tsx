"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { buildWhatsAppURL } from "@/lib/whatsapp"
import { CheckCircle2, Loader2 } from "lucide-react"

interface WhatsAppOrderModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    thumbnail_url?: string
    slug: string
    category_slug: string
    subcategory_slug: string
  }
  variant: {
    id: string
    name: string
    price: string
  }
  quantity: number
  waNumber: string
}

export function WhatsAppOrderModal({
  isOpen,
  onClose,
  product,
  variant,
  quantity,
  waNumber,
}: WhatsAppOrderModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const productUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${product.category_slug}/${product.subcategory_slug}/${product.slug}`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      // Create enquiry record
      await supabase.from("enquiries").insert({
        user_id: user?.id || null,
        product_id: product.id,
        variant_id: variant.id,
        quantity,
        customer_name: name,
        customer_phone: phone,
        status: "initiated",
      })

      // Build WhatsApp URL
      const waUrl = buildWhatsAppURL({
        waNumber,
        customerName: name,
        customerPhone: phone,
        productName: product.name,
        variantName: variant.name,
        quantity,
        price: variant.price,
        productUrl,
      })

      // Open WhatsApp
      window.open(waUrl, "_blank")
      setIsSuccess(true)
    } catch (error) {
      console.error("Error submitting order:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleClose() {
    setIsSuccess(false)
    setName("")
    setPhone("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2">WhatsApp opened!</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Our team will reply within a few hours. You can also track your order in &quot;My Orders&quot;.
            </p>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                Almost there — confirm your details
              </DialogTitle>
              <DialogDescription>
                We&apos;ll open WhatsApp with your order details. Our team will confirm availability and share payment details.
              </DialogDescription>
            </DialogHeader>

            {/* Order Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {product.thumbnail_url && (
                    <img
                      src={product.thumbnail_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{variant.name}</p>
                    <p className="text-sm font-semibold text-amber mt-1">
                      ₹{variant.price} × {quantity} = ₹{(parseFloat(variant.price) * quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rajesh Kumar"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Your number is only used for this order. We don&apos;t share it with third parties.
              </p>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Open WhatsApp
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}