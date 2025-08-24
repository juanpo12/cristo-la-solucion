'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    loadUserAndProducts()
  }, [])

  const loadUserAndProducts = async () => {
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
  }

  const loadProducts = async () => {
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
  }

  useEffect(() => {
    if (!loading) {
      loadProducts()
    }
  }, [searchTerm, selectedCategory, selectedStatus])

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar user={user} />
        
        <div className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                <p className="text-gray-600">Gestiona el catálogo de productos</p>
              </div>
              <Button onClick={handleCreateProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="books">Libros</option>
                    <option value="music">Música</option>
                    <option value="accessories">Accesorios</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="true">Activos</option>
                    <option value="false">Inactivos</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de productos */}
            <div className="space-y-4">
              {products.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                    <p className="text-gray-500 mb-4">Comienza agregando tu primer producto.</p>
                    <Button onClick={handleCreateProduct}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Producto
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Imagen del producto */}
                        <div className="w-full lg:w-20 h-48 lg:h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-gray-400" />
                          )}
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {product.name}
                                </h3>
                                {product.featured && (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    <Star className="w-3 h-3 mr-1" />
                                    Destacado
                                  </Badge>
                                )}
                                <Badge variant={product.active ? "default" : "secondary"}>
                                  {product.active ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">por {product.author}</p>
                              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                {product.description}
                              </p>
                              
                              {/* Información adicional */}
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                <div>
                                  <span className="text-lg font-bold text-gray-900">
                                    {formatCurrency(product.price)}
                                  </span>
                                  {product.originalPrice && (
                                    <span className="ml-2 text-sm text-gray-500 line-through">
                                      {formatCurrency(product.originalPrice)}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  Stock: <span className={product.stock <= 5 ? 'text-red-600 font-medium' : ''}>{product.stock}</span>
                                </div>
                                <div>
                                  Categoría: {product.category}
                                </div>
                              </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-wrap lg:flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleFeatured(product.id, product.featured)}
                                className="flex-1 lg:flex-none"
                              >
                                <Star className={`h-4 w-4 mr-2 ${product.featured ? 'fill-current text-yellow-500' : ''}`} />
                                {product.featured ? 'Quitar destacado' : 'Destacar'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 lg:flex-none"
                                onClick={() => handleViewProduct(product)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 lg:flex-none"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleProductStatus(product.id, product.active)}
                                className={`flex-1 lg:flex-none ${product.active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}`}
                              >
                                {product.active ? (
                                  <>
                                    <Package className="h-4 w-4 mr-2" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <Package className="h-4 w-4 mr-2" />
                                    Activar
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="flex-1 lg:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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