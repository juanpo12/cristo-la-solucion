import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { OrderService } from '@/lib/services/orders'

// Middleware de autenticación
async function requireAuth() {
  const user = await AuthService.verifyAuth()
  if (!user) {
    throw new Error('No autenticado')
  }
  return user
}

// POST - Marcar orden como entregada
export async function POST(
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

    const order = await OrderService.markAsDelivered(id)
    
    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Orden marcada como entregada',
      order
    })

  } catch (error) {
    console.error('Error marcando orden como entregada:', error)
    
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