import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function Contact() {
  return (
    <section id="contacto" className="py-20 bg-gray-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center church-text mb-16">INFORMACIÓN DE CONTACTO</h2>
        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          <div>
            <h3 className="text-3xl font-bold mb-8 church-text">CONTÁCTANOS</h3>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <MapPin className="w-8 h-8 text-church-electric-600 mt-1" />
                <div>
                  <h4 className="font-bold church-text text-xl mb-2">Dirección</h4>
                  <p className="church-text-muted text-lg">
                    Av. Principal 123, Centro
                    <br />
                    Ciudad, País
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <Phone className="w-8 h-8 text-church-electric-600 mt-1" />
                <div>
                  <h4 className="font-bold church-text text-xl mb-2">Teléfono</h4>
                  <p className="church-text-muted text-lg">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <Mail className="w-8 h-8 text-church-electric-600 mt-1" />
                <div>
                  <h4 className="font-bold church-text text-xl mb-2">Email</h4>
                  <p className="church-text-muted text-lg">info@iglesia.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <Clock className="w-8 h-8 text-church-electric-600 mt-1" />
                <div>
                  <h4 className="font-bold church-text text-xl mb-2">Horarios de Oficina</h4>
                  <p className="church-text-muted text-lg">
                    Martes a Viernes: 9:00 - 17:00
                    <br />
                    Sábados: 9:00 - 13:00
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Card className="church-card shadow-xl">
              <CardHeader className="pb-8">
                <CardTitle className="church-text text-2xl">Envíanos un mensaje</CardTitle>
                <CardDescription className="church-text-muted text-lg">
                  Estaremos encantados de responder tus preguntas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Nombre" className="church-card h-12" />
                    <Input placeholder="Apellido" className="church-card h-12" />
                  </div>
                  <Input type="email" placeholder="Email" className="church-card h-12" />
                  <Input placeholder="Teléfono" className="church-card h-12" />
                  <Textarea placeholder="Tu mensaje..." rows={5} className="church-card" />
                  <Button className="w-full church-button-primary h-12 text-lg font-semibold">Enviar Mensaje</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
