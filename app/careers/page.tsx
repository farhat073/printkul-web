import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Careers | Printkul",
  description: "Join the Printkul team. Explore career opportunities in printing, design, and customer service.",
}

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-brand-slate text-white py-10 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Careers at Printkul</h1>
          <p className="text-white/70 mt-3 max-w-2xl mx-auto">Join our growing team and help us deliver quality printing solutions across India.</p>
        </div>
      </section>
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="bg-brand-gray rounded-2xl border border-border p-8 md:p-12">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="font-heading text-2xl font-bold text-brand-slate mb-4">We&apos;re Growing!</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              We&apos;re always looking for talented individuals who are passionate about design, printing, and customer excellence. While we don&apos;t have specific openings listed right now, we&apos;d love to hear from you.
            </p>
            <a
              href="mailto:info@printkul.in?subject=Career%20Inquiry%20at%20Printkul"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-slate text-white rounded-xl hover:bg-brand-slate-light transition-colors font-bold"
            >
              Send Your Resume
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              Email your resume to <span className="font-semibold">info@printkul.in</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
