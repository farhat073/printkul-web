import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Package } from "lucide-react"
import { mockCategories } from "@/lib/data/mock"

export const revalidate = 60

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("categories")
    .select("*, subcategories(*)")
    .eq("is_active", true)
    .order("sort_order")

  const categories = data?.length ? data : mockCategories

  return (
    <div className="min-h-screen bg-[#faf8f5] pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-[#1a1a2e] mb-4">All Categories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive collection of premium print products, tailored for your brand and business needs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="group block text-center p-8 rounded-2xl border border-black/5 hover:border-amber/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
            >
              <div className="w-20 h-20 mx-auto bg-[#faf8f5] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <Package className="w-10 h-10 text-[#1a1a2e] group-hover:text-amber transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-lg text-[#1a1a2e] mb-2 group-hover:text-amber transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {category.description || `Explore our high-quality ${category.name.toLowerCase()}.`}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
