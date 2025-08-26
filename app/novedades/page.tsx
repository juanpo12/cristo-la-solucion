import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Star, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NovedadesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header con imagen de fondo */}
      <div className="relative h-[60vh] overflow-hidden -mt-20">
        <Image
          src="/CONFE.jpg"
          alt="Novedades Cristo La Solución"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/40 to-red-600/80" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <div className="flex justify-center mb-6">
              <Zap className="w-16 h-16 text-white drop-shadow-lg animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              🔥 EVENTOS 🔥
            </h1>
            <p className="text-xl md:text-2xl opacity-90 drop-shadow-md">
              ¡Descubre los eventos especiales y actividades programadas!
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Inicio</span>
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Novedades destacadas */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Novedad 1 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <Star className="w-6 h-6 text-orange-600 mr-2" />
                <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                  Nuevo
                </span>
              </div>
              <h3 className="text-2xl font-bold church-text mb-3">
                Laboratorio de Arte Inaugurado
              </h3>
              <p className="church-text-muted mb-4">
                ¡Ya está abierto nuestro nuevo espacio para canto, dibujo, teatro y danza! 
                Actividades para toda la familia.
              </p>
              <div className="flex items-center text-sm church-text-muted mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Enero 2025</span>
              </div>
              <Link href="/arte">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Conocer más
                </Button>
              </Link>
            </div>

            {/* Novedad 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <Star className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                  Actualizado
                </span>
              </div>
              <h3 className="text-2xl font-bold church-text mb-3">
                Nueva Tienda Online
              </h3>
              <p className="church-text-muted mb-4">
                Renovamos completamente nuestra tienda online con nuevos libros 
                y recursos espirituales del Pastor Alfredo.
              </p>
              <div className="flex items-center text-sm church-text-muted mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Diciembre 2024</span>
              </div>
              <Link href="/tienda">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Visitar tienda
                </Button>
              </Link>
            </div>

            {/* Novedad 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <Star className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                  Próximamente
                </span>
              </div>
              <h3 className="text-2xl font-bold church-text mb-3">
                Nuevos Grupos de Estudio
              </h3>
              <p className="church-text-muted mb-4">
                Se están formando nuevos grupos de estudio bíblico para diferentes 
                edades y niveles de conocimiento.
              </p>
              <div className="flex items-center text-sm church-text-muted mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Febrero 2025</span>
              </div>
              <Link href="/grupos">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Más información
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}