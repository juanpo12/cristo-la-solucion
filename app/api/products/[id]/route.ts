import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/products'

// GET /api/products/[id] - Obtener producto por ID (público, solo lectura).
// Las mutaciones (editar/borrar) viven en /api/admin/products/[id] y exigen auth de admin.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const product = await ProductService.getById(id)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
