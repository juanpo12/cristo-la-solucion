import { db } from '@/lib/db'
import { resources, subscribers } from '@/lib/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import { env } from '@/lib/env'

// Escapar contenido antes de interpolarlo en el HTML del email.
function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildEmailHtml(params: {
  typeLabel: string
  title: string
  excerpt: string
  resourceUrl: string
  unsubscribeUrl: string
}) {
  const { typeLabel, title, excerpt, resourceUrl, unsubscribeUrl } = params
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Nuevo ${typeLabel} disponible</h2>
      <div style="background: #f8fafc; padding: 24px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e293b; margin: 0 0 8px;">${title}</h3>
        ${excerpt ? `<p style="color: #64748b; line-height: 1.6; margin: 0;">${excerpt}</p>` : ''}
      </div>
      <a href="${resourceUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Leer ahora</a>
      <p style="color: #64748b; font-size: 14px; margin-top: 28px;">
        Recibís este email porque te suscribiste a las novedades de Cristo La Solución.<br />
        <a href="${unsubscribeUrl}" style="color: #94a3b8;">Cancelar suscripción</a>
      </p>
    </div>
  `
}

// Notifica a los suscriptores activos que se publicó un recurso nuevo.
// Solo notifica UNA vez por recurso: "reclama" el envío seteando notifiedAt
// de forma atómica, así ni ediciones ni republicaciones generan reenvíos.
export async function notifySubscribersOfResource(resourceId: number) {
  if (!env.RESEND_API_KEY) return

  const [claimed] = await db
    .update(resources)
    .set({ notifiedAt: new Date() })
    .where(and(
      eq(resources.id, resourceId),
      eq(resources.published, true),
      isNull(resources.notifiedAt),
    ))
    .returning()

  if (!claimed) return

  const activeSubscribers = await db
    .select({ email: subscribers.email, token: subscribers.unsubscribeToken })
    .from(subscribers)
    .where(isNull(subscribers.unsubscribedAt))

  if (activeSubscribers.length === 0) return

  const baseUrl = env.NEXT_PUBLIC_BASE_URL
  const typeLabel = claimed.type === 'archivo' ? 'archivo' : 'apunte'
  const title = escapeHtml(claimed.title)
  const excerpt = claimed.excerpt ? escapeHtml(claimed.excerpt) : ''
  const resourceUrl = `${baseUrl}/recursos/${claimed.slug}`

  const emails = activeSubscribers.map((s) => ({
    from: 'Cristo la Solución <contacto@cristolasolucionsj.com>',
    to: [s.email],
    subject: `Nuevo ${typeLabel}: ${claimed.title}`,
    html: buildEmailHtml({
      typeLabel,
      title,
      excerpt,
      resourceUrl,
      unsubscribeUrl: `${baseUrl}/api/unsubscribe?token=${s.token}`,
    }),
  }))

  // Resend acepta hasta 100 emails por request de batch
  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails.slice(i, i + 100)
    try {
      const response = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch),
      })
      if (!response.ok) {
        console.error('❌ Error enviando lote de novedades:', await response.text())
      }
    } catch (error) {
      console.error('❌ Error enviando lote de novedades:', error)
    }
  }
}
