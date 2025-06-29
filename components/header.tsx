"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function Header() {
  const [activeSection, setActiveSection] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)

  // Función para scroll suave con offset personalizado
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80
      const elementPosition = element.offsetTop - headerHeight

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }

  // Detectar scroll y sección activa
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)

      const sections = ["vision", "grupos", "reuniones", "dar", "oracion", "contacto"]
      const currentScrollPosition = scrollPosition + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (currentScrollPosition >= offsetTop && currentScrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "vision", label: "Visión" },
    { href: "grupos", label: "Grupos" },
    { href: "reuniones", label: "Reuniones" },
    { href: "dar", label: "Dar" },
    { href: "oracion", label: "Oración" },
    { href: "contacto", label: "Contacto" },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-gray-900/90 backdrop-blur-xl shadow-2xl border-b border-gray-700/50"
          : "bg-gradient-to-r from-gray-800/80 via-gray-900/70 to-gray-800/80 backdrop-blur-lg"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:brightness-110"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="relative h-12 w-48 drop-shadow-lg">
              <Image
                src="/logo-cls.png"
                alt="Ministerio Cristo la Solución"
                fill
                className="object-contain filter brightness-100"
                priority
              />
            </div>
          </div>

          {/* Navegación */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`relative text-gray-300 hover:text-white transition-all duration-300 font-medium py-2 px-3 group ${
                  activeSection === item.href ? "text-white" : ""
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-church-electric-400 to-church-electric-500 transform origin-left transition-transform duration-300 shadow-lg ${
                    activeSection === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
                {/* Efecto de brillo en hover */}
                <span className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
              </button>
            ))}
          </div>

          {/* Botón CTA */}
          <div className="hidden md:block">
            {/* <button
              onClick={() => scrollToSection("contacto")}
              className="bg-gradient-to-r from-church-electric-500 to-church-electric-600 hover:from-church-electric-600 hover:to-church-electric-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-church-electric-400/30"
            >
              Contáctanos
            </button> */}
          </div>

          {/* Menú móvil (hamburger) */}
          <div className="lg:hidden">
            <button className="p-2 text-gray-300 hover:text-white transition-colors hover:bg-white/10 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
