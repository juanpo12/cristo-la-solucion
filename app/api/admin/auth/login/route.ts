import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/ratelimit'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Password es requerido')
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting anti fuerza bruta: 10 intentos por IP cada 15 minutos.
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    const limitResult = await rateLimit(`admin_login:${ip}`, 10, 900)
    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Esperá unos minutos e intentá de nuevo.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const supabase = await createClient()

    // Intentar login con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar que el usuario tenga rol de admin
    const role = data.user.app_metadata?.role
    if (role !== 'admin' && role !== 'superadmin') {
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: 'No tienes permisos de administrador' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: role,
        username: data.user.user_metadata?.username || data.user.email?.split('@')[0]
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}