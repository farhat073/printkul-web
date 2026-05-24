import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray">
      <div className="text-center">
        <div className="text-8xl font-bold text-[#e8e4dc] mb-4">404</div>
        <h1 className="font-heading text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-[var(--color-brand-slate)] hover:bg-[var(--color-brand-slate-light)]">
              Go to Homepage
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}