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
      // Usar scrollIntoView con offset personalizado
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
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
            element.scrollIntoView({
              behavior: "smooth",
              block: "start"
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
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY
          setIsScrolled(scrollPosition > 50)

          // Solo detectar secciones activas si estamos en la página principal
          if (pathname === '/') {
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
          } else {
            // Limpiar activeSection si no estamos en la página principal
            setActiveSection("")
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

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
    { href: "/contacto", label: "Contacto", type: "link" },
  ]

  // Función para obtener el nombre de la sección activa
  const getActiveSectionName = () => {
    if (pathname !== '/') {
      // Para páginas específicas
      switch (pathname) {
        case '/tienda':
          return 'Tienda'
        case '/videos':
          return 'Videos'
        case '/contacto':
          return 'Contacto'
        case '/pastores':
          return 'Pastores'
        case '/instalaciones':
          return 'Instalaciones'
        case '/eventos':
          return 'Eventos'
        case '/novedades':
          return 'Novedades'
        case '/arte':
          return 'Arte'
        default:
          return 'Cristo la Solución'
      }
    }
    
    // Para secciones de la página principal
    const sectionNames: { [key: string]: string } = {
      'vision': 'Visión',
      'grupos': 'Grupos',
      'reuniones': 'Reuniones',
      'dar': 'Dar',
      'oracion': 'Oración',
      'contacto': 'Contacto'
    }
    
    return sectionNames[activeSection] || 'Cristo la Solución'
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 fixed-element transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-sm shadow-lg"
          : "bg-gray-900/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center h-20">
          {/* Logo - Solo visible en desktop */}
          <Link
            href="/"
            className="hidden lg:flex items-center transition-opacity duration-200 hover:opacity-80"
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
          
          {/* Espacio vacío en móvil para el botón hamburguesa */}
          <div className="lg:hidden w-10"></div>
          
          {/* Indicador de sección activa - Solo visible en móvil */}
          <div className="lg:hidden flex-1 flex justify-center items-center">
            <div className="relative">
              <span className="text-white font-medium text-lg">
                {getActiveSectionName()}
              </span>
              {/* Línea de color debajo del texto activo */}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
            </div>
          </div>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.type === "link" ? (
                  <Link
                    href={item.href}
                    className={`font-medium transition-colors duration-200 relative group text-white hover:text-gray-200`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                      isScrolled ? "bg-blue-600" : "bg-white"
                    } ${
                      pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
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
            className={`lg:hidden ml-auto p-3 rounded-lg transition-colors duration-200 z-50 relative ${
              isScrolled 
                ? "hover:bg-white/10" 
                : "hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center relative">
              <span
                className={`w-5 h-0.5 bg-white transition-all duration-300 absolute ${
                  isMobileMenuOpen ? "rotate-45" : "translate-y-[-4px]"
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-white transition-all duration-300 absolute ${
                  isMobileMenuOpen ? "-rotate-45" : "translate-y-[4px]"
                }`}
              />
            </div>
          </button>
        </nav>

        {/* Menú Móvil - Diseño limpio y minimalista */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="py-6 px-4 space-y-2 border-t border-white/10">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.type === "link" ? (
                  <Link
                    href={item.href}
                    className={`block px-6 py-4 text-center rounded-xl transition-all duration-200 ${
                      pathname === item.href
                        ? "bg-white/20 text-white font-semibold"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`block w-full px-6 py-4 text-center rounded-xl transition-all duration-200 ${
                      activeSection === item.href 
                        ? "bg-white/20 text-white font-semibold" 
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
            
            {/* Dropdown Nosotros Mobile - Simplificado */}
            <div>
              <button
                onClick={() => setIsMobileNosotrosOpen(!isMobileNosotrosOpen)}
                className="flex items-center justify-center w-full px-6 py-4 text-white/90 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200"
              >
                <span>Nosotros</span>
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isMobileNosotrosOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Submenu Mobile - Más limpio */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isMobileNosotrosOpen ? "max-h-32 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-2 px-4">
                  <Link
                    href="/pastores"
                    className="block px-6 py-3 text-center text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsMobileNosotrosOpen(false)
                    }}
                  >
                    Pastores
                  </Link>
                  <Link
                    href="/instalaciones"
                    className="block px-6 py-3 text-center text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200"
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
          </div>
        </div>
      </div>
    </header>
  )
}