"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Plus, Minus, Share2, BookOpen, Calendar, Book, ArrowLeft } from "lucide-react"

import { useCart } from "@/lib/hooks/use-cart"
import { useShare } from "@/lib/hooks/use-share"
import type { Product } from "@/lib/db/schema"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  // eslint-disable-next-line
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [shareMessage, setShareMessage] = useState("")
  
  const { dispatch } = useCart()
  const { shareProduct } = useShare()

  useEffect(() => {
    // Para simplificar, buscamos los productos filtrados y encontramos el ID correspondiente.
    // En una app más robusta, habría un endpoint /api/products/[id].
    // Optamos por usar /api/products para mantener consistencia con cache.
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const json = await response.json()
          const foundProduct = json.data?.find((p: Product) => p.id === parseInt(productId))
          if (foundProduct) {
            setProduct(foundProduct)
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  const addToCartWithQuantity = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          author: product.author,
          price: parseFloat(product.price),
          image: product.image || '',
        },
      })
    }
    // Opcionalmente redirigir o mostrar un toast (hemos dejado el sidebar drawer para eso)
    // router.push("/tienda/checkout") si quisiéramos ir directo.
  }

  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return numPrice.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const handleShare = async () => {
    if (!product) return;
    const result = await shareProduct({
      id: product.id,
      name: product.name,
      author: product.author,
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
      image: product.image || '',
      description: product.description,
    })

    if (result.success) {
      if (result.method === "native") {
        setShareMessage("¡Producto compartido exitosamente!")
      } else {
        setShareMessage("¡Enlace copiado al portapapeles!")
      }
      setTimeout(() => setShareMessage(""), 3000)
    } else {
      setShareMessage("Error al compartir el producto")
      setTimeout(() => setShareMessage(""), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="w-full relative aspect-[3/4] bg-white rounded-2xl p-4 shadow-sm">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 flex flex-col items-center flex-start mt-20">
        <BookOpen className="w-20 h-20 text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-church-navy-900 mb-4">Producto no encontrado</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          Lo sentimos, el producto que estás buscando no existe o ya no está disponible.
        </p>
        <Button onClick={() => router.push('/tienda')} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la tienda
        </Button>
      </div>
    )
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Retroceso Rápido */}
        <div className="mb-6">
          <Link href="/tienda" className="inline-flex items-center text-church-navy-600 hover:text-church-electric-600 transition-colors font-medium text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la tienda
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Columna Izquierda: Imagen */}
            <div className="p-6 sm:p-10 flex flex-col bg-gray-50/50 justify-center items-center">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5 transition-transform hover:scale-[1.02] duration-500">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
                {product.originalPrice && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-4 py-1.5 shadow-lg border-0">
                    ¡Oferta!
                  </Badge>
                )}
              </div>
            </div>

            {/* Columna Derecha: Información y Formulario */}
            <div className="p-6 sm:p-10 flex flex-col">
              <div className="flex-1">
                {/* Título y Autor */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-church-navy-900 mb-2 leading-tight">
                  {product.name}
                </h1>
                <p className="text-lg sm:text-xl text-gray-500 flex items-center mb-6 font-medium">
                  <BookOpen className="w-5 h-5 mr-2 text-gray-400" />
                  Por {product.author}
                </p>

                {/* Precio */}
                <div className="bg-gray-50/80 rounded-xl p-5 mb-8 border border-gray-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-4xl sm:text-5xl font-extrabold text-church-electric-600 tracking-tight">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <div className="flex flex-col">
                        <span className="text-xl text-gray-400 line-through decoration-1">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <Badge className="bg-green-100/80 border text-green-800 border-green-200 text-xs w-fit">
                          Ahorras {formatPrice((parseFloat(product.originalPrice || '0') - parseFloat(product.price)).toString())}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Descripción Detallada */}
                <div className="mb-8 pl-1">
                  <h3 className="text-xl font-bold text-church-navy-900 mb-3">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    {product.description}
                  </p>
                </div>

                {/* Información Adicional */}
                <div className="bg-blue-50/50 rounded-xl p-5 mb-8 border border-blue-100/50">
                  <h4 className="font-bold text-church-navy-900 mb-4">Información del Ejemplar</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm mr-3">
                        <Book className="w-4 h-4 text-church-electric-600" />
                      </div>
                      <span className="font-medium">Formato Físico</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm mr-3">
                        <Calendar className="w-4 h-4 text-church-electric-600" />
                      </div>
                      <span className="font-medium">Trámite Inmediato</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones y Agregado al Carrito */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                  {/* Selector de Cantidad */}
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-bold text-gray-700">Cantidad</span>
                    <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden self-start h-14">
                      <Button
                        variant="ghost"
                        onClick={decreaseQuantity}
                        className="px-4 h-full rounded-none hover:bg-gray-50 focus:ring-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 font-bold text-lg min-w-[3rem] text-center border-x-2 border-gray-100 h-full flex items-center justify-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        onClick={increaseQuantity}
                        className="px-4 h-full rounded-none hover:bg-gray-50 focus:ring-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Botón de Compra */}
                  <div className="flex-1 flex flex-col justify-end space-y-2">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-700 sm:hidden">
                       <span>Total calculado:</span>
                       <span>${(parseFloat(product.price) * quantity).toFixed(2)}</span>
                    </div>
                    <Button
                      onClick={addToCartWithQuantity}
                      className="w-full church-button-primary h-14 text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      <ShoppingCart className="w-5 h-5 mr-3" />
                      Añadir al Carrito
                    </Button>
                  </div>
                </div>

                {/* Botón Compartir Secundario */}
                 <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir este libro
                  </Button>
                  
                  {shareMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                      {shareMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
