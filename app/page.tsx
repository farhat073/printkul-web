import { createClient } from "@/lib/supabase/server"
import { HomePageClient } from "./HomePageClient"

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const [categoriesData, productsData, bannersData, dealsData] = await Promise.all([
    supabase
      .from("categories")
      .select("*, subcategories(*)")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("products")
      .select("*, subcategory:subcategories(*, category:categories(slug))")
      .eq("is_active", true)
      .eq("is_featured", true),
    supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .eq("position", "home_hero")
      .order("sort_order"),
    supabase
      .from("deals")
      .select("*, product:products(*, subcategory:subcategories(*, category:categories(slug)))")
      .eq("is_active", true)
      .lte("starts_at", new Date().toISOString())
      .gte("ends_at", new Date().toISOString())
      .order("sort_order"),
  ])

  const categories = categoriesData.data || []
  const featuredProducts = productsData.data || []
  const banners = bannersData.data || []
  const deals = dealsData.data || []

  return (
    <HomePageClient
      categories={categories as any}
      featuredProducts={featuredProducts as any}
      banners={banners as any}
      deals={deals as any}
    />
  )
}