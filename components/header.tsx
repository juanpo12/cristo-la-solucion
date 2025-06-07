"use client"
import { useState, useEffect } from "react"
import { Logo } from "./logocls"

export function Header() {
  const [activeSection, setActiveSection] = useState("")

  // Función para scroll suave con offset personalizado
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80 // Altura aproximada del header
      const elementPosition = element.offsetTop - headerHeight

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }

  // Detectar sección activa durante el scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["vision", "grupos", "reuniones", "dar", "oracion", "contacto"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
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
    { href: "vision", label: "VISIÓN" },
    { href: "grupos", label: "GRUPOS" },
    { href: "reuniones", label: "REUNIONES" },
    { href: "oracion", label: "ORACIÓN" },
    { href: "dar", label: "DAR" },
    // { href: "contacto", label: "CONTACTO" },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-200 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
              <Logo/>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`relative church-text-muted hover:text-church-electric-600 transition-all duration-300 font-semibold text-sm uppercase tracking-wide py-2 px-1 group ${
                  activeSection === item.href ? "text-church-electric-600" : ""
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-church-electric-500 to-church-electric-600 transform origin-left transition-transform duration-300 ${
                    activeSection === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
