"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Heart, Home, Receipt } from "lucide-react"
import Link from "next/link"

interface PaymentData {
  paymentId: string | null
  status: string | null
  externalReference: string | null
  merchantOrderId: string | null
}

export default function DonationSuccessPage() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    const externalReference = searchParams.get('external_reference')
    const merchantOrderId = searchParams.get('merchant_order_id')

    setPaymentData({
      paymentId,
      status,
      externalReference,
      merchantOrderId
    })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Mensaje de éxito */}
          <Card className="text-center p-8 mb-8 border-0 shadow-lg">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-green-600 mb-2">
                  ¡Donación Exitosa!
                </h1>
                <p className="text-xl text-gray-600">
                  Tu donación ha sido procesada correctamente
                </p>
              </div>

              {paymentData?.paymentId && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Receipt className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">ID de Pago:</span>
                    <span className="font-mono text-sm">{paymentData.paymentId}</span>
                  </div>
                  {paymentData.externalReference && (
                    <div className="flex items-center justify-center space-x-2">
                      <Heart className="w-5 h-5 text-gray-500" />
                      <span className="font-semibold">Referencia:</span>
                      <span className="font-mono text-sm">{paymentData.externalReference}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">¡Gracias por tu generosidad!</h3>
                <p className="text-sm text-blue-700">
                  Tu donación nos ayuda a continuar con nuestra misión de transformar vidas y servir a la comunidad.
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

          {/* Mensaje adicional */}
          <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">
              Tu generosidad marca la diferencia en la vida de muchas personas. 
              ¡Que Dios bendiga tu corazón generoso!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}