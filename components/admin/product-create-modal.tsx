'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Save, Loader2, Upload, Star } from 'lucide-react'
import Image from 'next/image'

interface ProductCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

interface NewProduct {
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
}

export function ProductCreateModal({ isOpen, onClose, onSave }: ProductCreateModalProps) {
  const [formData, setFormData] = useState<NewProduct>({
    name: '',
    author: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'books',
    image: '',
    featured: false,
    active: true,
    stock: 0
  })
  const [loading, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  const handleInputChange = (field: keyof NewProduct, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({
          ...prev,
          image: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    // Validaciones básicas
    if (!formData.name || !formData.author || !formData.description || !formData.price) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    setSaving(true)
    try {
      // Preparar los datos para enviar
      const dataToSend = {
        ...formData,
        price: String(formData.price),
        originalPrice: formData.originalPrice ? String(formData.originalPrice) : null,
        stock: Number(formData.stock),
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        onSave()
        handleClose()
      } else {
        const errorData = await response.json()
        console.error('Error creando producto:', errorData)
        alert('Error al crear el producto: ' + (errorData.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el producto')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      author: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'books',
      image: '',
      featured: false,
      active: true,
      stock: 0
    })
    setImagePreview('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Crear Nuevo Producto</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
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
                />
                <p className="text-sm text-gray-500">
                  Sube una imagen para el producto (JPG, PNG)
                </p>
              </div>
            </div>
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del producto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nombre del producto"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                value={formData.author}
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
              value={formData.description}
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
                value={formData.price}
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
                value={formData.stock}
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
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="books">Libros</option>
              <option value="music">Música</option>
              <option value="accessories">Accesorios</option>
              <option value="other">Otro</option>
            </select>
          </div>

          {/* Estados */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
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
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="active">Producto activo</Label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Crear producto
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}