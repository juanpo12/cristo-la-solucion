import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="church-gradient text-white py-52 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-church-electric-500/30 to-church-navy-900/50"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
            BIENVENIDOS
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed max-w-3xl mx-auto">
            Una comunidad donde cada persona puede encontrar su propósito y crecer en fe
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-in">
            <Button
              size="lg"
              className="church-button-primary px-8 py-4 text-lg font-semibold transform hover:scale-105"
            >
              Únete a nosotros
            </Button>
            <Button
              size="lg"
              className="church-button-secondary px-8 py-4 text-lg font-semibold transform hover:scale-105"
            >
              Conoce más
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
