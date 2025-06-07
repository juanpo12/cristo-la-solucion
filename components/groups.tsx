import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const groups = [
  {
    name: "INVICTOS KIDS",
    description:
      "Un espacio divertido y seguro donde los niños aprenden sobre el amor de Dios a través de juegos, canciones y enseñanzas adaptadas a su edad.",
    schedule: "Domingos 11:00 AM",
    bgPosition: "0% 0%",
    color: "from-church-electric-500 to-church-electric-700",
  },
  {
    name: "INVICTOS TEENS",
    description:
      "Adolescentes descubriendo su identidad en Cristo, construyendo amistades sólidas y preparándose para ser líderes del mañana.",
    schedule: "Sábados 18:00 HS",
    bgPosition: "25% 0%",
    color: "from-church-navy-600 to-church-electric-600",
  },
  {
    name: "INVICTOS",
    description:
      "Jóvenes y adultos comprometidos con el crecimiento espiritual, el servicio y la transformación personal y comunitaria.",
    schedule: "Jueves 20:30 HS",
    bgPosition: "50% 0%",
    color: "from-church-electric-600 to-church-navy-700",
  },
  {
    name: "GDC",
    description:
      "Grupos de Conexión donde las familias se reúnen para compartir, orar y crecer juntos en un ambiente íntimo y acogedor.",
    schedule: "Miércoles 19:00 HS",
    bgPosition: "75% 0%",
    color: "from-church-navy-700 to-church-navy-800",
  },
]

export function Groups() {
  return (
    <section id="grupos" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center church-text mb-16">NUESTROS GRUPOS</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {groups.map((group, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-105 church-card border-0"
            >
              <div className="relative h-72 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('/images/invictos-kids.png')`,
                    backgroundPosition: group.bgPosition,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/60 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold text-center px-4 transform transition-all duration-500 group-hover:scale-110">
                      {group.name}
                    </h3>
                  </div>
                </div>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-0 group-hover:opacity-95 transition-opacity duration-500 flex items-center justify-center p-6`}
                >
                  <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold mb-4">{group.name}</h3>
                    <p className="text-sm mb-6 opacity-90 leading-relaxed">{group.description.split(".")[0]}</p>
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">{group.schedule}</Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-8 bg-white group-hover:bg-blue-50 transition-colors duration-300">
                <p className="church-text-muted mb-6 leading-relaxed">{group.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="group-hover:bg-church-electric-100 px-3 py-1">
                    {group.schedule}
                  </Badge>
                  <div className="w-3 h-3 bg-church-electric-500 rounded-full group-hover:w-5 group-hover:h-5 transition-all duration-300"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
