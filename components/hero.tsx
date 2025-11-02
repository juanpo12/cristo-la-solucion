'use client'
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const images = [
    { src: "/DSC086721.jpg", alt: "Hero principal" },
    { src: "/libros pastor portada.jpg", alt: "Libro Prdsadomo" },
    { src: "/de corazon a corazon 2026 web.jpg", alt: "Corazón a Corazón" }
  ]

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000) // Cambia cada 5 segundos
    return () => clearInterval(interval)
  }, [])

  // Determinar si el slide actual debe ocultar el contenido
  const shouldHideContent = currentSlide === 1 || currentSlide === 2

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Carrusel de imágenes de fondo */}
      <div className="absolute inset-0 w-full h-full">
        {images.map((image, index) => (
          <Image
            key={index}
            width={1920}
            height={1080}
            src={image.src}
            alt={image.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ zIndex: -1 }}
            priority={index === 0}
            quality={100}
            unoptimized={false}
          />
        ))}
      </div>

      {/* Controles del carrusel */}
      <button
        onClick={prevSlide}
        className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Overlay con gradiente moderno - Solo visible en el primer slide */}
      <div className={`absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 transition-opacity duration-1000 ${
        shouldHideContent ? 'opacity-0' : 'opacity-100'
      }`} />

      {/* Contenido principal - Posicionado centro-derecha */}
      <div className={`relative z-10 w-full max-w-screen mx-auto px-4 sm:px-6 lg:px-12 transition-opacity duration-1000 ${
        shouldHideContent ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="grid grid-cols-12 gap-4 items-center min-h-screen">
          {/* Espacio vacío a la izquierda */}
          <div className="hidden md:block md:col-span-1 lg:col-span-1"></div>
          
          {/* Contenido del texto */}
          <div className="col-span-12 md:col-span-8 lg:col-span-7">
            <div className="text-center md:text-left text-white space-y-6 md:space-y-8 max-w-2xl pt-16 md:pt-0 pb-32 md:pb-0">
              {/* Título principal con Poppins */}
              <div className="space-y-3 md:space-y-4">
                <h1 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-poppins font-light tracking-tight leading-tight"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <span className="block font-poppins">Una familia para vos</span>
                </h1>
                <div className="flex justify-center md:justify-center mt-3 md:mt-4 w-full md:w-3/4">
                  <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto md:mx-0 rounded-full" />
                </div>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-white/90 leading-relaxed px-4 md:px-0">
                  Una comunidad donde cada persona encuentra su propósito y 
                  <span className="font-medium text-white"> crece espiritualmente</span>
                </p>
              </div>

              {/* Botones mejorados */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start items-center pt-3 md:pt-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-gray-900 hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                >
                  <Link href="/contacto">
                    Únete a nosotros
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("vision")}
                  className="bg-white text-gray-900 hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                >
                  Conoce más
                  <ArrowRight className="w-4 md:w-5 h-4 md:h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll - Oculto en móvil para evitar superposición */}
      <div className={`hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce transition-opacity duration-1000 ${
        shouldHideContent ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}