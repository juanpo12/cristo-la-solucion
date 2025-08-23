import { Cart } from "@/components/cart"
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
        {children}
        <Cart />
      </div>
    </CartProvider>
  )
}
