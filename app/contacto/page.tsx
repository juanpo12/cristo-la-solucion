import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative h-[40vh] overflow-hidden">
        <Image 
          src="/frente.jpg" 
          alt="Contacto Cristo La Solución" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-church-electric-600/80 to-church-navy-600/80" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">CONTACTO</h1>
            <p className="text-xl md:text-2xl opacity-90 drop-shadow-md">
              Estamos aquí para acompañarte en tu caminar con Dios
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Información de Contacto */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold church-text mb-6">¿Cómo podemos ayudarte?</h2>
              <p className="text-xl church-text-muted leading-relaxed">
                Nos encantaría saber de ti. Ya sea que tengas una pregunta, necesites oración, 
                o quieras conocer más sobre nuestra iglesia, estamos aquí para ayudarte.
              </p>
            </div>

            {/* Información de Contacto */}
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
            </div>

            {/* Tipos de peticiones */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold church-text mb-6">Tipos de peticiones</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-church-electric-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold church-text">Consulta general:</h4>
                    <p className="church-text-muted">Información sobre la iglesia y actividades.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-church-electric-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold church-text">Petición de oración:</h4>
                    <p className="church-text-muted">Solicita oración por situaciones específicas.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-church-electric-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold church-text">Consejería pastoral:</h4>
                    <p className="church-text-muted">Solicita una cita con nuestros pastores.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-church-electric-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold church-text">Información de grupos:</h4>
                    <p className="church-text-muted">Conoce más sobre nuestros ministerios.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-4">
              <Link
                href="https://wa.link/fpg6lr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  ENVÍA TU PETICIÓN
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}