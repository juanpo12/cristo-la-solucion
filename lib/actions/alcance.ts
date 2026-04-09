'use server'

import { db } from '@/lib/db'
import { alcanceSignups } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'

export async function submitAlcanceSignup(formData: FormData) {
  try {
    const nombre = formData.get('nombre') as string
    const telefono = formData.get('telefono') as string
    const edadStr = formData.get('edad') as string
    const edad = parseInt(edadStr, 10)
    const lider = formData.get('lider') as string
    const area = formData.get('area') as string

    if (!nombre || !telefono || isNaN(edad) || !lider || !area) {
      return { error: 'Faltan campos requeridos o son inválidos.' }
    }

    await db.insert(alcanceSignups).values({
      nombre,
      telefono,
      edad,
      lider,
      area,
    })

    revalidatePath('/admin/alcance')
    return { success: true }
  } catch (error) {
    console.error('Error in submitAlcanceSignup:', error)
    return { error: 'Ocurrió un error al procesar la solicitud.' }
  }
}
