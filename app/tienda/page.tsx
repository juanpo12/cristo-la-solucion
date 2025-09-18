"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Book, Shirt, Heart, Filter, Search, X, Plus, Minus, Share2, BookOpen, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/hooks/use-cart"
import { useFavorites } from "@/lib/hooks/use-favorites"
import { useShare } from "@/lib/hooks/use-share"
import { useProductsInStock } from "@/lib/hooks/use-products"
import { ProductGridSkeleton } from "@/components/product-skeleton"
// import { MercadoPagoStatus } from "@/components/mercadopago-status"
import type { Product } from "@/lib/db/schema"
import Image from "next/image"

const categories = [
  { id: "all", name: "Todos", icon: Heart },
  { id: "books", name: "Libros", icon: Book },
  { id: "merch", name: "Merchandising", icon: Shirt },
]

export default function TiendaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [shareMessage, setShareMessage] = useState("")
  const { dispatch } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { shareProduct } = useShare()
  const searchParams = useSearchParams()

  // Usar el hook optimizado para cargar productos
  const { 
    data: products = [], 
    isLoading: loading, 
    error,
    refetch 
  } = useProductsInStock({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchTerm.length > 2 ? searchTerm : undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }, {
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  // Detectar producto compartido en URL y abrir modal automáticamente
  useEffect(() => {
    const productId = searchParams.get('product')
    if (productId && products.length > 0) {
      const product = products.find(p => p.id === parseInt(productId))
      if (product) {
        setSelectedProduct(product)
        setIsModalOpen(true)
        
        // Limpiar el parámetro de la URL sin recargar la página
        const url = new URL(window.location.href)
        url.searchParams.delete('product')
        window.history.replaceState({}, '', url.toString())
      }
    }
  }, [searchParams, products])

  // Los productos ya vienen filtrados del hook, solo necesitamos memoizar para optimización
  const filteredProducts = useMemo(() => {
    // Si hay búsqueda local adicional (menos de 3 caracteres)
    if (searchTerm.length > 0 && searchTerm.length <= 2) {
      return products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
      })
    }
    return products
  }, [products, searchTerm])

  const addToCart = (product: Product) => {
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

  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
    setQuantity(1)
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  const addToCartWithQuantity = (product: Product, qty: number) => {
    for (let i = 0; i < qty; i++) {
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
    closeModal()
  }

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation() // Evitar que se abra el modal
    toggleFavorite({
      id: product.id,
      name: product.name,
      author: product.author,
      price: parseFloat(product.price),
      image: product.image || '',
    })
  }

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

  const handleShare = async (product: Product) => {
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

  // Mostrar error si hay problemas cargando productos
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <h2 className="text-2xl font-bold mb-2">Error al cargar productos</h2>
              <p className="text-gray-600 mb-4">Hubo un problema cargando los productos. Por favor, intenta nuevamente.</p>
              <Button onClick={() => refetch()} className="bg-church-electric-600 hover:bg-church-electric-700">
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 overflow-x-hidden">
      <div className="container mx-auto px-4 py-12">
        {/* Header de la tienda */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold church-text mb-6">TIENDA MINISTERIAL</h1>
          <p className="text-xl church-text-muted max-w-3xl mx-auto leading-relaxed">
            Descubre libros del pastor Alfredo Dimiro que fortalecerán tu fe y te ayudarán en tu crecimiento espiritual
          </p>
        </div>

        {/* Estado de Mercado Pago
        <MercadoPagoStatus /> */}

        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-12">
          <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar libros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base sm:text-lg border-2 border-gray-200 focus:border-church-electric-400 w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 h-10 sm:h-12 rounded-full border-2 transition-all duration-300 text-sm sm:text-base ${
                  selectedCategory === category.id
                    ? "bg-church-electric-600 text-white border-church-electric-600"
                    : "border-church-electric-200 hover:bg-church-electric-50 hover:border-church-electric-400 bg-transparent"
                }`}
              >
                <category.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Productos Destacados */}
        {selectedCategory === "all" && filteredProducts.filter((product) => product.featured).length > 0 && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold church-text mb-8">
              Productos Destacados
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {filteredProducts
                .filter((product) => product.featured)
                .map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white cursor-pointer"
                    onClick={() => openProductModal(product)}
                  >
                    {/* Layout responsive: vertical en móvil, horizontal en desktop */}
                    <div className="flex flex-col md:flex-row h-full">
                      {/* Imagen */}
                      <div className="w-full md:w-2/5 relative aspect-[3/4] md:aspect-auto">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.originalPrice && (
                          <Badge className="absolute top-3 left-3 bg-red-500 text-white text-sm px-3 py-1">
                            ¡Oferta!
                          </Badge>
                        )}
                      </div>
                      
                      {/* Contenido */}
                      <CardContent className="w-full md:w-3/5 p-4 md:p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold church-text mb-2">{product.name}</h3>
                          <p className="text-church-text-muted mb-3">{product.author}</p>

                          <p className="church-text-muted mb-4 leading-relaxed text-sm">{product.description}</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              {product.originalPrice && (
                                <span className="text-base md:text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                              )}
                              <span className="text-2xl md:text-3xl font-bold text-church-electric-600">{formatPrice(product.price)}</span>
                            </div>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              addToCart(product)
                            }}
                            className="w-full church-button-primary h-12 text-lg"
                          >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Añadir al Carrito
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Todos los Productos */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold church-text">
              {selectedCategory === "all"
                ? "Todos los Productos"
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <div className="flex items-center space-x-2 text-church-text-muted">
              <Filter className="w-5 h-5" />
              <span>{filteredProducts.length} productos encontrados</span>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold church-text mb-2">No se encontraron productos</h3>
              <p className="text-church-text-muted">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg group bg-white cursor-pointer"
                  onClick={() => openProductModal(product)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white">¡Oferta!</Badge>
                    )}
                    <div className="absolute top-3 right-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`rounded-full p-2 w-8 h-8 ${
                          isFavorite(product.id) 
                            ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                            : 'bg-white/80 hover:bg-white text-gray-700'
                        }`}
                        onClick={(e) => handleToggleFavorite(e, product)}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold church-text text-lg mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                      <p className="text-sm church-text-muted">{product.author}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                        <span className="text-xl font-bold text-church-electric-600">{formatPrice(product.price)}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                      }} 
                      className="w-full church-button-primary"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Añadir
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center bg-gradient-to-r from-church-electric-500 to-church-navy-600 rounded-2xl p-12 text-white">
          <h3 className="text-4xl font-bold mb-4">¿No encuentras lo que buscas?</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Contáctanos y te ayudaremos a encontrar el recurso perfecto para tu crecimiento espiritual
          </p>
          <Button size="lg" className="bg-white text-church-electric-600 hover:bg-gray-100 px-8 py-4 text-lg">
            Contactar Tienda
          </Button>
        </div>
      </div>

      {/* Modal del Producto */}
      {isModalOpen && selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between rounded-t-lg sm:rounded-t-2xl z-20">
              <h2 className="text-lg sm:text-2xl font-bold church-text">Detalles del Producto</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="rounded-full p-2 hover:bg-gray-100 h-8 w-8 sm:h-10 sm:w-10"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Imagen del Producto */}
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 z-0">
                    <Image
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                    {selectedProduct.originalPrice && (
                      <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-4 py-2">
                        ¡Oferta!
                      </Badge>
                    )}
                  </div>
                  
                  {/* Botones de Acción Secundarios */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className={`flex-1 ${isFavorite(selectedProduct.id) ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
                      onClick={(e) => handleToggleFavorite(e, selectedProduct)}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFavorite(selectedProduct.id) ? 'fill-current' : ''}`} />
                      {isFavorite(selectedProduct.id) ? 'En Favoritos' : 'Favoritos'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleShare(selectedProduct)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                  
                  {/* Mensaje de compartir */}
                  {shareMessage && (
                    <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-lg text-sm text-center">
                      {shareMessage}
                    </div>
                  )}
                </div>

                {/* Información del Producto */}
                <div className="space-y-6">
                  {/* Título y Autor */}
                  <div>
                    <h1 className="text-3xl font-bold church-text mb-2">{selectedProduct.name}</h1>
                    <p className="text-xl text-church-text-muted flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Por {selectedProduct.author}
                    </p>
                  </div>



                  {/* Precio */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      {selectedProduct.originalPrice && (
                        <span className="text-2xl text-gray-400 line-through">
                          {formatPrice(selectedProduct.originalPrice)}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-church-electric-600">
                        {formatPrice(selectedProduct.price)}
                      </span>
                      {selectedProduct.originalPrice && (
                        <Badge className="bg-green-100 text-green-800 text-sm">
                          Ahorra {formatPrice((parseFloat(selectedProduct.originalPrice || '0') - parseFloat(selectedProduct.price)).toString())}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Descripción Detallada */}
                  <div>
                    <h3 className="text-xl font-bold church-text mb-3">Descripción</h3>
                    <p className="text-church-text-muted leading-relaxed text-lg">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Información Adicional */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold church-text mb-3">Información del Libro</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Book className="w-4 h-4 mr-2 text-church-electric-600" />
                        <span>Formato: Libro físico</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-church-electric-600" />
                        <span>Disponible ahora</span>
                      </div>
                    </div>
                  </div>

                  {/* Selector de Cantidad y Botón de Compra */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold church-text">Cantidad:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={decreaseQuantity}
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                          {quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={increaseQuantity}
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between text-xl font-bold church-text">
                      <span>Total:</span>
                      <span className="text-church-electric-600">
                        ${(parseFloat(selectedProduct.price) * quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Botón de Añadir al Carrito */}
                    <Button
                      onClick={() => addToCartWithQuantity(selectedProduct, quantity)}
                      className="w-full church-button-primary h-14 text-lg"
                    >
                      <ShoppingCart className="w-6 h-6 mr-3" />
                      Añadir {quantity} {quantity === 1 ? 'libro' : 'libros'} al Carrito
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
