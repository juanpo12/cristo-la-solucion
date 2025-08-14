"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Book, Music, Shirt, Heart, Filter, Search, X, Plus, Minus, Share2, BookOpen, Calendar, Award } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/hooks/use-cart"
import { useFavorites } from "@/lib/hooks/use-favorites"
import { useShare } from "@/lib/hooks/use-share"
import Image from "next/image"

const categories = [
  { id: "all", name: "Todos", icon: Heart },
  { id: "books", name: "Libros", icon: Book },
  { id: "music", name: "Música", icon: Music },
  { id: "apparel", name: "Ropa", icon: Shirt },
]

const products = [
  {
    id: 1,
    name: "EL PODER DE LA ORACIÓN",
    author: "Alfredo Dimiro",
    price: 25.99,
    originalPrice: 32.99,
    category: "books",
    image: "/LIBROS DEL PASTOR ALFREDO DIMIRO0000.png",
    rating: 4.8,
    reviews: 124,
    description:
      "La oración es el principal medio de comunicación que el hombre tiene para entrar en contacto con el ser más importante del universo. Dios ha inclinado su oído hacia usted.",
    featured: true,
  },
  {
    id: 2,
    name: "EL PODER DE LA PASIÓN",
    author: "Alfredo Dimiro",
    price: 18.99,
    category: "books",
    image: "/LIBROS DEL PASTOR ALFREDO DIMIRO0001.png",
    rating: 4.9,
    reviews: 89,
    description:
      "Al descubrir su contenido usted comprenderá los valores y conceptos que Dios ha puesto a nuestra disposición, entendiendo como utilizar el poder de la pasión.",
  },
  {
    id: 3,
    name: "EL PODER DE LA IMAGINACIÓN",
    author: "Alfredo Dimiro",
    price: 15.99,
    category: "books",
    image: "/LIBROS DEL PASTOR ALFREDO DIMIRO0002.png",
    rating: 4.7,
    reviews: 45,
    description:
      "Muchos cristianos fueron engañados y formados con una imagen derrotada y empobrecida, pero la revelación de la palabra nos despierta a la genuina y correcta imagen del Dios verdadero.",
  },
  {
    id: 4,
    name: "SALMO 91",
    author: "Alfredo Dimiro",
    price: 12.99,
    category: "books",
    image: "/LIBROS DEL PASTOR ALFREDO DIMIRO0003.png",
    rating: 4.6,
    reviews: 67,
    description:
      "El Salmos 91 no es una metáfora, es un diseño de vida que está activo para este tiempo. En el libro, va a encontrar un estudio de cada versículo de este salmo para aprender a vivir en la protección divina de nuestro Dios.",
  },
  {
    id: 5,
    name: "EL PODER DEL TRABAJO",
    author: "Alfredo Dimiro",
    price: 45.99,
    originalPrice: 55.99,
    category: "books",
    image: "/LIBROS DEL PASTOR ALFREDO DIMIRO0004.png",
    rating: 4.9,
    reviews: 156,
    description:
      "Muchos trabajan, trabajan, trabajan, y nunca pueden superarse. Nunca pueden aumentar sus ingresos; nunca pueden aumentar sus realizaciones; nunca pueden aumentar sus cosas, cuando Dios es un Dios de aumento. Comprender el poder del trabajo es vital para cada creyente.",
    featured: true,
  },
  {
    id: 6,
    name: "EL PODER DE LA PATERNIDAD",
    author: "Alfredo Dimiro",
    price: 8.99,
    category: "books",
    image: "/LIBROS DEL PASTOR ALFREDO DIMIRO0005.png",
    rating: 4.5,
    reviews: 23,
    description:
      "Tener una padre espiritual es de gran valor. El estar conectado apropiadamente produce mucho fruto y trae bendiciones sin límites. Es un imperativo para ser exitoso en la vida y en el ministerio.",
  },
  {
    id: 7,
    name: "EL PODER DE LAS PRIMICIAS",
    author: "Alfredo Dimiro",
    price: 22.99,
    category: "books",
    image: "/LIBROS DEL PASTOR ALFREDO DIMIRO0006.png",
    rating: 4.7,
    reviews: 78,
    description:
      "Ponerlo a Dios primero en todo es la clave de una vida fructífera y próspera. El beneficio de que pongamos a Dios primero es que se establezca la bendición, una habilidad para tener éxito y triunfar.",
  },
  {
    id: 8,
    name: "CAMINO HACIA LA SANIDAD",
    author: "Alfredo Dimiro",
    price: 12.99,
    category: "books",
    image: "/LIBROS DEL PASTOR ALFREDO DIMIRO0007.png",
    rating: 4.4,
    reviews: 34,
    description:
      "Muchas personas que están enfermas aceptan con resignación su condición. No hay razón para resignarse, usted puede encontrar el camino hacia su sanidad. No hay razón para agotarse en búsquedas, tan infructuosas como solitarias, Dios ha provisto para usted la salud que anhela.",
  },
]

export default function TiendaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [shareMessage, setShareMessage] = useState("")
  const { dispatch } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { shareProduct } = useShare()
  const searchParams = useSearchParams()

  // Detectar producto compartido en URL y abrir modal automáticamente
  useEffect(() => {
    const productId = searchParams.get('product')
    if (productId) {
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
  }, [searchParams])

  // Filtrar productos basado en búsqueda y categoría
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const addToCart = (product: (typeof products)[0]) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        author: product.author,
        price: product.price,
        image: product.image,
      },
    })
  }

  const openProductModal = (product: (typeof products)[0]) => {
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

  const addToCartWithQuantity = (product: (typeof products)[0], qty: number) => {
    for (let i = 0; i < qty; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          author: product.author,
          price: product.price,
          image: product.image,
        },
      })
    }
    closeModal()
  }

  const handleToggleFavorite = (e: React.MouseEvent, product: (typeof products)[0]) => {
    e.stopPropagation() // Evitar que se abra el modal
    toggleFavorite({
      id: product.id,
      name: product.name,
      author: product.author,
      price: product.price,
      image: product.image,
    })
  }

  const handleShare = async (product: (typeof products)[0]) => {
    const result = await shareProduct({
      id: product.id,
      name: product.name,
      author: product.author,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header de la tienda */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold church-text mb-6">TIENDA MINISTERIAL</h1>
          <p className="text-xl church-text-muted max-w-3xl mx-auto leading-relaxed">
            Descubre libros del Pastor Alfredo Dimiro que fortalecerán tu fe y te ayudarán en tu crecimiento espiritual
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar libros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-church-electric-400"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 h-12 rounded-full border-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-church-electric-600 text-white border-church-electric-600"
                    : "border-church-electric-200 hover:bg-church-electric-50 hover:border-church-electric-400 bg-transparent"
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Productos Destacados */}
        {selectedCategory === "all" && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold church-text mb-8 flex items-center">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              Productos Destacados
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
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
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm church-text-muted">
                              {product.rating} ({product.reviews} reseñas)
                            </span>
                          </div>
                          <p className="church-text-muted mb-4 leading-relaxed text-sm">{product.description}</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              {product.originalPrice && (
                                <span className="text-base md:text-lg text-gray-400 line-through">${product.originalPrice}</span>
                              )}
                              <span className="text-2xl md:text-3xl font-bold text-church-electric-600">${product.price}</span>
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

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold church-text mb-2">No se encontraron productos</h3>
              <p className="text-church-text-muted">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs church-text-muted">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                        )}
                        <span className="text-xl font-bold text-church-electric-600">${product.price}</span>
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold church-text">Detalles del Producto</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Imagen del Producto */}
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
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

                  {/* Rating y Reseñas */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(selectedProduct.rating) 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold">{selectedProduct.rating}</span>
                    </div>
                    <div className="flex items-center text-church-text-muted">
                      <Award className="w-4 h-4 mr-1" />
                      <span>({selectedProduct.reviews} reseñas)</span>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      {selectedProduct.originalPrice && (
                        <span className="text-2xl text-gray-400 line-through">
                          ${selectedProduct.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-church-electric-600">
                        ${selectedProduct.price}
                      </span>
                      {selectedProduct.originalPrice && (
                        <Badge className="bg-green-100 text-green-800 text-sm">
                          Ahorra ${(selectedProduct.originalPrice - selectedProduct.price).toFixed(2)}
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
                        ${(selectedProduct.price * quantity).toFixed(2)}
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
