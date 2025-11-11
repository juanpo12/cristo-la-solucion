"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type StoreSection = {
  id: string;
  name: string;
  shortDesc: string;
  image: string;
  color: string;
  focusPosition: string;
};

const storeSections: StoreSection[] = [
  {
    id: "tienda",
    name: "TIENDA",
    shortDesc: "Recursos espirituales",
    image: "/DSC09995.jpg",
    color: "from-green-600/30 to-emerald-600/30",
    focusPosition: "center center",
  },
  {
    id: "arte",
    name: "ARTE CLS",
    shortDesc: "Canto, dibujo, teatro y danza ¡para toda la familia!",
    image: "/DSC02510.jpg",
    color: "from-pink-600/30 to-rose-600/30",
    focusPosition: "center center",
  },
  {
    id: "eventos",
    name: " EVENTOS ",
    shortDesc:
      "¡No te pierdas las últimas actualizaciones y eventos especiales!",
    image: "/CONFE.jpg",
    color: "from-orange-500/40 to-red-600/40",
    focusPosition: "center center",
  },
  {
    id: "sedes",
    name: "SEDES",
    shortDesc: "Tenemos dos lugares más",
    image: "/sedesv2.jpg",
    color: "from-blue-600/30 to-sky-600/30",
    focusPosition: "center center",
  }
];

export function StoreShowcase() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const getBackgroundImage = (sectionIndex: number) => {
    if (hoveredSection === null) {
      return storeSections[sectionIndex].image;
    } else {
      const hoveredIndex = storeSections.findIndex(
        (s) => s.id === hoveredSection
      );
      return storeSections[hoveredIndex].image;
    }
  };

  const getBackgroundPosition = (sectionIndex: number) => {
    if (hoveredSection === null) {
      // Estado normal: cada sección muestra su parte más representativa
      return storeSections[sectionIndex].focusPosition;
    } else {
      // Estado hover: dividir la imagen entre las secciones
      // Cada sección muestra una parte específica de la imagen
      const percentage = (sectionIndex / (storeSections.length - 1)) * 100;
      return `${percentage}% center`;
    }
  };

  const getBackgroundSize = () => {
    if (hoveredSection === null) {
      // Estado normal: imagen centrada y bien proporcionada
      return "cover";
    } else {
      // Estado hover: imagen escalada para cubrir todas las secciones
      // Usamos el ancho total necesario para que se vea completa dividida
      const totalSections = storeSections.length;
      return `${totalSections * 100}% auto`;
    }
  };

  const getOverlayColor = (section: StoreSection) => {
    if (hoveredSection === null) {
      return section.color;
    } else {
      const hoveredIndex = storeSections.findIndex(
        (s) => s.id === hoveredSection
      );
      return storeSections[hoveredIndex].color;
    }
  };

  const shouldShowContent = (section: StoreSection) => {
    if (hoveredSection === null) {
      return true;
    } else {
      return hoveredSection === section.id;
    }
  };

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
                    hoveredSection && hoveredSection !== section.id
                      ? "brightness(0.6) contrast(0.8)"
                      : "brightness(0.9)",
                }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t transition-all duration-700 ${getOverlayColor(
                  section
                )} ${
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
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-md">
                    {section.name}
                  </h3>
                  <div
                    className={`transition-all duration-700 ease-out ${
                      hoveredSection === section.id
                        ? "opacity-100 translate-y-0 max-h-96"
                        : "opacity-0 translate-y-6 max-h-0 overflow-hidden"
                    }`}
                  >
                    <p className="text-lg mb-6 drop-shadow-sm font-medium">
                      {section.shortDesc}
                    </p>
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
                      hoveredSection === null
                        ? "opacity-90"
                        : "opacity-0 absolute"
                    }`}
                  >
                    <p className="text-sm md:text-base font-medium">
                      {section.shortDesc}
                    </p>
                  </div>
                </div>
              </div>
              {index < storeSections.length - 1 && (
                <div className="absolute top-0 right-0 w-px h-full bg-white/15 z-30" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Tablet: Grid mejorado */}
      <div className="hidden md:block lg:hidden py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
            {storeSections.slice(0, 2).map((section) => (
              <Link
                key={section.id}
                href={`/${section.id}`}
                className="relative h-72 overflow-hidden rounded-2xl cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${section.image}')`,
                    backgroundPosition: section.focusPosition,
                  }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${section.color} opacity-50 group-hover:opacity-30 transition-opacity duration-300`}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">
                      {section.name}
                    </h3>
                    <p className="text-base mb-4 text-white/90 font-medium">
                      {section.shortDesc}
                    </p>
                  </div>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" className="bg-white/90 text-gray-800 hover:bg-white hover:text-gray-900 transition-all duration-300">
                      Explorar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Tercera sección en fila completa */}
          <div className="mt-6 max-w-5xl mx-auto">
            <Link
              href={`/${storeSections[2].id}`}
              className="relative h-64 block overflow-hidden rounded-2xl cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${storeSections[2].image}')`,
                  backgroundPosition: storeSections[2].focusPosition,
                }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${storeSections[2].color} opacity-50 group-hover:opacity-30 transition-opacity duration-300`}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 z-10">
                <div className="text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">
                    {storeSections[2].name}
                  </h3>
                  <p className="text-lg mb-6 text-white/90 font-medium">
                    {storeSections[2].shortDesc}
                  </p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="bg-white/90 text-gray-800 hover:bg-white hover:text-gray-900 transition-all duration-300">
                      Explorar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile: Stack vertical mejorado */}
      <div className="block md:hidden py-6">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {storeSections.map((section) => (
              <Link
                key={section.id}
                href={`/${section.id}`}
                className="relative h-64 block overflow-hidden rounded-2xl cursor-pointer group shadow-lg active:scale-95 transition-all duration-300"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                  style={{
                    backgroundImage: `url('${section.image}')`,
                    backgroundPosition: section.focusPosition,
                  }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${section.color} opacity-50`}
                />
                <div className="absolute inset-0 bg-black/30" />
                
                {/* Contenido principal */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                  {/* Contenido central */}
                  <div className="flex-1 flex flex-col justify-center text-center">
                    <h3 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">
                      {section.name}
                    </h3>
                    <p className="text-lg mb-6 text-white/90 font-medium px-2">
                      {section.shortDesc}
                    </p>
                  </div>
                  
                  {/* Footer con botón */}
                  <div className="flex justify-center">
                    <Button className="bg-white/90 text-gray-800 hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg">
                      Explorar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}