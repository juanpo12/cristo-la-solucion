import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { CategoryService } from '@/lib/services/categories'
import { z } from 'zod'

const updateCategorySchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    active: z.boolean().optional(),
})

// PUT: Actualizar categoría
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await AuthService.verifyAuth()
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const { id: idStr } = await params
        const id = parseInt(idStr)

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        const body = await request.json()
        const result = updateCategorySchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.format() },
                { status: 400 }
            )
        }

        const category = await CategoryService.update(id, result.data)

        if (!category) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
        }

        return NextResponse.json({ success: true, category })
    } catch (error) {
        console.error('Error updating category:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al actualizar la categoría' },
            { status: 500 }
        )
    }
}

// DELETE: Eliminar categoría (soft delete)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await AuthService.verifyAuth()
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const { id: idStr } = await params
        const id = parseInt(idStr)

        if (isNaN(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
        }

        const category = await CategoryService.delete(id)

        if (!category) {
            return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting category:', error)
        return NextResponse.json(
            { error: 'Error al eliminar la categoría' },
            { status: 500 }
        )
    }
}
