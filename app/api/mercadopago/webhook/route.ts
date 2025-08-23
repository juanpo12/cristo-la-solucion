import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { OrderService } from '@/lib/services/orders'

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
      
      console.log('Payment notification received:', {
        id: paymentInfo.id,
        status: paymentInfo.status,
        external_reference: paymentInfo.external_reference,
        transaction_amount: paymentInfo.transaction_amount,
        payer: paymentInfo.payer
      })
      
      // Buscar si ya existe una orden con esta referencia externa
      const existingOrder = paymentInfo.external_reference 
        ? await OrderService.getByExternalReference(paymentInfo.external_reference)
        : null
      
      if (existingOrder) {
        // Actualizar orden existente
        await OrderService.updateByExternalReference(
          paymentInfo.external_reference!,
          paymentInfo.status || 'pending',
          {
            mercadoPagoId: paymentInfo.id?.toString(),
            paymentMethod: paymentInfo.payment_method_id,
            paymentType: paymentInfo.payment_type_id,
            transactionAmount: paymentInfo.transaction_amount,
            netReceivedAmount: paymentInfo.transaction_details?.net_received_amount,
            totalPaidAmount: paymentInfo.transaction_details?.total_paid_amount,
            dateApproved: paymentInfo.date_approved ? new Date(paymentInfo.date_approved) : undefined,
          }
        )
        console.log('Order updated:', existingOrder.id)
      } else if (paymentInfo.status === 'approved' && paymentInfo.external_reference) {
        // Crear nueva orden si el pago fue aprobado y no existe la orden
        try {
          // Aquí necesitarías obtener los items del carrito de alguna manera
          // Por ahora, registramos que necesitamos implementar esto
          console.log('Need to create new order for external_reference:', paymentInfo.external_reference)
          console.log('Payment approved but no existing order found')
        } catch (error) {
          console.error('Error creating order:', error)
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