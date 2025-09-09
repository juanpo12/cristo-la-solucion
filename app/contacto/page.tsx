import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido principal */}
      <div className="mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Título centrado */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">¿CÓMO PODEMOS AYUDARTE?</h1>
          </div>
          
          {/* Contenido en dos columnas */}
          <div className="grid lg:grid-cols-1 gap-12 mb-12">
            {/* Columna Izquierda - Texto descriptivo */}
            <div className="space-y-8">
              <p className="text-2xl church-text-muted leading-relaxed">
                ¡Nos encantaría conocerte! Ya sea que tengas una pregunta, necesites oración
                o quieras información sobre nuestra iglesia, estamos para ayudarte.
              </p>
            </div>

            {/* Columna Derecha - Información de Contacto */}
            <div className="space-y-6">
              <Card className="church-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-church-electric-500 to-church-navy-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold church-text mb-2">Dirección</h3>
                      <p className="church-text-muted">
                        Av. Juan Manuel de Rosas 4357<br />
                        San Justo, Buenos Aires
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="church-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-church-electric-500 to-church-navy-500 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold church-text mb-2">Teléfono</h3>
                      <p className="church-text-muted">+54 9 11 2864-8642</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="church-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-church-electric-500 to-church-navy-500 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold church-text mb-2">Email</h3>
                      <p className="church-text-muted">oficinasclsj@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="church-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-church-electric-500 to-church-navy-500 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold church-text mb-2">Horarios de atención</h3>
                      <p className="church-text-muted">
                        Lunes a Viernes: 13:00 - 19:00 HS
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tarjeta de WhatsApp */}
              <Link
                href="https://wa.link/fpg6lr"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="church-card hover:shadow-lg transition-all duration-300 bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold church-text mb-2">WhatsApp</h3>
                        <p className="church-text-muted mb-3">
                          Envía tu petición de oración o consulta directamente por WhatsApp
                        </p>
                        <div className="inline-flex items-center text-green-600 font-semibold">
                          <span>ENVIAR MENSAJE</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}