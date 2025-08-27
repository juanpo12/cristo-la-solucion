import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { getContacts, updateContactStatus } from '@/lib/services/contacts'

// GET - Obtener todos los contactos
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = await AuthService.verifyAuth()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'all'
    const type = searchParams.get('type') || 'all'
    
    // Usar el servicio para obtener contactos
    const result = await getContacts({
      page,
      limit,
      status: status === 'all' ? undefined : status,
      type: type === 'all' ? undefined : type
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar estado de un contacto
export async function PATCH(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = await AuthService.verifyAuth()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const body = await request.json()
    const { id, status } = body
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID y status son requeridos' },
        { status: 400 }
      )
    }

    // Usar el servicio para actualizar el contacto
    const updatedContact = await updateContactStatus(id, status)

    if (!updatedContact) {
      return NextResponse.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Estado actualizado correctamente',
      contact: updatedContact
    })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}