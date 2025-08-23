import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

const payment = new Payment(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar que es una notificación de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id
      
      // Obtener información del pago
      const paymentInfo = await payment.get({ id: paymentId })
      
      console.log('Payment notification received:', {
        id: paymentInfo.id,
        status: paymentInfo.status,
        external_reference: paymentInfo.external_reference,
        transaction_amount: paymentInfo.transaction_amount
      })
      
      // Aquí puedes agregar lógica para actualizar tu base de datos
      // Por ejemplo, marcar el pedido como pagado, enviar emails, etc.
      
      switch (paymentInfo.status) {
        case 'approved':
          // Pago aprobado - procesar pedido
          console.log('Payment approved:', paymentId)
          break
        case 'pending':
          // Pago pendiente
          console.log('Payment pending:', paymentId)
          break
        case 'rejected':
          // Pago rechazado
          console.log('Payment rejected:', paymentId)
          break
        default:
          console.log('Unknown payment status:', paymentInfo.status)
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