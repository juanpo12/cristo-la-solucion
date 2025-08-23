import { NextRequest, NextResponse } from 'next/server'
import { createPreference, type CreatePreferenceData } from '@/lib/mercadopago'
import { OrderService } from '@/lib/services/orders'

export async function POST(request: NextRequest) {
  try {
    const body: CreatePreferenceData & {
      customerInfo?: {
        name: string
        email: string
        phone?: string
      }
    } = await request.json()

    console.log('Received request body:', JSON.stringify(body, null, 2))

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    // Verificar que las variables de entorno estén configuradas
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error('MERCADOPAGO_ACCESS_TOKEN not configured')
      return NextResponse.json(
        { error: 'Mercado Pago not configured' },
        { status: 500 }
      )
    }

    // Calcular total
    const totalAmount = body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Crear la preferencia de Mercado Pago
    const preference = await createPreference(body)

    // Crear la orden en la base de datos
    const orderData = {
      customerName: body.customerInfo?.name || body.payer?.name || 'Cliente',
      customerEmail: body.customerInfo?.email || body.payer?.email || '',
      customerPhone: body.customerInfo?.phone || body.payer?.phone?.number || '',
      total: totalAmount.toString(),
      status: 'pending',
      mercadopagoPreferenceId: preference.id,
      externalReference: preference.external_reference || `order_${Date.now()}`,
    }

    const orderItems = body.items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      unitPrice: item.price,
    }))

    try {
      const order = await OrderService.create(orderData, orderItems)
      console.log('Order created successfully:', order.id)
    } catch (orderError) {
      console.error('Error creating order in database:', orderError)
      // Continuamos aunque falle la creación de la orden
      // La orden se puede crear después via webhook
    }

    console.log('Preference created successfully:', preference.id)

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
      external_reference: preference.external_reference
    })
  } catch (error: unknown) {
    console.error('Error creating preference:', error)
    
    // Proporcionar más detalles del error
    const errorMessage = error instanceof Error ? error.message : 'Failed to create preference'
    const errorDetails = error instanceof Error ? error.cause : error
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    )
  }
}