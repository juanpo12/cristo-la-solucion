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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/80 backdrop-blur-md"
          : "bg-gray-900/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-opacity duration-200 hover:opacity-80"
          >
            <div className="relative h-10 w-44">
              <Image
                src="/logo-cls.png"
                alt="Ministerio Cristo la Solución"
                fill
                className="object-contain"
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
                    className={`font-medium transition-colors duration-200 relative group text-white hover:text-gray-200"`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-white`} />
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`font-medium transition-colors duration-200 relative group ${
                      activeSection === item.href 
                        ? (isScrolled ? "text-white" : "text-white") 
                        : (isScrolled ? "text-white hover:text-gray-200" : "text-white hover:text-gray-200")
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                        isScrolled ? "bg-blue-600" : "bg-white"
                      } ${
                        activeSection === item.href ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden lg:block">
            <button
              onClick={() => scrollToSection("contacto")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isScrolled 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              Contáctanos
            </button>
          </div>

          {/* Botón Hamburguesa */}
          <button
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
              isScrolled 
                ? "hover:bg-white/10" 
                : "hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`w-5 h-0.5 transition-all duration-300 ${
                  isScrolled ? "bg-gray-700" : "bg-white"
                } ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 transition-all duration-300 mt-1 ${
                  isScrolled ? "bg-gray-700" : "bg-white"
                } ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 transition-all duration-300 mt-1 ${
                  isScrolled ? "bg-gray-700" : "bg-white"
                } ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              />
            </div>
          </button>
        </nav>

        {/* Menú Móvil */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="py-4 space-y-1 border-t border-gray-200">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.type === "link" ? (
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`block w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeSection === item.href 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            
            {/* Botón CTA en móvil */}
            <div className="px-4 pt-4">
              <button
                onClick={() => scrollToSection("contacto")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
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