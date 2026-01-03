import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, BookOpen, Coffee, MapPin, Building } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function InstalacionesPage() {
  const instalaciones = [
    {
      id: "libreria",
      title: "LIBRERÍA",
      description: "En librería se pueden adquirir los libros de nuestro pastor y también artículos para regalar.",
      icon: BookOpen,
      image: "/libreria1.jpg",
      // color: "from-blue-500 to-blue-600"
    },
    {
      id: "cafeteria",
      title: "CAFETERÍA",
      description: "Espacio abierto al público para que las personas puedan compartir, antes o después, de nuestras reuniones.",
      icon: Coffee,
      image: "/cafeteria1.jpg",
      // color: "from-amber-500/40 to-orange-600/40"
    },
    {
      id: "auditorio",
      title: "AUDITORIO",
      description: "Estamos ubicados en Juan Manuel de Rosas 4357, San Justo, Buenos Aires.",
      icon: Building,
      image: "/Banner transimision-instalaciones.jpg",
      // color: "from-purple-500 to-purple-600"
    }
  ]

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Header */}
      <div className="relative h-[50vh] overflow-hidden -mt-20">
        <Image 
          src="/color2.jpg" 
          alt="Instalaciones Cristo La Solución" 
          fill 
          className="object-cover" 
          priority 
        />
        
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">INSTALACIONES</h1>
            <p className="text-xl md:text-2xl opacity-90 drop-shadow-md">
              Nuestros espacios diseñados para servir a la comunidad
            </p>
          </div>
        </div>

      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {instalaciones.map((instalacion) => (
            <Card
              key={instalacion.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white"
            >
              <div className="relative h-64">
                <Image
                  src={instalacion.image}
                  alt={instalacion.title}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t opacity-60`} />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 left-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                    <instalacion.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold church-text mb-4">{instalacion.title}</h3>
                <p className="church-text-muted leading-relaxed text-lg">
                  {instalacion.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ubicación */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold church-text mb-4">NUESTRA UBICACIÓN</h2>
            <div className="flex items-center justify-center space-x-2 text-church-text-muted">
              <MapPin className="w-5 h-5" />
              <span className="text-xl">Juan Manuel de Rosas 4357, San Justo, Buenos Aires</span>
            </div>
          </div>
          
          {/* Google Maps */}
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.7526004077745!2d-58.56511212445445!3d-34.68619297292483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc623af501339%3A0xc605a8a195d8ce69!2sAv.%20Brig.%20Gral.%20Juan%20Manuel%20de%20Rosas%204357%2C%20B1754FVB%20San%20Justo%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1757106329998!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Cristo La Solución"
            />
          </div>
        </div>

      </div>
    </div>
  )
}