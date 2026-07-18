import { NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { subscribers } from '@/lib/db/schema'

function htmlPage(title: string, message: string) {
  return new Response(
    `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} — Cristo la Solución</title>
  </head>
  <body style="font-family: Arial, sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0;">
    <div style="background: white; border-radius: 16px; padding: 40px; max-width: 420px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      <h1 style="color: #1e293b; font-size: 22px; margin-bottom: 12px;">${title}</h1>
      <p style="color: #64748b; line-height: 1.6;">${message}</p>
      <a href="/" style="display: inline-block; margin-top: 24px; background: #2563eb; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Volver al sitio</a>
    </div>
  </body>
</html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return htmlPage('Enlace inválido', 'El enlace de baja no es válido o está incompleto.')
  }

  try {
    const result = await db
      .update(subscribers)
      .set({ unsubscribedAt: new Date() })
      .where(eq(subscribers.unsubscribeToken, token))
      .returning({ id: subscribers.id })

    if (result.length === 0) {
      return htmlPage('Enlace inválido', 'No encontramos una suscripción asociada a este enlace.')
    }

    return htmlPage(
      'Suscripción cancelada',
      'Ya no vas a recibir avisos de novedades. Podés volver a suscribirte cuando quieras desde el sitio.'
    )
  } catch {
    return htmlPage('Algo salió mal', 'No pudimos procesar la baja. Intentá de nuevo más tarde.')
  }
}
