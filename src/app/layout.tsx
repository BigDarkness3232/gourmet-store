import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import SessionWrapper from "@/components/layout/SessionWrapper"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default:  "GourmetStore — Productos Gourmet Artesanales",
    template: "%s — GourmetStore",
  },
  description: "Descubre nuestra selección de productos gourmet artesanales. Aceites, conservas, quesos, embutidos y más.",
  keywords:    ["gourmet", "artesanal", "aceites", "conservas", "quesos", "chile"],
  openGraph: {
    title:       "GourmetStore — Productos Gourmet Artesanales",
    description: "Descubre nuestra selección de productos gourmet artesanales.",
    locale:      "es_CL",
    type:        "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <SessionWrapper>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}