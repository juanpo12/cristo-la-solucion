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

// GET - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const product = await ProductService.getById(id)

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })

  } catch (error) {
    console.error('Error obteniendo producto:', error)

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

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Schema específico para actualizaciones
    const updateSchema = z.object({
      name: z.string().optional(),
      author: z.string().optional(),
      description: z.string().optional(),
      price: z.union([z.string(), z.number()]).optional().transform(val => val ? String(val) : undefined),
      originalPrice: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional().transform(val => {
        if (val === null || val === undefined || val === '') return undefined
        return String(val)
      }),
      category: z.string().optional(),
      image: z.string().optional(),
      featured: z.boolean().optional(),
      active: z.boolean().optional(),
      stock: z.number().optional(),
    })

    const rawData = updateSchema.parse(body)

    // Filtrar valores undefined para evitar sobrescribir con undefined
    const updateData = Object.fromEntries(
      Object.entries(rawData).filter(([, value]) => value !== undefined)
    )

    const product = await ProductService.update(id, updateData)

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product
    })

  } catch (error) {
    console.error('Error actualizando producto:', error)

    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: (error as any).errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar producto (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const product = await ProductService.delete(id)

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error eliminando producto:', error)

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