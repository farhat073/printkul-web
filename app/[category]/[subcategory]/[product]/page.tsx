import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ProductDetailClient } from "./ProductDetailClient"
import { ChevronRight } from "lucide-react"

export const revalidate = 300

interface ProductPageProps {
  params: Promise<{ category: string; subcategory: string; product: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { category, subcategory, product: productSlug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("name, seo_title, seo_desc, short_desc, base_price")
    .eq("slug", productSlug)
    .single()

  if (!product) return { title: "Product Not Found" }

  return {
    title: product.seo_title || `${product.name} | Printkul`,
    description: product.seo_desc || `${product.short_desc} Starting at ₹${product.base_price}. Order via WhatsApp — fast delivery across India.`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, subcategory, product: productSlug } = await params
  const supabase = await createClient()

  // Fetch product with separate queries instead of nested joins (RLS-friendly)
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("slug", productSlug)
    .eq("is_active", true)
    .single()

  if (!product || productError) notFound()

  // Fetch variants
  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id)

  // Fetch subcategory
  const { data: subcat } = await supabase
    .from("subcategories")
    .select("*, category:categories(slug, name)")
    .eq("id", product.subcategory_id)
    .single()

  // Build product with relations
  const fullProduct = { ...product, variants: variants || [], subcategory: subcat }

  const { data: siteContentArr } = await supabase
    .from("site_content")
    .select("key, value")
    .in("key", ["whatsapp_number", "delivery_info", "gst_note"])

  const siteContent = siteContentArr || []
  const waNumber = siteContent.find((s: any) => s.key === "whatsapp_number")?.value || "919876543210"
  const deliveryInfo = siteContent.find((s: any) => s.key === "delivery_info")?.value || "7–14 business days, pan-India delivery"
  const gstNote = siteContent.find((s: any) => s.key === "gst_note")?.value || "Prices shown are indicative and exclude GST."

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*, subcategory:subcategories(*)")
    .eq("subcategory_id", product.subcategory_id)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(4)

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b border-border py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-amber">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${category}`} className="hover:text-amber">{fullProduct.subcategory?.category?.name || category}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${category}/${subcategory}`} className="hover:text-amber">{fullProduct.subcategory?.name || subcategory}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{fullProduct.name}</span>
          </nav>
        </div>
      </div>

      <ProductDetailClient
        product={fullProduct}
        waNumber={waNumber}
        deliveryInfo={deliveryInfo}
        gstNote={gstNote}
        relatedProducts={relatedProducts || []}
        categorySlug={category}
        subcategorySlug={subcategory}
      />
    </div>
  )
}