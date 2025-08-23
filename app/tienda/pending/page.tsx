"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Clock, Package, Home, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function PendingPage() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    const externalReference = searchParams.get('external_reference')

    setPaymentData({
      paymentId,
      status,
      externalReference
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Mensaje de pendiente */}
          <Card className="text-center p-8 mb-8 border-0 shadow-lg">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-12 h-12 text-yellow-600" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-yellow-600 mb-2">
                  Pago Pendiente
                </h1>
                <p className="text-xl text-gray-600">
                  Tu pago está siendo procesado
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="font-semibold text-yellow-800 mb-2">¿Qué significa esto?</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Tu pago está siendo verificado por el banco</li>
                      <li>• Puede tomar hasta 48 horas en confirmarse</li>
                      <li>• Recibirás una notificación cuando se complete</li>
                      <li>• No es necesario realizar otro pago</li>
                    </ul>
                  </div>
                </div>
              </div>

              {paymentData?.paymentId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>ID de Pago:</strong> {paymentData.paymentId}
                  </p>
                  {paymentData.externalReference && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Número de Orden:</strong> {paymentData.externalReference}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Mientras esperas...</h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  • <strong>Guarda este número de orden</strong> para futuras consultas
                </p>
                <p>
                  • <strong>Revisa tu email</strong> - te enviaremos actualizaciones del estado
                </p>
                <p>
                  • <strong>No cierres esta ventana</strong> hasta recibir la confirmación
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button asChild className="flex-1 church-button-primary h-12">
              <Link href="/tienda">
                <Package className="w-5 h-5 mr-2" />
                Seguir Comprando
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 h-12">
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Volver al Inicio
              </Link>
            </Button>
          </div>

          {/* Información de contacto */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">¿Tienes dudas?</h3>
              <p className="text-gray-600 mb-4">
                Si tienes alguna pregunta sobre tu pago pendiente:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> tienda@cristolasolucion.com</p>
                <p><strong>WhatsApp:</strong> +54 9 11 1234-5678</p>
                <p><strong>Horarios:</strong> Lunes a Viernes 9:00 - 18:00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}