import { NextRequest, NextResponse } from 'next/server'
import { createPreference, type CreatePreferenceData } from '@/lib/mercadopago'
import { env } from '@/lib/env'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { z } from 'zod'

const preferenceSchema = z.object({
  items: z.array(z.object({
    id: z.union([z.number(), z.string()]),
    name: z.string(),
    title: z.string().optional(),
    author: z.string(),
    price: z.number().positive(),
    unit_price: z.number().positive().optional(),
    image: z.string(),
    quantity: z.number().int().positive(),
  })).min(1, "No items provided"),
  payer: z.object({
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.object({
      area_code: z.string().optional(),
      number: z.string().optional(),
    }).optional(),
    address: z.object({
      zip_code: z.string().optional(),
      street_name: z.string().optional(),
      street_number: z.number().optional(),
    }).optional(),
  }).optional(),
  customerInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
  }).optional(),
})

import { rateLimit } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const limitResult = await rateLimit(`mp_pref:${ip}`, 10, 3600) // 10 requests per hour

    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const json = await request.json()
    const body = preferenceSchema.parse(json)

    if (env.NODE_ENV === 'development') {
      console.log('Received request body:', JSON.stringify(body, null, 2))
    }

    // Verificar que las variables de entorno estén configuradas
    if (!env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error('MERCADOPAGO_ACCESS_TOKEN not configured')
      return NextResponse.json(
        { error: 'Mercado Pago not configured' },
        { status: 500 }
      )
    }

    // Calcular total
    const totalAmount = body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Crear la preferencia de Mercado Pago
    // @ts-ignore - body matches structure but Zod types might be slightly different from SDK types
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