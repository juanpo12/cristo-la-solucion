'use client'

import { usePathname } from 'next/navigation'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')
  
  if (isAdminRoute) {
    return <>{children}</>
  }

  // Para rutas normales, incluir Header y Footer
  return (
    <>
      <Header />
      <main className="pt-20 relative">
        {children}
      </main>
      <Footer />
    </>
  )
}