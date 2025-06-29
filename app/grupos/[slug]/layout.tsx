import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import type React from "react"

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
