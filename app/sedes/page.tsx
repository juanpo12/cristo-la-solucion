import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SedesPage() {
  const sedes = [
    {
      id: "lomas-zamora",
      title: "LOMAS DE ZAMORA",
      direccion: "Laprida 780",
      horarios: [
        "Martes 19:00 HS",
        "Miércoles 10:00 HS",
        "Sábado Invictos Teens 18:00 HS",
        "Sábado Invictos 20:00 HS",
        "Domingo 10:00 HS"
      ],
      color: "from-blue-500 to-blue-600",
      image: "/sedesv2.jpg"
    },
    {
      id: "canuelas",
      title: "CAÑUELAS",
      direccion: "12 de octubre 455",
      horarios: [
        "Miércoles 19:00 HS",
        "Viernes Invictos 19:30 HS",
        "Domingo 10:00 HS"
      ],
      color: "from-green-500 to-emerald-600",
      image: "/SEDES.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative h-[50vh] overflow-hidden -mt-20">
        <Image 
          src="/sedesv2.jpg" 
          alt="Sedes Cristo La Solución" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-church-electric-600/80 to-church-navy-600/80" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <MapPin className="w-16 h-16 mx-auto mb-6 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">NUESTRAS SEDES</h1>
            <p className="text-xl md:text-2xl opacity-90 drop-shadow-md">
              Encuentra la sede más cercana a ti
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al inicio</span>
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {sedes.map((sede) => (
            <Card
              key={sede.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white"
            >
              <div className="relative h-48">
                <Image
                  src={sede.image}
                  alt={sede.title}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${sede.color} opacity-60`} />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 left-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <CardTitle className="church-text text-2xl font-bold mb-2">
                  {sede.title}
                </CardTitle>
                <div className="flex items-center space-x-2 text-church-text-muted">
                  <MapPin className="w-4 h-4" />
                  <span className="text-lg">{sede.direccion}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="mb-4">
                  <h4 className="font-semibold church-text mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Horarios de reuniones:
                  </h4>
                  <div className="space-y-2">
                    {sede.horarios.map((horario, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 text-church-electric-600" />
                        <span className="church-text-muted text-base">{horario}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-church-electric-500 to-church-navy-600 rounded-2xl p-12 text-white">
          <MapPin className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-4xl font-bold mb-4">¡Te esperamos!</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Elige la sede que más te convenga y forma parte de nuestra gran familia en Cristo.
          </p>
          <Link href="/contacto">
            <Button size="lg" className="bg-white text-church-electric-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Más información
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}