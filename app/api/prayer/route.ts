import { NextRequest, NextResponse } from 'next/server'
import { createContact } from '@/lib/services/contacts'
import { z } from 'zod'

const prayerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  category: z.string().min(1, 'La categoría es requerida'),
  message: z.string().min(1, 'El mensaje es requerido')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos
    const validatedData = prayerSchema.parse(body)
    
    // Crear el contacto con tipo 'prayer'
    const contactData = {
      name: `${validatedData.name} ${validatedData.lastName}`,
      email: validatedData.email || '',
      phone: validatedData.phone || '',
      subject: `Petición de Oración - ${validatedData.category}`,
      message: validatedData.message,
      type: 'prayer' as const
    }
    
    // Guardar en la base de datos
    const contact = await createContact(contactData)
    
    return NextResponse.json({
      success: true,
      message: 'Petición de oración enviada exitosamente',
      id: contact.id
    })
    
  } catch (error) {
    console.error('Error al procesar petición de oración:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos', 
          details: error.issues || "no se ha podido cargar los datos"
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}