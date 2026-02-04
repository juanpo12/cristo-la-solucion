import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { OrderService } from '@/lib/services/orders'
import { z } from 'zod'

const updateStatusSchema = z.object({
    status: z.enum(['pending', 'approved', 'delivered', 'rejected', 'cancelled'])
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await AuthService.verifyAuth()
        if (!user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            )
        }

        const { id: idStr } = await params
        const id = parseInt(idStr)
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID inválido' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const result = updateStatusSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Estado inválido' },
                { status: 400 }
            )
        }

        const { status } = result.data

        // Usamos el servicio existente para actualizar
        // Nota: OrderService.updateStatus espera status y datos adicionales
        // Actualizamos solo el estado
        const order = await OrderService.updateStatus(id, status, {})

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
        console.error('Error actualizando estado de orden:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
