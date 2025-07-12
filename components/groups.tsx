"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

type Group = {
  id: string
  name: string
  shortDesc: string
  schedule: string
  image: string
  color: string
}

const groups = [
  {
    id: "invictos-kids",
    name: "INVICTOS KIDS",
    shortDesc: "Diversión y aprendizaje",
    schedule: "Dom 11:00 AM",
    image: "/test.jpg",
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
  const [currentSlide, setCurrentSlide] = useState(0)

  const getBackgroundImage = (sectionIndex: number) => {
    if (hoveredGroup === null) {
      return groups[sectionIndex].image
    } else {
      const hoveredIndex = groups.findIndex((g) => g.id === hoveredGroup)
      return groups[hoveredIndex].image
    }
  }

  const getBackgroundPosition = (sectionIndex: number) => {
    return `${sectionIndex * 33.33}% center`
  }

  const getOverlayColor = (group: Group) => {
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % groups.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + groups.length) % groups.length)
  }

  return (
    <section id="grupos" className="py-0 bg-white scroll-mt-20 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-5xl font-bold text-center church-text mb-8">NUESTROS GRUPOS</h2>
        <p className="text-xl church-text-muted text-center max-w-3xl mx-auto">
          Descubre el lugar perfecto para crecer, conectar y servir junto a otros en tu jornada de fe
        </p>
      </div>

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
                  backgroundSize: "400% auto",
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

      {/* Tablet: Grid 2x2 */}
      <div className="hidden md:block lg:hidden">
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto px-4">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/grupos/${group.id}`}
              className="relative h-64 overflow-hidden rounded-xl cursor-pointer group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${group.image}')`,
                }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${group.color} opacity-40`} />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 z-10">
                <h3 className="text-xl font-bold mb-2 text-center drop-shadow-md">{group.name}</h3>
                <p className="text-sm mb-3 text-center opacity-90">{group.shortDesc}</p>
                <div className="flex items-center space-x-2 text-xs opacity-80">
                  <Calendar className="w-3 h-3" />
                  <span>{group.schedule}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile: Carousel */}
      <div className="block md:hidden">
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {groups.map((group) => (
                <div key={group.id} className="w-full flex-shrink-0 px-4">
                  <Link
                    href={`/grupos/${group.id}`}
                    className="relative h-80 block overflow-hidden rounded-xl cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${group.image}')`,
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${group.color} opacity-40`} />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 z-10">
                      <h3 className="text-2xl font-bold mb-4 text-center drop-shadow-md">{group.name}</h3>
                      <p className="text-lg mb-4 text-center opacity-90">{group.shortDesc}</p>
                      <div className="flex items-center space-x-2 mb-6 opacity-80">
                        <Calendar className="w-4 h-4" />
                        <span>{group.schedule}</span>
                      </div>
                      <Button className="bg-white/90 text-gray-800 hover:bg-white">
                        Conoce más
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Controles del carousel */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicadores */}
          <div className="flex justify-center mt-6 space-x-2">
            {groups.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-church-electric-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sección de llamada a la acción */}
      <div className="bg-gradient-to-r from-church-electric-50 to-blue-50 py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold church-text mb-6">¿Listo para conectar?</h3>
          <p className="text-lg church-text-muted mb-8 max-w-2xl mx-auto">
            Cada grupo es una oportunidad única de crecer, servir y construir relaciones duraderas. ¡Encuentra tu lugar
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
