import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Package } from "lucide-react"


export const revalidate = 60

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from("categories")
    .select("*, subcategories(*)")
    .eq("is_active", true)
    .order("sort_order")

  const categories = data || []

  return (
    <div className="min-h-screen bg-brand-gray pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-[var(--color-brand-slate)] mb-4">All Categories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive collection of premium print products, tailored for your brand and business needs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="group block text-center p-8 rounded border border-black/5 hover:border-brand-blue/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-brand-gray"
            >
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm overflow-hidden bg-brand-gray">
                <img
                  src={`/categories/${category.slug}.png`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e: any) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg class="w-10 h-10 text-brand-slate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>' }}
                />
              </div>
              <h3 className="font-semibold text-lg text-[var(--color-brand-slate)] mb-2 group-hover:text-brand-slate transition-colors">
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
