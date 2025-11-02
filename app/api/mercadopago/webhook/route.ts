import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

const payment = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Webhook received:', JSON.stringify(body, null, 2))
    
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
            
            // Si el pago fue aprobado, reducir stock de productos
            if (paymentInfo.status === 'approved' && existingOrder.items) {
              try {
                const items = existingOrder.items as Array<{ name: string; quantity: number; id: number }>
                for (const item of items) {
                  // Aquí podrías reducir el stock si tienes esa funcionalidad
                  console.log(`📦 Product sold: ${item.name} x${item.quantity}`)
                }
              } catch (stockError) {
                console.error('Error updating stock:', stockError)
              }
            }
          } else {
            console.log('⚠️ Order not found for external_reference:', paymentInfo.external_reference)
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