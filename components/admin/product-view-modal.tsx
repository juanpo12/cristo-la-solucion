'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Package, Star, Calendar, DollarSign, Archive } from 'lucide-react'

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

interface ProductViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

export function ProductViewModal({ product, isOpen, onClose, onEdit }: ProductViewModalProps) {
  if (!isOpen || !product) return null

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(parseFloat(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Detalles del Producto</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Imagen y información básica */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-16 w-16 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
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
                <p className="text-lg text-gray-600 mb-3">por {product.author}</p>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Información de precios y stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </div>
                {product.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </div>
                )}
                <div className="text-sm text-gray-600">Precio actual</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Archive className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className={`text-2xl font-bold ${product.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                  {product.stock}
                </div>
                <div className="text-sm text-gray-600">
                  {product.stock <= 5 ? 'Stock bajo' : 'En stock'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold text-gray-900">
                  {parseFloat(product.rating).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">
                  {product.reviewCount} reseñas
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Información del producto</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">#{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <Badge variant={product.active ? "default" : "secondary"}>
                    {product.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Destacado:</span>
                  <Badge variant={product.featured ? "secondary" : "outline"} className={product.featured ? "bg-yellow-100 text-yellow-800" : ""}>
                    {product.featured ? 'Sí' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Fechas</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Creado</div>
                    <div className="font-medium">{formatDate(product.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Actualizado</div>
                    <div className="font-medium">{formatDate(product.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button onClick={onEdit}>
              Editar producto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}