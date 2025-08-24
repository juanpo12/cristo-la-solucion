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

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.user_metadata?.username || user.email.split('@')[0]
      }
    })
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}