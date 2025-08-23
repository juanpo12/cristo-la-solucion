"use client"

import { useState } from "react"
import { X, CreditCard, User, Mail, Phone, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMercadoPago } from "@/lib/hooks/use-mercadopago"
import { useCart } from "@/lib/hooks/use-cart"
import Image from "next/image"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { state } = useCart()
  const { createPayment, isLoading, error } = useMercadoPago()
  
  const [payerInfo, setPayerInfo] = useState({
    name: '',
    surname: '',
    email: '',
    phone: {
      area_code: '11',
      number: ''
    }
  })

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      setPayerInfo(prev => ({
        ...prev,
        phone: { ...prev.phone, number: value }
      }))
    } else {
      setPayerInfo(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleCheckout = async () => {
    if (!payerInfo.email || !payerInfo.name) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    // Convertir items del carrito al formato de Mercado Pago
    const items = state.items.map(item => ({
      id: item.id,
      name: item.name,
      author: item.author,
      price: item.price,
      image: item.image,
      quantity: item.quantity
    }))

    const paymentUrl = await createPayment(items, payerInfo)
    
    if (paymentUrl) {
      // Redirigir a Mercado Pago
      window.location.href = paymentUrl
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold church-text">Finalizar Compra</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Resumen del pedido */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Resumen del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.items.map((item) => (
                    <div key={`${item.id}-${Math.random()}`} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="relative w-16 h-20 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-600">{item.author}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">Cantidad: {item.quantity}</span>
                          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-church-electric-600">${total.toFixed(2)} ARS</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información del comprador */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        Nombre *
                      </Label>
                      <Input
                        id="name"
                        value={payerInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="surname">Apellido *</Label>
                      <Input
                        id="surname"
                        value={payerInfo.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        placeholder="Tu apellido"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={payerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      Teléfono (opcional)
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        value={payerInfo.phone.area_code}
                        onChange={(e) => setPayerInfo(prev => ({
                          ...prev,
                          phone: { ...prev.phone, area_code: e.target.value }
                        }))}
                        placeholder="11"
                        className="w-20"
                      />
                      <Input
                        id="phone"
                        value={payerInfo.phone.number}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="1234-5678"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Información de entrega */}
                  <div className="bg-blue-50 rounded-lg p-4 mt-6">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Información de Entrega</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Los libros se entregan en la iglesia los domingos después del servicio. 
                          Te contactaremos para coordinar la entrega.
                        </p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading || !payerInfo.email || !payerInfo.name}
                    className="w-full church-button-primary h-12 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pagar con Mercado Pago
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <span>Pagos seguros con</span>
                      <span className="font-semibold text-blue-600">Mercado Pago</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Aceptamos todas las tarjetas de crédito y débito
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}