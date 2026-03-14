"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, User, Mail, Phone, MapPin, Loader2, ArrowLeft, ShoppingCart, Info, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useMercadoPago } from "@/lib/hooks/use-mercadopago"
import { useCart } from "@/lib/hooks/use-cart"
import Image from "next/image"
import Link from "next/link"
import { z } from "zod"

const checkoutSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  surname: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor ingresa un email válido"),
  phone: z.object({
    area_code: z.string().optional(),
    number: z.string().optional()
  }).optional()
})

type ValidationErrors = {
  [key: string]: string | undefined
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total } = useCart()
  const state = { items, total }
  const { createPayment, isLoading, error: mpError } = useMercadoPago()

  const [payerInfo, setPayerInfo] = useState({
    name: '',
    surname: '',
    email: '',
    phone: {
      area_code: '11',
      number: ''
    }
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isMounted, setIsMounted] = useState(false)

  // Prevenir hidratación mismatch al depender del localStorage de useCart
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Si no hay items en el carrito y ya cargó, volvemos a la tienda
  useEffect(() => {
    if (isMounted && state.items.length === 0) {
      router.push('/tienda')
    }
  }, [isMounted, state.items.length, router])

  // Función para formatear precios en pesos argentinos
  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return numPrice.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const handleInputChange = (field: string, value: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }

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
    // Validar formulario
    const result = checkoutSchema.safeParse(payerInfo)

    if (!result.success) {
      const newErrors: ValidationErrors = {}
      result.error.issues.forEach(issue => {
        const path = issue.path[0].toString()
        newErrors[path] = issue.message
      })
      setErrors(newErrors)
      // Scrollear hacia arriba para ver los errores suavemente
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Convertir items
    const cartItems = state.items.map(item => ({
      id: item.id.toString(),
      title: item.name,
      name: item.name,
      author: item.author,
      price: item.price,
      unit_price: item.price,
      image: item.image,
      quantity: item.quantity
    }))

    const paymentUrl = await createPayment(cartItems, payerInfo)

    if (paymentUrl) {
      window.location.href = paymentUrl
    }
  }

  // Prevenir render previo a hidratación
  if (!isMounted || state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-church-electric-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header / Nav de retroceso */}
        <div className="mb-8">
          <Link href="/tienda" className="inline-flex items-center text-church-navy-600 hover:text-church-electric-600 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la tienda
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-church-navy-900 mt-4 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-green-500 hidden sm:block" />
            Finalizar Compra
          </h1>
          <p className="text-gray-500 mt-2">Completa tus datos para procesar el pedido en Mercado Pago de forma segura.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Columna Izquierda: Información del comprador */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-white p-6 sm:p-8 space-y-8">

                {/* Datos Personales */}
                <div className="space-y-6">
                  <div className="flex items-center border-b border-gray-100 pb-4">
                    <div className="bg-blue-50 p-2 rounded-xl mr-4">
                      <User className="w-6 h-6 text-church-electric-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">1. Tus Datos Personales</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-semibold">Nombre *</Label>
                      <Input
                        id="name"
                        value={payerInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Ingresa tu nombre"
                        className={`h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-church-electric-500 focus-visible:border-church-electric-500 ${errors.name ? "border-red-500 bg-red-50/20" : ""}`}
                        required
                      />
                      {errors.name && <p className="text-red-500 text-sm flex items-center mt-1.5"><Info className="w-4 h-4 mr-1" />{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="surname" className="text-gray-700 font-semibold">Apellido *</Label>
                      <Input
                        id="surname"
                        value={payerInfo.surname}
                        onChange={(e) => handleInputChange('surname', e.target.value)}
                        placeholder="Ingresa tu apellido"
                        className={`h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-church-electric-500 focus-visible:border-church-electric-500 ${errors.surname ? "border-red-500 bg-red-50/20" : ""}`}
                        required
                      />
                      {errors.surname && <p className="text-red-500 text-sm flex items-center mt-1.5"><Info className="w-4 h-4 mr-1" />{errors.surname}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center">
                      <Mail className="w-4 h-4 mr-1.5 text-gray-400" /> Correo Electrónico *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={payerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className={`h-12 bg-gray-50/50 border-gray-200 focus-visible:ring-church-electric-500 focus-visible:border-church-electric-500 ${errors.email ? "border-red-500 bg-red-50/20" : ""}`}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm flex items-center mt-1.5"><Info className="w-4 h-4 mr-1" />{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-semibold flex items-center">
                      <Phone className="w-4 h-4 mr-1.5 text-gray-400" /> Teléfono (Opcional)
                    </Label>
                    <div className="flex space-x-3">
                      <Input
                        value={payerInfo.phone.area_code}
                        onChange={(e) => setPayerInfo(prev => ({
                          ...prev,
                          phone: { ...prev.phone, area_code: e.target.value }
                        }))}
                        placeholder="Cód."
                        className="w-24 h-12 bg-gray-50/50 border-gray-200"
                        title="Código de área"
                      />
                      <Input
                        id="phone"
                        value={payerInfo.phone.number}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Ej: 12345678"
                        className="flex-1 h-12 bg-gray-50/50 border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Entrega */}
                <div className="space-y-6 pt-6">
                  <div className="flex items-center border-b border-gray-100 pb-4">
                    <div className="bg-blue-50 p-2 rounded-xl mr-4">
                      <MapPin className="w-6 h-6 text-church-electric-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">2. Entrega y Retiro</h2>
                  </div>

                  <div className="bg-blue-50/60 border border-blue-100/50 rounded-xl p-5 shadow-sm">
                    <p className="text-blue-900 font-medium">
                      La coordinación del envío o punto de retiro se realiza luego a través de Mercado Pago o coordinando con nosotros. Si eres congregante, puedes retirarlo personalmente en la Iglesia.
                    </p>
                  </div>
                </div>

                {/* Payment Action */}
                <div className="pt-8">
                  {mpError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 shadow-sm flex items-start">
                      <Info className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-red-500" />
                      <p className="font-medium">{mpError}</p>
                    </div>
                  )}

                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full h-16 text-xl rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 bg-[#009ee3] hover:bg-[#008cc9] text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Generando pago seguro...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-6 h-6 mr-3" />
                        Pagar con Mercado Pago
                      </>
                    )}
                  </Button>

                  <div className="mt-6 flex flex-col items-center justify-center space-y-2 cursor-default">
                    <div className="flex items-center text-sm font-medium text-gray-500">
                      <ShieldCheck className="w-4 h-4 mr-1.5 text-green-500" />
                      Proceso 100% encriptado y seguro por <span className="font-bold text-[#009ee3] ml-1">Mercado Pago</span>
                    </div>
                    <p className="text-xs text-gray-400">Aceptamos todas las tarjetas, dinero en cuenta o pagofácil/rapipago.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Columna Derecha: Order Summary Sticky */}
          <div className="w-full lg:w-[400px] xl:w-[450px] order-1 lg:order-2">
            <div className="sticky top-28">
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold flex items-center mb-6 text-gray-900">
                    <ShoppingCart className="w-5 h-5 mr-3 text-church-electric-600" />
                    Resumen de Compra
                  </h3>

                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {state.items.map((item) => (
                      <div key={`${item.id}-${Math.random()}`} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1 truncate">{item.name}</h4>
                          <p className="text-xs text-gray-500 truncate w-full mb-1">Por {item.author}</p>
                          <div className="flex items-center justify-between text-sm mt-auto">
                            <span className="text-gray-500">Cant: <span className="text-gray-900 font-medium">{item.quantity}</span></span>
                            <span className="font-bold text-church-electric-600">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4 text-gray-600">
                      <span>Subtotal ({state.items.reduce((acc, curr) => acc + curr.quantity, 0)} items)</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6 text-gray-600">
                      <span>Envío</span>
                      <span className="text-sm font-medium">A coordinar / Retiro</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-bold text-gray-900">TOTAL</span>
                      <div className="text-right">
                        <span className="text-3xl font-black text-church-electric-600 block">{formatPrice(total)}</span>
                        <span className="text-xs text-gray-500 font-medium mt-1 inline-block">ARS (Pesos Argentinos)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
