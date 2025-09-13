import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/products'
import { insertProductSchema } from '@/lib/db/schema'
import { z } from 'zod'

// GET /api/products - Obtener productos con filtros
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
    
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    })
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

// POST /api/products - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos
    const validatedData = insertProductSchema.parse(body)
    
    const product = await ProductService.create(validatedData)
    
    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create product' 
      },
      { status: 500 }
    )
  }
}