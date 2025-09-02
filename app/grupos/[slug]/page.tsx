import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Users, Heart, Star, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const groupsData = {
  "invictos-kids": {
    name: "INVICTOS KIDS",
    subtitle: "Donde los pequeños grandes sueños cobran vida",
    description:
      "Es un espacio exclusivo para los niños de nuestra congregación. Contamos con un equipo de maestros encargados de sembrar la palabra de Dios, en la vida de cada uno de los niños, por medio de enseñanzas dinámicas, que capturen la atención de ellos e impacten sus vidas.",
    image: "/test.jpg",
    schedule: "Sábados 19:30 HS",
    location: "Auditorio Principal",
    ageRange: "3 a 9 años",
    color: "from-blue-500 to-cyan-500",
    activities: [
      "Historias bíblicas interactivas",
      "Juegos y dinámicas grupales",
      "Manualidades creativas",
      "Canciones y adoración infantil",
      "Teatro y representaciones",
      "Actividades al aire libre",
    ],
    values: [
      { icon: Heart, title: "Amor", desc: "Cada niño se siente amado y valorado" },
      { icon: Star, title: "Creatividad", desc: "Fomentamos la imaginación y expresión" },
      { icon: Users, title: "Amistad", desc: "Construimos lazos de amistad duraderos" },
    ]
  },
  "invictos-teens": {
    name: "INVICTOS TEENS",
    subtitle: "Descubriendo tu identidad en Cristo",
    description:
      "Estamos llamados a guiar a los adolescentes a que puedan desarrollar una relación personal con Dios, libre de toda tradición y religión. Nos esforzamos en trasmitir los principios de la Palabra utilizando todos los medios disponibles para alcanzar a la mayor cantidad posible.",
    image: "/fototeens.jpg",
    schedule: "Sábados 19:30 HS",
    location: "Auditorio Principal",
    ageRange: "10 a 17 años",
    color: "from-purple-500 to-pink-500",
    activities: [
      "Estudios bíblicos relevantes",
      "Noches de juegos y competencias",
      "Retiros y campamentos",
      "Proyectos de servicio comunitario",
      "Noches de adoración",
      "Mentorías personalizadas",
    ],
    values: [
      { icon: Target, title: "Propósito", desc: "Descubriendo el plan de Dios para sus vidas" },
      { icon: Users, title: "Comunidad", desc: "Relaciones auténticas y de apoyo mutuo" },
      { icon: Star, title: "Liderazgo", desc: "Formando líderes íntegros para el futuro" },
    ]
  },
  invictos: {
    name: "INVICTOS",
    subtitle: "Crecimiento espiritual sin límites",
    description:
      "Invictos es un grupo de jóvenes, que creen en que Jesús es la respuesta a todas las preguntas y que solo en Él hay esperanza. Mediante grupos de amistad y reuniones, los días sábados a las 19:30 hs, buscamos que Dios siga transformando la vida de los jóvenes y que los lleve a compartirlo con otros.",
    image: "/INVICTOS.jpg",
    schedule: "Sábados 19:30 HS",
    location: "Auditorio Principal",
    ageRange: "18 a 35 años",
    color: "from-church-electric-600 to-church-navy-600",
    activities: [
      "Estudios bíblicos profundos",
      "Conferencias y seminarios",
      "Proyectos misioneros",
      "Grupos de discipulado",
      "Retiros espirituales",
      "Ministerios de servicio",
    ],
    values: [
      { icon: Heart, title: "Pasión", desc: "Viviendo con pasión por Dios y su reino" },
      { icon: Target, title: "Misión", desc: "Comprometidos con la Gran Comisión" },
      { icon: Star, title: "Excelencia", desc: "Buscando la excelencia en todo lo que hacemos" },
    ]
  },
  gdc: {
    name: "GDC - GRUPOS DE CONEXIÓN",
    subtitle: "Familia, fe y comunión íntima",
    description:
      "Contamos con grupos de conexión (+36 años) los días martes a las 19:30 hs. La visión de estos grupos es que la gente pueda ser formada en la palabra de Dios; que puedan conectar con otras personas y juntos descubrir la misión que tienen sus vidas, que es vivir por una causa más importante; que esto los lleve a invitar y alcanzar a aquellos que nunca asistieron a la iglesia.",
    image: "/GDC.jpg",
    schedule: "Martes 19:30 HS",
    location: "Auditorio Principal",
    ageRange: "+36 años",
    color: "from-orange-500 to-red-500",
  },
}

export default async function GroupPage({ params }: { params: { slug: string } }) {
  const awaitParams = await params
  const group = groupsData[awaitParams.slug as keyof typeof groupsData]

  if (!group) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header con imagen de fondo */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image src={group.image || "/placeholder.svg"} alt={group.name} fill className="object-cover" priority />
        <div className={`absolute inset-0 bg-gradient-to-r ${group.color} opacity-30`} />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg">{group.name}</h1>
            <p className="text-2xl md:text-3xl opacity-90 drop-shadow-md">{group.subtitle}</p>
          </div>
        </div>

        <Link
          href="/#grupos"
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a Grupos</span>
        </Link>
      </div>

      {/* Información principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-12">
            {/* Descripción */}
            <div>
              <h2 className="text-4xl font-bold church-text mb-6">Acerca de {group.name}</h2>
              <p className="text-xl church-text-muted leading-relaxed">{group.description}</p>
            </div>

            {/* Actividades */}
            {/* <div>
              <h3 className="text-3xl font-bold church-text mb-8">¿Qué hacemos?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {group.activities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-church-electric-500 rounded-full" />
                    <span className="church-text">{activity}</span>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Valores */}
            {/* <div>
              <h3 className="text-3xl font-bold church-text mb-8">Nuestros Valores</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {group.values.map((value, index) => (
                  <Card key={index} className="church-card hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${group.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold church-text mb-2">{value.title}</h4>
                      <p className="church-text-muted">{value.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Información rápida */}
            <Card className="church-card sticky top-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold church-text mb-6">Información</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Calendar className="w-6 h-6 text-church-electric-600 mt-1" />
                    <div>
                      <h4 className="font-semibold church-text">Horario</h4>
                      <p className="church-text-muted">{group.schedule}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-church-electric-600 mt-1" />
                    <div>
                      <h4 className="font-semibold church-text">Ubicación</h4>
                      <p className="church-text-muted">{group.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Users className="w-6 h-6 text-church-electric-600 mt-1" />
                    <div>
                      <h4 className="font-semibold church-text">Edades</h4>
                      <p className="church-text-muted">{group.ageRange}</p>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
