import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/customer/FloatingWhatsApp";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Printkul — Kashmir's First Online Digital Printing Store",
    template: "%s | Printkul",
  },
  description: "Printkul is a modern online printing service by Mintleaf Design & Print (est. 2016). Order custom business cards, flyers, brochures, banners & marketing materials online. Fast delivery across India.",
  keywords: ["custom printing", "visiting cards", "banners", "flyers", "brochures", "Kashmir printing", "online print shop", "Mintleaf Design", "Anantnag", "Srinagar", "Jammu"],
  authors: [{ name: "Printkul — Mintleaf Design & Print" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://printkul.in",
    siteName: "Printkul",
    title: "Printkul — Kashmir's First Online Digital Printing Store",
    description: "High-quality, reliable, and affordable online print solutions. Order via WhatsApp. Fast delivery across India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Printkul — easy printing solutions",
    description: "Kashmir's First Online Digital Printing Store. Custom business cards, flyers, brochures, banners & more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}