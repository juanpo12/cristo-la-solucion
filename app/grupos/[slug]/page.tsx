import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
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
      "Un espacio mágico donde los niños descubren el amor de Dios a través de aventuras, juegos, canciones y enseñanzas diseñadas especialmente para ellos. Aquí cada niño es valorado, amado y guiado para crecer en fe de manera divertida y segura.",
    image: "/KIDS.jpg",
    schedule: "Domingos 11:00 AM",
    location: "Salón Infantil - Planta Baja",
    ageRange: "3 a 12 años",
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
    ],
    leaders: [
      { name: "María González", role: "Coordinadora General", experience: "8 años" },
      { name: "Carlos Ruiz", role: "Líder de Actividades", experience: "5 años" },
      { name: "Ana Martín", role: "Maestra Bíblica", experience: "6 años" },
    ],
  },
  "invictos-teens": {
    name: "INVICTOS TEENS",
    subtitle: "Descubriendo tu identidad en Cristo",
    description:
      "Un espacio auténtico donde los adolescentes pueden ser ellos mismos mientras exploran su fe, construyen amistades genuinas y se preparan para ser los líderes del mañana. Aquí abordamos las preguntas reales de la vida con respuestas bíblicas relevantes.",
    image: "/TEENS.jpg",
    schedule: "Sábados 18:00 HS",
    location: "Auditorio Principal",
    ageRange: "13 a 18 años",
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
    ],
    leaders: [
      { name: "David Morales", role: "Pastor de Jóvenes", experience: "10 años" },
      { name: "Sofía López", role: "Líder de Adoración", experience: "4 años" },
      { name: "Miguel Torres", role: "Consejero", experience: "7 años" },
    ],
  },
  invictos: {
    name: "INVICTOS",
    subtitle: "Crecimiento espiritual sin límites",
    description:
      "Una comunidad vibrante de jóvenes y adultos comprometidos con el crecimiento espiritual, el servicio y la transformación personal. Aquí profundizamos en la Palabra, desarrollamos nuestros dones y impactamos nuestra comunidad con el amor de Cristo.",
    image: "/INVICTOS.jpg",
    schedule: "Jueves 20:30 HS",
    location: "Santuario Principal",
    ageRange: "18+ años",
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
    ],
    leaders: [
      { name: "Pastor Roberto Silva", role: "Líder Principal", experience: "15 años" },
      { name: "Lucía Fernández", role: "Coordinadora de Ministerios", experience: "8 años" },
      { name: "Andrés Vega", role: "Líder de Discipulado", experience: "6 años" },
    ],
  },
  gdc: {
    name: "GDC - GRUPOS DE CONEXIÓN",
    subtitle: "Familia, fe y comunión íntima",
    description:
      "Espacios íntimos donde las familias y personas de todas las edades se reúnen para compartir la vida, orar juntos y crecer en comunión. Aquí experimentamos el verdadero significado de la familia de Dios en un ambiente acogedor y de apoyo mutuo.",
    image: "/GDC.jpg",
    schedule: "Miércoles 19:00 HS",
    location: "Salas de Reunión (Múltiples ubicaciones)",
    ageRange: "Todas las edades",
    color: "from-orange-500 to-red-500",
    activities: [
      "Estudios bíblicos familiares",
      "Cenas comunitarias",
      "Oración intercesora",
      "Apoyo en crisis y celebraciones",
      "Actividades recreativas familiares",
      "Proyectos de servicio grupal",
    ],
    values: [
      { icon: Heart, title: "Familia", desc: "Experimentando la verdadera familia de Dios" },
      { icon: Users, title: "Apoyo", desc: "Caminando juntos en las alegrías y desafíos" },
      { icon: Star, title: "Intimidad", desc: "Relaciones profundas y auténticas" },
    ],
    leaders: [
      { name: "Familia Rodríguez", role: "Coordinadores Generales", experience: "12 años" },
      { name: "Familia Mendoza", role: "Líderes de Grupo", experience: "9 años" },
      { name: "Familia Castro", role: "Líderes de Grupo", experience: "7 años" },
    ],
  },
}

export default function GroupPage({ params }: { params: { slug: string } }) {
  const group = groupsData[params.slug as keyof typeof groupsData]

  if (!group) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header con imagen de fondo */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image src={group.image || "/placeholder.svg"} alt={group.name} fill className="object-cover" priority />
        <div className={`absolute inset-0 bg-gradient-to-r ${group.color} opacity-80`} />
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
            <div>
              <h3 className="text-3xl font-bold church-text mb-8">¿Qué hacemos?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {group.activities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-church-electric-500 rounded-full" />
                    <span className="church-text">{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Valores */}
            <div>
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
            </div>

            {/* Líderes */}
            <div>
              <h3 className="text-3xl font-bold church-text mb-8">Nuestro Equipo</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {group.leaders.map((leader, index) => (
                  <Card key={index} className="church-card">
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
                      <h4 className="text-lg font-bold church-text mb-1">{leader.name}</h4>
                      <p className="church-text-muted mb-2">{leader.role}</p>
                      {/* <Badge variant="secondary">{leader.experience} de experiencia</Badge> */}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
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

                <div className="mt-8 space-y-4">
                  <Button className="w-full church-button-primary">Únete a este grupo</Button>
                  <Button variant="outline" className="w-full">
                    Más información
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
