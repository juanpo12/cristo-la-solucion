"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Settings, ExternalLink } from "lucide-react"

export function MercadoPagoStatus() {
  const [status, setStatus] = useState<'checking' | 'configured' | 'not-configured'>('checking')
  const [details, setDetails] = useState<string>('')

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = () => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
    
    if (!publicKey || publicKey === 'TEST-your-real-test-key-here') {
      setStatus('not-configured')
      setDetails('Las credenciales de Mercado Pago no están configuradas')
    } else if (publicKey.startsWith('APP_USR-')) {
      setStatus('configured')
      setDetails('Mercado Pago configurado y listo para procesar pagos')
    } else if (publicKey.startsWith('TEST-')) {
      setStatus('configured')
      setDetails('Configurado con credenciales de prueba')
    } else {
      setStatus('not-configured')
      setDetails('Credenciales de Mercado Pago inválidas')
    }
  }

  if (status === 'checking') {
    return null
  }

  if (status === 'configured') {
    return (
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Mercado Pago Configurado</p>
              <p className="text-sm text-green-700">{details}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-orange-800 mb-2">Configuración Pendiente</p>
            <p className="text-sm text-orange-700 mb-3">{details}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
                onClick={() => window.open('/OBTENER_CREDENCIALES_MP.md', '_blank')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Guía de Configuración
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
                onClick={() => window.open('https://www.mercadopago.com.ar/developers', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Panel de Desarrolladores
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}