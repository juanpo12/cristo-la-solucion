import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, Book, Users, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PastoresPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header con imagen de fondo */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image 
          src="/frente.jpg" 
          alt="Pastores Alfredo y Celina" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-church-electric-600/80 to-church-navy-600/80" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">NUESTROS PASTORES</h1>
            <p className="text-xl md:text-2xl opacity-90 drop-shadow-md">
              Líderes dedicados al servicio de Dios y su pueblo
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
        <div className="max-w-4xl mx-auto">
          {/* Información de los Pastores */}
          <Card className="church-card shadow-2xl border-0 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Imagen de los Pastores */}
              <div className="relative h-96 md:h-auto">
                <Image
                  src="/frente.jpg"
                  alt="Pastores Alfredo Daniel Dimiro y Celina del Valle López"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Información */}
              <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold church-text mb-4">
                      ALFREDO DANIEL DIMIRO
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-bold church-text mb-6">
                      CELINA DEL VALLE LÓPEZ
                    </h3>
                  </div>

                  <div className="flex items-center space-x-3 text-church-electric-600">
                    <Users className="w-6 h-6" />
                    <span className="text-lg font-semibold">Pastores Principales</span>
                  </div>

                  <div className="flex items-center space-x-3 text-church-electric-600">
                    <Star className="w-6 h-6" />
                    <span className="text-lg font-semibold">Más de 30 años de ministerio</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Historia y Ministerio */}
          <div className="mt-16 space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold church-text mb-8">Su Historia y Ministerio</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl church-text-muted leading-relaxed text-justify">
                Pastorean la iglesia <strong className="church-text">Cristo La Solución, San Justo</strong>, hace más de treinta años. 
                Alfredo es un maestro de las Escrituras, le apasiona desmenuzar los versos bíblicos y estudiarlos 
                detalladamente para enseñárselo a las personas. Algunos de sus estudios pueden encontrarse en los 
                libros que escribió: <em>&quot;El poder de la pasión&quot;</em>; <em>&quot;Desechando maldiciones&quot;</em>; 
                <em>&quot;Administración financiera&quot;</em>; entre otros.
              </p>

              <p className="text-xl church-text-muted leading-relaxed text-justify mt-6">
                Por otro lado, Celina lo acompaña siendo usada por Dios en oración y consejería. Ambos, dedican 
                sus vidas al ministerio y a la iglesia local, ya que el deseo de sus corazones es vivir por y para Él. 
                Están agradecidos por el llamado que recibieron sus vidas y por haber visto la bondad de Dios para 
                con ellos, su familia e iglesia.
              </p>
            </div>

            {/* Características del Ministerio */}
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              <Card className="church-card hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-church-electric-500 to-church-navy-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Book className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold church-text mb-4">Pastor Alfredo</h3>
                  <p className="church-text-muted leading-relaxed">
                    Maestro de las Escrituras, apasionado por el estudio detallado de la Palabra de Dios. 
                    Autor de múltiples libros que han impactado vidas.
                  </p>
                </CardContent>
              </Card>

              <Card className="church-card hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-church-electric-500 to-church-navy-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold church-text mb-4">Pastora Celina</h3>
                  <p className="church-text-muted leading-relaxed">
                    Usada por Dios en oración y consejería, acompañando el ministerio con un corazón 
                    dedicado al cuidado pastoral de la congregación.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-church-electric-500 to-church-navy-600 rounded-2xl p-12 text-white mt-16">
              <h3 className="text-4xl font-bold mb-4">¿Quieres conocer más?</h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Te invitamos a ser parte de nuestra comunidad y conocer personalmente a nuestros pastores
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-church-electric-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  Visítanos
                </Button>
                <Link href="/tienda">
                  <Button size="lg" className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-church-electric-600 px-8 py-4 text-lg font-semibold transition-all duration-300">
                    Ver Libros del Pastor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}