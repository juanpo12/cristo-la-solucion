import { Cart } from "@/components/cart"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { CartProvider } from "@/lib/hooks/use-cart"
import type React from "react"


export default function TiendaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <Header />
        {children}
        <Cart />
        <Footer />
      </div>
    </CartProvider>
  )
}
