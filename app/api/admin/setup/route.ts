import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const setupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
  username: z.string().min(3, 'Username debe tener al menos 3 caracteres').optional()
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar si ya existe un admin
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listando usuarios:', listError)
    } else {
      // Verificar si existe algún usuario con rol admin o superadmin
      const hasAdmin = users.users.some(user => {
        const role = user.user_metadata?.role
        return role === 'admin' || role === 'superadmin'
      })
      
      if (hasAdmin) {
        return NextResponse.json(
          { error: 'Ya existe un administrador configurado' },
          { status: 400 }
        )
      }
    }

    const body = await request.json()
    const { email, password, username } = setupSchema.parse(body)

    // Verificar si el usuario ya existe
    const existingUser = users?.users.find(u => u.email === email)
    
    if (existingUser) {
      // Si el usuario existe, actualizar sus metadatos para hacerlo admin
      const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
        user_metadata: {
          ...existingUser.user_metadata,
          role: 'superadmin',
          username: username || existingUser.user_metadata?.username || email.split('@')[0]
        }
      })

      if (error) {
        return NextResponse.json(
          { error: `Error actualizando usuario: ${error.message}` },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Usuario existente configurado como superadmin',
        user: {
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.username,
          role: 'superadmin'
        }
      })
    } else {
      // Crear nuevo usuario admin en Supabase
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          role: 'superadmin',
          username: username || email.split('@')[0]
        },
        email_confirm: true // Auto-confirmar email para admin
      })

      if (error) {
        return NextResponse.json(
          { error: `Error creando usuario: ${error.message}` },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Superusuario creado exitosamente',
        user: {
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.username,
          role: 'superadmin'
        }
      })
    }

  } catch (error) {
    console.error('Error en setup:', error)
    
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

// Verificar si necesita setup
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Listar todos los usuarios y verificar si alguno tiene rol admin
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Error listando usuarios:', error)
      return NextResponse.json({
        needsSetup: true // En caso de error, asumir que necesita setup
      })
    }

    // Verificar si existe algún usuario con rol admin o superadmin
    const hasAdmin = users.users.some(user => {
      const role = user.user_metadata?.role
      return role === 'admin' || role === 'superadmin'
    })
    
    return NextResponse.json({
      needsSetup: !hasAdmin
    })

  } catch (error) {
    console.error('Error verificando setup:', error)
    return NextResponse.json({
      needsSetup: true // En caso de error, asumir que necesita setup
    })
  }
}