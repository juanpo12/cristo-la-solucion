import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/products'

// GET /api/products - Obtener productos con filtros (público, solo lectura).
// Las mutaciones (crear/editar/borrar) viven en /api/admin/products y exigen auth de admin.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const sortBy = searchParams.get('sortBy') as 'name' | 'price' | 'rating' | 'createdAt' | null

    const filters = {
      category: searchParams.get('category') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      active: searchParams.get('active') !== 'false', // Por defecto true
      inStock: searchParams.get('inStock') !== 'false', // Por defecto true - solo productos con stock
      search: searchParams.get('search') || undefined,
      sortBy: sortBy || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    }

    const products = await ProductService.getAll(filters)

    return NextResponse.json(
      { success: true, data: products, count: products.length },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' } }
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products'
      },
      { status: 500 }
    )
  }
}
