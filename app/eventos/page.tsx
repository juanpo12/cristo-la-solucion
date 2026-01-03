import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Users, Heart, Cross, Home, UserCheck, Droplets, Building2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function EventosPage() {
  const eventos = [
    {
      id: "inmersion",
      title: "INMERSIÓN",
      description: "Es la conferencia para preadolescentes, adolescentes y jóvenes de 10 a 35 años, que tiene como finalidad acercar a esta generación a los pies de Jesús para que las vidas sean transformadas, y luego manifestarlo en las distintas esferas de la sociedad.",
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "corazon-corazon",
      title: "DE CORAZÓN A CORAZÓN",
      description: "Es una experiencia diseñada para toda la iglesia, que tiene el objetivo de edificar, fortalecer y equipar a cada miembro de nuestra comunidad, a través de momentos de alabanza, adoración y enseñanzas que marcan el rumbo de sus vidas.",
      icon: Heart,
      color: "from-red-500 to-pink-600"
    },
    {
      id: "nosotras",
      title: "NOSOTRAS",
      description: "Es un evento diseñado para las mujeres de nuestra iglesia, en donde compartimos Palabra con el fin de levantarlas y equiparlas, para que luego puedan compartir con libertad lo que Dios ha hecho, y continúa haciendo, en ellas.",
      icon: Heart,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "velorio-cancelado",
      title: "VELORIO CANCELADO",
      description: "Celebramos Semana Santa a través de reuniones especiales que tienen como centro dar a conocer a Cristo Jesús y su mensaje de salvación, sanidad y libertad. Además, recordamos su muerte y su resurrección a través de la Santa Cena, como Él dijo: 'Hagan esto en memoria de mí'.",
      icon: Cross,
      color: "from-amber-500 to-orange-600"
    },
    {
      id: "semana-familia",
      title: "SEMANA DE LA FAMILIA",
      description: "Apartamos una semana para ser enseñados acerca de familia. Todos los días tenemos un encuentro único y especial en donde exponemos el modelo de la Palabra respecto a los diferentes roles, funciones y problemáticas que se pueda estar atravesando en un hogar.",
      icon: Home,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "operacion-mateo",
      title: "OPERACIÓN MATEO",
      description: "Al igual que Mateo, quien realizó una cena en su casa e invitó a sus amigos para que puedan conocer a Jesús, como iglesia armamos una excusa para invitar a nuestros allegados con el fin de compartirles las buenas noticias.",
      icon: UserCheck,
      color: "from-teal-500 to-cyan-600"
    },
    {
      id: "bautismo",
      title: "BAUTISMO",
      description: "Todos los años apartamos un día para que aquellos hermanos, que recibieron a Jesús como su Señor y Salvador, tengan la posibilidad de celebrarlo a través de la confirmación pública, es decir, del bautismo en aguas.\n\nPara más información contáctanos.",
      icon: Droplets,
      color: "from-blue-400 to-blue-600"
    },
    {
      id: "rotonda",
      title: "ROTONDA",
      description: "Frente a la rotonda de San Justo adquirimos un nuevo lugar que momentáneamente se encuentra en reconstrucción. El objetivo es terminar de equiparlo con todo lo necesario para que niños, adolescentes y jóvenes de nuestra congregación puedan asistir a las actividades diarias realizadas por la iglesia.",
      icon: Building2,
      color: "from-indigo-500 to-purple-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="relative h-[50vh] overflow-hidden -mt-20">
        <Image
          src="/color2.jpg"
          alt="Eventos Cristo La Solución"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <Calendar className="w-16 h-16 mx-auto mb-6 drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">EVENTOS</h1>
            <p className="text-xl md:text-2xl opacity-90 drop-shadow-md">
              Momentos especiales que marcan nuestra comunidad
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {eventos.map((evento) => (
            <Card
              key={evento.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white h-full"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${evento.color}`}>
                    <evento.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="church-text text-xl font-bold leading-tight">
                    {evento.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="church-text-muted leading-relaxed text-base whitespace-pre-line">
                  {evento.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-church-electric-500 to-church-navy-600 rounded-2xl p-12 text-white">
          <Calendar className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-4xl font-bold mb-4">¡No te pierdas nuestros eventos!</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Mantente al día con todas nuestras actividades especiales y forma parte de estos momentos únicos de crecimiento y comunión.
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