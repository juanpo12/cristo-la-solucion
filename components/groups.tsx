"use client"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Calendar } from "lucide-react"
import Link from "next/link"

const groups = [
  {
    id: "invictos-kids",
    name: "INVICTOS KIDS",
    shortDesc: "Diversión y aprendizaje",
    schedule: "Dom 11:00 AM",
    image: "/KIDS.jpg",
    color: "from-blue-600/30 to-cyan-600/30",
  },
  {
    id: "invictos-teens",
    name: "INVICTOS TEENS",
    shortDesc: "Descubriendo propósito",
    schedule: "Sáb 18:00 HS",
    image: "/TEENS.jpg",
    color: "from-purple-600/30 to-pink-600/30",
  },
  {
    id: "invictos",
    name: "INVICTOS",
    shortDesc: "Crecimiento espiritual",
    schedule: "Jue 20:30 HS",
    image: "/INVICTOS.jpg",
    color: "from-church-electric-600/30 to-church-navy-600/30",
  },
  {
    id: "gdc",
    name: "GDC",
    shortDesc: "Conexión familiar",
    schedule: "Mié 19:00 HS",
    image: "/GDC2.jpg",
    color: "from-orange-600/30 to-red-600/30",
  },
]

export function Groups() {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)

  useEffect(() => {
    groups.forEach((group) => {
      const img = new Image()
      img.src = group.image
    })
  }, [])

  const getHoveredGroupData = () => {
    return hoveredGroup
      ? groups.find((g) => g.id === hoveredGroup) ?? groups[0]
      : null
  }

  const hoveredData = getHoveredGroupData()

  return (
    <section id="grupos" className="py-0 bg-white scroll-mt-20 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-5xl font-bold text-center church-text mb-8">NUESTROS GRUPOS</h2>
        <p className="text-xl church-text-muted text-center max-w-3xl mx-auto">
          Descubre el lugar perfecto para crecer, conectar y servir junto a otros en tu jornada de fe
        </p>
      </div>

      <div className="w-full h-[70vh] relative">
        <div className="flex h-full">
          {groups.map((group, index) => (
            <Link
              key={group.id}
              href={`/grupos/${group.id}`}
              className="relative flex-1 overflow-hidden cursor-pointer group"
              onMouseEnter={() => setHoveredGroup(group.id)}
              onMouseLeave={() => setHoveredGroup(null)}
            >
              {/* Imagen de fondo global (hovered o default) */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                style={{
                  backgroundImage: `url('${hoveredData ? hoveredData.image : group.image}')`,
                  backgroundPosition: `${index * 33.33}% center`,
                  backgroundSize: "400% 100%",
                  filter:
                    hoveredGroup && hoveredGroup !== group.id
                      ? "brightness(0.6) contrast(0.8)"
                      : "brightness(0.9)",
                }}
              />

              {/* Overlay con color dinámico */}
              <div
                className={`absolute inset-0 bg-gradient-to-t transition-all duration-700 ${
                  hoveredData ? hoveredData.color : group.color
                } ${hoveredGroup === group.id ? "opacity-20" : "opacity-40"}`}
              />

              {/* Capa para texto legible */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Contenido */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 z-10">
                <div
                  className={`text-center transition-all duration-700 ease-out ${
                    !hoveredGroup || hoveredGroup === group.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-md">{group.name}</h3>

                  <div
                    className={`transition-all duration-700 ease-out ${
                      hoveredGroup === group.id
                        ? "opacity-100 translate-y-0 max-h-96"
                        : "opacity-0 translate-y-6 max-h-0 overflow-hidden"
                    }`}
                  >
                    <p className="text-lg mb-4 drop-shadow-sm font-medium">{group.shortDesc}</p>

                    <div className="flex items-center justify-center space-x-2 mb-6 opacity-90">
                      <Calendar className="w-4 h-4" />
                      <span className="text-base">{group.schedule}</span>
                    </div>

                    <Button
                      size="lg"
                      className="bg-white/90 text-gray-800 hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg border-0"
                    >
                      Conoce más
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  <div
                    className={`transition-all duration-500 ${
                      !hoveredGroup ? "opacity-90" : "opacity-0 absolute"
                    }`}
                  >
                    <p className="text-sm md:text-base font-medium">{group.shortDesc}</p>
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div
                className={`absolute top-6 left-6 z-20 transition-all duration-500 ${
                  !hoveredGroup || hoveredGroup === group.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <Badge className="bg-white/80 text-gray-800 border-0 shadow-sm text-xs font-medium">
                  <Users className="w-3 h-3 mr-1" />
                  {group.name.split(" ")[1] || group.name}
                </Badge>
              </div>

              {/* Indicadores */}
              <div className="absolute bottom-6 left-6 z-20">
                <div className="flex space-x-1.5">
                  {groups.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-500 ${
                        hoveredGroup
                          ? i === index
                            ? "bg-white shadow-sm"
                            : "bg-white/40"
                          : i === index
                            ? "bg-white/70"
                            : "bg-white/25"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Línea divisoria */}
              {index < groups.length - 1 && <div className="absolute top-0 right-0 w-px h-full bg-white/15 z-30" />}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-church-electric-50 to-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold church-text mb-6">¿Listo para conectar?</h3>
          <p className="text-lg church-text-muted mb-8 max-w-2xl mx-auto">
            Cada grupo es una oportunidad única de crecer, servir y construir relaciones duraderas. ¡Encontrá tu lugar
            en nuestra familia!
          </p>
          <Button size="lg" className="church-button-primary">
            Contáctanos para más información
          </Button>
        </div>
      </div>
    </section>
  )
}
