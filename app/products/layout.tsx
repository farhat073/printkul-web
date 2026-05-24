import { Suspense } from "react"
import type { Metadata } from "next"
import ProductsContent from "./page"

export const metadata: Metadata = {
  title: "All Products | Printkul",
  description: "Browse our complete range of custom print products, from visiting cards to marketing materials.",
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
