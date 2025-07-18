'use client'
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Clock } from "lucide-react"

export function Hero() {
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/frente.jpg')`,
          backgroundPosition: "center center",
        }}
      />

      {/* Overlay con gradiente moderno */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white space-y-8">
          {/* Título principal con Poppins */}
          <div className="space-y-4">
            <h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-poppins font-light tracking-tight leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="block font-poppins">CRISTO</span>
              <span className="block font-poppins bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                LA SOLUCIÓN
              </span>
            </h1>

            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full" />

            <p className="text-lg sm:text-xl md:text-2xl font-light text-white/90 max-w-3xl mx-auto leading-relaxed">
              Una comunidad donde cada persona encuentra su propósito y 
              <span className="font-medium text-white"> crece espiritualmente</span>
            </p>
          </div>

          {/* Botones mejorados */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={() => scrollToSection("contacto")}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Únete a nosotros
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("vision")}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Conoce más
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Información de horarios mejorada */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
          <div className="flex items-center justify-center space-x-6 text-white">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Domingos 11:00 y 18:00</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Presencial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}