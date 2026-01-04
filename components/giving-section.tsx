"use client"

import { useState } from "react"
import { CreditCard, Smartphone, Building, Heart } from "lucide-react"
import { DonationModal } from "./donation-modal"
import Image from "next/image"

export default function GivingSection() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const givingMethods = [
    { icon: CreditCard, title: "Transferencia Bancaria", description: "CBU: 1234567890123456789012" },
    { icon: Building, title: "En Persona", description: "Durante los servicios" },
    { icon: Smartphone, title: "Mercado Pago", description: "Alias: iglesia.cristo.solucion", image: "/qr-mp-02.jpg", logo: "/MP_RGB_HANDSHAKE_color_horizontal.png" },
  ]

  return (
    <section id="dar" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">FORMAS DE DAR</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tu generosidad nos permite continuar con nuestra misión de transformar vidas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">¿Por qué dar?</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Apoyo a la Comunidad</h4>
                  <p className="text-gray-600">Ayudamos a familias necesitadas y proyectos sociales.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Crecimiento del Ministerio</h4>
                  <p className="text-gray-600">Expandimos nuestro alcance y programas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Mantenimiento</h4>
                  <p className="text-gray-600">Cuidamos nuestras instalaciones y recursos.</p>
                </div>
              </div>
            </div>
          </div>


          <div className="space-y-6">
            {/* Tarjetas de Transferencia y En Persona */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {givingMethods.slice(0, 2).map((method, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <method.icon className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2 text-lg">{method.title}</h4>
                      <p className="text-sm text-gray-600 font-medium">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tarjeta especial de Mercado Pago con QR */}
            {givingMethods[2] && (
              <div className="bg-gradient-to-br  rounded-2xl p-8 shadow-xl">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Columna izquierda: QR */}
                  <div className="flex-shrink-0">
                    <div className="bg-white p-5 rounded-2xl shadow-lg">
                      <Image
                        src={givingMethods[2].image!}
                        alt={givingMethods[2].title}
                        width={160}
                        height={160}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Columna derecha: Información */}
                  <div className="flex-1 text-center lg:text-left">
                    {/* Logo de Mercado Pago */}
                    <div className="inline-flex items-center justify-center mb-2 ">
                      <Image
                        src="/MP_RGB_HANDSHAKE_color_horizontal.png"
                        alt="Mercado Pago"
                        width={180}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <p className="text-lg text-gray-700 font-semibold mb-4">{givingMethods[2].description}</p>
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Escanea el código QR</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Cada aporte cuenta</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            No importa el monto, tu generosidad marca la diferencia en la vida de muchas personas.
          </p>
          <button
            onClick={() => setIsDonationModalOpen(true)}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto"
          >
            <Heart className="w-5 h-5" />
            Dar ahora
          </button>
        </div>

        {/* Modal de donación */}
        <DonationModal
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
        />
      </div>
    </section>
  )
}
