"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart"
import { createClient } from "@/lib/supabase/client"
import { buildCartWhatsAppURL } from "@/lib/whatsapp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, CheckCircle2, Loader2, MessageCircle } from "lucide-react"
import { toast } from "sonner"

export default function CartPage() {
  const { items, removeFromCart, clearCart, cartTotal } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch whatsapp number from site_content
      const { data: waData } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "whatsapp_number")
        .maybeSingle()

      const waNumber = waData?.value || "919419091333"

      // Save enquiry for each item
      for (const item of items) {
        await supabase.from("enquiries").insert({
          user_id: user?.id || null,
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
          customer_name: name,
          customer_phone: phone,
          status: "initiated",
          message: `Cart order — ${items.length} items`,
        })
      }

      // Build WhatsApp URL with all cart items
      const waUrl = buildCartWhatsAppURL({
        waNumber,
        customerName: name,
        customerPhone: phone,
        items: items.map((item) => ({
          productName: item.productName,
          variantName: item.variantName,
          quantity: item.quantity,
          price: item.price,
        })),
      })

      window.open(waUrl, "_blank")
      setIsSuccess(true)
      clearCart()
    } catch (error) {
      console.error("Error during checkout:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCloseCheckout() {
    setIsCheckoutOpen(false)
    setIsSuccess(false)
    setName("")
    setPhone("")
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-brand-gray pt-8 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-8 bg-white rounded-full flex items-center justify-center border border-border shadow-sm">
              <ShoppingCart className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-brand-slate mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
              Browse our products and add items to your cart. We&apos;ll send your order via WhatsApp!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-slate text-white font-bold rounded-xl hover:bg-brand-slate-light transition-all shadow-lg text-base"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-gray pt-8 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand-slate transition-colors mb-2">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="font-heading text-3xl font-bold text-brand-slate">Your Cart</h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => { if (confirm("Remove all items from cart?")) clearCart() }}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <Card key={item.variantId} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex gap-4 p-5">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-brand-gray flex-shrink-0 overflow-hidden border border-border">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${item.categorySlug}/${item.subcategorySlug}/${item.productSlug}`}
                      className="font-semibold text-brand-slate hover:text-brand-accent transition-colors line-clamp-1"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.variantName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.quantity} pcs</p>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <span className="font-bold text-brand-slate text-lg">₹{parseFloat(item.price).toLocaleString("en-IN")}</span>
                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        {items.length > 0 && (
          <Card className="border-2 border-brand-slate/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-muted-foreground font-medium">Subtotal ({items.length} item{items.length > 1 ? "s" : ""})</span>
                <span className="text-2xl font-bold text-brand-slate">₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>

              <Button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-[#25D366] hover:bg-[#1fb855] text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.789l5.044-1.383C7.561 23.178 9.654 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.487 0-4.807-.801-6.708-2.157l-.482-.334-2.544.696.713-2.46-.364-.542A9.74 9.74 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                </svg>
                Place Order via WhatsApp
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" />
                Your order details will be sent to our team on WhatsApp
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={handleCloseCheckout}>
        <DialogContent className="sm:max-w-md">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">WhatsApp opened!</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Our team will reply within a few hours. You can also check your order status in &quot;My Orders&quot;.
              </p>
              <Button onClick={handleCloseCheckout} className="w-full">Done</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">
                  Confirm your details
                </DialogTitle>
                <DialogDescription>
                  We&apos;ll open WhatsApp with your order summary. Our team will confirm availability and pricing.
                </DialogDescription>
              </DialogHeader>

              {/* Cart Summary */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold mb-2">{items.length} item{items.length > 1 ? "s" : ""} · ₹{cartTotal.toLocaleString("en-IN")}</p>
                  <div className="space-y-1">
                    {items.slice(0, 3).map((item) => (
                      <p key={item.variantId} className="text-xs text-muted-foreground truncate">
                        • {item.productName} — {item.variantName}
                      </p>
                    ))}
                    {items.length > 3 && (
                      <p className="text-xs text-muted-foreground">+ {items.length - 3} more</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="checkout-name">Your Name</Label>
                  <Input
                    id="checkout-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-phone">Phone Number</Label>
                  <Input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your details are only used for this order.
                </p>
                <Button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#1fb855] text-white font-bold py-5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.789l5.044-1.383C7.561 23.178 9.654 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.487 0-4.807-.801-6.708-2.157l-.482-.334-2.544.696.713-2.46-.364-.542A9.74 9.74 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                      </svg>
                      Send Order via WhatsApp
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
