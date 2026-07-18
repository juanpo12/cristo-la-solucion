import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { volunteers } from '@/lib/db/schema'
import { rateLimit } from '@/lib/ratelimit'
import { revalidatePath } from 'next/cache'

const volunteerSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es requerido').max(255),
    apellido: z.string().min(1, 'El apellido es requerido').max(255),
    fechaNacimiento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de nacimiento es inválida')
      .refine((value) => {
        const fecha = new Date(`${value}T00:00:00`)
        return !isNaN(fecha.getTime()) && fecha < new Date() && fecha.getFullYear() >= 1900
      }, 'La fecha de nacimiento es inválida'),
    email: z.string().email('Formato de email inválido').max(255).or(z.literal('')),
    telefono: z.string().max(50),
  })
  .refine((data) => data.email !== '' || data.telefono !== '', {
    message: 'Dejanos al menos un correo o un teléfono',
    path: ['email'],
  })

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const limitResult = await rateLimit(`volunteer:${ip}`, 5, 3600)

    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor intentá nuevamente más tarde.' },
        { status: 429 }
      )
    }

    const raw = await request.json()
    const parsed = volunteerSchema.safeParse({
      nombre: String(raw.nombre ?? '').trim(),
      apellido: String(raw.apellido ?? '').trim(),
      fechaNacimiento: String(raw.fechaNacimiento ?? '').trim(),
      email: String(raw.email ?? '').trim().toLowerCase(),
      telefono: String(raw.telefono ?? '').trim(),
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      )
    }

    const { nombre, apellido, fechaNacimiento, email, telefono } = parsed.data

    await db.insert(volunteers).values({
      nombre,
      apellido,
      fechaNacimiento,
      email: email || null,
      telefono: telefono || null,
    })

    revalidatePath('/admin/voluntarios')

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('❌ Error registrando voluntario:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
