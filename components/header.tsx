"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export function Header() {
  const [activeSection, setActiveSection] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    // Cerrar menú móvil después de hacer scroll
    setIsMobileMenuOpen(false)
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

  // Cerrar menú móvil cuando se redimensiona la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navItems = [
    { href: "vision", label: "Visión", type: "scroll" },
    { href: "grupos", label: "Grupos", type: "scroll" },
    { href: "reuniones", label: "Reuniones", type: "scroll" },
    { href: "/tienda", label: "Tienda", type: "link" },
    { href: "dar", label: "Dar", type: "scroll" },
    { href: "oracion", label: "Oración", type: "scroll" },
    { href: "contacto", label: "Contacto", type: "scroll" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

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
          <Link
            href="/"
            className="flex items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:brightness-110"
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
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.type === "link" ? (
                  <Link
                    href={item.href}
                    className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium py-2 px-3 group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-church-electric-400 to-church-electric-500 transform origin-left transition-transform duration-300 shadow-lg scale-x-0 group-hover:scale-x-100" />
                    <span className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
                  </Link>
                ) : (
                  <button
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
                    <span className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Botón CTA */}
          <div className="hidden md:block lg:block">
            {/* <button
              onClick={() => scrollToSection("contacto")}
              className="bg-gradient-to-r from-church-electric-500 to-church-electric-600 hover:from-church-electric-600 hover:to-church-electric-700 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-church-electric-400/30"
            >
              Contáctanos
            </button> */}
          </div>

          {/* Botón Hamburguesa */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="relative w-8 h-8 flex flex-col justify-center items-center group"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 group-hover:bg-white ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 group-hover:bg-white mt-1 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 group-hover:bg-white mt-1 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
          </div>
        </nav>

        {/* Menú Móvil */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-full opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="py-4 space-y-2 border-t border-gray-700/50">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.type === "link" ? (
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 rounded-lg mx-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300 rounded-lg mx-2 ${
                      activeSection === item.href ? "text-white bg-gray-800/30" : ""
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            
            {/* Botón CTA en móvil */}
            <div className="px-2 pt-4">
              <button
                onClick={() => scrollToSection("contacto")}
                className="w-full bg-gradient-to-r from-church-electric-500 to-church-electric-600 hover:from-church-electric-600 hover:to-church-electric-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg"
              >
                Contáctanos
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}