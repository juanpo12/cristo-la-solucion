import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Poppins } from 'next/font/google'
import { LayoutWrapper } from "@/components/layout-wrapper"
import { QueryProvider } from "@/components/providers/query-provider"

const inter = Inter({ subsets: ["latin"] })

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "Cristo la solución",
  description: "Una familia para vos. Iglesia Cristo la Solución.",
  icons: {
    icon: "/logo-cls.png",
    shortcut: "/logo-cls.png",
    apple: "/logo-cls.png",
  },
  openGraph: {
    title: "Cristo la solución",
    description: "Una familia para vos. Iglesia Cristo la Solución.",
    url: "https://www.cristolasolucionsj.com",
    siteName: "Cristo la Solución",
    images: [
      {
        url: "/logo-cls.png",
        width: 800,
        height: 600,
        alt: "Logo Cristo la Solución",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${poppins.variable}`}>
        <QueryProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </QueryProvider>
      </body>
    </html>
  )
}
