"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, Heart, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

interface PaymentData {
  paymentId: string | null
  status: string | null
  externalReference: string | null
}

function DonationFailureContent() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  useEffect(() => {
    const paymentId = searchParams.get("payment_id")
    const status = searchParams.get("status")
    const externalReference = searchParams.get("external_reference")

    setPaymentData({
      paymentId,
      status,
      externalReference,
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Mensaje de error */}
          <Card className="text-center p-8 mb-8 border-0 shadow-lg">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-red-600 mb-2">
                  Donación No Procesada
                </h1>
                <p className="text-xl text-gray-600">
                  Hubo un problema al procesar tu donación
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">
                  Posibles causas:
                </h3>
                <ul className="text-sm text-red-700 text-left space-y-1">
                  <li>• Fondos insuficientes en la tarjeta</li>
                  <li>• Datos de la tarjeta incorrectos</li>
                  <li>• Problemas de conexión</li>
                  <li>• Límites de la tarjeta excedidos</li>
                </ul>
              </div>

              {paymentData?.paymentId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>ID de referencia:</strong> {paymentData.paymentId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#dar">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <RefreshCw className="w-5 h-5 mr-2" />
                Intentar de nuevo
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-3">
                <Home className="w-5 h-5 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>

          {/* Información de contacto */}
          <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-gray-600 mb-4">
              Si continúas teniendo problemas, puedes contactarnos o intentar con otro método de pago.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/contacto">
                <Button variant="outline" size="sm">
                  Contactar soporte
                </Button>
              </Link>
              <Link href="/#dar">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Ver otros métodos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DonationFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>}>
      <DonationFailureContent />
    </Suspense>
  )
}