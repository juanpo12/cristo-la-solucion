"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"

type Group = {
  id: string
  name: string
  shortDesc: string
  schedule: string
  image: string
  color: string
  focusPosition: string // Posición de enfoque para la imagen
  ageRange: string
}
const groups: Group[] = [
  {
    id: "invictos-kids",
    name: "INVICTOS KIDS",
    shortDesc: "Diversión y aprendizaje",
    schedule: "Sáb 19:30 HS",
    image: "/test.jpg",
    color: "from-blue-600/30 to-cyan-600/30",
    focusPosition: "center center", // Centrado para mostrar al niño
    ageRange: "3 a 9 años",
  },
  {
    id: "invictos-teens",
    name: "INVICTOS TEENS",
    shortDesc: "Descubriendo propósito",
    schedule: "Sáb 19:30 HS",
    image: "/INVICTOS.jpg",
    color: "from-purple-600/30 to-pink-600/30",
    focusPosition: "center center", // Centrado para mostrar a los jóvenes
    ageRange: "10 a 17 años",
  },
  {
    id: "invictos",
    name: "INVICTOS",
    shortDesc: "Conocer para dar a conocer",
    schedule: "Sáb 19:30 HS",
    image: "/fototeens.jpg",
    color: "from-church-electric-600/30 to-church-navy-600/30",
    focusPosition: "center center", // Centrado para mostrar el grupo
    ageRange: "18 a 34 años",
  },
  {
    id: "gdc",
    name: "GDC",
    shortDesc: "Conexión familiar",
    schedule: "Mar 19:30 HS",
    image: "/gdcnueva.jpg",
    color: "from-orange-600/30 to-red-600/30",
    focusPosition: "center center", // Centrado para mostrar la familia
    ageRange: "+35 años",
  },
]

export function Groups() {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)

  const getBackgroundImage = (sectionIndex: number) => {
    if (hoveredGroup === null) {
      return groups[sectionIndex].image
    } else {
      const hoveredIndex = groups.findIndex((g) => g.id === hoveredGroup)
      return groups[hoveredIndex].image
    }
  }

  const getBackgroundPosition = (sectionIndex: number) => {
    if (hoveredGroup === null) {
      // Estado normal: cada sección muestra su parte más representativa
      return groups[sectionIndex].focusPosition
    } else {
      // Estado hover: mostrar la imagen completa dividida
      return `${sectionIndex * 33.33}% center`
    }
  }

  const getBackgroundSize = () => {
    if (hoveredGroup === null) {
      // Estado normal: imagen centrada y bien proporcionada
      return "cover"
    } else {
      // Estado hover: imagen completa dividida
      return "400% auto"
    }
  }

  const getOverlayColor = (group: Group,) => {
    if (hoveredGroup === null) {
      return group.color
    } else {
      const hoveredIndex = groups.findIndex((g) => g.id === hoveredGroup)
      return groups[hoveredIndex].color
    }
  }

  const shouldShowContent = (group: Group) => {
    if (hoveredGroup === null) {
      return true
    } else {
      return hoveredGroup === group.id
    }
  }

  return (
    <section id="grupos" className="py-0 bg-white scroll-mt-20 overflow-hidden">
      {/* <div className="container mx-auto px-4 mb-12">
        <h2 className="text-5xl font-bold text-center church-text mb-8">NUESTROS GRUPOS</h2>
        <p className="text-xl church-text-muted text-center max-w-3xl mx-auto">
          Descubre el lugar perfecto para crecer, conectar y servir junto a otros en tu jornada de fe
        </p>
      </div> */}

      {/* Desktop: Efecto horizontal original */}
      <div className="hidden lg:block w-full h-[70vh] relative">
        <div className="flex h-full">
          {groups.map((group, index) => (
            <Link
              key={group.id}
              href={`/grupos/${group.id}`}
              className="relative flex-1 overflow-hidden cursor-pointer group"
              onMouseEnter={() => setHoveredGroup(group.id)}
              onMouseLeave={() => setHoveredGroup(null)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                style={{
                  backgroundImage: `url('${getBackgroundImage(index)}')`,
                  backgroundPosition: getBackgroundPosition(index),
                  backgroundSize: getBackgroundSize(),
                  filter:
                    hoveredGroup && hoveredGroup !== group.id ? "brightness(0.6) contrast(0.8)" : "brightness(0.9)",
                }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t transition-all duration-700 ${getOverlayColor(group)} ${
                  hoveredGroup === group.id ? "opacity-20" : "opacity-40"
                }`}
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 z-10">
                <div
                  className={`text-center transition-all duration-700 ease-out ${
                    shouldShowContent(group)
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform translate-y-4"
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
                    <div className="flex items-center justify-center space-x-2 mb-3 opacity-90">
                      <Calendar className="w-4 h-4" />
                      <span className="text-base">{group.schedule}</span>
                    </div>
                    <div className="text-base mb-6 opacity-90 font-medium">
                      <span className="bg-white/20 px-3 py-1 rounded-full">{group.ageRange}</span>
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
                      hoveredGroup === null ? "opacity-90" : "opacity-0 absolute"
                    }`}
                  >
                    <p className="text-sm md:text-base font-medium">{group.shortDesc}</p>
                  </div>
                </div>
              </div>
              {index < groups.length - 1 && <div className="absolute top-0 right-0 w-px h-full bg-white/15 z-30" />}
            </Link>
          ))}
        </div>
      </div>

      {/* Tablet: Grid 2x2 mejorado */}
      <div className="hidden md:block lg:hidden py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/grupos/${group.id}`}
                className="relative h-72 overflow-hidden rounded-2xl cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${group.image}')`,
                    backgroundPosition: group.focusPosition,
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${group.color} opacity-50 group-hover:opacity-30 transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">{group.name}</h3>
                    <p className="text-base mb-3 text-white/90 font-medium">{group.shortDesc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-white/80">
                        <Calendar className="w-4 h-4" />
                        <span>{group.schedule}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium">
                        {group.ageRange}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" className="bg-white/90 text-gray-800 hover:bg-white hover:text-gray-900 transition-all duration-300">
                      Conoce más
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Stack vertical mejorado */}
      <div className="block md:hidden py-6">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/grupos/${group.id}`}
                className="relative h-64 block overflow-hidden rounded-2xl cursor-pointer group shadow-lg active:scale-95 transition-all duration-300"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                  style={{
                    backgroundImage: `url('${group.image}')`,
                    backgroundPosition: group.focusPosition,
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${group.color} opacity-50`} />
                <div className="absolute inset-0 bg-black/30" />
                
                {/* Contenido principal */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                  {/* Header con edad */}
                  <div className="flex justify-end">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium">
                      {group.ageRange}
                    </div>
                  </div>
                  
                  {/* Contenido central */}
                  <div className="text-center">
                    <h3 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">{group.name}</h3>
                    <p className="text-lg mb-4 text-white/90 font-medium">{group.shortDesc}</p>
                  </div>
                  
                  {/* Footer con horario y botón */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-white/80">
                      <Calendar className="w-4 h-4" />
                      <span className="text-base font-medium">{group.schedule}</span>
                    </div>
                    <div className="flex justify-center">
                      <Button className="bg-white/90 text-gray-800 hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg">
                        Conoce más
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
