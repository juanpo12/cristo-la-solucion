import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import { z } from 'zod'

const setupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Password debe tener al menos 8 caracteres'),
  username: z.string().min(3, 'Username debe tener al menos 3 caracteres').optional()
})

// Cliente con service-role: las operaciones auth.admin.* requieren esta clave,
// nunca la anon key. El rol se guarda en app_metadata (no escribible por el usuario).
function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY no configurada')
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getAdminClient()

    // Verificar si ya existe un admin
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('Error listando usuarios:', listError)
      return NextResponse.json(
        { error: 'No se pudo verificar el estado de configuración' },
        { status: 500 }
      )
    }

    const hasAdmin = users.users.some(user => {
      const role = user.app_metadata?.role
      return role === 'admin' || role === 'superadmin'
    })

    // El setup solo puede ejecutarse cuando todavía no existe ningún admin.
    if (hasAdmin) {
      return NextResponse.json(
        { error: 'Ya existe un administrador configurado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, password, username } = setupSchema.parse(body)

    const existingUser = users.users.find(u => u.email === email)

    if (existingUser) {
      // Si el usuario existe, promoverlo a superadmin vía app_metadata
      const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
        app_metadata: {
          ...existingUser.app_metadata,
          role: 'superadmin',
        },
        user_metadata: {
          ...existingUser.user_metadata,
          username: username || existingUser.user_metadata?.username || email.split('@')[0],
        },
      })

      if (error) {
        return NextResponse.json(
          { error: 'No se pudo actualizar el usuario' },
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
    }

    // Crear nuevo superadmin
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      app_metadata: { role: 'superadmin' },
      user_metadata: { username: username || email.split('@')[0] },
      email_confirm: true,
    })

    if (error) {
      return NextResponse.json(
        { error: 'No se pudo crear el usuario' },
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
    const supabase = getAdminClient()

    const { data: users, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('Error listando usuarios:', error)
      return NextResponse.json({ needsSetup: false })
    }

    const hasAdmin = users.users.some(user => {
      const role = user.app_metadata?.role
      return role === 'admin' || role === 'superadmin'
    })

    return NextResponse.json({ needsSetup: !hasAdmin })

  } catch (error) {
    console.error('Error verificando setup:', error)
    return NextResponse.json({ needsSetup: false })
  }
}
