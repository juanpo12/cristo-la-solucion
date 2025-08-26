import { Button } from "@/components/ui/button";
import { ArrowLeft, Palette, Music, Theater, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ArtePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header con imagen de fondo */}
      <div className="relative h-[60vh] overflow-hidden -mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-church-electric-500 to-church-navy-600" />
        <div className="absolute inset-0 bg-black/20" />

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
        <div className="max-w-4xl mx-auto">
          {/* Descripción principal */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold church-text mb-8">
              ¿Qué es el Laboratorio de Arte?
            </h2>
            <p className="text-xl church-text-muted leading-relaxed max-w-3xl mx-auto">
              El laboratorio de arte pretende ser un espacio en donde las personas puedan 
              aprender y disfrutar de actividades como canto, dibujo, teatro y danza. 
              <strong className="church-text"> ¡Para todas las edades! ¡Vení con tu familia!</strong>
            </p>
          </div>

          {/* Actividades */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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

          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-church-electric-500 to-church-navy-600 rounded-2xl p-12 text-white">
            <h3 className="text-4xl font-bold mb-4">¡Únete a Nosotros!</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              No importa tu edad o nivel de experiencia. Ven y descubre tu talento artístico en un ambiente familiar y acogedor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-church-electric-600 hover:bg-gray-100 px-8 py-4 text-lg"
              >
                Más Información
              </Button>
              <Link href="/contacto">
                <Button
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-church-electric-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  Contáctanos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}