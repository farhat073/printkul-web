import { createClient } from "@/lib/supabase/server"
import { HomePageClient } from "./HomePageClient"
import { mockCategories, mockProducts, mockBanners, mockDeals } from "@/lib/data/mock"

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

  // If the user hasn't set up the DB, fallback to mock data so the UI is visible
  const categories = categoriesData.data?.length ? categoriesData.data : mockCategories
  const featuredProducts = productsData.data?.length ? productsData.data : mockProducts
  const banners = bannersData.data?.length ? bannersData.data : mockBanners
  const deals = dealsData.data?.length ? dealsData.data : mockDeals

  return (
    <HomePageClient
      categories={categories as any}
      featuredProducts={featuredProducts as any}
      banners={banners as any}
      deals={deals as any}
    />
  )
}