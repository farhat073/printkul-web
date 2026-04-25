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
    default: "Printkul — Custom Print Products for Every Business",
    template: "%s | Printkul",
  },
  description: "Order custom print products — visiting cards, banners, flyers, stationery and more — via WhatsApp. Fast delivery across India.",
  keywords: ["custom printing", "visiting cards", "banners", "flyers", "India print", "WhatsApp ordering"],
  authors: [{ name: "Printkul" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://printkul.in",
    siteName: "Printkul",
    title: "Printkul — Custom Print Products for Every Business",
    description: "Order custom print products via WhatsApp. Fast delivery across India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Printkul — Custom Print Products",
    description: "Order custom print products via WhatsApp. Fast delivery across India.",
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