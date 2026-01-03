'use server'

import { ProductService } from '@/lib/services/products'
import type { Product } from '@/lib/db/schema'
import { revalidateTag } from 'next/cache'

interface ProductFilters {
  category?: string
  featured?: boolean
  active?: boolean
  inStock?: boolean
  search?: string
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

interface ProductsResult {
  success: boolean
  data?: Product[]
  error?: string
  count?: number
}

// Server action para obtener productos con caché optimizado
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResult> {
  try {
    // Aplicar filtros por defecto para optimización
    const defaultFilters = {
      active: true,
      inStock: true,
      ...filters
    }

    const products = await ProductService.getAll(defaultFilters)

    return {
      success: true,
      data: products,
      count: products.length
    }
  } catch (error) {
    console.error('Error in getProducts server action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al obtener productos'
    }
  }
}

// Server action para obtener productos destacados
export async function getFeaturedProducts(limit = 6): Promise<ProductsResult> {
  try {
    const products = await ProductService.getFeatured(limit)

    return {
      success: true,
      data: products,
      count: products.length
    }
  } catch (error) {
    console.error('Error in getFeaturedProducts server action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al obtener productos destacados'
    }
  }
}

// Server action para buscar productos
export async function searchProducts(query: string, limit = 10): Promise<ProductsResult> {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: true,
        data: [],
        count: 0
      }
    }

    const products = await ProductService.search(query.trim(), limit)

    return {
      success: true,
      data: products,
      count: products.length
    }
  } catch (error) {
    console.error('Error in searchProducts server action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al buscar productos'
    }
  }
}

// Server action para obtener un producto por ID
export async function getProductById(id: number): Promise<{ success: boolean; data?: Product; error?: string }> {
  try {
    const product = await ProductService.getById(id)

    if (!product) {
      return {
        success: false,
        error: 'Producto no encontrado'
      }
    }

    return {
      success: true,
      data: product
    }
  } catch (error) {
    console.error('Error in getProductById server action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al obtener el producto'
    }
  }
}
