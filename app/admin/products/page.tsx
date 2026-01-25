'use client'

import { useEffect, useState, useCallback } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { ProductEditModal } from '@/components/admin/product-edit-modal'
import { ProductViewModal } from '@/components/admin/product-view-modal'
import { ProductCreateModal } from '@/components/admin/product-create-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Star
} from 'lucide-react'

interface AdminUser {
  id: string
  username?: string
  email: string
  role: string
}

interface Product {
  id: number
  name: string
  author: string
  description: string
  price: string
  originalPrice?: string
  category: string
  image?: string
  featured: boolean
  active: boolean
  stock: number
  rating: string
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export default function AdminProductsPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Estados para modales
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const loadProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedStatus !== 'all') params.append('active', selectedStatus)

      const response = await fetch(`/api/admin/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        console.error('Error cargando productos:', response.statusText)
        setProducts([])
      }
    } catch (error) {
      console.error('Error cargando productos:', error)
      setProducts([])
    }
  }, [searchTerm, selectedCategory, selectedStatus])

  const loadUserAndProducts = useCallback(async () => {
    try {
      // Obtener información del usuario desde Supabase
      const supabase = createClient()
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()

      if (error || !supabaseUser) {
        console.error('Error obteniendo usuario:', error)
        return
      }

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role: supabaseUser.user_metadata?.role || 'admin',
        username: supabaseUser.user_metadata?.username
      })

      // Obtener productos
      await loadProducts()

    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }, [loadProducts])

  useEffect(() => {
    loadUserAndProducts()
  }, [loadUserAndProducts])

  useEffect(() => {
    if (!loading) {
      loadProducts()
    }
  }, [loading, loadProducts])

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(parseFloat(amount))
  }

  const toggleProductStatus = async (productId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !currentStatus }),
      })

      if (response.ok) {
        await loadProducts()
      }
    } catch (error) {
      console.error('Error actualizando producto:', error)
    }
  }

  const toggleFeatured = async (productId: number, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      if (response.ok) {
        await loadProducts()
      }
    } catch (error) {
      console.error('Error actualizando producto:', error)
    }
  }

  // Funciones para manejar modales
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setViewModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  const handleEditFromView = () => {
    setViewModalOpen(false)
    setEditModalOpen(true)
  }

  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p))
    setEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handleCloseModals = () => {
    setEditModalOpen(false)
    setViewModalOpen(false)
    setCreateModalOpen(false)
    setSelectedProduct(null)
  }

  const handleCreateProduct = () => {
    setCreateModalOpen(true)
  }

  const handleSaveNewProduct = () => {
    loadProducts() // Recargar la lista de productos
    setCreateModalOpen(false)
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadProducts()
      } else {
        console.error('Error eliminando producto')
      }
    } catch (error) {
      console.error('Error eliminando producto:', error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg mb-6">
            <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-church-electric-600" />
          </div>
          <p className="text-base md:text-lg font-medium text-gray-700">Cargando productos...</p>
          <p className="text-sm text-gray-500 mt-2">Obteniendo catálogo</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <div className="flex">
        <AdminSidebar user={user} />

        <div className="flex-1 lg:ml-72">
          <div className="p-4 md:p-6 lg:p-8">
            {/* Header mejorado */}
            <div className="flex flex-col gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Productos</h1>
                <p className="text-sm md:text-base text-gray-600">Gestiona el catálogo de productos de la tienda</p>
              </div>
              <Button
                onClick={handleCreateProduct}
                className="w-full sm:w-auto bg-gradient-to-r from-church-electric-600 to-church-electric-700 hover:from-church-electric-700 hover:to-church-electric-800 shadow-lg shadow-church-electric-600/30 hover:shadow-xl hover:shadow-church-electric-600/40 transition-all duration-200"
              >
                <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Nuevo Producto
              </Button>
            </div>

            {/* Filtros mejorados */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 md:p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div className="md:col-span-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
                    <Input
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 md:pl-10 h-10 md:h-11"
                    />
                  </div>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-10 md:h-11 px-3 md:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-electric-500 focus:border-transparent transition-all"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="books">Libros</option>
                  <option value="music">Música</option>
                  <option value="accessories">Accesorios</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-10 md:h-11 px-3 md:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-electric-500 focus:border-transparent transition-all"
                >
                  <option value="all">Todos los estados</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>
            </div>

            {/* Lista de productos mejorada */}
            <div className="space-y-3 md:space-y-4">
              {products.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8 md:p-12">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 mb-4">
                      <Package className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No hay productos</h3>
                    <p className="text-sm md:text-base text-gray-500 mb-6">Comienza agregando tu primer producto al catálogo.</p>
                    <Button onClick={handleCreateProduct} className="bg-gradient-to-r from-church-electric-600 to-church-electric-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Producto
                    </Button>
                  </div>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md hover:border-church-electric-300 transition-all duration-200">
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col lg:flex-row gap-4">
                        {/* Imagen del producto */}
                        <div className="w-full lg:w-24 h-48 lg:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
                          )}
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-4">
                            {/* Cabecera */}
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-base md:text-lg font-bold text-gray-900">
                                  {product.name}
                                </h3>
                                {product.featured && (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                    <Star className="w-3 h-3 mr-1" />
                                    Destacado
                                  </Badge>
                                )}
                                <Badge variant={product.active ? "default" : "secondary"} className={product.active ? "bg-green-100 text-green-800 border-green-200" : ""}>
                                  {product.active ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </div>
                              <p className="text-xs md:text-sm text-gray-600 mb-2">por {product.author}</p>
                              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                {product.description}
                              </p>

                              {/* Información adicional */}
                              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg md:text-xl font-bold text-gray-900">
                                    {formatCurrency(product.price)}
                                  </span>
                                  {product.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                      {formatCurrency(product.originalPrice)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Package className="h-4 w-4" />
                                  <span className={product.stock <= 5 ? 'text-red-600 font-semibold' : 'font-medium'}>
                                    {product.stock} en stock
                                  </span>
                                </div>
                                <div className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 font-medium capitalize">
                                  {product.category}
                                </div>
                              </div>
                            </div>

                            {/* Acciones - Grid responsive  */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleFeatured(product.id, product.featured)}
                                className="text-xs hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700"
                              >
                                <Star className={`h-3 w-3 md:h-4 md:w-4 mr-1 ${product.featured ? 'fill-current text-yellow-500' : ''}`} />
                                <span className="hidden sm:inline">{product.featured ? 'Quitar' : 'Destacar'}</span>
                                <span className="sm:hidden">★</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewProduct(product)}
                                className="text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                              >
                                <Eye className="h-3 w-3 md:h-4 md:w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Ver</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                className="text-xs hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                              >
                                <Edit className="h-3 w-3 md:h-4 md:w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Editar</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleProductStatus(product.id, product.active)}
                                className={`text-xs ${product.active ? 'hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700' : 'hover:bg-green-50 hover:border-green-300 hover:text-green-700'}`}
                              >
                                <Package className="h-3 w-3 md:h-4 md:w-4 sm:mr-1" />
                                <span className="hidden sm:inline">{product.active ? 'Desactivar' : 'Activar'}</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-700 col-span-2 sm:col-span-1 lg:col-span-2"
                              >
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ProductViewModal
        product={selectedProduct}
        isOpen={viewModalOpen}
        onClose={handleCloseModals}
        onEdit={handleEditFromView}
      />

      <ProductEditModal
        product={selectedProduct}
        isOpen={editModalOpen}
        onClose={handleCloseModals}
        onSave={handleSaveProduct}
      />

      <ProductCreateModal
        isOpen={createModalOpen}
        onClose={handleCloseModals}
        onSave={handleSaveNewProduct}
      />
    </div>
  )
}