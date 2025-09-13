import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import type { Product } from '@/lib/db/schema'

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

interface ProductsResponse {
  success: boolean
  data: Product[]
  count: number
  error?: string
}

const fetchProducts = async (filters: ProductFilters = {}): Promise<Product[]> => {
  const searchParams = new URLSearchParams()
  
  // Agregar filtros a los parámetros de búsqueda
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  
  const response = await fetch(`/api/products?${searchParams.toString()}`)
  
  if (!response.ok) {
    throw new Error('Error al cargar productos')
  }
  
  const data: ProductsResponse = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'Error al cargar productos')
  }
  
  return data.data
}

export const useProducts = (
  filters: ProductFilters = {},
  options?: Omit<UseQueryOptions<Product[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  })
}

// Hook específico para productos en stock
export const useProductsInStock = (
  filters: Omit<ProductFilters, 'inStock'> = {},
  options?: Omit<UseQueryOptions<Product[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useProducts(
    { ...filters, inStock: true },
    options
  )
}

// Hook específico para productos destacados
export const useFeaturedProducts = (
  limit = 6,
  options?: Omit<UseQueryOptions<Product[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useProducts(
    { featured: true, inStock: true, limit },
    options
  )
}

// Hook para buscar productos
export const useSearchProducts = (
  searchTerm: string,
  filters: Omit<ProductFilters, 'search'> = {},
  options?: Omit<UseQueryOptions<Product[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useProducts(
    { ...filters, search: searchTerm, inStock: true },
    {
      enabled: searchTerm.length > 0,
      ...options,
    }
  )
}