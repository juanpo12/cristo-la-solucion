import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { OrderService } from '@/lib/services/orders'
import { z } from 'zod'

// Middleware de autenticación
async function requireAuth() {
  const user = await AuthService.verifyAuth()
  if (!user) {
    throw new Error('No autenticado')
  }
  return user
}

const updateOrderSchema = z.object({
  status: z.string().optional(),
  payerEmail: z.string().email().optional(),
  payerName: z.string().optional(),
  payerSurname: z.string().optional(),
  payerPhone: z.string().optional(),
})

// GET - Obtener orden por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const order = await OrderService.getById(id)
    
    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })

  } catch (error) {
    console.error('Error obteniendo orden:', error)
    
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

// PUT - Actualizar orden
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const updateData = updateOrderSchema.parse(body)

    const order = await OrderService.updateStatus(id, updateData.status || 'pending', updateData)
    
    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order
    })

  } catch (error) {
    console.error('Error actualizando orden:', error)
    
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