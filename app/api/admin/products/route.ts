import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { ProductService } from '@/lib/services/products'

import { z } from 'zod'

// Middleware de autenticación
async function requireAuth() {
  const user = await AuthService.verifyAuth()
  if (!user) {
    throw new Error('No autenticado')
  }
  return user
}

// GET - Obtener productos con filtros
export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    const { searchParams } = new URL(request.url)
    
    const filters = {
      category: searchParams.get('category') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : 
                searchParams.get('featured') === 'false' ? false : undefined,
      active: searchParams.get('active') === 'true' ? true : 
              searchParams.get('active') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as 'name' | 'price' | 'rating' | 'createdAt') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    }

    const products = await ProductService.getAll(filters)
    const stats = await ProductService.getStats()

    return NextResponse.json({
      products,
      stats
    })

  } catch (error) {
    console.error('Error obteniendo productos:', error)
    
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear producto
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    
    // Schema específico para creación
    const createSchema = z.object({
      name: z.string().min(1, "El nombre es requerido"),
      author: z.string().min(1, "El autor es requerido"),
      description: z.string().min(1, "La descripción es requerida"),
      price: z.union([z.string(), z.number()]).transform(val => String(val)),
      originalPrice: z.union([z.string(), z.number(), z.null()]).optional().transform(val => val ? String(val) : undefined),
      category: z.string().default('books'),
      image: z.string().optional(),
      featured: z.boolean().default(false),
      active: z.boolean().default(true),
      stock: z.number().default(0),
    })
    
    const productData = createSchema.parse(body)

    const product = await ProductService.create(productData)

    return NextResponse.json({
      success: true,
      product
    })

  } catch (error) {
    console.error('Error creando producto:', error)
    
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}