import { NextResponse } from 'next/server'
import { CategoryService } from '@/lib/services/categories'

export async function GET() {
    try {
        const categories = await CategoryService.getActive()
        return NextResponse.json(
          categories,
          { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
        )
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json(
            { error: 'Error al obtener categorías' },
            { status: 500 }
        )
    }
}
