import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { env } from '@/lib/env'
import { ProductService } from '@/lib/services/products'
import crypto from 'crypto'

const client = new MercadoPagoConfig({
  accessToken: env.MERCADOPAGO_ACCESS_TOKEN,
})

const payment = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    // 1. Validar firma del webhook. Obligatoria en producción: sin firma válida,
    // cualquiera podría crear órdenes "approved" y alterar el stock.
    const secret = env.MERCADOPAGO_WEBHOOK_SECRET
    if (!secret) {
      if (env.NODE_ENV === 'production') {
        console.error('MERCADOPAGO_WEBHOOK_SECRET no configurada: rechazando webhook')
        return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
      }
      // En desarrollo se permite sin firma para poder testear localmente.
    } else {
      const xSignature = request.headers.get('x-signature')
      const xRequestId = request.headers.get('x-request-id')
      const dataId = request.nextUrl.searchParams.get('data.id')

      if (!xSignature || !xRequestId) {
        return NextResponse.json({ error: 'Missing signature headers' }, { status: 401 })
      }

      // Parsear x-signature -> ts y v1
      let ts: string | undefined
      let hash: string | undefined
      xSignature.split(',').forEach(part => {
        const [key, value] = part.split('=')
        if (key && value) {
          const k = key.trim()
          if (k === 'ts') ts = value.trim()
          if (k === 'v1') hash = value.trim()
        }
      })

      if (!ts || !hash) {
        return NextResponse.json({ error: 'Invalid signature format' }, { status: 401 })
      }

      // Manifest según la documentación de Mercado Pago:
      // id:<data.id>;request-id:<x-request-id>;ts:<ts>;
      let manifest = ''
      if (dataId) manifest += `id:${dataId.toLowerCase()};`
      if (xRequestId) manifest += `request-id:${xRequestId};`
      manifest += `ts:${ts};`

      const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex')

      const expectedBuf = Buffer.from(expected)
      const receivedBuf = Buffer.from(hash)
      const valid =
        expectedBuf.length === receivedBuf.length &&
        crypto.timingSafeEqual(expectedBuf, receivedBuf)

      if (!valid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const body = await request.json()

    // Log de la notificación (evitar loguear datos sensibles en producción)
    if (env.NODE_ENV === 'development') {
      console.log('Webhook received:', JSON.stringify(body, null, 2))
    }

    // Verificar que es una notificación de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id

      // Obtener información del pago
      const paymentInfo = await payment.get({ id: paymentId })
      // Buscar si ya existe una orden con esta referencia externa
      if (paymentInfo.external_reference) {
        try {
          const [existingOrder] = await db
            .select()
            .from(orders)
            .where(eq(orders.externalReference, paymentInfo.external_reference))
            .limit(1)

          if (existingOrder) {
            // Actualizar orden existente
            const updateData = {
              status: paymentInfo.status || 'pending',
              mercadoPagoId: paymentInfo.id?.toString(),
              paymentMethod: paymentInfo.payment_method_id,
              paymentType: paymentInfo.payment_type_id,
              transactionAmount: paymentInfo.transaction_amount?.toString(),
              netReceivedAmount: paymentInfo.transaction_details?.net_received_amount?.toString(),
              totalPaidAmount: paymentInfo.transaction_details?.total_paid_amount?.toString(),
              dateApproved: paymentInfo.date_approved ? new Date(paymentInfo.date_approved) : null,
              lastModified: new Date(),
              updatedAt: new Date(),
            }

            await db
              .update(orders)
              .set(updateData)
              .where(eq(orders.externalReference, paymentInfo.external_reference))

            console.log('✅ Order updated successfully:', existingOrder.id)

            // Si el pago fue aprobado y venía de un estado no aprobado, reducir stock
            const wasAlreadyApproved = existingOrder.status === 'approved'
            if (paymentInfo.status === 'approved' && !wasAlreadyApproved && existingOrder.items) {
              try {
                const items = existingOrder.items as Array<{ name: string; quantity: number; id: number }>
                await Promise.all(
                  items.map((item) => ProductService.reduceStock(item.id, item.quantity))
                )
                console.log(`📦 Stock reducido para ${items.length} producto(s) de la orden ${existingOrder.id}`)
              } catch (stockError) {
                console.error('Error actualizando stock:', stockError)
              }
            }
          } else {
            // Crear la orden a partir de los datos del pago (webhook es la única fuente de verdad)
            const mpItems = (paymentInfo.additional_info?.items ?? []) as Array<{
              id?: string
              title?: string
              description?: string
              unit_price?: number
              quantity?: number
            }>

            const orderItems = mpItems.map((item) => ({
              id: parseInt(item.id ?? '0') || 0,
              name: item.title ?? 'Producto',
              author: item.description?.replace(/^Libro por /, '') ?? '',
              price: item.unit_price ?? 0,
              quantity: item.quantity ?? 1,
              image: '',
            }))

            const [newOrder] = await db.insert(orders).values({
              externalReference: paymentInfo.external_reference,
              status: paymentInfo.status || 'pending',
              total: paymentInfo.transaction_amount?.toString() ?? '0',
              currency: paymentInfo.currency_id ?? 'ARS',
              payerEmail: paymentInfo.payer?.email ?? '',
              payerName: paymentInfo.payer?.first_name ?? '',
              payerSurname: paymentInfo.payer?.last_name ?? '',
              payerPhone: paymentInfo.payer?.phone?.number ?? '',
              items: orderItems,
              mercadoPagoId: paymentInfo.id?.toString(),
              paymentMethod: paymentInfo.payment_method_id,
              paymentType: paymentInfo.payment_type_id,
              transactionAmount: paymentInfo.transaction_amount?.toString(),
              netReceivedAmount: paymentInfo.transaction_details?.net_received_amount?.toString(),
              totalPaidAmount: paymentInfo.transaction_details?.total_paid_amount?.toString(),
              dateApproved: paymentInfo.date_approved ? new Date(paymentInfo.date_approved) : null,
            }).returning()

            console.log('✅ Order created from webhook:', newOrder.id, 'status:', newOrder.status)

            // Si el pago fue aprobado, reducir stock
            if (paymentInfo.status === 'approved' && orderItems.length > 0) {
              try {
                await Promise.all(
                  orderItems
                    .filter((item) => item.id > 0)
                    .map((item) => ProductService.reduceStock(item.id, item.quantity))
                )
                console.log(`📦 Stock reducido para ${orderItems.length} producto(s) de la orden ${newOrder.id}`)
              } catch (stockError) {
                console.error('Error actualizando stock:', stockError)
              }
            }
          }
        } catch (dbError) {
          console.error('❌ Database error in webhook:', dbError)
        }
      }

      switch (paymentInfo.status) {
        case 'approved':
          console.log('✅ Payment approved:', paymentId)
          break
        case 'pending':
          console.log('⏳ Payment pending:', paymentId)
          break
        case 'rejected':
          console.log('❌ Payment rejected:', paymentId)
          break
        case 'cancelled':
          console.log('🚫 Payment cancelled:', paymentId)
          break
        default:
          console.log('❓ Unknown payment status:', paymentInfo.status)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}