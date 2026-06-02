"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WhatsAppOrderModal } from "@/components/customer/WhatsAppOrderModal"
import { ProductCard } from "@/components/customer/ProductCard"
import { Truck, Shield, Clock, ShoppingCart, Minus, Plus, Package } from "lucide-react"
import { useCart } from "@/lib/cart"
import { toast } from "sonner"

interface ProductVariant {
  id: string
  name: string
  finish?: string
  size?: string
  quantity: number
  price: string
  is_active: boolean
}

interface PricingTier {
  qty: number
  discount: number
}

interface Product {
  id: string
  slug: string
  name: string
  description?: string
  short_desc?: string
  base_price: string
  price_note?: string
  moq?: number
  pricing_tiers?: PricingTier[]
  images?: string[]
  thumbnail_url?: string
  specifications?: Record<string, string>
  variants?: ProductVariant[]
}

interface RelatedProduct {
  id: string
  slug: string
  name: string
  short_desc?: string
  thumbnail_url?: string
  base_price: string
  subcategory?: { slug: string }
}

interface ProductDetailClientProps {
  product: Product
  waNumber: string
  deliveryInfo: string
  gstNote: string
  relatedProducts: RelatedProduct[]
  categorySlug: string
  subcategorySlug: string
}

// ── Pricing calculation using DB-stored tiers ──
function getTierDiscount(qty: number, moq: number, tiers: PricingTier[]): number {
  // Sort tiers descending by qty to find the highest applicable tier
  const sorted = [...tiers].sort((a, b) => b.qty - a.qty)
  for (const tier of sorted) {
    if (qty >= tier.qty) return tier.discount / 100
  }
  return 0 // base rate for MOQ
}

function calculatePrice(
  basePrice: number,
  qty: number,
  moq: number,
  tiers: PricingTier[]
): { total: number; perPiece: number; savings: number } {
  const basePricePerPiece = basePrice / moq
  const discount = getTierDiscount(qty, moq, tiers)
  const perPiece = basePricePerPiece * (1 - discount)
  const total = perPiece * qty
  const baseTotalAtMOQRate = basePricePerPiece * qty
  const savings = baseTotalAtMOQRate - total

  return {
    total: Math.round(total),
    perPiece: Math.round(perPiece * 100) / 100,
    savings: Math.round(savings),
  }
}

export function ProductDetailClient({
  product,
  waNumber,
  deliveryInfo,
  gstNote,
  relatedProducts,
  categorySlug,
  subcategorySlug,
}: ProductDetailClientProps) {
  const moq = product.moq || 1000
  const tiers: PricingTier[] = product.pricing_tiers || []
  const presetQuantities = [moq, ...tiers.map((t) => t.qty)].sort((a, b) => a - b)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedQuantity, setSelectedQuantity] = useState(moq)
  const [customQtyInput, setCustomQtyInput] = useState("")
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.find((v) => v.is_active) || null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()
  const router = useRouter()

  const basePrice = parseFloat(product.base_price)

  const pricing = useMemo(
    () => calculatePrice(basePrice, selectedQuantity, moq, tiers),
    [basePrice, selectedQuantity, moq, tiers]
  )

  // All tier prices for the pricing table
  const allTierPrices = useMemo(() => {
    return presetQuantities.map((qty) => ({
      qty,
      ...calculatePrice(basePrice, qty, moq, tiers),
      discount: getTierDiscount(qty, moq, tiers),
    }))
  }, [basePrice, moq, tiers, presetQuantities])

  const uniqueFinishes = [...new Set(product.variants?.map((v) => v.finish).filter(Boolean) || [])]

  const handleFinishSelect = (finish: string) => {
    const variant = product.variants?.find((v) => v.finish === finish && v.is_active)
    if (variant) setSelectedVariant(variant)
  }

  const handlePresetSelect = (qty: number) => {
    setSelectedQuantity(qty)
    setIsCustomMode(false)
    setCustomQtyInput("")
  }

  const handleCustomQtyChange = (value: string) => {
    setCustomQtyInput(value)
    const num = parseInt(value)
    if (!isNaN(num) && num >= moq) {
      setSelectedQuantity(num)
    }
  }

  const handleCustomQtyBlur = () => {
    const num = parseInt(customQtyInput)
    if (isNaN(num) || num < moq) {
      setSelectedQuantity(moq)
      setCustomQtyInput(moq.toString())
    }
  }

  const incrementQty = () => {
    const newQty = selectedQuantity + 1
    setSelectedQuantity(newQty)
    setCustomQtyInput(newQty.toString())
    if (!presetQuantities.includes(newQty)) setIsCustomMode(true)
  }

  const decrementQty = () => {
    const newQty = Math.max(moq, selectedQuantity - 1)
    setSelectedQuantity(newQty)
    setCustomQtyInput(newQty.toString())
    if (!presetQuantities.includes(newQty)) setIsCustomMode(true)
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: selectedVariant?.id || `qty-${selectedQuantity}`,
      variantName: selectedVariant?.name || `${selectedQuantity.toLocaleString("en-IN")} pcs`,
      price: pricing.total.toString(),
      quantity: selectedQuantity,
      thumbnailUrl: product.thumbnail_url,
      categorySlug,
      subcategorySlug,
    })

    toast.success("Added to cart", {
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart")
      }
    })
  }

  const images = product.images?.length ? product.images : [product.thumbnail_url].filter(Boolean)

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded overflow-hidden">
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-[#e8e4dc]">
                  P
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      idx === selectedImage ? "border-brand-blue" : "border-transparent hover:border-brand-blue/30"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-[var(--color-brand-slate)]">
                {product.name}
              </h1>
              {product.short_desc && (
                <p className="text-muted-foreground mt-2">{product.short_desc}</p>
              )}
            </div>

            {/* ── Dynamic Price Display ── */}
            <div className="bg-gradient-to-r from-[var(--color-brand-slate)] to-[#3a474d] rounded-xl p-5 text-white">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium">Total Price</p>
                  <p className="text-3xl font-bold mt-0.5">
                    ₹{pricing.total.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm font-medium">Per Piece</p>
                  <p className="text-xl font-bold mt-0.5">₹{pricing.perPiece}</p>
                </div>
              </div>
              {pricing.savings > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                    You save ₹{pricing.savings.toLocaleString("en-IN")}
                  </Badge>
                  <span className="text-white/50 text-xs">
                    vs. ordering at base rate
                  </span>
                </div>
              )}
              <p className="text-white/40 text-xs mt-2">
                {gstNote}
              </p>
            </div>

            {/* Variant Selector - Finish */}
            {uniqueFinishes.length > 1 && (
              <div>
                <label className="text-sm font-medium mb-3 block">Finish</label>
                <div className="flex flex-wrap gap-2">
                  {uniqueFinishes.map((finish) => {
                    const isSelected = selectedVariant?.finish === finish
                    return (
                      <button
                        key={finish}
                        onClick={() => handleFinishSelect(finish!)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          isSelected
                            ? "border-brand-blue bg-brand-blue/5 text-brand-slate"
                            : "border-border hover:border-brand-blue/30"
                        }`}
                      >
                        {finish}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Quantity Selector ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold">
                  Quantity
                  <span className="text-muted-foreground font-normal ml-1.5">(MOQ: {moq.toLocaleString("en-IN")} pcs)</span>
                </label>
              </div>

              {/* Preset Quantity Buttons */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                {presetQuantities.map((qty) => {
                  const tierPrice = calculatePrice(basePrice, qty, moq, tiers)
                  const discount = getTierDiscount(qty, moq, tiers)
                  const isSelected = selectedQuantity === qty && !isCustomMode
                  return (
                    <button
                      key={qty}
                      onClick={() => handlePresetSelect(qty)}
                      className={`relative p-3 rounded-xl border-2 text-center transition-all ${
                        isSelected
                          ? "border-[var(--color-brand-accent)] bg-[var(--color-brand-accent)]/5 shadow-sm"
                          : "border-border hover:border-[var(--color-brand-accent)]/40 hover:shadow-sm"
                      }`}
                    >
                      <div className="font-bold text-sm">{qty.toLocaleString("en-IN")}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        ₹{tierPrice.perPiece}/pc
                      </div>
                      {discount > 0 && (
                        <Badge className="absolute -top-2 -right-1 bg-emerald-500 text-white text-[9px] px-1.5 py-0">
                          {Math.round(discount * 100)}% off
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Custom Quantity Input */}
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQty}
                  disabled={selectedQuantity <= moq}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min={moq}
                    step={1}
                    value={isCustomMode ? customQtyInput : selectedQuantity}
                    onChange={(e) => {
                      setIsCustomMode(true)
                      handleCustomQtyChange(e.target.value)
                    }}
                    onFocus={() => {
                      setIsCustomMode(true)
                      setCustomQtyInput(selectedQuantity.toString())
                    }}
                    onBlur={handleCustomQtyBlur}
                    className="w-full h-10 text-center text-lg font-bold border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)]/30 focus:border-[var(--color-brand-accent)] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder={`Min ${moq}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">pcs</span>
                </div>
                <button
                  onClick={incrementQty}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {selectedQuantity < moq && (
                <p className="text-xs text-destructive mt-2">
                  Minimum order quantity is {moq.toLocaleString("en-IN")} pieces
                </p>
              )}
            </div>

            {/* ── Pricing Table ── */}
            {allTierPrices.length > 1 && (
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    Bulk Pricing
                  </h3>
                  <div className="space-y-1.5">
                    {allTierPrices.map(({ qty, total, perPiece, savings, discount }) => {
                      const isSelected = selectedQuantity === qty
                      return (
                        <button
                          key={qty}
                          onClick={() => handlePresetSelect(qty)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
                            isSelected ? "bg-[var(--color-brand-accent)]/5 ring-1 ring-[var(--color-brand-accent)]/20" : "bg-muted/30 hover:bg-muted/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm">{qty.toLocaleString("en-IN")} pcs</span>
                            {discount > 0 && (
                              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-[10px]">
                                {Math.round(discount * 100)}% off
                              </Badge>
                            )}
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">₹{perPiece}/pc</span>
                            <span className="font-semibold text-sm min-w-[80px] text-right">
                              ₹{total.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Desktop Order CTA */}
            <div className="hidden md:block space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={selectedQuantity < moq}
                className="w-full bg-brand-slate hover:bg-brand-slate-light text-white text-lg py-6 shadow-md hover:shadow-lg transition-all font-bold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart — ₹{pricing.total.toLocaleString("en-IN")}
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue/5 text-base py-5 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.789l5.044-1.383C7.561 23.178 9.654 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.487 0-4.807-.801-6.708-2.157l-.482-.334-2.544.696.713-2.46-.364-.542A9.74 9.74 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                </svg>
                Order via WhatsApp
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{deliveryInfo}</span>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Quality Guaranteed</span>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Quick Response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                {product.description || (
                  <p className="text-muted-foreground">No description available.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value as string}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specifications available.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold mb-8">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    ...p,
                    category_slug: categorySlug,
                    subcategory_slug: subcategorySlug,
                  }}
                  showFeaturedBadge={false}
                />
              ))}
            </div>
          </div>
        )}
        {/* Mobile Sticky Checkout Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-3 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs text-muted-foreground">{selectedQuantity.toLocaleString("en-IN")} pcs</span>
            <span className="text-sm font-bold">₹{pricing.total.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={selectedQuantity < moq}
              variant="outline"
              className="flex-1 border-brand-slate text-brand-slate py-6 text-sm font-bold"
            >
              Add to Cart
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-[#25D366] hover:bg-[#1fb855] text-white py-6 font-bold text-sm"
            >
              Order Now
            </Button>
          </div>
        </div>
      </div>

      {/* WhatsApp Order Modal */}
      <WhatsAppOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          thumbnail_url: product.thumbnail_url,
          slug: product.slug,
          category_slug: categorySlug,
          subcategory_slug: subcategorySlug,
        }}
        variant={{
          id: selectedVariant?.id || `qty-${selectedQuantity}`,
          name: selectedVariant?.name || `${selectedQuantity.toLocaleString("en-IN")} pcs`,
          price: pricing.total.toString(),
        }}
        quantity={selectedQuantity}
        waNumber={waNumber}
      />
    </div>
  )
}