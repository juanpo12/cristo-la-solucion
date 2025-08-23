import { Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-church-navy-900 text-white py-16 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-church-electric-500 to-church-electric-600 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">CRISTO LA SOLUCIÓN</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">Transformando vidas a través del amor de Cristo</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xl">Enlaces Rápidos</h4>
            <div className="space-y-3">
              <Link
                href="#vision"
                className="block text-gray-300 hover:text-church-electric-400 transition-colors text-lg"
              >
                Visión
              </Link>
              <Link
                href="#grupos"
                className="block text-gray-300 hover:text-church-electric-400 transition-colors text-lg"
              >
                Grupos
              </Link>
              <Link
                href="#reuniones"
                className="block text-gray-300 hover:text-church-electric-400 transition-colors text-lg"
              >
                Reuniones
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xl">Ministerios</h4>
            <div className="space-y-3">
              <p className="text-gray-300 text-lg">Invictos Kids</p>
              <p className="text-gray-300 text-lg">Invictos Teens</p>
              <p className="text-gray-300 text-lg">Invictos</p>
              <p className="text-gray-300 text-lg">GDC</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xl">Contacto</h4>
            <div className="space-y-3 text-gray-300 text-lg">
              <p>Av. Juan Manuel de Rosas 4357</p>
              <p>San Justo</p>
              <p>+54 9 11 2864-8642</p>
              <p>oficinasclsj@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
          <p className="text-lg">&copy; {new Date().getFullYear()} Cristo La Solución. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
