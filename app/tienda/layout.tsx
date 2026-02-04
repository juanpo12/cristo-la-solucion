import { Cart } from "@/components/cart"
import { CartProvider } from "@/lib/hooks/use-cart"
import type React from "react"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tienda Ministerial | Cristo la Solución",
  description: "Recursos espirituales, libros y merchandising para tu crecimiento.",
}
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
