"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Book, Shirt, Filter, Search, X, Plus, Minus, Share2, BookOpen, Calendar, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/hooks/use-cart"
import { useProductsInStock } from "@/lib/hooks/use-products"
import { ProductGridSkeleton } from "@/components/product-skeleton"
import type { Product, Category } from "@/lib/db/schema"
import Image from "next/image"
import Link from "next/link"
import * as LucideIcons from "lucide-react"

export default function TiendaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [dbCategories, setDbCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const { dispatch } = useCart()
  const searchParams = useSearchParams()

  // Cargar categorías
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setDbCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Combinar categoría "Todos" con las de la DB
  const categories = useMemo(() => {
    const allCategory = { id: "all", name: "Todos", icon: "Package" }

    const mappedCategories = dbCategories.map(cat => ({
      id: cat.slug,
      name: cat.name,
      icon: cat.icon || "Package"
    }))

    return [allCategory, ...mappedCategories]
  }, [dbCategories])

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

  // Detectar producto compartido en URL (obsoleto, pero preservamos limpieza de URL si acaso)
  useEffect(() => {
    const productId = searchParams.get('product')
    if (productId && products.length > 0) {
      // Limpiar el parámetro de la URL sin recargar la página
      const url = new URL(window.location.href)
      url.searchParams.delete('product')
      window.history.replaceState({}, '', url.toString())
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



  // Helper para renderizar iconos dinámicos
  const renderIcon = (iconName: string) => {
    const Icon = (LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.Package) as React.ElementType
    return <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
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
            {loadingCategories ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-10 sm:h-12 w-24 bg-gray-200 rounded-full animate-pulse" />
              ))
            ) : (
              categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 h-10 sm:h-12 rounded-full border-2 transition-all duration-300 text-sm sm:text-base ${selectedCategory === category.id
                    ? "bg-church-electric-600 text-white border-church-electric-600"
                    : "border-church-electric-200 hover:bg-church-electric-50 hover:border-church-electric-400 bg-transparent"
                    }`}
                >
                  {renderIcon(category.icon as string)}
                  <span>{category.name}</span>
                </Button>
              ))
            )}
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
                  <Link href={`/tienda/${product.id}`} key={product.id} className="block group">
                  <Card
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1 border-0 shadow-lg bg-white cursor-pointer h-full"
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
                              e.preventDefault() // prevent navigating to /tienda/[id]
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
                  </Link>
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
                <Link href={`/tienda/${product.id}`} key={product.id} className="block group h-full">
                <Card
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 border-0 shadow-lg bg-white cursor-pointer h-full flex flex-col"
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
                        e.preventDefault() // prevent navigating to /tienda/[id]
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>


    </div>
  )
}
