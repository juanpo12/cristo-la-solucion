import { ArrowLeft, Palette, Music, Theater, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ArtePage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header con imagen de fondo */}
      <div className="relative h-[60vh] overflow-hidden -mt-20">
          <Image
            src="/color2.jpg"
            alt="Laboratorio de Arte Cristo La Solución"
            fill
            className="absolute inset-0 w-full h-full object-cover brightness-50"
            priority
          />

        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <div className="flex justify-center mb-6">
              <Palette className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              LABORATORIO DE ARTE
            </h1>
            <p className="text-xl md:text-2xl opacity-90 drop-shadow-md">
              Un espacio para crear, aprender y disfrutar
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Descripción principal */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold church-text mb-8">
              ¿Qué es el Laboratorio de Arte?
            </h2>
            <p className="text-xl church-text-muted leading-relaxed max-w-3xl mx-auto">
              Canto, dibujo, teatro y danza para toda la familia.
              <br />
              <strong className="church-text">Un espacio para aprender, crear y disfrutar.</strong>
            </p>
          </div>

          {/* Actividades */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-church-electric-50 to-white border border-church-electric-100">
              <Music className="w-12 h-12 text-church-electric-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold church-text mb-2">Canto</h3>
              <p className="church-text-muted">
                Desarrolla tu voz y aprende técnicas vocales
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-church-navy-50 to-white border border-church-navy-100">
              <Palette className="w-12 h-12 text-church-navy-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold church-text mb-2">Dibujo</h3>
              <p className="church-text-muted">
                Expresa tu creatividad a través del arte visual
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-church-vibrant-50 to-white border border-church-vibrant-100">
              <Theater className="w-12 h-12 text-church-vibrant-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold church-text mb-2">Teatro</h3>
              <p className="church-text-muted">
                Descubre el arte de la actuación y expresión
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-b from-purple-50 to-white border border-purple-100">
              <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold church-text mb-2">Danza</h3>
              <p className="church-text-muted">
                Expresa tu fe a través del movimiento y la danza
              </p>
            </div>

          </div>
      </div>
      </div>
    </div>
  );
}