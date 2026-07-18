import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { z } from 'zod'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'
import { rateLimit } from '@/lib/ratelimit'

const subscribeSchema = z.object({
  email: z.string().email('Formato de email inválido').max(255),
})

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const limitResult = await rateLimit(`subscribe:${ip}`, 5, 3600) // 5 requests per hour

    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor intente nuevamente más tarde.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = subscribeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    const email = parsed.data.email.trim().toLowerCase()

    // Si el email ya existía (incluso dado de baja), se reactiva la suscripción
    await db
      .insert(subscribers)
      .values({ email, unsubscribeToken: randomBytes(32).toString('hex') })
      .onConflictDoUpdate({
        target: subscribers.email,
        set: { unsubscribedAt: null },
      })

    return NextResponse.json(
      { success: true, message: '¡Listo! Te vamos a avisar cuando haya novedades.' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
