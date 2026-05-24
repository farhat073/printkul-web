"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-3">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          We&apos;re sorry, an unexpected error occurred. Please try again or contact us on WhatsApp if the issue persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="bg-[var(--color-brand-slate)] hover:bg-[var(--color-brand-slate-light)]">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">Go to Homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
