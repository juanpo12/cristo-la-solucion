import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-church-electric-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold church-text mb-4">Grupo no encontrado</h2>
        <p className="church-text-muted mb-8">Lo sentimos, el grupo que buscas no existe o ha sido movido.</p>
        <div className="space-y-4">
          <Link href="/#grupos">
            <Button className="church-button-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Grupos
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Ir al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
