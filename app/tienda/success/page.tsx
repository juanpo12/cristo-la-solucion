"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Package, Home, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    // Obtener parámetros de la URL
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

    // Limpiar el carrito del localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
    }
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
                  ¡Pago Exitoso!
                </h1>
                <p className="text-xl text-gray-600">
                  Tu compra ha sido procesada correctamente
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
                      <Package className="w-5 h-5 text-gray-500" />
                      <span className="font-semibold">Número de Orden:</span>
                      <span className="font-mono text-sm">{paymentData.externalReference}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">¿Qué sigue?</h3>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Recibirás un email de confirmación</li>
                  <li>• Te contactaremos para coordinar la entrega</li>
                  <li>• Los libros físicos se entregan en la iglesia</li>
                  <li>• Tiempo estimado: 2-3 días hábiles</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
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
          <Card className="mt-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">¿Necesitas ayuda?</h3>
              <p className="text-gray-600 mb-4">
                Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:
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