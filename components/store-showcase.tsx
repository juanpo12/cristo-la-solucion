"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

type StoreSection = {
  id: string
  name: string
  shortDesc: string
  image: string
  color: string
  focusPosition: string
}

const storeSections: StoreSection[] = [
  {
    id: "tienda",
    name: "TIENDA",
    shortDesc: "Recursos espirituales",
    image: "/LIBROS DEL PASTOR ALFREDO DIMIRO0000.png",
    color: "from-green-600/30 to-emerald-600/30",
    focusPosition: "center center",
  },
  {
    id: "arte",
    name: "ARTE CLS",
    shortDesc: "Expresión creativa",
    image: "/ARTE CLS.jpg",
    color: "from-pink-600/30 to-rose-600/30",
    focusPosition: "center center",
  },
  {
    id: "cls",
    name: "CLS",
    shortDesc: "Nuestra identidad",
    image: "/logo-cls.png",
    color: "from-church-electric-600/30 to-church-navy-600/30",
    focusPosition: "center center",
  },
  {
    id: "novedades",
    name: "NOVEDADES",
    shortDesc: "Lo más reciente",
    image: "/CONFE.jpg",
    color: "from-purple-600/30 to-indigo-600/30",
    focusPosition: "center center",
  },
]

export function StoreShowcase() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  const getBackgroundImage = (sectionIndex: number) => {
    if (hoveredSection === null) {
      return storeSections[sectionIndex].image
    } else {
      const hoveredIndex = storeSections.findIndex((s) => s.id === hoveredSection)
      return storeSections[hoveredIndex].image
    }
  }

  const getBackgroundPosition = (sectionIndex: number) => {
    if (hoveredSection === null) {
      // Estado normal: cada sección muestra su parte más representativa
      return storeSections[sectionIndex].focusPosition
    } else {
      // Estado hover: mostrar la imagen completa dividida
      return `${sectionIndex * 33.33}% center`
    }
  }

  const getBackgroundSize = () => {
    if (hoveredSection === null) {
      // Estado normal: imagen centrada y bien proporcionada
      return "cover"
    } else {
      // Estado hover: imagen completa dividida
      return "400% auto"
    }
  }

  const getOverlayColor = (section: StoreSection) => {
    if (hoveredSection === null) {
      return section.color
    } else {
      const hoveredIndex = storeSections.findIndex((s) => s.id === hoveredSection)
      return storeSections[hoveredIndex].color
    }
  }

  const shouldShowContent = (section: StoreSection) => {
    if (hoveredSection === null) {
      return true
    } else {
      return hoveredSection === section.id
    }
  }

  return (
    <section className="py-0 bg-white overflow-hidden">
      {/* Desktop: Efecto horizontal original */}
      <div className="hidden lg:block w-full h-[70vh] relative">
        <div className="flex h-full">
          {storeSections.map((section, index) => (
            <Link
              key={section.id}
              href={`/${section.id}`}
              className="relative flex-1 overflow-hidden cursor-pointer group"
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                style={{
                  backgroundImage: `url('${getBackgroundImage(index)}')`,
                  backgroundPosition: getBackgroundPosition(index),
                  backgroundSize: getBackgroundSize(),
                  filter:
                    hoveredSection && hoveredSection !== section.id ? "brightness(0.6) contrast(0.8)" : "brightness(0.9)",
                }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t transition-all duration-700 ${getOverlayColor(section)} ${
                  hoveredSection === section.id ? "opacity-20" : "opacity-40"
                }`}
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 z-10">
                <div
                  className={`text-center transition-all duration-700 ease-out ${
                    shouldShowContent(section)
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform translate-y-4"
                  }`}
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-md">{section.name}</h3>
                  <div
                    className={`transition-all duration-700 ease-out ${
                      hoveredSection === section.id
                        ? "opacity-100 translate-y-0 max-h-96"
                        : "opacity-0 translate-y-6 max-h-0 overflow-hidden"
                    }`}
                  >
                    <p className="text-lg mb-6 drop-shadow-sm font-medium">{section.shortDesc}</p>
                    <Button
                      size="lg"
                      className="bg-white/90 text-gray-800 hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg border-0"
                    >
                      Explorar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div
                    className={`transition-all duration-500 ${
                      hoveredSection === null ? "opacity-90" : "opacity-0 absolute"
                    }`}
                  >
                    <p className="text-sm md:text-base font-medium">{section.shortDesc}</p>
                  </div>
                </div>
              </div>
              {index < storeSections.length - 1 && <div className="absolute top-0 right-0 w-px h-full bg-white/15 z-30" />}
            </Link>
          ))}
        </div>
      </div>

      {/* Tablet: Grid 2x2 */}
      <div className="hidden md:block lg:hidden">
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto px-4">
          {storeSections.map((section) => (
            <Link
              key={section.id}
              href={`/${section.id}`}
              className="relative h-64 overflow-hidden rounded-xl cursor-pointer group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${section.image}')`,
                  backgroundPosition: section.focusPosition,
                }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${section.color} opacity-40`} />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 z-10">
                <h3 className="text-xl font-bold mb-2 text-center drop-shadow-md">{section.name}</h3>
                <p className="text-sm mb-3 text-center opacity-90">{section.shortDesc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile: Carousel */}
      <div className="block md:hidden">
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex space-x-4 px-4">
              {storeSections.map((section) => (
                <div key={section.id} className="w-80 flex-shrink-0">
                  <Link
                    href={`/${section.id}`}
                    className="relative h-80 block overflow-hidden rounded-xl cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${section.image}')`,
                        backgroundPosition: section.focusPosition,
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${section.color} opacity-40`} />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 z-10">
                      <h3 className="text-2xl font-bold mb-4 text-center drop-shadow-md">{section.name}</h3>
                      <p className="text-lg mb-6 text-center opacity-90">{section.shortDesc}</p>
                      <Button className="bg-white/90 text-gray-800 hover:bg-white">
                        Explorar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}