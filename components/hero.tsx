import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/hero.jpg')`,
          backgroundPosition: "center center",
        }}
      />

      {/* Overlay minimalista */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido principal */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center text-white max-w-4xl mx-auto space-y-12">
            {/* Título principal */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-light tracking-wide">
                <span className="block">CRISTO</span>
                <span className="block font-normal">LA SOLUCIÓN</span>
              </h1>

              <p className="text-xl md:text-2xl font-light text-white/90 max-w-2xl mx-auto leading-relaxed">
                Una comunidad donde cada persona encuentra su propósito
              </p>
            </div>

            {/* Botones simples */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-normal shadow-none border-0"
              >
                Únete a nosotros
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10 px-8 py-4 text-lg font-normal border border-white/30"
              >
                Conoce más
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Información mínima */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
        <div className="text-center text-white/70">
          <p className="text-sm font-light">Domingos 11:00 y 18:00</p>
        </div>
      </div>
    </section>
  )
}
