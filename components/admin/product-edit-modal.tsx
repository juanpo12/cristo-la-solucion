'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { X, Save, Loader2, Upload, Star } from 'lucide-react'
import Image from 'next/image'

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

interface ProductEditModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
}

interface Category {
  id: number
  name: string
  slug: string
}

export function ProductEditModal({ product, isOpen, onClose, onSave }: ProductEditModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({})
  const [loading, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (product) {
      setFormData(product)
      setImagePreview(product.image || '')
    }
  }, [product])

  useEffect(() => {
    if (!isOpen) return
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [isOpen])

  const handleInputChange = (field: keyof Product, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'productos')
      formData.append('folder', 'products')

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setImagePreview(data.url)
      setFormData(prev => ({ ...prev, image: data.url }))
    } catch {
      alert('No se pudo subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!product || !formData) return

    setSaving(true)
    try {
      // Preparar los datos para enviar
      const dataToSend = {
        ...formData,
        price: formData.price ? String(formData.price) : undefined,
        originalPrice: formData.originalPrice ? String(formData.originalPrice) : null,
        stock: formData.stock ? Number(formData.stock) : 0,
      }

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        const result = await response.json()
        onSave(result.product)
        onClose()
      } else {
        const errorData = await response.json()
        console.error('Error actualizando producto:', errorData)
        alert('Error al actualizar el producto: ' + (errorData.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el producto')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Editar Producto</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Imagen del producto */}
          <div className="space-y-2">
            <Label>Imagen del producto</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <Image 
                    src={imagePreview} 
                    alt="Preview"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-2"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Subiendo imagen...
                  </p>
                )}
                {!uploading && (
                  <p className="text-sm text-gray-500">
                    Se guarda en Supabase Storage (JPG, PNG)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del producto *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nombre del producto"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                value={formData.author || ''}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Nombre del autor"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción del producto"
              rows={4}
            />
          </div>

          {/* Precios y stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Precio original</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={formData.originalPrice || ''}
                onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock || 0}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <select
              id="category"
              value={formData.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Estados */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured || false}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="featured" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Producto destacado
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active !== false}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="active">Producto activo</Label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}