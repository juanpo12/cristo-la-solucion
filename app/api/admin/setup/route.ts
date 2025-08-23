import { NextRequest, NextResponse } from 'next/server'
import { AdminService } from '@/lib/services/admin'
import { z } from 'zod'

const setupSchema = z.object({
  username: z.string().min(3, 'Username debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Password debe tener al menos 6 caracteres')
})

export async function POST(request: NextRequest) {
  try {
    // Verificar si ya existe un admin
    const hasAdmin = await AdminService.hasAnyAdmin()
    
    if (hasAdmin) {
      return NextResponse.json(
        { error: 'Ya existe un administrador configurado' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { username, email, password } = setupSchema.parse(body)

    // Crear superusuario
    const user = await AdminService.createUser({
      username,
      email,
      password,
      role: 'superadmin',
      active: true
    })

    return NextResponse.json({
      success: true,
      message: 'Superusuario creado exitosamente',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Error en setup:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Verificar si necesita setup
export async function GET() {
  try {
    const hasAdmin = await AdminService.hasAnyAdmin()
    
    return NextResponse.json({
      needsSetup: !hasAdmin
    })

  } catch (error) {
    console.error('Error verificando setup:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}