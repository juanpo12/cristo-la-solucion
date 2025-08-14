"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

export function Header() {
  const [activeSection, setActiveSection] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNosotrosOpen, setIsNosotrosOpen] = useState(false)
  const [isMobileNosotrosOpen, setIsMobileNosotrosOpen] = useState(false)
  const nosotrosRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Función para scroll suave con offset personalizado
  const scrollToSection = (sectionId: string) => {
    // Si no estamos en la página principal, redirigir primero
    if (pathname !== '/') {
      router.push(`/#${sectionId}`)
      setIsMobileMenuOpen(false)
      return
    }

    // Si estamos en la página principal, hacer scroll normal
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

  // Manejar scroll cuando se llega desde otra página con hash
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && pathname === '/') {
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            const headerHeight = 80
            const elementPosition = element.offsetTop - headerHeight
            window.scrollTo({
              top: elementPosition,
              behavior: "smooth",
            })
          }
        }, 100) // Pequeño delay para asegurar que la página se haya cargado
      }
    }

    // Ejecutar al cargar la página
    handleHashScroll()

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleHashScroll)
    return () => window.removeEventListener('hashchange', handleHashScroll)
  }, [pathname])

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

  // Cerrar dropdown "Nosotros" cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nosotrosRef.current && !nosotrosRef.current.contains(event.target as Node)) {
        setIsNosotrosOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navItems = [
    { href: "vision", label: "Visión", type: "scroll" },
    { href: "grupos", label: "Grupos", type: "scroll" },
    { href: "reuniones", label: "Reuniones", type: "scroll" },
    { href: "/tienda", label: "Tienda", type: "link" },
    { href: "/videos", label: "Videos", type: "link" },
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
            
            {/* Dropdown Nosotros */}
            <div className="relative" ref={nosotrosRef}>
              <button
                onClick={() => setIsNosotrosOpen(!isNosotrosOpen)}
                className="font-medium transition-colors duration-200 relative group text-white hover:text-gray-200 flex items-center space-x-1"
              >
                <span>Nosotros</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isNosotrosOpen ? 'rotate-180' : ''}`} />
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-white`} />
              </button>
              
              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 ${
                  isNosotrosOpen 
                    ? 'opacity-100 visible transform translate-y-0' 
                    : 'opacity-0 invisible transform -translate-y-2'
                }`}
              >
                <div className="py-2">
                  <Link
                    href="/pastores"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => setIsNosotrosOpen(false)}
                  >
                    Pastores
                  </Link>
                  <Link
                    href="/instalaciones"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                    onClick={() => setIsNosotrosOpen(false)}
                  >
                    Instalaciones
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden lg:block">
            <Link
              href="/contacto"
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 inline-block ${
                isScrolled 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              Contáctanos
            </Link>
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
                  isScrolled ? "bg-white" : "bg-white"
                } ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 transition-all duration-300 mt-1 ${
                  isScrolled ? "bg-white" : "bg-white"
                } ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 transition-all duration-300 mt-1 ${
                  isScrolled ? "bg-white" : "bg-white"
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
                    className="block px-4 py-3 text-white hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
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
                        : "text-white hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            
            {/* Dropdown Nosotros Mobile */}
            <div>
              <button
                onClick={() => setIsMobileNosotrosOpen(!isMobileNosotrosOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-white hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <span>Nosotros</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileNosotrosOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Submenu Mobile */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isMobileNosotrosOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-4 space-y-1">
                  <Link
                    href="/pastores"
                    className="block px-4 py-2 text-white hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsMobileNosotrosOpen(false)
                    }}
                  >
                    Pastores
                  </Link>
                  <Link
                    href="/instalaciones"
                    className="block px-4 py-2 text-white hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsMobileNosotrosOpen(false)
                    }}
                  >
                    Instalaciones
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Botón CTA en móvil */}
            <div className="px-4 pt-4">
              <Link
                href="/contacto"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 block text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}