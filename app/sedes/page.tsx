import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Navigation, Phone } from "lucide-react"
import Image from "next/image"

export default function SedesPage() {
  const sedes = [
    {
      id: "lomas-zamora",
      title: "LOMAS DE ZAMORA",
      direccion: "Laprida 780",
      horarios: [
        { dia: "Martes", hora: "19:00 HS" },
        { dia: "Miércoles", hora: "10:00 HS" },
        { dia: "Sábado", hora: "18:00 HS", tipo: "Invictos Teens" },
        { dia: "Sábado", hora: "20:00 HS", tipo: "Invictos" },
        { dia: "Domingo", hora: "10:00 HS" }
      ],
      color: "from-blue-600 via-blue-500 to-cyan-400",
      accentColor: "bg-blue-500",
      mapUrl: "#",
    },
    {
      id: "canuelas",
      title: "CAÑUELAS",
      direccion: "12 de octubre 455",
      horarios: [
        { dia: "Miércoles", hora: "19:00 HS" },
        { dia: "Viernes", hora: "19:30 HS", tipo: "Invictos" },
        { dia: "Domingo", hora: "10:00 HS" }
      ],
      color: "from-emerald-600 via-green-500 to-teal-400",
      accentColor: "bg-emerald-500",
      mapUrl: "#",
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 pt-20 via-white to-gray-100">
      {/* Hero Header */}
      <div className="relative h-[60vh] overflow-hidden -mt-20">

        <Image
          src="/color2.jpg"
          alt="Sedes Cristo La Solución"
          fill
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          priority
        />

        {/* Overlay con gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-cyan-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.2),rgba(0,0,0,0.8))]" />

        {/* Contenido del hero */}
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4 space-y-6">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 mb-4">
              <MapPin className="w-12 h-12 text-cyan-300" strokeWidth={1.5} />
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-2xl">
              NUESTRAS SEDES
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
              Encuentra el lugar perfecto para conectar con Dios y nuestra comunidad
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-20">
        {/* Grid de sedes */}
        <div className="grid lg:grid-cols-2 gap-10 mb-20 max-w-6xl mx-auto">
          {sedes.map((sede, index) => (
            <Card
              key={sede.id}
              className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header de la card con gradiente */}
              <div className="relative h-56 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${sede.color} transition-transform duration-500 group-hover:scale-110`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

                {/* Icono flotante */}
                <div className="absolute top-6 left-6 p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" strokeWidth={2} />
                </div>

                {/* Título en el header */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">
                    {sede.title}
                  </h2>
                </div>
              </div>

              {/* Contenido de la card */}
              <CardContent className="p-8 space-y-6">
                {/* Dirección */}
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Navigation className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Dirección</p>
                    <p className="text-lg font-semibold text-gray-900">{sede.direccion}</p>
                  </div>
                </div>

                {/* Horarios */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-5 h-5 text-gray-700" />
                    <h3 className="font-bold text-gray-900 text-lg">Horarios de Reunión</h3>
                  </div>

                  <div className="space-y-3">
                    {sede.horarios.map((horario, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors group/item"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${sede.accentColor}`} />
                          <div>
                            <span className="font-semibold text-gray-900">{horario.dia}</span>
                            {horario.tipo && (
                              <span className="ml-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {horario.tipo}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 tabular-nums">
                          {horario.hora}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action final */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-12 md:p-16 text-white shadow-2xl max-w-5xl mx-auto">
          {/* Patrón de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent)]" />
          </div>

          <div className="relative z-10 text-center space-y-8">
            <div className="inline-block p-5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <MapPin className="w-14 h-14" strokeWidth={1.5} />
            </div>

            <div className="space-y-4">
              <h3 className="text-4xl md:text-5xl font-black">¡Te Esperamos!</h3>
              <p className="text-xl md:text-2xl opacity-95 max-w-2xl mx-auto font-light leading-relaxed">
                Elige la sede que más te convenga y sé parte de nuestra familia en Cristo
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a href="/contacto">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <Phone className="w-5 h-5 mr-2" />
                  Contáctanos
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}