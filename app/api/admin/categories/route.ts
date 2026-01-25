import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { CategoryService } from '@/lib/services/categories'
import { z } from 'zod'

const createCategorySchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().optional(),
    icon: z.string().optional(),
})

// GET: Obtener todas las categorías (admin)
export async function GET() {
    try {
        const user = await AuthService.verifyAuth()
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const categories = await CategoryService.getAll()
        return NextResponse.json(categories)
    } catch (error) {
        console.error('Error fetching admin categories:', error)
        return NextResponse.json(
            { error: 'Error al obtener categorías' },
            { status: 500 }
        )
    }
}

// POST: Crear categoría
export async function POST(request: NextRequest) {
    try {
        const user = await AuthService.verifyAuth()
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const body = await request.json()
        const result = createCategorySchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: result.error.format() },
                { status: 400 }
            )
        }

        const category = await CategoryService.create(result.data)

        return NextResponse.json({ success: true, category }, { status: 201 })
    } catch (error) {
        console.error('Error creating category:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al crear la categoría' },
            { status: 500 }
        )
    }
}
