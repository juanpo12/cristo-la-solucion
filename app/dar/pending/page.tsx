"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Heart, Home } from "lucide-react"
import Link from "next/link"

interface PaymentData {
  paymentId: string | null
  status: string | null
  externalReference: string | null
}

export default function DonationPendingPage() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

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
                  Donación Pendiente
                </h1>
                <p className="text-xl text-gray-600">
                  Tu donación está siendo procesada
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="font-semibold text-yellow-800 mb-1">¿Qué significa esto?</h3>
                    <p className="text-sm text-yellow-700">
                      Tu donación está siendo verificada. Esto puede suceder cuando:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• Usaste transferencia bancaria</li>
                      <li>• El pago requiere verificación adicional</li>
                      <li>• Hay demoras en el procesamiento</li>
                    </ul>
                  </div>
                </div>
              </div>

              {paymentData?.paymentId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>ID de referencia:</strong> {paymentData.paymentId}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Guarda este número para futuras consultas
                  </p>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">¿Qué sigue?</h3>
                <p className="text-sm text-blue-700">
                  Te notificaremos por email cuando tu donación sea confirmada. 
                  Generalmente esto ocurre en las próximas 24-48 horas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Home className="w-5 h-5 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
            <Link href="/#dar">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-3">
                <Heart className="w-5 h-5 mr-2" />
                Hacer otra donación
              </Button>
            </Link>
          </div>

          {/* Información adicional */}
          <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ¡Gracias por tu corazón generoso!
            </h3>
            <p className="text-gray-600">
              Aunque tu donación esté pendiente, ya valoramos tu intención de apoyar nuestro ministerio.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}