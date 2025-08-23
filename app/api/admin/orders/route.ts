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

// GET - Obtener órdenes con filtros
export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    const { searchParams } = new URL(request.url)
    
    const filters = {
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      dateFrom: searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined,
      dateTo: searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined,
      sortBy: (searchParams.get('sortBy') as 'createdAt' | 'total' | 'status') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    }

    const orders = await OrderService.getAll(filters)
    const stats = await OrderService.getStats(filters.dateFrom, filters.dateTo)

    return NextResponse.json({
      orders,
      stats
    })

  } catch (error) {
    console.error('Error obteniendo órdenes:', error)
    
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