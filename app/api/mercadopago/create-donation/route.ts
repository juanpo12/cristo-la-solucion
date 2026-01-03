import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { env } from '@/lib/env'

// Configuración de Mercado Pago
const accessToken = env.MERCADOPAGO_ACCESS_TOKEN
const client = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
  },
})

const preference = new Preference(client)

import { z } from 'zod'

const donationSchema = z.object({
  amount: z.number().positive("El monto debe ser mayor a 0"),
  payer: z.object({
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.object({
      area_code: z.string().optional(),
      number: z.string().optional(),
    }).optional(),
  }).optional(),
})

import { rateLimit } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const limitResult = await rateLimit(`mp_don:${ip}`, 10, 3600) // 10 requests per hour

    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const json = await request.json()
    const body = donationSchema.parse(json)

    if (env.NODE_ENV === 'development') {
      console.log('Received donation request:', JSON.stringify(body, null, 2))
    }

    // Verificar que las variables de entorno estén configuradas
    if (!env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error('MERCADOPAGO_ACCESS_TOKEN not configured')
      return NextResponse.json(
        { error: 'Mercado Pago not configured' },
        { status: 500 }
      )
    }

    const baseUrl = env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"

    const preferenceData = {
      items: [
        {
          id: 'donation',
          title: 'Donación a Cristo La Solución',
          description: 'Donación para apoyar el ministerio de Cristo La Solución',
          quantity: 1,
          unit_price: body.amount,
          currency_id: 'ARS',
        }
      ],
      back_urls: {
        success: `${baseUrl}/dar/success`,
        failure: `${baseUrl}/dar/failure`,
        pending: `${baseUrl}/dar/pending`,
      },
      auto_return: 'approved',
      statement_descriptor: 'Cristo la Solucion',
      external_reference: `donation_${Date.now()}`,
      notification_url: `${baseUrl}/api/mercadopago/webhook`,
      expires: false,
      binary_mode: false,
    }

    console.log('Creating donation preference with data:', JSON.stringify(preferenceData, null, 2))

    const response = await preference.create({ body: preferenceData })

    console.log('Donation preference created successfully:', response.id)

    return NextResponse.json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      external_reference: response.external_reference
    })
  } catch (error: unknown) {
    console.error('Error creating donation preference:', error)

    const errorMessage = error instanceof Error ? error.message : 'Failed to create donation preference'
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