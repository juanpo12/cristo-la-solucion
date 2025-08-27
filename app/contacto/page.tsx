import { ContactForm } from "@/components/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, Phone, Mail, Clock } from "lucide-react"
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

        <Link
          href="/"
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Inicio</span>
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Información de Contacto */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold church-text mb-6">¿Cómo podemos ayudarte?</h2>
              <p className="text-xl church-text-muted leading-relaxed">
                Nos encantaría escuchar de ti. Ya sea que tengas una pregunta, necesites oración, 
                o quieras conocer más sobre nuestra iglesia, estamos aquí para ti.
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
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold church-text mb-2">Horarios de Atención</h3>
                      <div className="church-text-muted space-y-1">
                        <p>Lunes a Viernes: 9:00 - 18:00</p>
                        <p>Sábados: 16:00 - 21:00</p>
                        <p>Domingos: 9:00 - 13:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tipos de Peticiones */}
            <Card className="church-card">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold church-text mb-4">Tipos de Peticiones</h3>
                <div className="space-y-3 church-text-muted">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-church-electric-500 rounded-full" />
                    <span><strong>Consulta General:</strong> Información sobre la iglesia y actividades</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-church-electric-500 rounded-full" />
                    <span><strong>Petición de Oración:</strong> Solicita oración por situaciones específicas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-church-electric-500 rounded-full" />
                    <span><strong>Consejería Pastoral:</strong> Solicita una cita con nuestros pastores</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-church-electric-500 rounded-full" />
                    <span><strong>Información de Grupos:</strong> Conoce más sobre nuestros ministerios</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}