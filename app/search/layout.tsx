import { Suspense } from "react"
import type { Metadata } from "next"
import SearchContent from "./page"

export const metadata: Metadata = {
  title: "Search Results | Printkul",
  description: "Search for custom print products on Printkul.",
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
