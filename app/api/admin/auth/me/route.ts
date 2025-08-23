import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

export async function GET() {
  try {
    const user = await AuthService.verifyAuth()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Error verificando autenticación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}