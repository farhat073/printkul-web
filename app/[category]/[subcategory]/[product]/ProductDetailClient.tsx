"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WhatsAppOrderModal } from "@/components/customer/WhatsAppOrderModal"
import { ProductCard } from "@/components/customer/ProductCard"
import { Check, Truck, Shield, Clock } from "lucide-react"

interface ProductVariant {
  id: string
  name: string
  finish?: string
  size?: string
  quantity: number
  price: string
  is_active: boolean
}

interface Product {
  id: string
  slug: string
  name: string
  description?: string
  short_desc?: string
  base_price: string
  price_note?: string
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

export function ProductDetailClient({
  product,
  waNumber,
  deliveryInfo,
  gstNote,
  relatedProducts,
  categorySlug,
  subcategorySlug,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.find((v) => v.is_active) || null
  )
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    product.variants?.find((v) => v.is_active)?.quantity || 100
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const images = product.images?.length ? product.images : [product.thumbnail_url].filter(Boolean)

  const uniqueFinishes = [...new Set(product.variants?.map((v) => v.finish).filter(Boolean) || [])]

  const handleFinishSelect = (finish: string) => {
    const variant = product.variants?.find((v) => v.finish === finish && v.is_active)
    if (variant) {
      setSelectedVariant(variant)
      setSelectedQuantity(variant.quantity)
    }
  }

  const handleQuantitySelect = (qty: number) => {
    setSelectedQuantity(qty)
    const variant = product.variants?.find((v) => v.quantity === qty && v.is_active)
    if (variant) {
      setSelectedVariant(variant)
    }
  }

  const currentVariant = selectedVariant || product.variants?.find((v) => v.is_active)
  const bestValueVariant = product.variants?.reduce((best, v) =>
    v.price && best.price && parseFloat(v.price) / v.quantity < parseFloat(best.price) / best.quantity ? v : best
  , product.variants[0])

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-xl overflow-hidden">
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
                      idx === selectedImage ? "border-amber" : "border-transparent hover:border-amber/30"
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
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1a1a2e]">
                {product.name}
              </h1>
              {product.short_desc && (
                <p className="text-muted-foreground mt-2">{product.short_desc}</p>
              )}
              <div className="flex items-center gap-4 mt-4">
                <span className="text-2xl font-bold text-[#1a1a2e]">
                  ₹{currentVariant?.price || product.base_price}
                </span>
                {product.price_note && (
                  <span className="text-muted-foreground">{product.price_note}</span>
                )}
              </div>
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
                            ? "border-amber bg-amber/10 text-amber"
                            : "border-border hover:border-amber/30"
                        }`}
                      >
                        {finish}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-3 block">Quantity</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[...new Set(product.variants.map((v) => v.quantity))].sort((a, b) => a - b).map((qty) => {
                    const variant = product.variants?.find((v) => v.quantity === qty && v.is_active)
                    const isBestValue = bestValueVariant?.quantity === qty
                    return (
                      <button
                        key={qty}
                        onClick={() => handleQuantitySelect(qty)}
                        className={`relative p-4 rounded-lg border text-left transition-colors ${
                          selectedQuantity === qty
                            ? "border-amber bg-amber/10"
                            : "border-border hover:border-amber/30"
                        }`}
                      >
                        <div className="font-semibold">{qty} pcs</div>
                        {variant && (
                          <div className="text-sm text-muted-foreground">₹{variant.price}</div>
                        )}
                        {isBestValue && (
                          <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                            Best Value
                          </Badge>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Pricing Table */}
            {product.variants && product.variants.length > 1 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Pricing Breakdown</h3>
                  <div className="space-y-2">
                    {[...new Map(product.variants.filter(v => v.is_active).map(v => [v.quantity, v])).values()]
                      .sort((a, b) => a.quantity - b.quantity)
                      .map((variant) => {
                        const unitPrice = (parseFloat(variant.price) / variant.quantity).toFixed(2)
                        const isBestValue = bestValueVariant?.quantity === variant.quantity
                        return (
                          <div
                            key={variant.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              selectedQuantity === variant.quantity ? "bg-amber/10" : "bg-muted/50"
                            }`}
                          >
                            <div>
                              <span className="font-medium">{variant.quantity} pcs</span>
                              {isBestValue && (
                                <Badge variant="outline" className="ml-2 text-green-600 border-green-600 text-xs">
                                  Best Value
                                </Badge>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-muted-foreground">₹{unitPrice}/pc</span>
                              <span className="font-semibold ml-3">₹{variant.price}</span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order CTA */}
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.789l5.044-1.383C7.561 23.178 9.654 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.487 0-4.807-.801-6.708-2.157l-.482-.334-2.544.696.713-2.46-.364-.542A9.74 9.74 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
              </svg>
              Order via WhatsApp
            </Button>

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

            <p className="text-xs text-muted-foreground">{gstNote}</p>
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
          id: currentVariant?.id || "",
          name: currentVariant?.name || `${selectedQuantity} pcs`,
          price: currentVariant?.price || product.base_price,
        }}
        quantity={selectedQuantity}
        waNumber={waNumber}
      />
    </div>
  )
}