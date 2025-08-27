import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { getContactsStats } from '@/lib/services/contacts'

// GET - Obtener estadísticas de contactos
export async function GET() {
  try {
    // Verificar autenticación
    const user = await AuthService.verifyAuth()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    // Obtener estadísticas usando el servicio
    const stats = await getContactsStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching contact stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}