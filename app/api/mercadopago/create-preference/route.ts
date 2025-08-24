import { NextRequest, NextResponse } from 'next/server'
import { createPreference, type CreatePreferenceData } from '@/lib/mercadopago'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'

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
      externalReference: preference.external_reference || `order_${Date.now()}`,
      status: 'pending',
      total: totalAmount.toString(),
      currency: 'ARS',
      payerEmail: body.customerInfo?.email || body.payer?.email || '',
      payerName: body.customerInfo?.name || body.payer?.name || 'Cliente',
      payerSurname: body.payer?.surname || '',
      payerPhone: body.customerInfo?.phone || body.payer?.phone?.number || '',
      items: body.items, // Guardar los items como JSON
      mercadoPagoId: null, // Se actualizará cuando se procese el pago
    }

    try {
      // Usar inserción directa en lugar del servicio complejo
      const [order] = await db.insert(orders).values(orderData).returning()
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